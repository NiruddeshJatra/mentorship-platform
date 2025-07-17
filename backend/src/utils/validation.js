const Joi = require('joi');
const { validatePasswordStrength } = require('./password');

// Custom password validation
const passwordValidation = Joi.string().required().custom((value, helpers) => {
  const result = validatePasswordStrength(value);
  if (!result.isValid) {
    return helpers.error('any.custom', { message: result.errors.join('; '), code: 'WEAK_PASSWORD' });
  }
  return value;
}, 'Custom password strength validation');

const xssPattern = /<script.*?>.*?<\/script.*?>/i;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordValidation,
  name: Joi.string().min(2).max(50).required().custom((value, helpers) => {
    if (xssPattern.test(value)) {
      return helpers.error('any.invalid', { message: 'Name contains forbidden script tags' });
    }
    return value;
  }, 'XSS protection'),
  role: Joi.string().valid('mentor', 'mentee').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const mentorProfileSchema = Joi.object({
  company: Joi.string().max(100).optional(),
  experience: Joi.number().min(0).max(50).optional(),
  baseHourlyRate: Joi.number().min(0).optional(),
  bio: Joi.string().max(500).optional(),
  location: Joi.string().max(100).optional()
});

const menteeProfileSchema = Joi.object({
  currentRole: Joi.string().max(100).optional(),
  learningGoals: Joi.string().max(500).optional(),
  experience: Joi.string().max(500).optional(),
  availability: Joi.string().max(200).optional()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  mentor: mentorProfileSchema.optional(),
  mentee: menteeProfileSchema.optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  mentorProfileSchema,
  menteeProfileSchema,
  updateProfileSchema
};