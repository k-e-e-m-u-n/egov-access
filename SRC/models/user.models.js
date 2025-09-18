import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    communities: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "male", "female"],
    },
    otp: String,
    otpExpiry: Date,
    profilePhoto: {
      type: [String],
    },
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

export default User