# SecureVault - Encrypted Document Storage

A self-contained, secure document storage web application with end-to-end encryption, two-factor authentication, and an elegant user interface. Store your documents with confidence knowing they're encrypted client-side before ever leaving your device.

## Features

### Security
- **Email/Password Authentication** - Secure login with JWT tokens
- **Two-Factor Authentication (2FA)** - TOTP-based 2FA using standard authenticator apps (Google Authenticator, Authy, etc.)
- **Client-Side Encryption** - Files encrypted with AES-GCM before upload using Web Crypto API
- **Master Passphrase** - Encryption keys derived from user-set master passphrase via PBKDF2
- **Row-Level Security** - Supabase RLS policies ensure users can only access their own data

### File Management
- **Secure Upload** - Drag-and-drop file upload with client-side encryption
- **Secure Download** - Files decrypted client-side after retrieval
- **Folder Organization** - Organize documents into folders/categories
- **File Search & Filter** - Search files by name or filter by type
- **File Operations** - Rename, move, delete files with confirmation dialogs
- **Storage Quota** - Visual display of storage usage

### User Experience
- **Elegant Dashboard** - Modern, polished UI with sidebar navigation
- **Real-Time Updates** - Instant feedback on file operations
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Theme support for user preference

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Web Crypto API** - Client-side encryption (AES-GCM)

### Backend
- **Express.js** - Node.js web server
- **tRPC** - Type-safe RPC framework
- **Drizzle ORM** - Type-safe database queries

### Database & Storage
- **Supabase** - PostgreSQL database + authentication + storage
- **Supabase Storage** - 1 GB free encrypted file storage
- **Row-Level Security (RLS)** - Database-enforced access control

### Security Libraries
- **bcryptjs** - Password hashing
- **speakeasy** - TOTP generation and verification
- **jose** - JWT token handling
- **qrcode** - QR code generation for 2FA setup

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secure-vault.git
   cd secure-vault
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp ENV_TEMPLATE.txt .env.local
   ```
   
   Then edit `.env.local` and fill in your Supabase credentials:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Generate a random string (min 32 chars)

   See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

4. **Run database migrations**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Project Structure

```
secure-vault/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities (encryption, etc.)
│   │   └── App.tsx        # Main app component
│   └── public/            # Static files
├── server/                # Express backend
│   ├── _core/            # Core infrastructure
│   ├── routers.ts        # tRPC route definitions
│   └── db.ts             # Database queries
├── drizzle/              # Database schema & migrations
├── shared/               # Shared types & constants
├── .env.local            # Local environment variables (NOT committed)
├── ENV_TEMPLATE.txt      # Template for .env.local
└── ENV_SETUP.md          # Detailed environment setup guide
```

## Usage

### Creating an Account
1. Go to the login page
2. Click "Sign Up"
3. Enter your email and create a password
4. Verify your email (if required)
5. Log in with your credentials

### Setting Up 2FA
1. Go to **Settings** → **Security**
2. Click **Enable 2FA**
3. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.)
4. Enter the 6-digit code to verify
5. Save your backup codes in a safe place

### Uploading Files
1. Go to **Dashboard** → **Upload**
2. Drag and drop files or click to select
3. Files are encrypted client-side before upload
4. Choose a folder (optional)
5. Click **Upload**

### Organizing Files
1. Create folders in **Settings** → **Folders**
2. Move files to folders by selecting and choosing destination
3. Rename files by right-clicking and selecting **Rename**
4. Delete files with confirmation dialog

### Downloading Files
1. Select a file from the list
2. Click **Download**
3. File is decrypted client-side and saved to your device

### Searching Files
1. Use the search bar in the dashboard
2. Filter by file type using the filter dropdown
3. Filter by folder using the folder selector

## Security Considerations

### What We Encrypt
- **File contents** - All files are encrypted with AES-GCM before upload
- **Encryption keys** - Stored encrypted in the database
- **Master passphrase** - Never stored; only a hash for verification

### What We Don't Encrypt
- **File metadata** - Names, sizes, types are searchable (stored in plaintext)
- **User data** - Email addresses, names for account management

### Security Best Practices
1. **Use a strong master passphrase** - At least 12 characters, mix of uppercase, lowercase, numbers, symbols
2. **Enable 2FA** - Protects your account even if password is compromised
3. **Save backup codes** - Store them securely in case you lose access to authenticator app
4. **Keep your device secure** - Your encryption keys are derived from your passphrase
5. **Don't share credentials** - Each user should have their own account

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm check

# Format code
pnpm format

# Run tests
pnpm test

# Generate database migrations
pnpm drizzle-kit generate

# Apply database migrations
pnpm db:push
```

### Database Schema

The application uses the following main tables:

- **users** - User accounts with password hashes and TOTP settings
- **files** - File metadata with encryption keys and storage references
- **folders** - User-created folders for organization
- **sessions** - JWT refresh tokens for authentication
- **totp_backup_codes** - Backup codes for 2FA recovery

See [drizzle/schema.ts](./drizzle/schema.ts) for complete schema definition.

## Deployment

### Cloudflare Pages (Frontend)
1. Push code to GitHub
2. Connect GitHub repo to Cloudflare Pages
3. Set build command: `pnpm build`
4. Set build output: `dist`

### Backend Hosting
The backend can be deployed to:
- Render.com (free tier available)
- Railway.app (free tier available)
- Heroku (paid)
- Your own server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] Sharing files with other users
- [ ] File versioning and history
- [ ] Advanced search with full-text indexing
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Backup and restore functionality
- [ ] Audit logs for security

## Acknowledgments

- [Supabase](https://supabase.com) - Database and authentication
- [React](https://react.dev) - UI framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [tRPC](https://trpc.io) - Type-safe RPC
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - Client-side encryption

---

**Built with security and elegance in mind.** 🔒✨
