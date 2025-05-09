import Joi from 'joi';

export const userValidator = (data) => {
  const users = Joi.object({
    fullname: Joi.string().min(2).max(20),
    email: Joi.string().required(),
    password: Joi.string(),
    role: Joi.string().valid('superadmin', 'admin', 'user', 'author'),
  });
  return users.validate(data);
};
