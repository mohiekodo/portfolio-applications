#!/bin/bash

APP_NAME=$1

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./scripts/create-app.sh <app-name>"
  exit 1
fi

echo "Creating $APP_NAME..."

# Create app structure
mkdir -p apps/$APP_NAME/{frontend,backend,shared}/src

cd apps/$APP_NAME

# Root package.json for the app
cat > package.json << APPEOF
{
  "name": "@portfolio/$APP_NAME",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "build": "npm run build --workspaces",
    "typecheck": "npm run typecheck --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
APPEOF

# Frontend
cat > frontend/package.json << FEEOF
{
  "name": "@portfolio/$APP_NAME-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@portfolio/types": "*",
    "@portfolio/utils": "*",
    "@portfolio/api-client": "*",
    "@portfolio/ui-components": "*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0"
  }
}
FEEOF

cat > frontend/tsconfig.json << FETSEOF
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
FETSEOF

cat > frontend/vite.config.ts << FEVITEEOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
FEVITEEOF

cat > frontend/index.html << FEHTMLEOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$APP_NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
FEHTMLEOF

cat > frontend/src/main.tsx << FEMAINEOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
FEMAINEOF

cat > frontend/src/App.tsx << FEAPPEOF
import { Button } from '@portfolio/ui-components';
import { formatDate } from '@portfolio/utils';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">$APP_NAME</h1>
        <p className="text-gray-600 mb-4">Created: {formatDate(new Date())}</p>
        <Button onClick={() => alert('Hello!')}>Click Me</Button>
      </div>
    </div>
  );
}

export default App;
FEAPPEOF

cat > frontend/src/index.css << FECSSEOF
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
FECSSEOF

cat > frontend/tailwind.config.js << FETAILEOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
FETAILEOF

cat > frontend/postcss.config.js << FEPOSTEOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
FEPOSTEOF

# Backend
cat > backend/package.json << BEEOF
{
  "name": "@portfolio/$APP_NAME-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "@portfolio/types": "*",
    "@portfolio/utils": "*"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.0.0"
  }
}
BEEOF

cat > backend/tsconfig.json << BETSEOF
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
BETSEOF

cat > backend/src/index.ts << BEINDEXEOF
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import type { ApiResponse } from '@portfolio/types';

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
BEINDEXEOF

cat > backend/.env.example << BEENVEOF
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
BEENVEOF

# Shared (app-specific types)
cat > shared/package.json << SHEOF
{
  "name": "@portfolio/$APP_NAME-shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@portfolio/types": "*"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
SHEOF

cat > shared/tsconfig.json << SHTSEOF
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "composite": true
  },
  "include": ["src/**/*"]
}
SHTSEOF

cat > shared/src/types.ts << SHTYPESEOF
// App-specific types for $APP_NAME
import type { User } from '@portfolio/types';

export interface AppUser extends User {
  // Add app-specific user properties
}

// Add more app-specific types here
SHTYPESEOF

cat > shared/src/index.ts << SHINDEXEOF
export * from './types';
SHINDEXEOF

# Docker Compose
cat > docker-compose.yml << DOCKEREOF
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: $APP_NAME-postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: $APP_NAME
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
DOCKEREOF

# README
cat > README.md << READMEEOF
# $APP_NAME

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

\`\`\`bash
# Install dependencies (from root of monorepo)
npm install

# Start database
cd apps/$APP_NAME
docker-compose up -d

# Run development servers
npm run dev
\`\`\`

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Project Structure

\`\`\`
$APP_NAME/
├── frontend/           # React app
├── backend/            # Express API
├── shared/             # App-specific shared types
└── docker-compose.yml
\`\`\`

## Environment Variables

See \`backend/.env.example\` for required environment variables.

## API Endpoints

- \`GET /api/health\` - Health check

## Screenshots

[Add screenshots]

## Live Demo

[Add demo link]
READMEEOF

echo "✅ $APP_NAME created successfully!"
echo ""
echo "Next steps:"
echo "  cd apps/$APP_NAME"
echo "  cp backend/.env.example backend/.env"
echo "  docker-compose up -d"
echo "  npm run dev"
