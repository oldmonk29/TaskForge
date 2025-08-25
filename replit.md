# Overview

This is a cybersecurity-focused OTT (Over-The-Top) streaming platform built as a modern web application. The platform provides educational cybersecurity content with features like user authentication, wallet system, premium subscriptions, and an admin panel for content management. It's designed with a luxury black and gold aesthetic, targeting cybersecurity professionals and enthusiasts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for dashboard, login, watch, wallet, and admin
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui styling system
- **Styling**: TailwindCSS with custom black/gold theme, CSS variables for theming
- **Authentication**: Firebase Authentication with Google OAuth and email/password support
- **Real-time Updates**: Firebase Auth state listener for authentication changes

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **API Design**: RESTful APIs with Express routes for content, auth, wallet, and admin operations
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **File Structure**: Monorepo structure with shared schema and types between client/server

## Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless platform
- **ORM**: Drizzle with PostgreSQL dialect, migrations in `/migrations` folder
- **Schema Design**: 
  - Users table with Firebase UID integration, wallet balance, and role-based access
  - Content table for video/course storage with categories and premium flags
  - Watch history tracking for user progress
  - Transaction system for wallet operations and payments
  - Ad management system with placement tracking

## Authentication and Authorization
- **Primary Auth**: Firebase Authentication for user management
- **Authorization**: Role-based access control (USER/ADMIN roles)
- **Session Handling**: Server-side session management with secure cookies
- **Protected Routes**: Client-side route protection with auth state checks
- **Welcome Bonus**: Automatic wallet credit system for new user onboarding

## External Dependencies
- **Authentication**: Firebase Auth with Google OAuth provider
- **Database**: Neon PostgreSQL serverless database
- **Payment Processing**: Razorpay integration (configured but not fully implemented)
- **CDN/Assets**: External image hosting via Unsplash for demo content
- **Development**: Replit-specific development tools and error overlay
- **Build Tools**: Vite for frontend bundling, esbuild for server bundling
- **Styling**: Google Fonts (Inter, Playfair Display) for typography
- **UI Components**: Extensive Radix UI component library for accessible components

## Key Features
- **Content Streaming**: Video player with progress tracking and watch history
- **Wallet System**: Virtual currency system with transaction tracking
- **Subscription Tiers**: Freemium, Premium, and Advisory subscription models
- **Admin Panel**: Content and ad management interface for administrators
- **Ad System**: Configurable ad placement with click tracking
- **Mobile Responsive**: Mobile-first design with responsive layouts
- **Development Mode**: Special handling for Replit development environment