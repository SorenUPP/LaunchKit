const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const sanitizeHtml = require("sanitize-html");
const { contactEmailTemplate } = require("./emailTemplates");

async function sendContactEmail({ email, subject, message }) {
    const cleanSubject = sanitizeHtml(subject, { allowedTags: [], });
    const cleanMessage = sanitizeHtml(message, { allowedTags: [], });

    await resend.emails.send({
        from: "LaunchKit <onboarding@resend.dev>",
        to: process.env.COMPANY_EMAIL,
        replyTo: email,
        subject: `[Contact] ${cleanSubject}`,
        text: `From: ${email}\n\n${cleanMessage}`,
        html: contactEmailTemplate({ email, cleanSubject, cleanMessage }),
    });
}

module.exports = { sendContactEmail };