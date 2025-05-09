import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categorySchema.virtual('course', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'category',
});

const category = model('Category', categorySchema);
export default category;
