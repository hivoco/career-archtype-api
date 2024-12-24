import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import careerServices from "./service.js";

const router = express.Router();

router.post(
  "/create",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await careerServices.createCluster(data);
    res.send(result);
  })
);

export default router;
