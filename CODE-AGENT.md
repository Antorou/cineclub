# CODE-AGENT: cineclub (Antorou)

```
CREATED: 2026-07-30
LAST_UPDATED: 2026-07-30
VERSION: 1.0.0
AGENT_TYPE: code
SCOPE: Cineclub platform (React frontend & FastAPI backend)
SCOPE_PATHS: repos/cineclub/
PARENT: .agent/workflows/master.md
```

> WARNING: This document MUST be updated whenever a new integration, model, service, API endpoint, schema, dependency, or architectural pattern is added or modified within this agent's scope. Failure to do so will cause agents working on this codebase to produce incorrect code.

## Linear Card Policy

Before creating or updating any Linear card, you MUST read the roadmap agent first. The roadmap owns all card rules (structure, formatting, tone, defaults, MCP usage, confidentiality). Defer to: `.agent/workflows/roadmap.md` > "Linear Card Rules".

---

## 1. Overview

This codebase hosts the Cineclub application, consisting of a React-based frontend built with Vite and a FastAPI backend written in Python.

---

## 2. Directory Structure

```
repos/cineclub/
├── frontend/ (React + Vite, TS)
└── backend/  (FastAPI, Python)
```

---

## 3. Architecture and Data Flow

Frontend application communicating with FastAPI over HTTP. Static frontend interfaces with dynamic backend APIs.

---

## 4. Data Models and Schemas

To be defined using Python Pydantic models in the backend.

---

## 5. External Service Integrations

None active currently.

---

## 6. API Layer

FastAPI endpoints provided from `repos/cineclub/backend/main.py`.

---

## 7. Configuration and Environment

Setup relies on Devcontainers and local Docker Compose routing.

---

## 8. Testing Patterns

TBD

---

## 9. Design Patterns and Conventions

- **Frontend**: React functional components, hooks, strict TypeScript.
- **Backend**: FastAPI async routes, dependency injection via `Depends()`, strict Python type hints.

---

## 10. Known Gotchas and Bugs

None yet.

---

## Cross-References

```yaml
parent: .agent/workflows/master.md
siblings: None
test_agent: TBD
roadmap: .agent/workflows/roadmap.md
```

## Test Delegation

When implementing a feature or function that touches a critical path (authentication, data integrity, payment, core business logic, public API contracts), read the sibling TEST-AGENT before writing code. The test agent defines:

- Which test patterns and conventions to follow
- What level of testing is required (unit, integration, e2e)
- How to structure test files and assertions
- Whether the tests need pipeline integration

Follow the test agent's conventions exactly. Test consistency across the project is non-negotiable.

## Scope Boundary

This agent covers: Cineclub platform (React frontend & FastAPI backend)

Paths: repos/cineclub/

If a task falls outside this scope, delegate to the parent (`.agent/workflows/master.md`), which will route it to the correct sibling agent.

## Document Maintenance

```
CREATED: 2026-07-30
LAST_UPDATED: 2026-07-30
DOCUMENT_OWNER: Antorou Team
AUTHORS: [Antigravity Setup]

UPDATE_TRIGGERS:
- New models, services, or API endpoints within scope
- New external service integrations within scope
- Schema or type system changes within scope
- Dependency version changes
- Docker build changes
- New design patterns introduced
- Architecture changes within scope
```

END_OF_DOCUMENT
