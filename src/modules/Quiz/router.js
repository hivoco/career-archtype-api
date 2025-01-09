import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import quizServices from "./service.js";

const router = express.Router();

router.post(
  "/create",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await quizServices.createQuestion(data);
    res.send(result);
  })
);
router.get(
  "/get",
  httpHandler(async (req, res) => {
    const result = await quizServices.getQuestion();
    res.send(result);
  })
);
router.get(
  "/questions",
  httpHandler(async (req, res) => {
    const result = await quizServices.getQuizQuestion();
    res.send(result);
  })
);
router.post(
  "/calculate-result",
  httpHandler(async (req, res) => {
    const data = req.body
    const result = await quizServices.calculateResult(data);
    res.send(result);
  })
);




export default router;
