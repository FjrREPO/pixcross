# PixCross Web

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC.svg)](https://tailwindcss.com/)
[![Wagmi](https://img.shields.io/badge/Wagmi-2.15.6-purple.svg)](https://wagmi.sh/)

A modern, responsive web application for the PixCross protocol - a cutting-edge DeFi platform that enables cross-chain lending and borrowing using IP NFTs as collateral. Built with Next.js 15, TypeScript, and the latest Web3 technologies.

## 🌟 Features

### Core Functionality
- **NFT-Collateralized Lending**: Intuitive interface for using IP NFTs as collateral
- **Cross-Chain Bridging**: Seamless token and NFT transfers across multiple chains
- **Real-time Data**: Live market data, prices, and transaction status
- **Portfolio Management**: Comprehensive dashboard for positions and assets
- **Auction Interface**: Dutch auction system for liquidated positions

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Customizable theme support with system preference detection
- **Multi-Wallet Support**: Integration with popular wallets via RainbowKit
- **Real-time Updates**: Live data updates using React Query
- **Smooth Animations**: Framer Motion animations for enhanced UX

### Developer Experience
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Modern React**: React 19 with latest hooks and features
- **Component Library**: Radix UI components with shadcn/ui styling
- **Code Quality**: ESLint, Prettier, and strict TypeScript configuration

## 🏗️ Architecture

### Technology Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │    Blockchain   │    │    Backend      │
│   (Next.js)     │────│    (Wagmi)      │────│   (GraphQL)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI/UX Layer   │    │   Web3 Layer    │    │   Data Layer    │
│  (Tailwind CSS) │    │ (Ethereum/etc.) │    │   (Subgraph)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Technologies

- **Frontend Framework**: Next.js 15 with App Router
- **Blockchain Integration**: Wagmi v2 with Viem
- **Wallet Connection**: RainbowKit for multi-wallet support
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS 4.1 with CSS variables
- **State Management**: React Query (TanStack Query)
- **Type System**: TypeScript with strict configuration
- **Charts**: Recharts and Lightweight Charts
- **Animations**: Framer Motion

## 📂 Project Structure

```
web/
├── app/                        # Next.js App Router
│   ├── (client)/              # Client-side pages
│   │   ├── auction/           # Auction interface
│   │   ├── borrowing/         # Borrowing functionality
│   │   ├── bridge/            # Cross-chain bridge
│   │   ├── collect/           # NFT collection pages
│   │   ├── create/            # Pool creation
│   │   ├── lending/           # Lending interface
│   │   └── manage/            # Portfolio management
│   ├── api/                   # API routes
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                 # Reusable components
│   ├── card/                  # Card components
│   ├── chart/                 # Chart components
│   ├── dialog/                # Modal dialogs
│   ├── layout/                # Layout components
│   ├── loader/                # Loading components
│   ├── table/                 # Data tables
│   ├── token/                 # Token-related components
│   ├── ui/                    # Base UI components (shadcn/ui)
│   ├── wallet/                # Wallet components
│   ├── navbar.tsx             # Navigation bar
│   └── providers.tsx          # Context providers
├── config/                     # Configuration files
│   └── site.ts                # Site configuration
├── data/                       # Static data and constants
│   ├── chains.data.ts         # Blockchain configurations
│   ├── cmc.data.ts            # CoinMarketCap data
│   ├── nft-multichain.data.ts # Multi-chain NFT data
│   └── token-multichain.data.ts # Multi-chain token data
├── graphql/                    # GraphQL queries and types
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   └── wagmi.ts               # Wagmi configuration
├── public/                     # Static assets
├── types/                      # TypeScript type definitions
│   ├── api/                   # API types
│   ├── contract/              # Smart contract types
│   ├── form/                  # Form types
│   ├── graphql/               # GraphQL types
│   └── globals.d.ts           # Global type definitions
├── components.json             # shadcn/ui configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)
- A Web3 wallet (MetaMask, WalletConnect compatible)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pixcross/web
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```bash
   # WalletConnect Project ID (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
   
   # Alchemy API Keys (get from https://www.alchemy.com/)
   NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_api_key
   NEXT_PUBLIC_ALCHEMY_KEY_2=your_alchemy_api_key_2
   NEXT_PUBLIC_ALCHEMY_KEY_3=your_alchemy_api_key_3
   
   # Subgraph URLs (The Graph Protocol endpoints)
   NEXT_PUBLIC_API_SUBGRAPH_ETH_SEPOLIA_URL=your_eth_sepolia_subgraph_url
   NEXT_PUBLIC_API_SUBGRAPH_BASE_SEPOLIA_URL=your_base_sepolia_subgraph_url
   NEXT_PUBLIC_API_SUBGRAPH_ARB_SEPOLIA_URL=your_arb_sepolia_subgraph_url
   NEXT_PUBLIC_API_SUBGRAPH_AVAX_FUJI_URL=your_avax_fuji_subgraph_url
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting and auto-fix issues
pnpm lint

# Type checking
npx tsc --noEmit
```

### Supported Networks

The application supports the following testnet networks:

| Network | Chain ID | RPC Provider | Block Explorer |
|---------|----------|--------------|----------------|
| Ethereum Sepolia | 11155111 | Alchemy | [Sepolia Etherscan](https://sepolia.etherscan.io) |
| Base Sepolia | 84532 | Alchemy | [Base Sepolia Explorer](https://sepolia.basescan.org) |
| Arbitrum Sepolia | 421614 | Alchemy | [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io) |
| Avalanche Fuji | 43113 | Alchemy | [Avalanche Fuji Explorer](https://testnet.snowtrace.io) |

### Key Features Implementation

#### 1. Wallet Integration
```typescript
// Multi-wallet support with RainbowKit
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

// Supports MetaMask, WalletConnect, Coinbase Wallet, and more
```

#### 2. Cross-Chain Functionality
```typescript
// Multi-chain configuration
const config = getDefaultConfig({
  chains: [sepolia, baseSepolia, arbitrumSepolia, avalancheFuji],
  transports: {
    [sepolia.id]: http(ETHEREUM_RPC_URL),
    [baseSepolia.id]: http(BASE_RPC_URL),
    // ... other chains
  },
});
```

#### 3. Real-time Data
```typescript
// React Query for data fetching and caching
import { useQuery } from '@tanstack/react-query';

// Automatic refetching and background updates
```

#### 4. Type-Safe Contracts
```typescript
// Generated types from smart contracts
import { useReadContract, useWriteContract } from 'wagmi';

// Type-safe contract interactions
```

## 🎨 UI/UX Features

### Design System
- **Components**: Built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Dark/light mode with system preference detection
- **Typography**: Cabin font family for clean, modern look
- **Colors**: Carefully crafted color palette with proper contrast ratios

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailwind's responsive breakpoint system
- **Touch-friendly**: Large touch targets and gesture support
- **Performance**: Optimized images and lazy loading

### Accessibility
- **WCAG Compliance**: Follows Web Content Accessibility Guidelines
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order

## 📊 Data Management

### State Management
- **Client State**: React Query for server state management
- **Local State**: React hooks (useState, useReducer)
- **Form State**: React Hook Form with Zod validation
- **Theme State**: Next-themes for theme persistence

### Data Sources
- **Smart Contracts**: Direct blockchain queries via Wagmi
- **Subgraphs**: The Graph Protocol for indexed data
- **External APIs**: Token prices and metadata
- **Local Storage**: User preferences and cached data

## 🔧 Configuration

### Environment Configuration
```typescript
// Site configuration
export const siteConfig = {
  name: "Pixcross",
  description: "DeFi platform for lending and borrowing with IP NFT as collateral",
  url: process.env.NODE_ENV === "production" 
    ? "https://pixcross.vercel.app" 
    : "http://localhost:3000",
};
```

### Build Configuration
```typescript
// Next.js configuration with optimizations
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [/* External image domains */],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};
```

## 🧪 Testing

### Testing Strategy
- **Component Testing**: React Testing Library
- **E2E Testing**: Playwright (recommended setup)
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint with custom rules

### Running Tests
```bash
# Type checking
npx tsc --noEmit

# Linting
pnpm lint

# Component tests (when implemented)
pnpm test

# E2E tests (when implemented)
pnpm test:e2e
```

## 🚀 Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel

# Or connect your GitHub repository for automatic deployments
```

#### Netlify
```bash
# Build command: pnpm build
# Publish directory: .next
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Variables in Production
```bash
# Required for production
NEXT_PUBLIC_WC_PROJECT_ID=your_production_walletconnect_id
NEXT_PUBLIC_ALCHEMY_KEY=your_production_alchemy_key

# Optional but recommended
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🛡️ Security Considerations

### Frontend Security
- **Input Validation**: Zod schemas for all form inputs
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js CSRF protection
- **Content Security Policy**: Configured CSP headers

### Web3 Security
- **Wallet Validation**: Proper wallet connection validation
- **Transaction Verification**: Pre-transaction validation
- **Network Verification**: Chain ID verification
- **Error Handling**: Graceful error handling for failed transactions

## 📈 Performance Optimization

### Next.js Optimizations
- **App Router**: Latest Next.js routing with performance benefits
- **Server Components**: Reduce client-side JavaScript
- **Image Optimization**: Next.js Image component with optimization
- **Code Splitting**: Automatic code splitting and lazy loading

### Runtime Performance
- **React Query**: Efficient data caching and background updates
- **Memoization**: Strategic use of useMemo and useCallback
- **Bundle Optimization**: Tree-shaking and dead code elimination
- **Web Vitals**: Monitoring Core Web Vitals metrics

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use for consistent code formatting
- **Conventional Commits**: Follow conventional commit format

### Component Guidelines
```typescript
// Example component structure
interface ComponentProps {
  // Define props with proper types
}

export function Component({ ...props }: ComponentProps) {
  // Component implementation
  return <div>...</div>;
}

// Export with proper naming
Component.displayName = "Component";
```

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)

### Learning Resources
- [Web3 Frontend Development](https://ethereum.org/en/developers/tutorials/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Learn](https://nextjs.org/learn)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and development purposes. Always verify transactions before signing and never share your private keys or seed phrases.

## 🔗 Links

- **Production**: [https://pixcross.vercel.app](https://pixcross.vercel.app)
- **Repository**: [GitHub Repository](https://github.com/tumbuh-lisk)
- **Documentation**: [Coming Soon]
- **Support**: [Discord Community](https://discord.gg/)

---

Built with ❤️ by the PixCross Team using modern Web3 technologies
