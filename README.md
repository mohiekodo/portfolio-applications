# 🎨 Portfolio Monorepo

A collection of full-stack TypeScript applications showcasing various technologies and skills.

## 📦 Structure

```
portfolio-applications/
├── apps/                    # Individual portfolio applications
│   ├── quiz-app/           # Quiz application
│   ├── task-manager/       # Task management app
│   ├── chat-app/           # Real-time chat
│   └── ecommerce/          # E-commerce platform
├── packages/               # Shared packages
│   ├── ui-components/      # Reusable React components
│   ├── utils/              # Common utilities
│   ├── api-client/         # API client library
│   └── types/              # Shared TypeScript types
└── lerna.json
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Run all apps in development mode
npm run dev

# Build all packages and apps
npm run build

# Run tests
npm test

# Format code
npm run format
```

## 📱 Applications

### 1. Quiz App
**Tech Stack:** React, Express, PostgreSQL  
**Features:** Multiple choice questions, timer, leaderboard  
**Demo:** [Link to demo]

### 2. Task Manager
**Tech Stack:** React, Express, MongoDB  
**Features:** CRUD operations, drag & drop, authentication  
**Demo:** [Link to demo]

### 3. Chat App
**Tech Stack:** React, Express, Socket.io, Redis  
**Features:** Real-time messaging, rooms, file uploads  
**Demo:** [Link to demo]

### 4. E-commerce
**Tech Stack:** React, Express, PostgreSQL, Stripe  
**Features:** Products, cart, payments, orders  
**Demo:** [Link to demo]

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Databases:** PostgreSQL, MongoDB, Redis
- **Tools:** Lerna, Docker, ESLint, Prettier

## 📚 Shared Packages

- `@portfolio/ui-components` - Reusable UI components
- `@portfolio/utils` - Common utility functions
- `@portfolio/api-client` - API client library
- `@portfolio/types` - Shared TypeScript types

## 🔧 Development

### Adding a New App

```bash
# Create new app structure
./scripts/create-app.sh <app-name>

# Add dependencies
npx lerna add <package> --scope=@portfolio/<app-name>
```

### Working on a Specific App

```bash
# Run specific app
npx lerna run dev --scope=@portfolio/quiz-app

# Build specific app
npx lerna run build --scope=@portfolio/quiz-app
```

## 📝 License

MIT
