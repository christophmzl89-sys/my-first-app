# Project Context

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS + shadcn/ui | 3.4 |
| Backend | Supabase (PostgreSQL, Auth, Storage) | 2.39 |
| Validation | Zod + react-hook-form | 4.x / 7.x |
| Testing | Vitest + Playwright | 4.x / 1.x |
| Deployment | Vercel | - |

## Folder Structure

```
src/
  app/              # Next.js App Router - pages and layouts
  components/
    ui/             # shadcn/ui components (pre-installed)
  hooks/            # Custom React hooks (e.g. use-mobile, use-toast)
  lib/
    supabase.ts     # Supabase client setup
    utils.ts        # Utility functions (cn helper for Tailwind)
  test/
    setup.ts        # Vitest test setup
features/           # Feature specifications (PROJ-X-name.md)
  INDEX.md          # Feature status tracking
docs/
  PRD.md            # Product Requirements Document
  production/       # Production guides
public/             # Static assets (images, fonts, icons)
```

## Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- **NEXT_PUBLIC_SUPABASE_URL** - Your Supabase project URL (found in Project Settings > API)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Your Supabase anonymous/public key (found in Project Settings > API)

> These are prefixed with `NEXT_PUBLIC_` so they are available in the browser. Never expose the `service_role` key on the client side.

## Supabase Client

The Supabase client in `src/lib/supabase.ts` is currently commented out. To activate it:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Add the environment variables to `.env.local`
3. Uncomment the client code in `src/lib/supabase.ts`

## Next Steps

1. **Define your product** - Fill out `docs/PRD.md` with your vision and features
2. **Create feature specs** - Run `/requirements` to define your first feature
3. **Design architecture** - Run `/architecture` to plan the technical approach
4. **Build UI** - Run `/frontend` to implement components with shadcn/ui
5. **Build backend** - Run `/backend` to set up Supabase tables, APIs, and RLS policies
6. **Test** - Run `/qa` to verify against acceptance criteria
7. **Deploy** - Run `/deploy` to ship to Vercel
