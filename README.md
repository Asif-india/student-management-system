# Student Management System - MERN MVP

Industry-level Student Management System built with MERN stack.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript

## Project Structure

```
student-management-system/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── package.json
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   └── package.json
├── package.json             # Root package.json
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Instructions

1. Clone the repository
2. Install all dependencies:
```bash
npm run install:all
```

3. Configure environment variables (see `.env.example` files)

## Development

### Start both frontend and backend:
```bash
npm run dev
```

### Start frontend only:
```bash
npm run dev:frontend
```

### Start backend only:
```bash
npm run dev:backend
```

## Build

### Build frontend:
```bash
npm run build:frontend
```

### Build backend:
```bash
npm run build:backend
```

## Architecture

This project follows clean architecture principles with separation of concerns:

- **Frontend**: Component-based architecture with clear separation of UI, business logic, and data fetching
- **Backend**: Layered architecture with controllers, services, and models for maintainability


## Fees Management Module (Development Branch)
