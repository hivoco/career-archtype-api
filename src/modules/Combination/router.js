import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import combinationServices from "./service.js";




const router = express.Router();

router.post(
  "/create",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await combinationServices.createCombination(data);
    res.send(result);
  })
);

export default router;
