import UserModel from "./schema.js";

import transporter from "../../helper/sendEmail.js";

import axios from "axios";

const sendEmailWithPdfFromS3 = async (toEmail, firstName, s3PdfUrl) => {
  try {
    // Step 1: Download PDF from S3 as buffer
    const pdfResponse = await axios.get(s3PdfUrl, {
      responseType: "arraybuffer",
    });

    const pdfBuffer = Buffer.from(pdfResponse.data, "binary");

    const mailOptions = {
      from: '"OfExperiences"<Ofexcareerarchetypes@gmail.com>',
      to: toEmail,
      subject: "Your Career Archetype Quiz Results Are Here!",
      html: `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Your Career Archetype Quiz Results</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background-color: #ffffff; border-radius: 8px;">
                    <!-- Logo Row -->
                    <tr>
                        <td align="center" style="padding: 30px 30px 15px 30px;">
                            <img src="https://ofexperiences.com/wp-content/uploads/2021/07/OfExperience_Logo-Lockup_Official-1.png" 
                                alt="OfExperiences Logo" 
                                style="max-width: 250px; height: auto;" />
                        </td>
                    </tr>
                    <!-- Content Row -->
                    <tr>
                        <td align="left" style="padding: 0 30px 30px 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                            <p style="margin-top: 0;">Hi <strong>${firstName}</strong>,</p>

                            <p>Thank you for taking the <strong>Career Archetype Quiz</strong>!</p>

                            <p>
                                Attached to this email, you'll find your personalized report — a snapshot of your unique
                                career personality, what drives you at work, and how you can make more aligned and
                                confident career choices.
                            </p>

                            <p>
                                We hope this helps you reflect, realign, and take your next step with greater clarity.
                            </p>

                            <p>
                                If you'd like to explore your results further or have a deeper conversation about your
                                career direction with a coach, reach out to us at
                                <a href="mailto:dipti@ofexperiences.com"
                                    style="color: #007acc;">dipti@ofexperiences.com</a>.
                            </p>

                            <p style="margin-bottom: 0;">Warm regards,</p>
                            <p style="margin-top: 0;"><strong>Team OfExperiences</strong></p>

                            <p><a href="https://www.ofexperiences.com" style="color: #007acc;">www.ofexperiences.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`,
      attachments: [
        {
          filename: "Career-Archetype-Report.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};

const sendAdminNotificationEmail = async (userEmail, userName, s3PdfUrl) => {
  try {
    // Extract archetype name from S3 URL for more informative admin notification
    const pdfFileName = s3PdfUrl.split("/").pop();
    const archetypeName = decodeURIComponent(pdfFileName.replace(".pdf", ""));

    const mailOptions = {
      from: '"New Quiz Submission"<Ofexcareerarchetypes@gmail.com>',
      to: "dipti@ofexperiences.com", // Admin email
      subject: "New Career Archetype Quiz Submission",
      html: `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>New Career Archetype Quiz Submission</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0"
                    style="background-color: #ffffff; border-radius: 8px;">
                    <!-- Logo Row -->
                    <tr>
                        <td align="center" style="padding: 30px 30px 15px 30px;">
                            <img src="https://ofexperiences.com/wp-content/uploads/2021/07/OfExperience_Logo-Lockup_Official-1.png" 
                                alt="OfExperiences Logo" 
                                style="max-width: 250px; height: auto;" />
                        </td>
                    </tr>
                    <!-- Content Row -->
                    <tr>
                        <td align="left" style="padding: 0 30px 30px 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                            <h2 style="color: #007acc;">New Quiz Submission Alert</h2>
                            
                            <p>A new user has completed the Career Archetype Quiz:</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${userName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                                        <a href="mailto:${userEmail}" style="color: #007acc;">${userEmail}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Archetype:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${archetypeName}</td>
                                </tr>
                            </table>
                            
                            <p>
                                <a href="${s3PdfUrl}" style="display: inline-block; background-color: #007acc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View PDF Report</a>
                            </p>

                            <p style="margin-top: 20px; color: #666;">This is an automated notification from the Career Archetype Quiz system.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", info.response);
    return info;
  } catch (err) {
    console.error("Error sending admin notification email:", err);
    throw err;
  }
};

const saveUserData = async (data) => {
  const result = await UserModel(data).save();
  sendEmailWithPdfFromS3(data.email, data.name, data.pdfUrl)
    .then(() => console.log(`Email sent successfully to ${data.email}`))
    .catch((err) => console.error(`Background email error: ${err.message}`));
  sendAdminNotificationEmail(data.email, data.name, data.pdfUrl)
    .then(() => console.log(`Admin Email sent successfully`))
    .catch((err) =>
      console.error(`Admin Background email error: ${err.message}`)
    );
  return result;
};

const userServices = { saveUserData, sendEmailWithPdfFromS3 };
export default userServices;
