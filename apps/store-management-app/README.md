# store-management-app

## Description
[Add description of your app]

## Features
- Feature 1
- Feature 2
- Feature 3

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Shared UI Components

### Backend
- Express + TypeScript
- PostgreSQL
- [Add other technologies]

## Setup

```bash
# Install dependencies (from root of monorepo)
npm install

# Start database
cd apps/store-management-app
docker-compose up -d

# Run development servers
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Project Structure

```
store-management-app/
├── frontend/           # React app
├── backend/            # Express API
├── shared/             # App-specific shared types
└── docker-compose.yml
```

## Environment Variables

See `backend/.env.example` for required environment variables.

## API Endpoints

- `GET /api/health` - Health check

## Screenshots

[Add screenshots]

## Live Demo

[Add demo link]
