// Lidni qabul qilib, Google Sheets'ga (Apps Script orqali) yuboradi.
// Kerakli env o'zgaruvchilar: SHEETS_WEBHOOK_URL, SHEETS_SECRET

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const phone = clean(body.phone, 20).replace(/\D/g, "");
  if (!/^\d{9}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: "phone" });
  }

  const url = process.env.SHEETS_WEBHOOK_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) {
    console.error("SHEETS_WEBHOOK_URL yoki SHEETS_SECRET yo'q");
    return res.status(500).json({ ok: false, error: "config" });
  }

  const lead = {
    secret: secret,
    name: clean(body.name, 80),
    phone: phone,
    discount: body.discount === true,
    page: clean(body.page, 300),
    ref: clean(body.ref, 300),
    ua: clean(req.headers["user-agent"], 300),
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      redirect: "follow",
    });
    const text = await r.text();
    let data = {};
    try { data = JSON.parse(text); } catch (e) {}
    if (!data.ok) {
      console.error("Sheets javobi:", r.status, text.slice(0, 300));
      return res.status(502).json({ ok: false, error: "sheets" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Sheets xatosi:", e && e.message);
    return res.status(502).json({ ok: false, error: "network" });
  }
};
