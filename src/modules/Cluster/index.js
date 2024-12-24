import { Router } from "express";
import clusterRouter from "./router.js";
const router = Router();

router.use("/cluster", clusterRouter);

const clusterModule = {
  init: (app) => {
    app.use(router);
    console.log("Cluster module Loaded 💎");
  },
};

export default clusterModule;
