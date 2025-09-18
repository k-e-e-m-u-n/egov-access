import mongoose from "mongoose";


const feedbackSchema = mongoose.Schema({
    feedback: [
        {
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref : "User",
                required: true
            },
          text: {
                type: String,
                required: true,
          },
          userProfilePic: {
                type: String,
          },
        
        }
    ]
  })
  
  
  const Feedback= mongoose.model("Feedback",feedbackSchema);
  
  export default Feedback;
