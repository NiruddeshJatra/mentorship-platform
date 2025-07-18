const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      // Check if this is a password validation error
      const passwordError = error.details.find(detail => 
        detail.path.includes('password') && 
        detail.type === 'password.custom'
      );
      
      // Use WEAK_PASSWORD code for password validation errors
      const errorCode = passwordError ? 'WEAK_PASSWORD' : (error.details[0]?.context?.code || 'VALIDATION_ERROR');
      
      return res.status(400).json({
        error: 'Validation failed',
        code: errorCode,
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context.value
        }))
      });
    }
    
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        error: 'Query validation failed',
        code: 'QUERY_VALIDATION_ERROR',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context.value
        }))
      });
    }
    
    next();
  };
};

module.exports = {
  validateRequest,
  validateQuery
};