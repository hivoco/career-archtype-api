import { Router } from "express";
import userRouter from "./router.js";
const router = Router();

router.use("/user", userRouter);

const userModule = {
  init: (app) => {
    app.use(router);
    console.log("User module Loaded ");
  },
};

export default userModule;
