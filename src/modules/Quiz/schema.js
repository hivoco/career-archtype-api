import mongoose from "mongoose";

const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    archetype: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArcheType",
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const questionSchema = new Schema({
  questionText: { type: String, required: true, trim: true },
  options: [optionSchema],
});

const QuestionModel = mongoose.model("Question", questionSchema);
export default QuestionModel;
