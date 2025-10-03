# 🎨 Portfolio Monorepo

A collection of full-stack TypeScript applications showcasing various technologies and skills.

## 📦 Structure

```
portfolio-applications/
├── apps/                           # Individual portfolio applications
│   ├── clinicez-management-app/    # Clinic management system
│   ├── propertiez-management-app/  # Property management platform
│   └── store-management-app/       # Store/inventory management
├── packages/                       # Shared packages
│   ├── ui-components/              # Reusable React components
│   ├── utils/                      # Common utilities
│   ├── api-client/                 # API client library
│   └── types/                      # Shared TypeScript types
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

### 1. Clinicez Management App
**Tech Stack:** React, TypeScript, Express, Tailwind CSS, PostgreSQL  
**Features:** Patient management, appointment scheduling, medical records  
**Structure:** Frontend/Backend/Shared workspaces  
**Demo:** [Link to demo]

### 2. Propertiez Management App
**Tech Stack:** React, TypeScript, Express, Tailwind CSS, PostgreSQL  
**Features:** Property listings, tenant management, maintenance tracking  
**Structure:** Frontend/Backend/Shared workspaces  
**Demo:** [Link to demo]

### 3. Store Management App
**Tech Stack:** React, TypeScript, Express, Tailwind CSS, PostgreSQL  
**Features:** Inventory management, sales tracking, supplier management  
**Structure:** Frontend/Backend/Shared workspaces  
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
npx lerna run dev --scope=@portfolio/clinicez-management-app

# Build specific app
npx lerna run build --scope=@portfolio/clinicez-management-app

# Other available apps:
# @portfolio/propertiez-management-app
# @portfolio/store-management-app
```

## 📝 License

MIT
