const Joi = require('joi');

// Custom validator for password strength
const passwordValidator = (value, helpers) => {
  if (value.length < 12) {
    return helpers.error('password.minLength');
  }
  if (!/[a-z]/.test(value)) {
    return helpers.error('password.lowercase');
  }
  if (!/[A-Z]/.test(value)) {
    return helpers.error('password.uppercase');
  }
  if (!/\d/.test(value)) {
    return helpers.error('password.number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return helpers.error('password.symbol');
  }
  return value;
};

// Custom validator for XSS protection
const xssValidator = (value, helpers) => {
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)) {
    return helpers.error('xss.scriptTag');
  }
  return value;
};

// Auth schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().custom(passwordValidator).required().messages({
    'password.minLength': 'Password must be at least 12 characters',
    'password.lowercase': 'Password must contain at least one lowercase letter',
    'password.uppercase': 'Password must contain at least one uppercase letter',
    'password.number': 'Password must contain at least one number',
    'password.symbol': 'Password must contain at least one symbol'
  }),
  name: Joi.string().min(2).max(50).custom(xssValidator).required().messages({
    'xss.scriptTag': 'Name cannot contain script tags'
  }),
  role: Joi.string().valid('mentor', 'mentee').required(),
  userType: Joi.string().valid('mentor', 'mentee') // For backward compatibility
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).custom(xssValidator).optional(),
  bio: Joi.string().max(1000).optional(),
  profileImageUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  portfolioUrl: Joi.string().uri().optional(),
  timezone: Joi.string().optional()
});

// Mentor schemas
const mentorProfileSchema = Joi.object({
  company: Joi.string().min(2).max(100).optional(),
  experienceYears: Joi.number().integer().min(0).max(50).optional(),
  hourlyRate: Joi.number().min(0).max(10000).optional(),
  bio: Joi.string().max(1000).optional(),
  profileImageUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  portfolioUrl: Joi.string().uri().optional(),
  timezone: Joi.string().optional()
});

const mentorExpertiseSchema = Joi.object({
  topicId: Joi.string().uuid().required(),
  price: Joi.number().min(0).max(10000).required(),
  durationMinutes: Joi.number().integer().valid(30, 45, 60, 90, 120).required(),
  description: Joi.string().max(500).optional()
});

const availabilitySlotSchema = Joi.object({
  startDatetime: Joi.date().iso().required(),
  endDatetime: Joi.date().iso().greater(Joi.ref('startDatetime')).required(),
  isRecurring: Joi.boolean().default(false),
  recurrencePattern: Joi.when('isRecurring', {
    is: true,
    then: Joi.string().valid('weekly', 'biweekly', 'monthly').required(),
    otherwise: Joi.forbidden()
  }),
  recurrenceEndDate: Joi.when('isRecurring', {
    is: true,
    then: Joi.date().iso().greater(Joi.ref('startDatetime')).optional(),
    otherwise: Joi.forbidden()
  })
});

// Mentee schemas
const menteeProfileSchema = Joi.object({
  currentRole: Joi.string().min(2).max(100).optional(),
  learningGoals: Joi.string().max(1000).optional(),
  bio: Joi.string().max(1000).optional(),
  profileImageUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  portfolioUrl: Joi.string().uri().optional(),
  timezone: Joi.string().optional()
});

const mentorSearchSchema = Joi.object({
  topic: Joi.string().optional(),
  company: Joi.string().optional(),
  minRating: Joi.number().min(0).max(5).optional(),
  maxPrice: Joi.number().min(0).optional(),
  minPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('rating', 'price', 'experience', 'reviews').default('rating'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

// Topic schemas
const topicSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  mentorProfileSchema,
  mentorExpertiseSchema,
  availabilitySlotSchema,
  menteeProfileSchema,
  mentorSearchSchema,
  topicSchema
};