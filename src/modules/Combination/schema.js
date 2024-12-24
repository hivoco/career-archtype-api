import mongoose from "mongoose";

const { Schema } = mongoose;
const archeTypeSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  archetype: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cluster",
      required: true,
    },
  ],
},{timestamps:true});

const ArcheTypeModel = mongoose.model("ArcheType", archeTypeSchema);
export default ArcheTypeModel;
