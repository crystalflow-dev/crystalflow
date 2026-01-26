# ReactFlo Landing Page

The official landing page for ReactFlo - a declarative workflow builder framework for React applications.

## Overview

This is a Next.js-based marketing website showcasing ReactFlo's features, capabilities, and providing an interactive demo of the workflow builder.

## Features

- 🎨 **Modern Design** - Clean, responsive UI built with Tailwind CSS
- 🚀 **Interactive Demo** - Live workflow builder with drag-and-drop functionality
- 📱 **Responsive** - Fully optimized for mobile, tablet, and desktop
- ⚡ **Fast** - Built on Next.js 15 with App Router for optimal performance
- 🎯 **SEO Optimized** - Configured for search engine visibility

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Components**: Custom React components
- **Workflow Engine**: @reactflo/react and @reactflo/core

## Getting Started

### Prerequisites

Make sure you're in the ReactFlo monorepo root and have built all packages:

```bash
# From monorepo root
npm install
npm run build
```

### Development

```bash
# Navigate to landing package
cd packages/landing

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
packages/landing/
├── app/
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Hero.tsx          # Hero section
│   ├── Features.tsx      # Features showcase
│   ├── InteractiveDemo.tsx  # Live workflow demo
│   ├── GettingStarted.tsx   # Quick start guide
│   ├── CodeExample.tsx   # Code snippets
│   ├── Navbar.tsx        # Navigation
│   └── Footer.tsx        # Footer
└── public/
    └── logo/             # ReactFlo branding assets
```

## Key Components

### InteractiveDemo

The interactive demo component integrates the full ReactFlo workflow builder, allowing visitors to:

- Drag and drop nodes from the palette
- Connect nodes to create workflows
- Configure node properties
- Execute workflows and see real-time results

### Hero

Eye-catching hero section with:

- Value proposition
- Call-to-action buttons
- Animated background effects

### Features

Highlights ReactFlo's core capabilities:

- Declarative node definitions with TypeScript decorators
- Visual workflow builder with React Flow
- JSON serialization for persistence
- Execution engine with event system

### GettingStarted

Step-by-step guide to help developers get started quickly with installation and basic usage examples.

## Customization

### Styling

The landing page uses Tailwind CSS. Customize the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      // Add your custom colors
    }
  }
}
```

### Content

Edit component files in `components/` to update:

- Marketing copy
- Feature descriptions
- Code examples
- Links and CTAs

## Deployment

### Vercel (Recommended)

The easiest way to deploy:

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the root directory to `packages/landing`
4. Deploy

### Other Platforms

Build the static site and deploy to any hosting platform:

```bash
npm run build
# Deploy the .next folder
```

Supports deployment to:

- Netlify
- AWS Amplify
- Cloudflare Pages
- Any static hosting service

## Environment Variables

Currently no environment variables required. For future integrations (analytics, CMS, etc.), create a `.env.local` file:

```env
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) in the monorepo root.

## License

MIT License - see [LICENSE](../../LICENSE) for details.
