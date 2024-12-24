import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import archeTypeServices from "./service.js";

const router = express.Router();

router.post(
  "/create",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await archeTypeServices.createArchetype(data);
    res.send(result);
  })
);

export default router;
