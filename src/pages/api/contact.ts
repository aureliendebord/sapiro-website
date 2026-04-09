import type { APIRoute } from "astro";

export const prerender = false;

const SENDER_EMAIL = "bonjour@sapiro.app";
const RECIPIENT_EMAIL = "adebord@agencedebord.com";

// Rate limiting simple en memoire (reset au redeploy)
const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure
const RATE_LIMIT_MAX = 5; // 5 soumissions par IP par heure

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = submissions.get(ip) || [];
  const recent = history.filter((t) => now - t < RATE_LIMIT_WINDOW);
  submissions.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordSubmission(ip: string) {
  const history = submissions.get(ip) || [];
  history.push(Date.now());
  submissions.set(ip, history);
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SendGrid API error ${response.status}: ${text}`);
  }
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.SENDGRID_API_KEY || import.meta.env.SENDGRID_API_KEY;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Trop de soumissions. Reessayez plus tard." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();

    const name = (formData.get("name") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const message = (formData.get("message") as string)?.trim() || "";

    // Honeypot : si un champ cache "website" est rempli, c'est un bot
    const honeypot = formData.get("website") as string;
    if (honeypot) {
      // On simule un succes pour ne pas alerter le bot
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validation serveur
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Champs obligatoires manquants." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Email invalide." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (message.length > 500) {
      return new Response(
        JSON.stringify({ error: "Message trop long (500 caracteres max)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- SendGrid via fetch (compatible Cloudflare Workers) ---
    const emailHtml = `
      <h2>Nouvelle demande de contact — Sapiro</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;color:#555;">Nom</td><td style="padding:8px;">${name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#555;">Message</td><td style="padding:8px;">${message.replace(/\n/g, "<br>")}</td></tr>
      </table>
    `;

    await sendEmail(apiKey, {
      personalizations: [{ to: [{ email: RECIPIENT_EMAIL }] }],
      from: { email: SENDER_EMAIL, name: "Sapiro — Formulaire de contact" },
      reply_to: { email, name },
      subject: `[Sapiro] Nouveau contact : ${name}`,
      content: [{ type: "text/html", value: emailHtml }],
    });

    recordSubmission(ip);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
