# NENUNNA AI — Healthcare Booking & WhatsApp Automation Demo

This repository implements the backend-first demo architecture from the supplied specification:
React frontend → Node.js/Express API → Supabase → n8n → Meta WhatsApp.

## Included
- Express + TypeScript backend
- Supabase PostgreSQL access
- Demo mode (no external WhatsApp/n8n credentials required)
- Doctor, appointment, lab booking and report APIs
- WhatsApp webhook endpoints
- n8n event endpoints
- Private report signed-URL service
- Helmet, CORS, rate limiting and request validation
- SQL schema + demo seed
- React/Vite frontend starter with booking/demo WhatsApp screens

## Run
1. Create a Supabase project.
2. Run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Fill `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `FRONTEND_URL`.
5. Keep `DEMO_MODE=true` initially.
6. Backend:
   `cd backend && npm install && npm run dev`
7. Frontend:
   `cd frontend && npm install && npm run dev`

This is a demo healthcare application. It is not automatically HIPAA/DPDP/GDPR compliant; production legal, privacy, security and regulatory review is required.
