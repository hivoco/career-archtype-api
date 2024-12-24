import mongoose from "mongoose";

const { Schema } = mongoose;

const clusterSchema = new Schema(
  {
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
        ref: "ArcheType",
        required: true,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const ClusterModel = mongoose.model("Cluster", clusterSchema);
export default ClusterModel;
