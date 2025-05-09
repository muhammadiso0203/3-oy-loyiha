import Joi from 'joi';

export const courseValidator = (data) => {
  const course = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(4).max(100),
    price: Joi.number().required(true),
    author: Joi.string().required(),
    category: Joi.string().required(),
  });
  return course.validate(data);
};
