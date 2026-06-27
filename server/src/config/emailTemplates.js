function contactEmailTemplate({ email, cleanSubject, cleanMessage }) {
    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:2rem auto;background:#ffffff;border-radius:4px;overflow:hidden;border:1px solid #e5e5e5;">
    
    <div style="background:#000000;padding:1.5rem 2rem;">
      <span style="color:#ffffff;font-size:18px;font-weight:600;letter-spacing:-0.02em;">LaunchKit</span>
    </div>

    <div style="padding:2rem;">
      <p style="font-size:15px;color:#111111;line-height:1.6;margin:0 0 1.5rem;">
        You have received a new contact message from your website.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
        <tr>
          <td style="padding:0.75rem 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#888888;width:80px;">From</td>
          <td style="padding:0.75rem 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111111;">${email}</td>
        </tr>
        <tr>
          <td style="padding:0.75rem 0;border-bottom:1px solid #e5e5e5;font-size:13px;color:#888888;">Subject</td>
          <td style="padding:0.75rem 0;border-bottom:1px solid #e5e5e5;font-size:14px;color:#111111;">${cleanSubject}</td>
        </tr>
      </table>

      <p style="font-size:13px;color:#888888;margin:0 0 8px;">Message</p>
      <p style="font-size:15px;color:#111111;line-height:1.7;margin:0 0 2rem;padding:1rem;background:#f9f9f9;border-radius:4px;border:1px solid #e5e5e5;">${cleanMessage}</p>

      <p style="font-size:13px;color:#888888;margin:0;">
        Reply directly to this email to respond to the customer.
      </p>
    </div>

    <div style="border-top:1px solid #e5e5e5;padding:1rem 2rem;">
      <p style="font-size:12px;color:#aaaaaa;margin:0;">Sent via LaunchKit contact form</p>
    </div>

  </div>
</body>
</html>
`;
}

module.exports = { contactEmailTemplate };