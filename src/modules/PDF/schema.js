import mongoose from "mongoose";

const { Schema } = mongoose;
const pdfSchema = new Schema(
  {
    title: { type: String, required: true, trim: true }, // Name of the PDF
    pdfUrl: { type: String, required: true, trim: true }, // URL of the PDF in the S3 bucket
    archetypes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ArcheType",
      required: true,
    },
  },
  { timestamps: true }
);

const PDFModel = mongoose.model("PDF", pdfSchema);
export default PDFModel;
