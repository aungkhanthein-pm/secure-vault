# Environment Setup Guide

This document explains how to set up your local environment for SecureVault.

## Prerequisites

1. Node.js 18+ and pnpm installed
2. Supabase project created (with credentials ready)
3. Git installed

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/secure-vault.git
cd secure-vault
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Create `.env.local` File

Copy the example environment file and fill in your actual values:

```bash
cp .env.example .env.local
```

### 4. Fill in Your Supabase Credentials

Open `.env.local` and replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Authentication & Security
JWT_SECRET=your-random-jwt-secret-min-32-chars-here
```

**Where to find these values in Supabase:**

1. **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY**:
   - Go to your Supabase project dashboard
   - Click **Settings** → **API**
   - Copy the **Project URL** and **Anon Key**

2. **SUPABASE_SERVICE_ROLE_KEY**:
   - Same location (Settings → API)
   - Scroll down to find **Service Role Key**
   - ⚠️ **KEEP THIS SECRET** - Never commit to Git

3. **DATABASE_URL**:
   - Go to **Settings** → **Database**
   - Copy the connection string
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`

4. **JWT_SECRET**:
   - Generate a random string (minimum 32 characters)
   - You can use: `openssl rand -base64 32`
   - Or use any random string generator

### 5. Run Database Migrations

Once your database is connected, run the migrations:

```bash
pnpm db:push
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase secret API key (server-side only) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing (min 32 chars) |
| `NODE_ENV` | No | `development` or `production` (default: `development`) |
| `PORT` | No | Server port (default: `3000`) |

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- Keep your `JWT_SECRET` secure and unique
- Use strong, random values for all secrets

## Troubleshooting

**Database connection fails:**
- Verify your `DATABASE_URL` is correct
- Check that Supabase project is active
- Ensure your IP is allowed (Supabase usually allows all by default)

**Migrations fail:**
- Make sure `DATABASE_URL` is set correctly
- Run `pnpm db:push` to apply pending migrations

**Application won't start:**
- Check that all required environment variables are set
- Run `pnpm install` to ensure dependencies are installed
- Check the console for specific error messages

## Next Steps

Once your environment is set up:
1. Create your first user account
2. Set up 2FA with an authenticator app
3. Test file upload and encryption
4. Explore the dashboard features

For more information, see the main README.md
