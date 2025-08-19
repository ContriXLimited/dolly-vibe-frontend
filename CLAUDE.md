# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Testing & Quality
- No test framework is currently configured
- TypeScript and ESLint errors are ignored during builds (see next.config.mjs)
- When making changes, ensure `npm run build` completes successfully

## Architecture Overview

### Core Technology Stack
- **Next.js 15** with App Router (not Pages Router)
- **TypeScript** with relaxed build constraints
- **Tailwind CSS** + **Radix UI** components for styling
- **Web3 Integration**: wagmi + viem + RainbowKit for wallet connections
- **State Management**: Zustand for authentication state
- **API Communication**: Axios with proxy configuration

### Authentication Architecture

This is a **Web3 + Social OAuth** authentication system with the following flow:
1. **Wallet Connection** (RainbowKit/wagmi) → **Wallet Signature Verification** → **JWT Token**
2. **Social OAuth** (Discord + Twitter) with server verification requirements
3. **Zustand Store** (`store/auth.ts`) manages all authentication state

**Critical Authentication Requirements:**
- Users must complete ALL verification steps: wallet signature + Discord join + Twitter follow
- Only `userStatus.allConnected === true` grants full application access
- `AuthGuard` component protects all authenticated routes

### API Proxy Configuration
- All `/api/*` requests proxy to `https://p01--dolly-vibe-backend--jlqhr9wl7sxr.code.run/*`
- Uses `lib/request.ts` for centralized HTTP client with JWT token management
- Backend responses are wrapped in `{data: {...}}` format

### Key Directory Structure

```
app/
├── auth/discord/callback/     # Discord OAuth callback handler  
├── auth/twitter/callback/     # Twitter OAuth callback handler
├── discord-callback/          # Alternative Discord callback route
├── twitter-callback/          # Alternative Twitter callback route
├── login/                     # Multi-step authentication UI
└── page.tsx                   # Main dashboard (requires authentication)

services/
├── auth.ts                    # Wallet authentication API calls
├── social.ts                  # Discord/Twitter OAuth API calls
├── user.ts                    # User status API calls
└── vibepass.ts                # VibePass/NFT minting API calls

store/
└── auth.ts                    # Zustand authentication store

components/
├── auth-guard.tsx             # Authentication route protection
└── wallet-connect-button.tsx  # RainbowKit wallet connection UI
```

### State Management Patterns

**Authentication State (Zustand)**:
- Single source of truth in `store/auth.ts`
- Persists to localStorage with automatic hydration
- Manages wallet connection, login status, user data, and social connections
- Includes `useWalletSync()` hook to sync wagmi wallet state

**Component Patterns**:
- Use `useAuthStore()` for authentication state
- Wrap authenticated routes with `<AuthGuard>`
- OAuth callbacks use Suspense boundaries for `useSearchParams()`

### OAuth Callback Handling

**Important**: All OAuth callback pages must:
1. Wrap `useSearchParams()` calls in Suspense boundaries to prevent build errors
2. Extract and pass `callbackUrl` parameter to backend API calls
3. Handle error states and provide user feedback
4. Both `/auth/*/callback/` and `/*/callback/` routes exist for flexibility

### Component Architecture

**UI Components**: Built with Radix UI primitives and custom Tailwind styling
- Dark theme with orange accent color (`#ea580c`)
- Cyberpunk/tactical dashboard aesthetic
- Responsive design with mobile-first approach

**Page Structure**: Each dashboard section is a separate page component
- Main dashboard (`page.tsx`) with sidebar navigation
- Section pages: vibepass, space, command-center, etc.
- Authentication flows are separate from main application

### Web3 Integration Details

**Primary Network**: 0G Galileo Testnet (Chain ID: 16601)
- RPC: `https://blue-wild-spring.0g-galileo.quiknode.pro/d5adfe5ccaff7e2dc5b4a9501c5c34141c62ceec/`
- Explorer: `https://chainscan-galileo.0g.ai/`

**Wallet Support**: RainbowKit with custom 0G testnet configuration
**RainbowKit Theme**: Custom dark theme matching application design  
**Wallet State**: Synchronized between wagmi hooks and Zustand store via `useWalletSync()`

### NFT Minting Architecture

**Three-Step Frontend Mint Process**:
1. **Upload Metadata** → 0G Storage (gets `rootHash` + `sealedKey`)
2. **Get Mint Parameters** → Backend API returns contract address, ABI, function params
3. **Execute Transaction** → Frontend calls smart contract directly using wagmi

**Key Components**:
- `services/vibepass.ts`: VibePass API service with mint-related methods
- `components/mint-modal.tsx`: Multi-step mint UI with transaction monitoring
- Contract interaction uses wagmi's `useWriteContract` with 3 block confirmations
- Post-mint server notification via `confirmMint` API

**Critical Mint Flow Requirements**:
- Users must be on 0G Galileo Testnet (validates network in UI)
- Wallet signature required for metadata upload
- Frontend handles all blockchain interactions (not backend)
- Server confirmation API called after successful on-chain mint

### Environment Configuration

**Required Environment Variables**:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` (has fallback default)

**Next.js Configuration**:
- Images are unoptimized
- TypeScript and ESLint errors ignored during builds
- API proxy handles CORS issues

### Development Guidelines

**When working with authentication**:
- Always check `userStatus.allConnected` before granting access
- Use the centralized `AuthStore` rather than individual hooks
- Handle loading states properly during OAuth flows

**When working with APIs**:
- Use `services/*` modules rather than direct axios calls
- Backend responses are nested: `response.data.data`
- Handle authentication errors (401) in request interceptors

**When working with OAuth callbacks**:
- Wrap `useSearchParams()` in Suspense boundaries
- Extract and pass `callbackUrl` parameter when present
- Provide clear error messaging and retry options

**When working with NFT minting**:
- Always validate user is on 0G Galileo Testnet before mint operations
- Use `MintModal` component for consistent 3-step mint UI
- Handle both wallet transaction errors and server notification failures
- Wait for 3 block confirmations before calling `confirmMint` API
- Maintain transaction state through wagmi hooks (`useWriteContract`, `useWaitForTransactionReceipt`)

### Code Quality Standards

**Language Consistency**:
- **CRITICAL**: All comments, logging, error messages, and user-facing text must be in English only
- **NO Chinese characters** are allowed in any user-visible areas including:
  - Code comments and documentation
  - Console logs and debug messages
  - Error messages and user feedback
  - API response logging
  - Variable names and function names
- Console logs use standardized format: "🌐 API Call:", "📡 API Response:", "❌ API Error:"
- This ensures international accessibility and consistent developer experience

**API Response Patterns**:
- Backend responses are nested: `response.data.data` (for actual data)
- All service methods include comprehensive error handling
- Use centralized `request.ts` client for consistent JWT token management