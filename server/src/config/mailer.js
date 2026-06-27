const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_APP_PASSWORD,
    },
});

async function sendContactEmail({ email, subject, message }) {
    await transporter.sendMail({
        from: `"LaunchKit contact" <${process.env.MAIL_USER}>`,
        to: process.env.COMPANY_EMAIL,
        replyTo: email,
        subject: `[Contact] ${subject}`,
        text: `From: ${email}\n\n${message}`,
        html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    });
}

module.exports = { sendContactEmail };