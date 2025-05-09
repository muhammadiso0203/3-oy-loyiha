import Joi from 'joi';

export const categoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().min(4).max(20).required(),
    description: Joi.string().required(),
  });
  return category.validate(data);
};
