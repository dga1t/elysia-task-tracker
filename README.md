# Elysia Task Tracker

A clean-architecture backend service for managing tasks using Bun, Elysia, Drizzle ORM, PostgreSQL, and Redis.

## Project Structure

```
src/
  domain/
    entities/
    repositories/
    value-objects/
  application/
    dto/
    exceptions/
    ports/
    services/
  infrastructure/
    config/
    db/
    http/
    jobs/
    repositories/
  server.ts
```

- **Domain layer** contains the `Task` entity, value objects, and repository interfaces.
- **Application layer** exposes use cases via the `TaskService`, performing validation, orchestrating repositories, and triggering notifications.
- **Infrastructure layer** wires external services (PostgreSQL via Drizzle, Redis, and Elysia HTTP server).

## Getting Started

### Requirements

- [Bun](https://bun.sh/)
- Docker (for PostgreSQL & Redis)

### Install dependencies

```bash
bun install
```

### Run services

```bash
docker compose up -d
```

### Run migrations & seed data

```bash
bunx drizzle-kit migrate
bun run scripts/seed.ts
```

### Start the API server

```bash
bun run src/server.ts
```

Server listens on `http://localhost:3000/api` by default.

## API

- `POST /api/tasks`
- `GET /api/tasks?status=pending|completed`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

When a task includes a due date within 24 hours, a notification message is enqueued into Redis (`task:notifications`).
