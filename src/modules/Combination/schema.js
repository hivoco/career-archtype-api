import mongoose from "mongoose";

const { Schema } = mongoose;
const combinationSchema = new Schema(
  {
    title: { type: String, trim: true },
    clusters: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Cluster",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const CombinationModel = mongoose.model("Combination", combinationSchema);
export default CombinationModel;
