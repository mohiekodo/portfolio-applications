# 🚀 Running Portfolio Applications

This document provides comprehensive instructions for running each application in the portfolio monorepo.

## 📋 Prerequisites

Before running any applications, ensure you have the following installed:

### Required Software
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** and **Docker Compose** (for databases)
- **Git** (for version control)

### Verify Installation
```bash
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
docker --version  # Should be available
```

## 🔧 Initial Setup

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd portfolio-applications

# Install all dependencies and build shared packages
npm install

# Build shared packages
npm run build:packages
```

### 2. Build Required Packages
The following packages must be built before running any applications:
```bash
# Build shared packages in order
npx lerna run build --scope=@portfolio/types
npx lerna run build --scope=@portfolio/utils  
npx lerna run build --scope=@portfolio/ui-components
```

## 📱 Applications

### 1. Clinic Management App

**Purpose:** Clinic management system for patient management, appointment scheduling, and medical records.

**Ports:**
- Frontend: http://localhost:3030
- Backend: http://localhost:5000

#### Running the Application
```bash
# Method 1: Using Lerna (Recommended)
npx lerna run dev --scope=@portfolio/clinic-management-app

# Method 2: Direct command from app directory
cd apps/clinic-management-app
npm run dev
```

#### Database Setup (Optional)
```bash
cd apps/clinic-management-app
docker-compose up -d
```

#### Test the Application
```bash
# Test backend
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:3030
```

#### Stopping the Application
- Press `Ctrl+C` in the terminal where the dev server is running
- Stop database: `docker-compose down` (if using Docker)

---

### 2. Store Management App

**Purpose:** Store/inventory management system for inventory tracking, sales management, and supplier management.

**Ports:**
- Frontend: http://localhost:3050  
- Backend: http://localhost:5080

#### Running the Application
```bash
# Method 1: Using Lerna (Recommended)
npx lerna run dev --scope=@portfolio/store-management-app

# Method 2: Direct command from app directory
cd apps/store-management-app
npm run dev
```

#### Database Setup (Optional)
```bash
cd apps/store-management-app
docker-compose up -d
```

#### Test the Application
```bash
# Test backend
curl http://localhost:5080/api/health

# Test frontend  
curl http://localhost:3050
```

#### Stopping the Application
- Press `Ctrl+C` in the terminal where the dev server is running
- Stop database: `docker-compose down` (if using Docker)

---

### 3. Property Management App

**Purpose:** Property management platform for property listings, tenant management, and maintenance tracking.

**Ports:**
- Frontend: http://localhost:3080
- Backend: http://localhost:5050

#### Running the Application
```bash
# Method 1: Using Lerna (Recommended)  
npx lerna run dev --scope=@portfolio/property-management-app

# Method 2: Direct command from app directory
cd apps/property-management-app
npm run dev
```

#### Database Setup (Optional)
```bash
cd apps/property-management-app
docker-compose up -d
```

#### Test the Application
```bash
# Test backend
curl http://localhost:5050/api/health

# Test frontend
curl http://localhost:3080
```

#### Stopping the Application
- Press `Ctrl+C` in the terminal where the dev server is running
- Stop database: `docker-compose down` (if using Docker)

---

## 🔄 Running Multiple Applications

### Run All Applications Simultaneously
```bash
# This will start all applications in parallel
npm run dev
```

### Run Specific Combinations
```bash
# Run only backend services
npx lerna run dev:backend --parallel

# Run only frontend services  
npx lerna run dev:frontend --parallel

# Run two specific apps
npx lerna run dev --scope=@portfolio/clinic-management-app --scope=@portfolio/store-management-app
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
If you get a "port already in use" error:
```bash
# Find process using the port (Windows)
netstat -ano | findstr :3030

# Kill the process (Windows)
taskkill /PID <process-id> /F

# Find process using the port (Mac/Linux)
lsof -i :3030

# Kill the process (Mac/Linux)
kill -9 <process-id>
```

#### 2. Package Not Found Errors
If you encounter `@portfolio/*` package not found errors:
```bash
# Rebuild all packages
npm run build

# Or build specific packages
npx lerna run build --scope=@portfolio/types
npx lerna run build --scope=@portfolio/utils
npx lerna run build --scope=@portfolio/ui-components
```

#### 3. TSX Command Not Found
If you get "tsx is not recognized" errors:
- The package.json files are already configured to use `npx tsx`
- Ensure all dependencies are installed: `npm install`

#### 4. Database Connection Issues
- Ensure Docker is running
- Start the database: `docker-compose up -d`
- Check if PostgreSQL port 5432 is available
- Verify `.env` file configuration in each app's backend folder

### Clean Start
If you encounter persistent issues, try a clean start:
```bash
# Remove all node_modules and package-lock.json files
# (This has already been done in the current setup)

# Reinstall everything
npm install

# Rebuild packages
npm run build

# Try running the application again
npx lerna run dev --scope=@portfolio/<app-name>
```

## 📊 Development Workflow

### Recommended Development Order
1. Start with **Clinic Management App** (port 3030/5000)
2. Then **Store Management App** (port 3050/5080)  
3. Finally **Property Management App** (port 3080/5050)

### Code Changes
- Frontend changes will automatically reload (Vite HMR)
- Backend changes will automatically restart (tsx watch)
- Shared package changes require rebuilding: `npm run build`

## 🔍 Health Checks

Each application provides a health endpoint:
- Clinic Management: http://localhost:5000/api/health
- Store Management: http://localhost:5080/api/health  
- Property Management: http://localhost:5050/api/health

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "ok", 
    "timestamp": "2025-10-05T12:00:00.000Z"
  }
}
```

## 📝 Additional Notes

- All applications use the same shared packages (`@portfolio/types`, `@portfolio/utils`, `@portfolio/ui-components`)
- Database connections are optional for basic frontend/backend functionality
- Each app can be developed independently
- Environment variables are stored in `backend/.env` files for each app
- Frontend builds are optimized for production with `npm run build`

## 🆘 Getting Help

If you encounter issues not covered here:
1. Check the individual app README files in `apps/<app-name>/README.md`
2. Review the main project README.md
3. Check for TypeScript compilation errors: `npm run typecheck`
4. Review ESLint issues: `npm run lint`