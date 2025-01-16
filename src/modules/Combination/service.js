import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import CombinationModel from "./schema.js";
import assert from "assert";

const createCombination = async (data) => {
  assert(
    data.description,
    createError(StatusCodes.NOT_FOUND, "Title is not Present")
  );
  const result = await CombinationModel(data).save();
  return result;
};
const combinationServices = { createCombination };
export default combinationServices;
