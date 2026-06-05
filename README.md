# Next Launch TS - Production-Ready SaaS Starter

A modern, production-ready SaaS starter built with Next.js 15, React Query, Supabase, and shadcn/ui. This comprehensive starter includes everything you need to launch a scalable SaaS application with enterprise-grade features.

> 🚨 **Using this template?** Make sure to follow the [setup instructions](#-getting-started) carefully, especially the step to **remove the `.git` directory** after cloning. This prevents accidentally pushing your project's changes back to this template repository.

## 🚀 Features

### Core Application
- **Authentication**: Complete auth system with login, signup, password reset
- **Todo Management**: Full CRUD operations with categories, priorities, and due dates
- **Real-time Updates**: Live synchronization across devices using Supabase
- **Professional UI**: Modern, responsive design with dark mode support
- **Type Safety**: End-to-end TypeScript with strict mode
- **Performance**: Optimized with React Query caching and optimistic updates

### Production Features
- **Analytics**: Vercel Analytics and Speed Insights (automatic on Vercel)
- **SEO Optimization**: Dynamic metadata, Open Graph, Twitter Cards, and sitemaps
- **Environment Validation**: Zod-based environment variable validation
- **Error Handling**: React error boundaries with extensible error reporting

### Developer Experience
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **Documentation**: Extensive inline documentation and architecture guides
- **Type Safety**: Strict TypeScript with end-to-end type safety
- **Code Quality**: ESLint configuration and best practices

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: TanStack React Query v5
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Background Jobs**: Inngest (durable workflows, queues, cron)

### Production Tools
- **Analytics**: Vercel Analytics & Speed Insights (automatic on Vercel)
- **SEO**: Dynamic metadata generation and sitemaps
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel (optimized configuration)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for local Supabase)
- Supabase account (for production)

### 1. Clone and Setup Your Project

```bash
# Clone the template
git clone https://github.com/zphelps/next-launch-ts.git your-project-name
cd your-project-name

# Install dependencies
npm install

# Disconnect from the template repository
git remote remove origin

# Create your own repository on GitHub, then add it as origin:
git remote add origin https://github.com/yourusername/your-project-name.git
git branch -M main
git push -u origin main
```

> ⚠️ **Important**: Always run `git remote remove origin` after cloning to disconnect from the template repository. This prevents accidentally pushing your project changes back to the template.

### 2. Start Local Supabase

```bash
# Start local Supabase stack (PostgreSQL, Auth, Storage, etc.)
npm run db:start

# This will output your local API credentials
# API URL: http://127.0.0.1:54321
# anon key: <your-local-anon-key>
```

The first time you run this, it will download the necessary Docker images. This may take a few minutes.

### 3. Environment Setup

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with the credentials from step 2:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional - Customize SEO:
# NEXT_PUBLIC_SITE_NAME=Your App Name
# NEXT_PUBLIC_SITE_DESCRIPTION=Your app description
```

> 💡 **Tip**: Check `.env.example` for a complete list of available configuration options.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

### 5. Access Local Supabase Studio

While your local Supabase is running, you can access the Studio dashboard at:

```
http://127.0.0.1:54323
```

Here you can view your database tables, manage authentication, and more.

## 🛠️ Development Workflow

### Local Database Development

This project uses **local Supabase** for development, giving you:
- ⚡ Instant database operations (no network latency)
- 🔄 Version-controlled schema migrations
- 🌿 Preview environments per Git branch
- 🧪 Safe testing without affecting production

### Common Development Commands

```bash
# Start local Supabase
npm run db:start

# Start Inngest Dev Server (for background jobs)
npx inngest-cli@latest dev

# Stop local Supabase
npm run db:stop

# Reset local database (apply all migrations from scratch)
npm run db:reset

# Create a new migration
npm run db:migration <migration_name>

# Push migrations to production
npm run db:push
```

### Creating Database Schema Changes

**Method 1: Create Migration Files (Recommended)**

```bash
# Create a new migration
npm run db:migration add_products_table

