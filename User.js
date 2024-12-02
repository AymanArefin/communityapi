import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
      username: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      community: {type: String, default: ""}
});
export const User = mongoose.model('users', userSchema);
