import createError from "http-errors-lite";
import { StatusCodes } from "http-status-codes";
import ArcheTypeModel from "./schema.js";
import assert from "assert";

const createArchetype = async (data) => {
  assert(
    data.title,
    createError(StatusCodes.NOT_FOUND, "Title is not Present")
  );
  const result = await ArcheTypeModel(data).save();
  return result;
};

const getArchetype = async (data) => {
  const result = await ArcheTypeModel.find(data);
  return result;
};

const archeTypeServices = { createArchetype, getArchetype };
export default archeTypeServices;
