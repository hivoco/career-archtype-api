import { Router } from "express";
import acrcheTypeRouter from "./router.js";
const router = Router();

router.use("/archetype", acrcheTypeRouter);

const archeTypeModule = {
  init: (app) => {
    app.use(router);
    console.log("ArcheType module Loaded 🦹");
  },
};

export default archeTypeModule;
