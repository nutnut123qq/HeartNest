# CareNest - Web API Project

## Project Structure

### Backend (BE) - .NET 8.0 Clean Architecture

```
BE/
├── CareNest.Domain/                 # Domain Layer
│   ├── Entities/                    # Domain entities
│   ├── ValueObjects/                # Value objects
│   ├── Services/                    # Domain services
│   ├── Interfaces/                  # Domain interfaces
│   └── Common/                      # Base entities, domain events
│
├── CareNest.Application/            # Application Layer
│   ├── UseCases/                    # Application use cases
│   ├── DTOs/                        # Data Transfer Objects
│   ├── Interfaces/                  # Application interfaces
│   ├── Services/                    # Application services
│   └── Common/                      # Common utilities, exceptions
│
├── CareNest.Infrastructure/         # Infrastructure Layer
│   ├── Data/                        # DbContext, configurations
│   ├── Repositories/                # Repository implementations
│   ├── Services/                    # External service implementations
│   └── Migrations/                  # EF Core migrations
│
└── CareNest.WebAPI/                 # Presentation Layer
    ├── Controllers/                 # API controllers
    ├── Middleware/                  # Custom middleware
    └── Configuration/               # Configuration extensions
```

### Frontend (FE) - Next.js

```
FE/
├── src/
│   ├── app/                         # Next.js 13+ App Router
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   └── features/                # Feature-specific components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility functions
│   ├── services/                    # API service functions
│   ├── types/                       # TypeScript type definitions
│   ├── styles/                      # CSS/SCSS files
│   └── store/                       # State management
└── public/                          # Static assets
```

## Architecture Overview

### Backend Clean Architecture Layers:

1. **Domain Layer**: Core business logic, entities, and domain rules
2. **Application Layer**: Use cases, application services, and DTOs
3. **Infrastructure Layer**: Data access, external services, and implementations
4. **Presentation Layer**: API controllers, middleware, and configuration

### Frontend Structure:

- **App Router**: Next.js 13+ routing system
- **Components**: Organized by UI and feature components
- **Services**: API communication with backend
- **Types**: TypeScript definitions for type safety
- **Hooks**: Custom React hooks for reusable logic
- **Store**: State management solution

## Technology Stack

### Backend:
- .NET 8.0
- Entity Framework Core (Code First)
- Clean Architecture Pattern

### Frontend:
- Next.js (React Framework)
- TypeScript
- Modern React patterns

## Getting Started

1. **Backend Setup**: Navigate to `BE/` folder and set up .NET projects
2. **Frontend Setup**: Navigate to `FE/` folder and initialize Next.js project
3. **Database**: Configure Entity Framework with Code First approach
