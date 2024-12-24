import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongod = async () => {
  mongoose
    .connect(`${process.env.MONGOCONNECTIONSTRING}`)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

mongod();
