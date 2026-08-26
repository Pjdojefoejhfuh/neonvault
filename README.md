# NeonVault

A self-hosted Lua script management service with:
- PostgreSQL via Prisma
- AES-256-GCM encrypted script storage
- JWT authentication
- Dashboard pages: Login, Register, Scripts, API Keys, Logs, Settings
- API key expiration and revocation
- Basic Lua transformation/obfuscation pipeline
- Next.js App Router + Tailwind CSS

## Requirements
- Node.js 20+
- PostgreSQL 15+

## Setup
1. Copy `.env.example` to `.env`
2. Set `DATABASE_URL`, `JWT_SECRET`, and a 32-byte hex `ENCRYPTION_KEY`
3. Run:
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev

Generate an encryption key:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Never commit `.env` or production encryption keys.
