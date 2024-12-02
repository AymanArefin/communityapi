import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({username: String, text: String});

const communitySchema = new Schema({
      name: {
        type: String,
        required: true,
        unique: true
      },
      admin: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
      },
      description: String,
      posts: [String]
});
export const Community = mongoose.model('communities', communitySchema);
