import { model, Schema } from 'mongoose';

const reviewSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const review = model('review', reviewSchema);
export default review;
