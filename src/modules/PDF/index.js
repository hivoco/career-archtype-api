import { Router } from "express";
import pdfRouter from "./router.js";
const router = Router();

router.use("/pdf", pdfRouter);

const pdfModule = {
  init: (app) => {
    app.use(router);
    console.log("PDF module Loaded ");
  },
};

export default pdfModule;
