import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: String,
  passwordHash: String,
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  }
});

const User = model('User', userSchema);

export default User;