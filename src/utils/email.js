import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendSellerOTP(email, otp) {
  await transporter.sendMail({
    from: `"iNova Store" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "iNova Seller Verification",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        color: #1d1d1f;
      ">

        <h2>
          iNova Seller Verification
        </h2>

        <p>
          You requested to become a seller on iNova.
        </p>

        <p>
          Your verification code is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 25px 0;
        ">
          ${otp}
        </div>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p style="color: #86868b;">
          If you did not request this, you can safely ignore this email.
        </p>

      </div>
    `,
  });
}
