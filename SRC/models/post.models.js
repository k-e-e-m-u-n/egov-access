// import  { text }  from "body-parser";
// import pkg from 'body-parser';
// const { text } = pkg;
import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Admin",
        required: true
    },
    adminProfilePic: {
      type: String,
    },
    text: {
        type: String,
        maxlength: 3000
    },
    img: [{
      type: String
    }],
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    views: {
      type : Number ,
      default : 50
    },
    comment: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            adminId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Admin",
              required: true
          },
          text: {
                type: String,
                required: true,
          },
          userProfilePic: {
                type: String,
          },
          name: {
                type: String,
          },
        }
    ],
    replies: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true
        },
          text: {
            type: String,
            required: true
          },
          userProfilePic: {
            type: String
          },
          name: {
            type: String
          },
        },
      ],
      createdAt: {
        type: String
    }
},
{
    timestamp: Date
}
)

const Post = mongoose.model("Post",postSchema);

export default Post;