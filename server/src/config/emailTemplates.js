function contactEmailTemplate({ email, cleanSubject, cleanMessage }) {
    return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:580px;margin:2rem auto;background:#ffffff;border-radius:12px;overflow:hidden;border:0.5px solid #d0daea;">
    
    <div style="background:#1a56db;padding:2rem 2rem 1.5rem;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <img src="https://www.google.com/s2/favicons?domain=gmail.com&sz=18" width="18" height="18" style="display:block;" />
        </div>
        <span style="color:#ffffff;font-size:17px;font-weight:500;">LaunchKit</span>
      </div>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:1rem 0 0;">New contact message</p>
    </div>

    <div style="padding:1.75rem 2rem;">
      <div style="background:#eff6ff;border-radius:8px;border:0.5px solid #bfdbfe;padding:1rem 1.25rem;margin-bottom:1.5rem;">
        <p style="font-size:12px;color:#1d4ed8;font-weight:500;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.05em;">From</p>
        <p style="font-size:15px;color:#1e3a5f;margin:0;font-weight:500;">${email}</p>
      </div>
      <div style="margin-bottom:1.25rem;">
        <p style="font-size:12px;color:#6b7280;font-weight:500;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Subject</p>
        <p style="font-size:16px;color:#111827;font-weight:500;margin:0;">${cleanSubject}</p>
      </div>
      <div style="border-top:0.5px solid #e5e7eb;padding-top:1.25rem;">
        <p style="font-size:12px;color:#6b7280;font-weight:500;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
        <p style="font-size:15px;color:#374151;line-height:1.7;margin:0;">${cleanMessage}</p>
      </div>
      <div style="margin-top:1.75rem;background:#eff6ff;border-radius:8px;border-left:3px solid #1a56db;padding:0.875rem 1.125rem;">
        <p style="font-size:13px;color:#1d4ed8;margin:0;">Reply directly to this email to respond to the customer.</p>
      </div>
    </div>

    <div style="border-top:0.5px solid #e5e7eb;padding:1.25rem 2rem;background:#f8fafc;">
      <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center;">Sent via LaunchKit contact form</p>
    </div>

  </div>
</body>
</html>
`;
}

module.exports = { contactEmailTemplate };