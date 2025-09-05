# To Do Web Application Backend API

A Node.js + Express + Typescript + PostgreSQL backend API Project for a to do application.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with bcrypt password hashing
- 📝 **To do task Management** - CRUD operations for tasks
- 🛡️ **Security** - Helmet.js for security headers, CORS enabled , Route Guarding



## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + bcryptjs
- **Security**: Helmet, CORS

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd to-do-be
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. To generate JWT_SECRET, run this command
 ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  
 ```

5. Configure your `.env` file with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=to_do_app
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=1d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

6. Set up your PostgreSQL database

## Scripts

- `npm run dev` - Start development server
- `npm run dev:watch` - Start development server with hot reload

## Development

Start the development server with hot reload:

```bash
npm run dev:watch
```

The API will be available at `http://localhost:3000` (or your configured PORT).

```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### To-Dos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
