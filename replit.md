# PennyWise - Smart Micro-Investing Platform

## Overview

PennyWise is a modern micro-investing platform that helps users invest their spare change through round-up functionality and automated portfolio allocation. The application enables users to connect their bank accounts, track transactions, and automatically invest rounded-up amounts into diversified portfolios. The platform also includes goal-setting features and comprehensive investment tracking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript running on Vite for development and build tooling
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Charts**: Chart.js for portfolio visualization and investment tracking

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with JSON responses
- **Development Server**: Vite integration for hot module replacement during development
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL for cloud-hosted database
- **Schema Management**: Drizzle migrations with schema defined in shared TypeScript files
- **Storage Interface**: Abstract storage layer with in-memory implementation for development/testing

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **User Authentication**: Email/password authentication with secure password handling
- **Route Protection**: Client-side route guards with server-side session validation
- **Demo Account**: Pre-configured demo user for testing and demonstration

### Data Models and Relationships
- **Users**: Core user information with authentication credentials
- **Accounts**: Bank account connections with encrypted account details
- **Transactions**: Transaction records with automatic round-up calculations
- **Portfolios**: Investment portfolios with allocation strategies and value tracking
- **Investments**: Individual investment holdings within portfolios
- **Goals**: User-defined financial goals with progress tracking
- **Portfolio History**: Time-series data for portfolio performance tracking

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Drizzle Kit**: Database migration and schema management tools

### UI and Design System
- **Radix UI**: Headless UI components for accessibility and functionality
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for styling

### Data Fetching and Validation
- **TanStack React Query**: Server state management with caching and synchronization
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with validation integration

### Development and Build Tools
- **Vite**: Fast development server and build tool with HMR
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Visualization and Analytics
- **Chart.js**: Canvas-based charting library for portfolio and performance visualization
- **Date-fns**: Date manipulation and formatting utilities

### Deployment and Hosting
- **Replit**: Integrated development and hosting environment
- **Express Static**: Static file serving for production builds
- **Session Storage**: PostgreSQL-backed session management for user authentication