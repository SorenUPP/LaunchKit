const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendContactEmail({ email, subject, message }) {
    await resend.emails.send({
        from: "LaunchKit <onboarding@resend.dev>",
        to: process.env.COMPANY_EMAIL,
        replyTo: email,
        subject: `[Contact] ${subject}`,
        text: `From: ${email}\n\n${message}`,
        html: `<p><strong>From:</strong> ${email}</p><p>${message}</p>`,
    });
}

module.exports = { sendContactEmail };