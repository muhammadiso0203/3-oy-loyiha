// models/Enrolment.js
import { model, Schema } from 'mongoose';

const enrolmentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true }
);

const Enrolment = model('Enrolment', enrolmentSchema);
export default Enrolment;
