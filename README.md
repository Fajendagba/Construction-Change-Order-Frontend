# Construction Change Order Engine — Frontend

Vue 3 + TypeScript frontend for the Construction Change Order Engine. Role-based UI with real-time updates via Laravel Reverb WebSockets.

---

## Tech Stack

- **Vue 3** — Composition API with `<script setup>` syntax
- **TypeScript** — strict typing throughout
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client with auth interceptor
- **Laravel Echo + Pusher JS** — WebSocket client for real-time updates
- **Vitest** — unit testing for composables

---

## Requirements

- Node.js 18+
- Backend API running on `http://localhost:8000`
- Laravel Reverb running on `http://localhost:8081`

---

## Setup

```bash
git clone https://github.com/Fajendagba/Construction-Change-Order-Frontend.git
cd change-order-frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173`.

---

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_REVERB_APP_KEY=local-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8081
```

---

## Demo Credentials

| Name | Email | Password | Role |
|------|-------|----------|------|
| Nick Carter | owner@ingenious.build | password | Owner |
| Michał Sączek | contractor@ingenious.build | password | Contractor |
| Eli Rattner | architect@ingenious.build | password | Architect |

---

## Running Tests

```bash
npm run test
```
