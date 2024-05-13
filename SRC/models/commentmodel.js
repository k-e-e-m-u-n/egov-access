import mongoose from "mongoose";


const commentSchema = mongoose.Schema({
    comment: [
        {
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref : "Admin",
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
    ]
  })
  
  
  const Comment = mongoose.model("Comment",commentSchema);
  
  export default Comment;
