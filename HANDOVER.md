# SecureVault - Project Handover Document

## Project Overview

**SecureVault** is a self-contained, secure document storage web application designed to provide end-to-end encryption for sensitive documents. Unlike traditional cloud storage solutions, SecureVault encrypts all files **client-side** before they ever leave the user's device, ensuring that even the server cannot access the unencrypted content.

### Core Objective

Build a production-ready document storage platform that prioritizes **security, privacy, and user control** with the following key principles:

1. **Zero-Knowledge Architecture** - Files are encrypted on the client before upload; the server never has access to unencrypted data
2. **Complete Independence** - No reliance on third-party authentication services; all infrastructure is self-contained
3. **Elegant User Experience** - Polished, intuitive UI that makes secure document management accessible to non-technical users
4. **Standards-Based Security** - Uses industry-standard encryption (AES-GCM), key derivation (PBKDF2), and 2FA (TOTP)

---

## Key Features (Planned)

### Authentication & Security
- ✅ Email/password registration and login with JWT tokens
- ✅ TOTP-based 2FA using standard authenticator apps (Google Authenticator, Authy, etc.)
- ✅ Password hashing with bcryptjs
- ✅ Session management with refresh tokens
- ⏳ Client-side encryption key derivation from user-set master passphrase (PBKDF2)

### File Management
- ⏳ Secure file upload with client-side AES-GCM encryption
- ⏳ Secure file download with client-side decryption
- ⏳ Folder/category organization for documents
- ⏳ File metadata storage (name, size, type, upload date)
- ⏳ File search and filtering by name/type
- ⏳ File deletion with confirmation dialogs
- ⏳ Soft delete support for recovery

### User Interface
- ⏳ Elegant dashboard with sidebar navigation
- ⏳ Storage usage visualization
- ⏳ Recent files section
- ⏳ Quick actions panel
- ⏳ Dark/light theme support
- ⏳ Responsive design for desktop and mobile

### Infrastructure
- ✅ PostgreSQL database (via Supabase)
- ✅ Row-Level Security (RLS) for database access control
- ⏳ Supabase Storage for encrypted file storage (1 GB free tier)
- ⏳ Cloudflare Pages for frontend deployment (optional)

---

## Technology Stack

### Frontend
- **React 19** - Modern UI framework with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with modern features
- **Vite** - Lightning-fast build tool and dev server
- **Web Crypto API** - Browser-native encryption (AES-GCM)
- **Wouter** - Lightweight client-side routing

### Backend
- **Express.js** - Minimal, flexible Node.js web server
- **tRPC** - Type-safe RPC framework with end-to-end TypeScript support
- **Drizzle ORM** - Lightweight, type-safe database queries

### Database & Storage
- **Supabase** - PostgreSQL database with built-in authentication and storage
- **Supabase Storage** - S3-compatible file storage (1 GB free)
- **Row-Level Security (RLS)** - Database-enforced access control

### Security Libraries
- **bcryptjs** - Password hashing (OWASP recommended)
- **speakeasy** - TOTP generation and verification
- **jose** - JWT token creation and verification
- **qrcode** - QR code generation for 2FA setup

---

## Project Structure

