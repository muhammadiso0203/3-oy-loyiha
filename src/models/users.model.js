import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'user', 'author'],
      default: 'user',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema.virtual('Course', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'author',
});

userSchema.virtual('Enrolment', {
  ref: 'Enrolment',
  localField: '_id',
  foreignField: 'user_id',
});

const Users = model('User', userSchema);
export default Users;