# Edit the file in supabase/migrations/
# Then apply it locally:
npm run db:reset
```

**Method 2: Use Studio Dashboard**

```bash
# Make changes in Studio (http://127.0.0.1:54323)
# Then generate a migration from your changes:
npx supabase db diff -f describe_your_changes
```

### Deploying Database Changes

Migrations are automatically applied when you:
1. Push to GitHub (if using Supabase branching)
2. Merge to main branch (production deployment)
3. Or manually run `npm run db:push`

---

## 🎯 Production Features

### Analytics & Monitoring
- **Vercel Analytics**: Automatic page views and performance tracking (works automatically on Vercel)
- **Speed Insights**: Core Web Vitals monitoring (works automatically on Vercel)

### SEO & Metadata
- **Dynamic SEO**: Flexible metadata generation for all pages
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine optimization

### Environment Management
- **Zod Validation**: Runtime environment variable validation
- **Type Safety**: Fully typed environment configuration
- **Clear Documentation**: Comprehensive `.env.example` with all options

### Error Handling & Performance
- **Error Boundaries**: React error boundaries with extensible error reporting
- **Performance Optimization**: React Query caching and optimistic updates

## 📁 Project Structure

```
/
├── supabase/              # Supabase configuration
│   ├── config.toml        # CLI configuration
│   └── migrations/        # Database migrations
├── docs/
│   └── supabase/          # Supabase development guides
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Protected dashboard routes
│   │   ├── api/          # API route handlers
│   │   ├── sitemap.ts    # Dynamic sitemap generation
│   │   └── globals.css   # Global styles
│   ├── components/       # Shared UI components
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Core utilities
│   │   ├── supabase/    # Supabase client
│   │   ├── inngest/     # Inngest client and functions
│   │   ├── env.ts       # Environment validation
│   │   └── seo.ts       # SEO utilities
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── todos/       # Todo management module
│   │   └── users/       # User management module
│   ├── hooks/           # Shared custom hooks
│   └── middleware.ts    # Route protection
```

## 🏗️ Architecture

This project follows a **modular architecture** pattern where each feature is self-contained:

### Feature Module Structure
```
src/modules/{feature}/
├── components/           # Feature-specific React components
├── hooks/               # Custom React Query hooks
├── services/            # Business logic and data access
├── types.ts             # TypeScript interfaces
└── config.ts            # Module configuration
```

### Data Flow Pattern
**Component → Custom Hook → Service → Supabase**

This ensures clear separation of concerns and makes the codebase maintainable and testable.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Initial Production Setup

1. **Create Supabase Production Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your production URL and anon key

2. **Link to Production Database**:
   ```bash
   npx supabase link --project-ref your-project-id
   ```

3. **Push Migrations to Production**:
   ```bash
   npm run db:push
   ```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your **production** environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your **production** Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your **production** anon key
   - `NEXT_PUBLIC_SITE_URL` - Your production domain
4. Deploy!

### Deploying Database Changes

**Option 1: Automatic (Recommended)**
- Enable Supabase GitHub integration
- Migrations auto-apply when merging to main

**Option 2: Manual**
```bash
npm run db:push
```

> 💡 **Tip**: Analytics work automatically when deployed to Vercel - no configuration needed!

## 📚 Key Concepts

### Authentication Flow
- JWT-based authentication with Supabase
- Protected routes using middleware
- Automatic token refresh
- Secure user session management

### State Management
- React Query for server state
- React Context for authentication state
- Optimistic updates for better UX

### Form Handling
- React Hook Form for performance
- Zod schemas for validation
- Type-safe form data

### Error Handling
- Global error boundaries for graceful error handling
- Toast notifications for user feedback
- Extensible error reporting (ready for Sentry, LogRocket, etc.)

### Background Jobs (Inngest)
- **Durable functions**: Multi-step workflows with automatic retries
- **Event-driven**: Trigger functions from anywhere in your app
- **Scheduled jobs**: Cron-based tasks for cleanup, reports, etc.
- **Local development**: Inngest Dev Server for testing workflows
- **Zero infrastructure**: No queues or workers to manage

### SEO & Metadata
- Use `generateSEO()` utility for consistent metadata
- Automatic sitemap generation for all routes
- Open Graph and Twitter Card optimization
- Dynamic metadata based on page content

### Analytics
- Vercel Analytics work automatically when deployed to Vercel
- Enable Web Analytics and Speed Insights in your Vercel dashboard
- No configuration or environment variables needed

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Configuration Examples

### Custom SEO for Pages

```typescript
import { generateMetadata, pageMetadata } from '@/lib/seo';

// Use predefined metadata for common pages
export const metadata = pageMetadata.login;

// Or create custom metadata for specific pages
export const metadata = generateMetadata({
  title: 'My Custom Page',
  description: 'This is a custom page with optimized SEO',
  image: '/custom-og-image.png',
});
```

### Environment Configuration

```typescript
import { env } from '@/lib/env';

// Access validated environment variables
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const siteName = env.NEXT_PUBLIC_SITE_NAME || 'Default Name';
```

### Error Boundary Usage

```typescript
import ErrorBoundary from '@/components/error-boundary';

export function MyApp() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Inngest Background Jobs

```typescript
// Create a durable function with steps
import { inngest } from "@/lib/inngest/client";

export const processOrder = inngest.createFunction(
  { id: "process-order", retries: 3 },
  { event: "order/created" },
  async ({ event, step }) => {
    // Each step is independently retried on failure
    await step.run("validate-inventory", async () => {
      return await checkInventory(event.data.items);
    });

    await step.run("charge-payment", async () => {
      return await chargeCard(event.data.paymentId);
    });

    // Durable sleep - function pauses without blocking
    await step.sleep("wait-for-processing", "5m");

    await step.run("send-confirmation", async () => {
      return await sendEmail(event.data.email);
    });
  }
);

// Trigger the function from anywhere
await inngest.send({
  name: "order/created",
  data: { orderId: "123", items: [...], email: "user@example.com" }
});
```

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Inngest](https://www.inngest.com/) - Durable workflows and background jobs
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [TanStack Query](https://tanstack.com/query) - Data fetching library
- [Vercel](https://vercel.com/) - Deployment and analytics platform