```
secure-vault/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components (Home, Login, Register, Dashboard)
│   │   ├── components/             # Reusable UI components (shadcn/ui)
│   │   ├── contexts/               # React contexts (Theme, Auth)
│   │   ├── hooks/                  # Custom hooks (useAuth, useEncryption)
│   │   ├── lib/                    # Utilities (encryption, tRPC client)
│   │   ├── _core/                  # Core infrastructure
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles and Tailwind
│   ├── public/                     # Static files (favicon, robots.txt)
│   └── index.html                  # HTML template
│
├── server/                          # Express backend
│   ├── _core/                      # Core infrastructure
│   │   ├── index.ts                # Server entry point
│   │   ├── context.ts              # tRPC context with JWT auth
│   │   ├── auth.ts                 # Authentication service
│   │   ├── vite.ts                 # Vite dev server setup
│   │   └── env.ts                  # Environment variables
│   ├── routers.ts                  # tRPC procedure definitions
│   ├── db.ts                       # Database queries and helpers
│   └── auth.logout.test.ts         # Example test file
│
├── drizzle/                         # Database schema and migrations
│   ├── schema.ts                   # Table definitions (users, files, folders, sessions)
│   ├── migrations/                 # SQL migration files
│   ├── meta/                       # Migration metadata
│   └── 0000_*.sql                  # Generated PostgreSQL migrations
│
├── shared/                          # Shared code between frontend and backend
│   ├── const.ts                    # Shared constants
│   └── types.ts                    # Shared TypeScript types
│
├── .env.local                       # Local environment variables (NOT committed)
├── ENV_TEMPLATE.txt                # Template for .env.local
├── ENV_SETUP.md                    # Detailed environment setup guide
├── SETUP_GUIDE.md                  # External service setup instructions
├── README.md                        # Project documentation
├── HANDOVER.md                      # This file
├── todo.md                          # Implementation roadmap
├── package.json                    # Dependencies and scripts
├── drizzle.config.ts               # Drizzle ORM configuration
├── vite.config.ts                  # Vite build configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## Current Status

### ✅ Completed
- Project initialization with React 19 + Express + tRPC stack
- Database schema designed for PostgreSQL (users, files, folders, sessions, TOTP backup codes)
- Database migrations generated and applied to Supabase
- Independent authentication service (JWT + password hashing)
- Environment setup documentation
- GitHub repository created and configured
- Manus OAuth and analytics code removed
- Frontend landing page with Sign In/Sign Up navigation
- Cross-platform compatibility (Windows, macOS, Linux)

### ⏳ In Progress / TODO
- Email/password authentication endpoints (register, login)
- TOTP 2FA setup and verification
- Client-side encryption utilities (PBKDF2 + AES-GCM)
- File upload with encryption
- File download with decryption
- Dashboard UI implementation
- File management features (search, filter, delete, rename)
- Folder organization
- Storage quota display
- Comprehensive testing

See [todo.md](./todo.md) for detailed implementation checklist.

---

## Key Files to Understand the Project

### Architecture & Design
- **[README.md](./README.md)** - Complete project documentation with features, tech stack, and usage guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Instructions for setting up external services (Supabase, Cloudflare)
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Detailed environment variable configuration guide

### Database & Schema
- **[drizzle/schema.ts](./drizzle/schema.ts)** - Database table definitions with detailed comments
  - `users` - User accounts with password hashes and TOTP settings
  - `files` - File metadata with encryption keys and storage references
  - `folders` - User-created folders for organization
  - `sessions` - JWT refresh tokens for authentication
  - `totp_backup_codes` - Backup codes for 2FA recovery
- **[drizzle/0000_*.sql](./drizzle/0000_left_gabe_jones.sql)** - PostgreSQL migration SQL

### Backend Implementation
- **[server/routers.ts](./server/routers.ts)** - tRPC procedure definitions
  - `auth.me` - Get current authenticated user
  - `auth.logout` - Logout and clear session
  - ⏳ `auth.register` - User registration
  - ⏳ `auth.login` - User login
  - ⏳ `files.*` - File operations
  - ⏳ `folders.*` - Folder operations
- **[server/db.ts](./server/db.ts)** - Database query helpers
  - User queries (getUserByEmail, createUser, updateUser)
  - File queries (getFiles, createFile, deleteFile)
  - Folder queries (getFolders, createFolder)
- **[server/_core/auth.ts](./server/_core/auth.ts)** - Authentication service
  - Password hashing and verification
  - JWT token generation and verification
  - TOTP secret generation
- **[server/_core/context.ts](./server/_core/context.ts)** - tRPC context with JWT authentication
- **[server/_core/index.ts](./server/_core/index.ts)** - Express server setup and middleware

### Frontend Implementation
- **[client/src/App.tsx](./client/src/App.tsx)** - Main app component with routing
  - Route definitions (Home, Login, Register, Dashboard)
  - Theme provider setup
  - Global error handling
- **[client/src/pages/Home.tsx](./client/src/pages/Home.tsx)** - Landing page
  - Authentication state handling
  - Navigation to dashboard or login
- **[client/src/_core/hooks/useAuth.ts](./client/src/_core/hooks/useAuth.ts)** - Authentication hook
  - User state management
  - Logout functionality
  - Redirect on unauthenticated
- **[client/src/lib/trpc.ts](./client/src/lib/trpc.ts)** - tRPC client setup
  - Type-safe API calls
  - Query and mutation hooks

### Configuration
- **[.env.local](./ENV_TEMPLATE.txt)** - Environment variables (template provided)
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Supabase public API key
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase secret API key
  - `DATABASE_URL` - PostgreSQL connection string
  - `JWT_SECRET` - Secret for JWT signing
- **[drizzle.config.ts](./drizzle.config.ts)** - Drizzle ORM configuration
- **[vite.config.ts](./vite.config.ts)** - Vite build and dev server configuration
- **[tsconfig.json](./tsconfig.json)** - TypeScript compiler options
- **[package.json](./package.json)** - Dependencies and npm scripts

---

## Security Architecture

### Authentication Flow
1. User enters email and password on login page
2. Frontend sends credentials to `auth.login` tRPC procedure
3. Backend verifies password against bcrypt hash
4. Backend generates JWT token (short-lived) and refresh token (long-lived)
5. Frontend stores JWT in memory, refresh token in secure HTTP-only cookie
6. Subsequent requests include JWT in Authorization header
7. tRPC context verifies JWT and injects authenticated user into procedures

### Encryption Flow (Planned)
1. User sets master passphrase during registration
2. Master passphrase is never stored on server
3. User enters master passphrase on login (client-side only)
4. Client derives encryption key from passphrase using PBKDF2
5. When uploading file:
   - Client encrypts file content with AES-GCM using derived key
   - Client generates random IV (initialization vector)
   - Client encrypts the file key with user's master key
   - Encrypted file and encrypted key are sent to server
   - Server stores encrypted file in Supabase Storage
   - Server stores encrypted key and IV in database
6. When downloading file:
   - Client retrieves encrypted file and encrypted key from server
   - Client decrypts the file key using master passphrase
   - Client decrypts file content using decrypted file key
   - File is decrypted entirely on client before saving to disk

### Database Security
- **Row-Level Security (RLS)** - PostgreSQL policies ensure users can only access their own data
- **Password Hashing** - All passwords hashed with bcryptjs (salt rounds: 10)
- **JWT Tokens** - Signed with `JWT_SECRET`, verified on every request
- **HTTPS Only** - All production traffic must be encrypted
- **No Sensitive Data in Logs** - Passwords, keys, tokens never logged

### 2FA Security
- **TOTP (Time-based One-Time Password)** - Industry standard, works with any authenticator app
- **Backup Codes** - Generated during 2FA setup for account recovery
- **Base32 Encoding** - TOTP secret stored as Base32-encoded string
- **30-Second Window** - Allows for clock skew between client and server

---

## Development Workflow

### Local Setup
```bash
# Clone repository
git clone https://github.com/aungkhanthein-pm/secure-vault.git
cd secure-vault

