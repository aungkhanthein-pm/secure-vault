# SecureVault - External Services Setup Guide

Before we proceed with the application development, you need to set up the following free services. Follow the steps below for each service.

---

## 1. Supabase Setup (PostgreSQL Database + Auth)

**Why Supabase?** Free tier includes 500 MB database, 50,000 monthly active users, built-in TOTP 2FA support, and Row Level Security for data protection.

### Steps:

1. Go to https://supabase.com and click **"Start your project"**
2. Sign up with email or GitHub
3. Create a new project:
   - **Project name:** `secure-vault` (or your choice)
   - **Database password:** Create a strong password and save it
   - **Region:** Choose closest to your location
   - Click **"Create new project"** (takes 1-2 minutes)
4. Once created, go to **Project Settings** → **Database**
5. Copy your connection string (looks like: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`)
6. Also note your **Project URL** and **Anon Key** from **Settings** → **API**

### What you'll get:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_ROLE_KEY` - Secret key (keep private)
- `DATABASE_URL` - PostgreSQL connection string

---

## 2. Cloudflare R2 Setup (File Storage)

**Why Cloudflare R2?** Free tier includes 10 GB storage, zero egress fees (crucial for file downloads), and S3-compatible API.

### Steps:

1. Go to https://www.cloudflare.com and sign up (free account)
2. Go to **R2** in the left sidebar
3. Click **"Create bucket"**
   - **Bucket name:** `secure-vault-files` (must be globally unique, add random suffix if needed)
   - **Region:** Choose WNAM (Western North America) or closest to you
   - Click **"Create bucket"**
4. Go to **Settings** → **API Tokens** in R2
5. Click **"Create API token"**
   - **Token name:** `secure-vault-app`
   - **Permissions:** Select "Object Read & Write"
   - **Bucket:** Select your `secure-vault-files` bucket
   - **TTL:** Leave as default
   - Click **"Create API Token"**
6. Copy the credentials shown:
   - `ACCESS_KEY_ID`
   - `SECRET_ACCESS_KEY`
7. Also note your **Account ID** (visible in R2 dashboard)

### What you'll get:
- `R2_ACCOUNT_ID` - Your Cloudflare account ID
- `R2_ACCESS_KEY_ID` - API access key
- `R2_SECRET_ACCESS_KEY` - API secret key
- `R2_BUCKET_NAME` - `secure-vault-files`
- `R2_ENDPOINT` - `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

---

## 3. Cloudflare Pages Setup (Frontend Hosting)

**Why Cloudflare Pages?** Free tier includes unlimited bandwidth, 500 builds/month, automatic SSL, and DDoS protection.

### Steps:

1. Go to https://pages.cloudflare.com
2. Sign in with your Cloudflare account (from R2 setup)
3. Click **"Create a project"**
4. Connect your GitHub account (or use direct upload)
5. For now, just note that we'll deploy here later
6. Create a **Pages project** (you can do this now or later):
   - Click **"Connect to Git"** → Select your GitHub repo
   - **Project name:** `secure-vault`
   - **Production branch:** `main`
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - Click **"Save and Deploy"**

### What you'll get:
- A free `*.pages.dev` domain (e.g., `secure-vault.pages.dev`)
- Automatic HTTPS and DDoS protection

---

## 4. Optional: Custom Domain (Free)

If you want a custom domain instead of `*.pages.dev`:

1. Register a free domain at https://www.freenom.com or use an existing domain
2. In Cloudflare Pages project settings, go to **Custom domains**
3. Add your domain and follow DNS setup instructions

---

## Summary of Credentials to Collect

Create a `.env.local` file in the project root with these values (we'll use them in the next phase):

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=secure-vault-files
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# JWT Secret (generate a random string)
JWT_SECRET=your-random-jwt-secret-here-min-32-chars
```

---

## Next Steps

Once you've completed all the setups above and collected the credentials:

1. Share the credentials with me (or add them to `.env.local`)
2. I'll integrate Supabase, Cloudflare R2, and the authentication system
3. We'll build the elegant dashboard UI with file upload/download
4. Deploy to Cloudflare Pages

**Ready to set these up?** Let me know when you've completed the service setups and have the credentials ready.
