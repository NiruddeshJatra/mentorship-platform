const Joi = require('joi');
const {
  isValidEmail,
  mentorExpertiseSchema,
  menteeProfileSchema,
  mentorProfileSchema,
  topicSchema,
  passwordValidator,
  xssValidator,
} = require('../src/utils/validation');

// Password validator is a custom Joi validator, so we test via a schema
const passwordSchema = Joi.string().custom(passwordValidator);
const xssSchema = Joi.string().custom(xssValidator);

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
    });
    it('should return false for invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('passwordValidator', () => {
    it('should accept strong passwords', () => {
      const { error } = passwordSchema.validate('StrongPass123!');
      expect(error).toBeUndefined();
    });
    it('should reject short passwords', () => {
      const { error } = passwordSchema.validate('Short1!');
      expect(error).toBeDefined();
      expect(error.message).toMatch(/at least 12 characters/);
    });
    it('should reject passwords missing uppercase', () => {
      const { error } = passwordSchema.validate('weakpassword123!');
      expect(error).toBeDefined();
      expect(error.message).toMatch(/uppercase/);
    });
    it('should reject passwords missing lowercase', () => {
      const { error } = passwordSchema.validate('WEAKPASSWORD123!');
      expect(error).toBeDefined();
      expect(error.message).toMatch(/lowercase/);
    });
    it('should reject passwords missing number', () => {
      const { error } = passwordSchema.validate('NoNumberHere!');
      expect(error).toBeDefined();
      expect(error.message).toMatch(/number/);
    });
    it('should reject passwords missing symbol', () => {
      const { error } = passwordSchema.validate('NoSymbol1234');
      expect(error).toBeDefined();
      expect(error.message).toMatch(/symbol/);
    });
  });

  describe('xssValidator', () => {
    it('should accept safe strings', () => {
      const { error } = xssSchema.validate('Hello world');
      expect(error).toBeUndefined();
    });
    it('should reject strings with <script> tags', () => {
      const { error } = xssSchema.validate('<script>alert(1)</script>');
      expect(error).toBeDefined();
    });
  });

  describe('mentorExpertiseSchema', () => {
    it('should validate correct expertise', () => {
      const { error } = mentorExpertiseSchema.validate({
        topicId: '123e4567-e89b-12d3-a456-426614174000',
        price: 100,
        durationMinutes: 60,
        description: 'Mentoring in Node.js',
      });
      expect(error).toBeUndefined();
    });
    it('should reject missing topicId', () => {
      const { error } = mentorExpertiseSchema.validate({ price: 100, durationMinutes: 60 });
      expect(error).toBeDefined();
    });
  });

  describe('menteeProfileSchema', () => {
    it('should validate correct mentee profile', () => {
      const { error } = menteeProfileSchema.validate({
        currentRole: 'Student',
        learningGoals: 'Learn Node.js',
        bio: 'Eager to learn',
      });
      expect(error).toBeUndefined();
    });
    it('should reject overly long bio', () => {
      const { error } = menteeProfileSchema.validate({ bio: 'a'.repeat(2000) });
      expect(error).toBeDefined();
    });
  });

  describe('mentorProfileSchema', () => {
    it('should validate correct mentor profile', () => {
      const { error } = mentorProfileSchema.validate({
        company: 'TestCo',
        experienceYears: 5,
        hourlyRate: 100,
        bio: 'Experienced mentor',
      });
      expect(error).toBeUndefined();
    });
    it('should reject negative experienceYears', () => {
      const { error } = mentorProfileSchema.validate({ experienceYears: -1 });
      expect(error).toBeDefined();
    });
  });

  describe('topicSchema', () => {
    it('should validate correct topic', () => {
      const { error } = topicSchema.validate({ name: 'Node.js', description: 'Backend' });
      expect(error).toBeUndefined();
    });
    it('should reject missing name', () => {
      const { error } = topicSchema.validate({ description: 'Backend' });
      expect(error).toBeDefined();
    });
  });
}); 