//create user schema from mongoose
import mongoose from "mongoose";

//setup schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNnumber: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
  },
  profilePic: {
    type: String,
  },
});

//create the user model
const User = mongoose.model("User", userSchema);
export default User;
