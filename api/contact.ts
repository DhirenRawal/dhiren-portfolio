type ContactSubmission = {
  name: string;
  email: string;
  message: string;
};

type ResendEmailPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

type VercelRequest = {
  body?: unknown;
  method?: string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export const config = {
  runtime: "nodejs",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "dhiren.rawal2001@gmail.com";
const DEFAULT_FROM_EMAIL = "Dhiren Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseSubmission(body: unknown): ContactSubmission {
  const payload =
    typeof body === "string"
      ? JSON.parse(body)
      : body;

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request body");
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message : "";

  if (!name) {
    throw new Error("Name / Organization is required");
  }

  if (!email || !isValidEmail(email)) {
    throw new Error("Valid email address required");
  }

  return { name, email, message };
}

async function sendResendEmail(apiKey: string, payload: ResendEmailPayload) {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `Resend request failed with ${response.status}`;

    try {
      const error = (await response.json()) as { message?: string };
      if (error.message) message = error.message;
    } catch {
      const text = await response.text().catch(() => "");
      if (text) message = text;
    }

    throw new Error(message);
  }
}

async function sendContactEmails(submission: ContactSubmission) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Email delivery is not configured yet. Add RESEND_API_KEY in Vercel to activate contact emails.");
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;
  const safeName = escapeHtml(submission.name);
  const safeEmail = escapeHtml(submission.email);
  const safeMessage = escapeHtml(submission.message);

  await sendResendEmail(apiKey, {
    from: fromEmail,
    to: [toEmail],
    subject: `New portfolio inquiry from ${submission.name || "Website Visitor"}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; background: #07111c; color: #f8fafc; padding: 24px;">
        <div style="max-width: 640px; margin: 0 auto; background: #0b1625; border: 1px solid rgba(34,197,94,0.2); border-radius: 18px; padding: 24px;">
          <p style="margin: 0 0 16px; color: #86efac; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">
            Portfolio Contact Submission
          </p>
          <h1 style="margin: 0 0 24px; font-size: 28px; line-height: 1.15;">New inquiry received</h1>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 0; color: #94a3b8; width: 120px;">Name</td>
              <td style="padding: 10px 0; font-weight: 600;">${safeName || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;">Email</td>
              <td style="padding: 10px 0; font-weight: 600;">${safeEmail}</td>
            </tr>
          </table>
          <div style="border: 1px solid rgba(148,163,184,0.18); border-radius: 14px; padding: 16px; background: rgba(2,8,16,0.5);">
            <p style="margin: 0 0 10px; color: #94a3b8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em;">Message</p>
            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${safeMessage || "(No message provided)"}</p>
          </div>
        </div>
      </div>
    `,
  });

  let acknowledgementSent = false;

  try {
    await sendResendEmail(apiKey, {
      from: fromEmail,
      to: [submission.email],
      subject: "Thank you for your interest",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; background: #07111c; color: #f8fafc; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #0b1625; border: 1px solid rgba(34,197,94,0.2); border-radius: 18px; padding: 24px;">
            <p style="margin: 0 0 16px; color: #86efac; font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">
              Acknowledgement
            </p>
            <h1 style="margin: 0 0 18px; font-size: 28px; line-height: 1.15;">Thank you for your interest</h1>
            <p style="margin: 0 0 14px; line-height: 1.7;">Hi ${safeName || "there"},</p>
            <p style="margin: 0 0 14px; line-height: 1.7;">
              Thank you for reaching out through my portfolio website. I’ve received your message and I will reach out to you shortly.
            </p>
            <p style="margin: 0; line-height: 1.7;">
              Best regards,<br />
              Dhiren Rawal
            </p>
          </div>
        </div>
      `,
    });
    acknowledgementSent = true;
  } catch (error) {
    console.error("Acknowledgement email failed", error);
  }

  return { acknowledgementSent };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const submission = parseSubmission(req.body ?? {});
    const result = await sendContactEmails(submission);

    return res.status(201).json({
      success: true,
      acknowledgementSent: result.acknowledgementSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit contact form";
    const isValidationError =
      message.toLowerCase().includes("required") ||
      message.toLowerCase().includes("valid") ||
      message.toLowerCase().includes("invalid");

    return res.status(isValidationError ? 400 : 502).json({ message });
  }
}
