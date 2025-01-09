import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import ArcheTypeModel from "./schema.js";
import assert from "assert";
import UserModel from "./schema.js";

const saveUserData = async (data) => {
  
  const result = await UserModel(data).save();
  return result;
};

const userServices = { saveUserData };
export default userServices;
