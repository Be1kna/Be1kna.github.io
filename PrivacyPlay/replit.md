# Cybersecurity Awareness Training Application

## Overview

This is a cybersecurity awareness training application disguised as a gaming platform. The application simulates a typical web service that requests various permissions and personal information, designed to educate users about digital privacy and security risks. Users progress through different stages including permission requests (camera/location), account creation, a Snake game, and payment processing, while their security-conscious choices are tracked and scored.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with a simple Switch/Route structure
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **State Management**: Custom React hooks for local state management, specifically `useGameState` for tracking user progress and choices
- **Styling**: Tailwind CSS with CSS custom properties for theming, configured with "new-york" style from Shadcn

### Backend Architecture
- **Server Framework**: Express.js with TypeScript running in ESM mode
- **Development Setup**: Vite integration for hot module replacement in development
- **Error Handling**: Centralized error middleware with structured error responses
- **Logging**: Custom request/response logging middleware for API endpoints
- **Static Serving**: Conditional static file serving based on environment

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for schema management and queries
- **Connection**: Neon Database serverless PostgreSQL integration
- **Schema Definition**: Centralized schema in `shared/schema.ts` with Zod validation
- **Development Storage**: In-memory storage implementation (`MemStorage`) for development/testing
- **Migrations**: Drizzle Kit for database schema migrations

### Authentication and Authorization
- **User Model**: Simple username/password based authentication schema
- **Session Management**: Express sessions with PostgreSQL session store using `connect-pg-simple`
- **Storage Interface**: Abstracted storage interface (`IStorage`) allowing swappable implementations

### Component Architecture
- **Game Flow**: Step-based progression system with multiple stages (permissions, account creation, gaming, payment)
- **Permission Handling**: Browser API integrations for camera and geolocation with fallback handling
- **Modal System**: Reusable modal component for displaying privacy policies, terms, and contact information
- **Game Logic**: Canvas-based Snake game implementation with real-time scoring
- **Form Handling**: React Hook Form integration with Zod validation for user inputs

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **Build Tools**: Vite with React plugin, TypeScript compilation, ESBuild for production builds
- **Development Tools**: Replit-specific plugins for runtime error handling and development features

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting (`@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe database queries and schema management
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Complete set of accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Class Variance Authority**: Dynamic class name generation for component variants
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching for API interactions
- **Wouter**: Lightweight client-side routing library

### Development and Production Tools
- **TypeScript**: Static type checking with strict configuration
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Node.js Utilities**: Various utilities for cryptographic functions, date manipulation, and development tooling

### Browser APIs Integration
- **Camera Access**: Native MediaDevices API for camera permission and image capture
- **Geolocation**: Native Geolocation API for location tracking
- **Canvas**: HTML5 Canvas for game rendering and image manipulation