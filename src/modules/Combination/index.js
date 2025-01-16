import { Router } from "express";
import pdfRouter from "./router.js";
const router = Router();

router.use("/combination", pdfRouter);

const combinationModule = {
  init: (app) => {
    app.use(router);
    console.log("Combination module Loaded ");
  },
};

export default combinationModule;
