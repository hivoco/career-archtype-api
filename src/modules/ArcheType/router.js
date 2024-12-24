import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import archeTypeServices from "./service.js";
import ArcheTypeModel from "./schema.js";

const router = express.Router();

router.post(
  "/create",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await archeTypeServices.createArchetype(data);
    res.send(result);
  })
);
router.get(
  "/get",
  httpHandler(async (req, res) => {
   
    const result = await archeTypeServices.getArchetype();
    res.send(result);
  })
);

router.put("/update-isLeft/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Update the document
    const result = await ArcheTypeModel.findByIdAndUpdate(
      id,
      { isLeft: true }, // Update operation
      { new: true, runValidators: true } // Options: return updated document and validate
    );

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
