import express from "express";
import { httpHandler } from "../../../config/errorUtil.js";
import userServices from "./service.js";

const router = express.Router();

router.post(
  "/save-user-data",
  httpHandler(async (req, res) => {
    const data = req.body;
    const result = await userServices.saveUserData(data);
    res.send(result);
  })
);
// router.post(
//   "/email",
//   httpHandler(async (req, res) => {
  
//     const result = await userServices.sendEmailWithPdfFromS3(
//       "krishna@hivoco.com",
//       "krishna",
//       "https://careerarchetypes.s3.ap-south-1.amazonaws.com/pdf/Protagonist%20%2B%20Maverick.pdf"
//     );
//     res.send(result);
//   })
// );

export default router;
