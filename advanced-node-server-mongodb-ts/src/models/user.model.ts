import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface IUserDocument extends mongoose.Document {
  email: String;
  name: String;
  password: String;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// schema pre hook
userSchema.pre('save', async function (next: (err?: Error) => void) {
  // type assertion to user variable
  let user = this as IUserDocument;

  // checks user changed password
  if (!user.isModified('password')) {
    return next();
  }

  // if password changed this execute
  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = bcrypt.hashSync(user.password as string, salt);
  user.password = hash;
  return next();
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
