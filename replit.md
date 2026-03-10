# CalcHub - Multi-Tool Calculator Application

## Overview

CalcHub is a comprehensive calculator and utility web application built with a modern full-stack architecture. It provides multiple calculator modes (basic, scientific, percentage), financial tools (EMI, compound interest, tip calculator, ROI), health calculators (BMI, BMR, calorie tracking), unit converters, date/time utilities, business & economics tools (GDP, market size, net worth, unemployment, tariff, inflation, per capita income), and an AI-powered assistant. The application features a dark-themed UI with smooth animations, persistent history tracking, and notes functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with custom dark theme, CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Math Engine**: mathjs library for expression evaluation
- **Date Utilities**: date-fns for date manipulation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Build Tool**: Custom build script using esbuild for server, Vite for client

### Data Storage
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` defines all tables
- **Tables**:
  - `notes`: User-created notes with title, content, and category
  - `history`: Calculation history with expression, result, and category
  - `conversations`: AI chat conversations
  - `messages`: Individual chat messages linked to conversations
- **Migrations**: Managed via Drizzle Kit (`drizzle-kit push`)

### API Structure
- Routes defined declaratively in `shared/routes.ts` with Zod schemas for input/output validation
- Endpoints follow RESTful conventions:
  - `GET/POST /api/notes` - List and create notes
  - `DELETE /api/notes/:id` - Delete specific note
  - `GET/POST /api/history` - List and add calculation history
  - `DELETE /api/history` - Clear all history
  - `GET/POST /api/conversations` - Chat conversation management
  - `POST /api/conversations/:id/messages` - Send message with streaming response
  - `POST /api/generate-image` - AI image generation

### Project Structure
```
client/           # Frontend React application
  src/
    components/   # Reusable UI components
    hooks/        # Custom React hooks for API calls
    pages/        # Route page components
    lib/          # Utilities (queryClient, utils)
server/           # Backend Express application
  replit_integrations/  # AI service integrations (chat, image, batch)
shared/           # Shared code between client/server
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod
```

### Key Design Patterns
- **Shared Types**: Schema and route definitions shared between client and server
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` for database operations
- **AI Integration**: Modular AI services in `server/replit_integrations/` for chat and image generation
- **Component Composition**: Tool cards with consistent styling patterns via `ToolCard` component

## External Dependencies

### Database
- **PostgreSQL**: Required database connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management
- **connect-pg-simple**: PostgreSQL session store (available but may not be used)

### AI Services
- **OpenAI API**: Used for chat completions and image generation
  - Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Models: GPT for chat, gpt-image-1 for image generation
  - Streaming responses for chat interface

### Third-Party Libraries
- **mathjs**: Mathematical expression parsing and evaluation
- **date-fns**: Date manipulation and formatting
- **Radix UI**: Accessible UI primitives (dialogs, dropdowns, tabs, etc.)
- **Framer Motion**: Animation library
- **Recharts**: Charting library (available for financial visualizations)

### Development Tools
- **Vite**: Frontend build and dev server with HMR
- **esbuild**: Server bundling for production
- **Drizzle Kit**: Database migration management
- **TypeScript**: Full type safety across the stack