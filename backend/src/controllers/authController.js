const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;

    // Additional password strength validation
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Password does not meet requirements',
        code: 'WEAK_PASSWORD',
        details: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
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
          userType
        },
        select: {
          id: true,
          email: true,
          name: true,
          userType: true,
          createdAt: true
        }
      });

      // Create role-specific profile
      if (userType === 'mentor') {
        await tx.mentor.create({
          data: {
            userId: newUser.id
          }
        });
      } else if (userType === 'mentee') {
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
      userType: user.userType
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
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }
    
    res.status(500).json({ 
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      userType: user.userType
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        createdAt: true,
        mentor: req.user.userType === 'mentor' ? {
          select: {
            company: true,
            experience: true,
            baseHourlyRate: true,
            bio: true,
            location: true
          }
        } : undefined,
        mentee: req.user.userType === 'mentee' ? {
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
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user data',
      code: 'GET_USER_ERROR'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, mentor, mentee } = req.body;
    const userId = req.user.id;
    const userType = req.user.userType;

    // Validate that user is updating correct profile type
    if (userType === 'mentor' && mentee) {
      return res.status(400).json({
        error: 'Cannot update mentee profile as mentor',
        code: 'INVALID_PROFILE_UPDATE'
      });
    }

    if (userType === 'mentee' && mentor) {
      return res.status(400).json({
        error: 'Cannot update mentor profile as mentee',
        code: 'INVALID_PROFILE_UPDATE'
      });
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
      if (userType === 'mentor' && mentor) {
        await tx.mentor.update({
          where: { userId },
          data: mentor
        });
      } else if (userType === 'mentee' && mentee) {
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
          userType: true,
          createdAt: true,
          mentor: userType === 'mentor' ? {
            select: {
              company: true,
              experience: true,
              baseHourlyRate: true,
              bio: true,
              location: true
            }
          } : undefined,
          mentee: userType === 'mentee' ? {
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
    res.status(500).json({
      error: 'Failed to update profile',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile
};
