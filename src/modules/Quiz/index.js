import { Router } from "express";
import quizRouter from "./router.js";
const router = Router();

router.use("/quiz", quizRouter);

const quizModule = {
  init: (app) => {
    app.use(router);
    console.log("Quiz module Loaded ");
  },
};

export default quizModule;
