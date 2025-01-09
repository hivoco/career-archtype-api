import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import "./config/db.js";
import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import ArchetypeModule from "./src/modules/ArcheType/index.js";
import ClusterModule from "./src/modules/Cluster/index.js";
import QuizModule from "./src/modules/Quiz/index.js";
import PDFModule from "./src/modules/PDF/index.js";
import UserModule from "./src/modules/User/index.js";
import cookieParser from "cookie-parser";
// import { v2 as cloudinary } from "cloudinary";
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const modules = [
  ArchetypeModule,
  ClusterModule,
  QuizModule,
  PDFModule,
  UserModule,
];
dotenv.config();

export const createApp = () => {
  const app = express();
  // app.use("/static", express.static(process.env.S3_MOUNT_DIR));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    const allowedOrigins = ["http://localhost:8806", "http://localhost:5173"];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", true);
    }
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  });

  return app;
};

export const useModules = (app) => {
  modules.map((module) => module.init(app));
};

export const notFoundHandler = (req, res, next) => {
  next(
    createError(StatusCodes.NOT_FOUND, `${req.originalUrl} route not found`)
  );
};

export const errorHandler = (err, req, res, _next) => {
  res.status(err.statusCode || 500).send({
    msg: "something unwanted occured....",
    error: err.message,
  });
};

export const finishApp = (app) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
