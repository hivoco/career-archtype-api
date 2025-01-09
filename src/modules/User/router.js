import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import userServices from "./service.js";

const router = express.Router();

router.post(
  "/save-user-data",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await userServices.saveUserData(data);
    res.send(result);
  })
);

export default router;