# Install dependencies
pnpm install

# Set up environment
cp ENV_TEMPLATE.txt .env.local
# Edit .env.local with your Supabase credentials

# Apply database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Available Scripts
```bash
pnpm dev          # Start development server (Vite + Express)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm check        # Run TypeScript type checking
pnpm format       # Format code with Prettier
pnpm test         # Run Vitest unit tests
pnpm db:push      # Generate and apply database migrations
```

### Adding New Features
1. Update database schema in `drizzle/schema.ts` if needed
2. Run `pnpm drizzle-kit generate` to create migration
3. Review generated SQL and run `pnpm db:push` to apply
4. Add database query helpers in `server/db.ts`
5. Create tRPC procedures in `server/routers.ts`
6. Build frontend components in `client/src/pages/` or `client/src/components/`
7. Call tRPC procedures from frontend using `trpc.*.useQuery()` or `trpc.*.useMutation()`
8. Write tests in `server/*.test.ts` using Vitest
9. Commit changes and push to GitHub

### Testing
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/auth.logout.test.ts

# Watch mode
pnpm test --watch
```

---

## Deployment

### Frontend (Cloudflare Pages)
1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Set build command: `pnpm build`
4. Set build output: `dist`
5. Add environment variables in Cloudflare dashboard
6. Deploy

### Backend
The backend can be deployed to:
- **Render.com** (free tier available)
- **Railway.app** (free tier available)
- **Heroku** (paid)
- **Your own server**

Ensure environment variables are set in your hosting platform.

---

## Important Notes

### ⚠️ Security Considerations
- **Never commit `.env.local`** - It's in `.gitignore` for a reason
- **Keep `JWT_SECRET` secure** - Use a strong, random string
- **Rotate `SUPABASE_SERVICE_ROLE_KEY`** - This is a sensitive credential
- **Enable HTTPS in production** - Never use HTTP for authentication
- **Test RLS policies** - Ensure users can only access their own data
- **Keep dependencies updated** - Regularly run `pnpm update`

### 📝 Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Write comments for complex logic
- Keep functions small and focused
- Use React hooks instead of class components
- Prefer composition over inheritance

### 🧪 Testing
- Write tests for authentication flows
- Write tests for encryption/decryption
- Write tests for database queries
- Test error handling and edge cases
- Aim for >80% code coverage

### 📚 Documentation
- Keep README.md up to date
- Document new environment variables in ENV_SETUP.md
- Add comments to complex functions
- Update this handover document when architecture changes

---

## Next Steps

1. **Complete Authentication** - Implement registration and login endpoints
2. **Implement 2FA** - Add TOTP setup and verification
3. **Build Dashboard** - Create elegant dashboard UI with file listing
4. **Implement Encryption** - Add client-side encryption utilities
5. **File Upload/Download** - Implement secure file operations
6. **File Management** - Add search, filter, delete, rename features
7. **Testing** - Write comprehensive tests
8. **Deployment** - Deploy to production
9. **Monitoring** - Set up error tracking and analytics
10. **Maintenance** - Regular security updates and feature improvements

---

## Contact & Support

For questions or issues:
1. Check the README.md for common questions
2. Review existing GitHub issues
3. Check the code comments and documentation
4. Create a new GitHub issue with detailed information

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Document Version:** 1.0  
**Last Updated:** April 29, 2026  
**Status:** Project Foundation Complete - Ready for Feature Implementation
