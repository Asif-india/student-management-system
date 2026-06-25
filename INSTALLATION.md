# Installation Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git (optional)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "d:\Student Management System App"
```

### 2. Install Root Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 5. Or Install All at Once

```bash
npm run install:all
```

### 6. Configure Environment Variables

#### Frontend Environment Variables

Copy the example environment file:
```bash
cd frontend
cp .env.example .env
```

Edit `.env` and configure:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend Environment Variables

Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and configure:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 7. Run Development Servers

#### Start Both Frontend and Backend
```bash
npm run dev
```

#### Start Frontend Only
```bash
npm run dev:frontend
```

Frontend will be available at: http://localhost:5173

#### Start Backend Only
```bash
npm run dev:backend
```

Backend will be available at: http://localhost:5000

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
│   │   ├── assets/          # Static assets
│   │   ├── App.tsx          # Main App component
│   │   ├── main.tsx         # Application entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Public assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── package.json             # Root package.json
├── .gitignore
└── README.md
```

## Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install all dependencies

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev` - Start development server with tsx watch
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript 5.4.5
- Vite 5.2.8
- Tailwind CSS 3.4.3
- React Router DOM 6.22.3
- Axios 1.6.8

### Backend
- Node.js
- Express 4.19.2
- TypeScript 5.4.5
- tsx 4.7.2 (for development)
- CORS 2.8.5
- Helmet 7.1.0
- Express Rate Limit 7.2.0
- Morgan 1.10.0
- Dotenv 16.4.5

## Development Notes

- The project uses TypeScript for type safety
- ESLint is configured for code quality
- Tailwind CSS is configured for styling
- The backend includes security middleware (Helmet, Rate Limiting)
- CORS is configured to allow requests from the frontend
- Environment variables are used for configuration

## Next Steps

After installation, you can proceed with:
1. Setting up the database (MongoDB or other)
2. Implementing authentication
3. Creating API endpoints
4. Building UI components
5. Adding business logic

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
- Change the PORT in backend/.env
- Change the port in frontend/vite.config.ts

### Dependency Issues
If you encounter dependency issues:
- Delete node_modules folders
- Run `npm cache clean --force`
- Reinstall dependencies

### TypeScript Errors
TypeScript errors are expected before dependencies are installed. They will resolve after running `npm install`.
