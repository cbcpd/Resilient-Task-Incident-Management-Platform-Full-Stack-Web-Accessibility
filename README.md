# Resilient Task & Incident Management Platform

A full-stack starter project for task and incident tracking.

## Stack
- Backend: Java 17, Spring Boot 3, Spring Data JPA, Bean Validation
- Database: PostgreSQL
- Frontend: React 18, Vite, React Testing Library
- Tests: JUnit 5, Spring Boot Test
- Runtime: Docker Compose

## Features
- Create, list, update, and delete incidents
- Status, priority, assignee, and description fields
- Search/filter by status and text
- Server-side pagination and database indexes
- Validation and centralized API error responses
- Responsive React UI with semantic HTML, keyboard-accessible controls, labels, and status text
- Backend and frontend test examples

## Run with Docker
```bash
docker compose up --build
```
Open http://localhost:5173. API: http://localhost:8080/api/incidents

PostgreSQL is exposed on port 5432. Default local credentials are configured in
`docker-compose.yml`; change them before using this outside local development.

## Run locally
Backend (Java 17+ and Maven):
```bash
cd backend
mvn spring-boot:run
```
Frontend (Node 18+):
```bash
cd frontend
npm install
npm run dev
```

## API
- `GET /api/incidents?page=0&size=10&status=OPEN&search=login`
- `GET /api/incidents/{id}`
- `POST /api/incidents`
- `PUT /api/incidents/{id}`
- `DELETE /api/incidents/{id}`

Example POST body:
```json
{
  "title": "Login service unavailable",
  "description": "Users receive a 503 response.",
  "priority": "HIGH",
  "status": "OPEN",
  "assignee": "Platform Team"
}
```

## Notes
This is a runnable portfolio project baseline, not a production-certified service.
The README's performance goal should be validated with representative load tests
and production-like infrastructure before claiming a measured sub-100ms SLA.
WCAG conformance also requires manual testing with screen readers, browser zoom,
contrast tools, and keyboard-only navigation.
