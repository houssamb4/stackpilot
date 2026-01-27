import { Request, Response, NextFunction } from 'express';

type ValidationSchema = {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'email';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
};

export const validate = (schema: ValidationSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const errors: string[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      // Check required
      if (rules.required && !value) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value) {
        // Check type
        if (rules.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field} must be a valid email`);
          }
        } else if (typeof value !== rules.type) {
          errors.push(`${field} must be a ${rules.type}`);
        }

        // Check string length
        if (rules.type === 'string' && typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    next();
  };
};
