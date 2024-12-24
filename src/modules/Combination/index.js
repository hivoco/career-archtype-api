import { Router } from "express";
import acrcheTypeRouter from "./router.js";
const router = Router();

router.use("/combination", acrcheTypeRouter);

const combonationModule = {
  init: (app) => {
    app.use(router);
    console.log("Combination module Loaded ");
  },
};

export default combonationModule;
