import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    quiz: {
      type: Array,
    },
    result: {
      type: Array,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
