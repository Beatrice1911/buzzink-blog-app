const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
    await resend.emails.send({
    from: "BuzzInk <onboarding@resend.dev>",
    to: email,
    subject: "Password Reset Request",
    html: `
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 30 minutes.</p>
  `
  });
};

module.exports = sendEmail;
