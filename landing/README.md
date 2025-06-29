# Pixcross Landing Page

A modern, responsive landing page for Pixcross built with Next.js, TypeScript, and shadcn/ui components.

## Features

- **Next.js 15** with Turbopack for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** components for consistent, accessible UI
- **Dark/Light mode** support with next-themes
- **Fully responsive** design
- **Accessibility first** with Radix UI primitives
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Tailwind CSS Animate
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pixcross/landing
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint with auto-fix

## Project Structure

```
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── app/                # Next.js app directory (pages and layouts)
├── lib/                # Utility functions
├── public/             # Static assets
└── styles/             # Global styles
```

## Development

### Adding New Components

This project uses shadcn/ui for components. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

### Code Quality

The project includes ESLint and Prettier configurations for maintaining code quality. Run linting before committing:

```bash
pnpm lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to the Pixcross team.
