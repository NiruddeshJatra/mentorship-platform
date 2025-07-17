const { prisma } = require('../config/database');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const register = async (req, res, next) => {
  try {
    const { email, password, name, userType } = req.body;
    const role = userType; // Map userType to role for backward compatibility

    // Additional password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      const error = new Error('Password does not meet requirements');
      error.statusCode = 400;
      error.code = 'WEAK_PASSWORD';
      error.details = passwordValidation.errors;
      return next(error);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      error.code = 'USER_EXISTS';
      return next(error);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role // Use role instead of userType
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      // Create role-specific profile
      if (role === 'mentor') {
        await tx.mentor.create({
          data: {
            userId: newUser.id
          }
        });
      } else if (role === 'mentee') {
        await tx.mentee.create({
          data: {
            userId: newUser.id
          }
        });
      }

      return newUser;
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      error.statusCode = 409;
      error.code = 'USER_EXISTS';
      error.message = 'User already exists';
      return next(error);
    }
    
    error.statusCode = 500;
    error.code = 'REGISTRATION_ERROR';
    error.message = 'Registration failed';
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      return next(error);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    error.statusCode = 500;
    error.code = 'LOGIN_ERROR';
    error.message = 'Login failed';
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        mentor: req.user.role === 'mentor' ? {
          select: {
            company: true,
            experience: true,
            baseHourlyRate: true,
            bio: true,
            location: true
          }
        } : undefined,
        mentee: req.user.role === 'mentee' ? {
          select: {
            currentRole: true,
            learningGoals: true,
            experience: true,
            availability: true
          }
        } : undefined
      }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    error.statusCode = 500;
    error.code = 'GET_USER_ERROR';
    error.message = 'Failed to get user data';
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, mentor, mentee } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    // Validate that user is updating correct profile type
    if (role === 'mentor' && mentee) {
      const error = new Error('Cannot update mentee profile as mentor');
      error.statusCode = 400;
      error.code = 'INVALID_PROFILE_UPDATE';
      return next(error);
    }

    if (role === 'mentee' && mentor) {
      const error = new Error('Cannot update mentor profile as mentee');
      error.statusCode = 400;
      error.code = 'INVALID_PROFILE_UPDATE';
      return next(error);
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user basic info
      const userUpdateData = {};
      if (name) userUpdateData.name = name;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userUpdateData
        });
      }

      // Update role-specific profile
      if (role === 'mentor' && mentor) {
        await tx.mentor.update({
          where: { userId },
          data: mentor
        });
      } else if (role === 'mentee' && mentee) {
        await tx.mentee.update({
          where: { userId },
          data: mentee
        });
      }

      // Return updated user
      return await tx.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          mentor: role === 'mentor' ? {
            select: {
              company: true,
              experience: true,
              baseHourlyRate: true,
              bio: true,
              location: true
            }
          } : undefined,
          mentee: role === 'mentee' ? {
            select: {
              currentRole: true,
              learningGoals: true,
              experience: true,
              availability: true
            }
          } : undefined
        }
      });
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    error.statusCode = 500;
    error.code = 'UPDATE_PROFILE_ERROR';
    error.message = 'Failed to update profile';
    next(error);
  }
};

// Logout controller
const logout = (req, res) => {
  // If using sessions (Passport), destroy session
  if (req.logout) req.logout(() => {});
  if (req.session) req.session.destroy(() => {});
  res.json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout
};
