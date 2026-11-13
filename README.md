# Sandbox — Instagram kontakt sahifasi

Instagram bio uchun kontakt sahifasi. Forma to'ldirilganda lid Google Sheets'ga yoziladi.

- `index.html` — sahifa
- `api/lead.js` — lidni qabul qilib, Google Apps Script orqali jadvalga yozadi
- `vercel.json` — Vercel sozlamalari

Vercel'da kerakli Environment Variables:
- `SHEETS_WEBHOOK_URL` — Apps Script web app manzili (`.../exec`)
- `SHEETS_SECRET` — Apps Script'dagi `SECRET` bilan bir xil maxfiy kalit
