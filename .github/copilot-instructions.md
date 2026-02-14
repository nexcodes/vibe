# Copilot Instructions for Vibe

## Project Architecture

This is a **Next.js 15 + tRPC + Prisma + shadcn/ui** application with the following key characteristics:

- **Next.js App Router** with TypeScript and React 19
- **tRPC** for type-safe API calls with React Query integration
- **Prisma** with PostgreSQL and custom output directory
- **shadcn/ui** components with Radix UI primitives
- **Inngest** for background job processing
- **Tailwind CSS v4** with custom configuration

## Key File Patterns

### Database & API Layer
- **Prisma client**: Generated to `src/generated/prisma/` (not the default location)
- **Database singleton**: Use `db` from `src/lib/db.ts` for all Prisma operations
- **tRPC routers**: Add new routers in `src/trpc/routers/` and export from `_app.ts`
- **tRPC procedures**: Use `baseProcedure` from `src/trpc/init.ts`, always validate inputs with Zod

### Component Patterns
- **UI components**: Use shadcn/ui components from `src/components/ui/`
- **Styling**: Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- **Component variants**: Follow the CVA (class-variance-authority) pattern as seen in `button.tsx`
- **Icons**: Use Lucide React icons (configured in `components.json`)

### Import Aliases
```typescript
// Use these path aliases (defined in components.json):
@/components  // src/components
@/lib         // src/lib  
@/hooks       // src/hooks
@/utils       // src/lib/utils
```

## Development Workflows

### Adding New API Endpoints
1. Create procedures in `src/trpc/routers/_app.ts` or separate router files
2. Use Zod for input validation: `z.object({ ... })`
3. Import and use in components with `useTRPC.routerName.procedureName.useQuery()`

### Adding New Components  
1. For reusable UI: Create in `src/components/ui/` following shadcn patterns
2. Use the button component as reference for CVA variant patterns
3. Always forward refs and use proper TypeScript interfaces

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `prisma migrate dev` to apply changes
3. Generated client will be in `src/generated/prisma/` (custom path)

### Background Jobs
- Use Inngest client from `src/inngest/client.ts`
- Define functions in `src/inngest/functions.ts`
- Functions are automatically registered via the API route

## Project-Specific Conventions

### Styling Approach
- **Tailwind v4** (not v3) - use the latest syntax
- **New York style** shadcn/ui components with neutral base color
- CSS variables for theming enabled
- Use `cn()` utility for conditional classes, never raw `clsx`

### tRPC Setup
- SuperJSON transformer enabled for Date/Set/Map serialization
- React Query integration with custom query client
- Server and client contexts properly separated
- Always use the `useTRPC` hook, never direct tRPC client calls

### File Organization
- API routes: `src/app/api/`
- Page components: `src/app/*/page.tsx`
- Shared components: `src/components/`
- Business logic: `src/lib/`
- Type-safe hooks: `src/hooks/`

## Integration Points

### Key Dependencies
- **React Query**: Integrated with tRPC, don't install separately
- **Form handling**: React Hook Form with Zod resolvers
- **Toast notifications**: Sonner (already configured in layout)
- **Fonts**: Geist Sans and Geist Mono (preloaded)

### External Services
- **Inngest**: Background job processing with agent kit support
- **Prisma**: Database ORM with custom client location
- **Vercel**: Deployment target (inferred from Next.js setup)

## Common Patterns

When adding new features:
1. Define data schema in Prisma if needed
2. Create tRPC procedures with Zod validation
3. Build UI components using shadcn/ui primitives
4. Use React Query for state management via tRPC hooks
5. Add background jobs to Inngest if async processing needed

Always prefer type-safe solutions and leverage the existing tRPC/Prisma/Zod stack for consistency.