import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import archeTypeServices from "./service.js";
import PDFModel from "./schema.js";

const router = express.Router();

router.post("/upload", async (req, res) => {
  function customEncode(input) {
    return input.replace(/\+/g, "%2B").replace(/ /g, "%20");
  }

  try {
    const { title, archetypes } = req.body;
    if (!title || !archetypes) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newtitle = customEncode(title);
    const pdfData = new PDFModel({
      title,
      pdfUrl: `https://careerarchetypes.s3.ap-south-1.amazonaws.com/pdf/${newtitle}`,
      archetypes,
    });

    await pdfData.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      data: {
        title: pdfData.title,
        pdfUrl: pdfData.pdfUrl,
        archetypes: pdfData.archetypes,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error uploading PDF", error: error.message });
  }
});

export default router;
