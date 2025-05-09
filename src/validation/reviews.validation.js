import Joi from 'joi';

export const reviewsValidator = (data) => {
  const reviews = Joi.object({
    user_id: Joi.string().required(),
    course_id: Joi.string().required(),
    rating: Joi.string().valid('1', '2', '3', '4', '5').required(),
    comments: Joi.string().max(100).required(),
  });
  return reviews.validate(data);
};
