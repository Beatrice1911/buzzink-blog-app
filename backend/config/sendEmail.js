const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

exports.sendResetEmail = async (email, token) => {
  const link = `${process.env.CLIENT_URL}/reset-password.html?token=${token}`;

  await apiInstance.sendTransacEmail({
    sender: { email: "buzzinkblog@gmail.com", name: "BuzzInk" },
    to: [{ email }],
    subject: "Password Reset Request",
    htmlContent: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it:</p>
        <a href="${link}">Reset password</a>
        <p>This link will expire in 30 minutes.</p>
      `,
  });
}

exports.sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email.html?token=${token}`;

  const message = {
    sender: {
      name: "BuzzInk",
      email: "buzzinkblog@gmail.com",
    },
    to: [{ email }],
    subject: "Verify your account",
    htmlContent: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 30 minutes.</p>
    `,
  };

  await apiInstance.sendTransacEmail(message);
}

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       html,
//     });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Failed to send email");
//   }
// };

