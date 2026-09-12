# FoundryOne Enterprise Backend

This is the Python 3.12+ FastAPI backend for the FoundryOne platform, built with PostgreSQL, SQLAlchemy 2.x, and Redis.

## Features

- **Authentication & RBAC:** Complete JWT flow with Admin, Manager, Employee, and Client role restrictions.
- **Enterprise Modules:** Projects, Tasks, Milestones, Contracts, Invoices, Payments, Support Tickets.
- **AI Platform:** Ready for prompt management and AI integrations.
- **Reporting & Analytics:** CSV exports and complex financial queries.
- **Security:** Rate limiting, secure headers, password hashing.

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 2. Docker Setup
Run the complete application stack (PostgreSQL, Redis, Backend API) via Docker Compose:
```bash
docker compose up --build -d
```
The API will be available at `http://localhost:8000`.

### 3. Database Migrations
To generate the initial database tables:
```bash
docker compose exec backend alembic upgrade head
```

### 4. Seed Database
To populate the database with thousands of realistic rows for testing:
```bash
docker compose exec backend python scripts/seed_database.py
```

## API Documentation
Once the server is running, interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing
Run the pytest suite:
```bash
pytest tests/
```
