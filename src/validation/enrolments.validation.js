import Joi from 'joi';

export const enrolmentValidator = (data) => {
  const enrolment = Joi.object({
    user_id: Joi.string().required(),
    course_id: Joi.string().required(),
  });
  return enrolment.validate(data);
};
