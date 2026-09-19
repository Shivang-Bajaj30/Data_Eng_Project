# 📚 NoteVault

A reputation-moderated, AI-powered study notes platform — students discover trusted notes, moderators earn publishing rights, admins run verification and moderation from a full console.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + React Router, Tailwind, React Query, accessible Radix UI primitives |
| Backend | Spring Boot 3 (Java 21) + Spring Security + JWT |
| Database | MongoDB Atlas (Spring Data MongoDB) |
| Streaming | Kafka event mirror (`/api/admin/events`) — Aiven Kafka + Kafka Streams to be wired |

## Run locally

### Backend (MongoDB required)

Set `MONGODB_URI` in `backend/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?appName=cluster1
```

```bash
cd backend
mvn spring-boot:run        # or: java -cp "target/classes;$(cat target/cp.txt)" com.notvault.backend.BackendApplication
```

The app connects to the `notevault` database. On a **fresh/empty** database it seeds demo data (4 accounts, 3 classes, 6 notes, a report, a moderator request). Every mutation is written through to Atlas and survives restarts.

### Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

### Demo accounts (password: `password123`)

| Email | Role | What to try |
|---|---|---|
| admin@notevault.com | Admin | Review queue, reports, mod requests, analytics, audit log |
| aisha@notevault.com | Trusted moderator | Upload → publishes instantly |
| diego@notevault.com | Unproven moderator (2/5) | Upload → goes to pending; reach 5 approvals → auto-trusted |
| student@notevault.com | Student | Search, download, report notes |

## Frontend redesign

The rebuilt interface includes a public landing page, authentication, student dashboard, note catalog and viewer, search, moderator uploads, and an admin console. See [frontend/README.md](frontend/README.md) for routes, the component structure, demo mode, and integration details.

Semantic retrieval, AI chat, binary file storage, and signed download URLs still require backend services. The existing moderator-request review service has no HTTP controller endpoint yet. Demo interactions are labeled separately from live data.

## Architecture

```
Controller (HTTP + RBAC)   →  Service (domain rules)   →  DataStore  →  MongoDB Atlas
     │                            │
     │ AuthContext (JWT)          │ TrustService — reputation rules in one place
     │                            │ NoteService — upload gating, review, delete
     │                            │ ReportService — reports + trust safety net
     │                            │ ModeratorVerificationService — approval workflow
     │                            │ ClassService — admin-only class creation
     └─ every mutation emits a stream event (audit-stream, note-events, ...)
```

**Trust flow** (`TrustService`): admin approves an upload → moderator gets +1 clean upload → at **5** the moderator flips to `isTrusted` → their uploads auto-publish. A **valid report** against a trusted moderator resets their trust to zero.

## API overview

| Endpoint | Role | Purpose |
|---|---|---|
| `POST /api/auth/signup` | public | Student account (or moderator request) |
| `POST /api/auth/login` | public | JWT login |
| `GET /api/notes?q=&classId=` | public | Catalog + keyword search (approved only) |
| `POST /api/notes` | moderator | Upload (pending unless trusted) |
| `POST /api/notes/{id}/delete` | owner/admin | Soft delete |
| `POST /api/reports` | any user | Report a note |
| `POST /api/admin/notes/{id}/review` | admin | Approve/reject + trust engine |
| `POST /api/reports/{id}/resolve` | admin | Mark valid (trust reset) / dismissed |
| `POST /api/moderator-requests/{id}/review` | admin | Verify moderator |
| `GET /api/admin/analytics` | admin | Totals, uploads/subject, trust counts |
| `GET /api/admin/streams` · `/events` | admin | Pipeline observability (Kafka mock) |
| `GET /api/admin/audit` | admin | Audit trail |

## Collections

`users`, `classes`, `notes`, `reports`, `moderatorRequests`, `auditLogs`, `streamEvents`

## Roadmap (per the full spec)

- Real Kafka producer (Aiven) + Kafka Streams jobs on Oracle Cloud (trust engine can reuse `TrustService`)
- Atlas Vector Search embeddings for semantic search (`/api/notes/search` is the seam)
- Cloudflare R2 signed URLs for file storage (fileUrl/fileHash fields are ready)
- Heartbeat + lag monitor collections for the streams pipeline


