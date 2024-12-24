import mongoose from "mongoose";

const { Schema } = mongoose;
const archeTypeSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    isLeft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ArcheTypeModel = mongoose.model("ArcheType", archeTypeSchema);
export default ArcheTypeModel;
