# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ground Data Explorer** — An interactive geospatial data visualization platform for exploring subsurface data points. It has two independent parts: a React/TypeScript frontend and a FastAPI/PostgreSQL backend.

## Frontend Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm test             # Run Vitest in watch mode
npm run test:ui      # Vitest with browser UI
npm run test:coverage # Coverage report
```

Run a single test file:
```bash
npx vitest run src/hooks/useMapPoints.test.ts
```

## Backend Commands (from `backend/`)

```bash
make dev             # Start uvicorn on port 8000 (requires venv active)
make install         # pip install -r requirements.txt
make test            # pytest -v
make clean           # Remove __pycache__ files
```

Or directly:
```bash
source backend/venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Initialize the database (first-time setup):
```bash
cd backend && python init_db.py
```

## Environment Setup

Copy `.env.example` to `.env` and add a Mapbox token (required for the map to render):
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Backend connects to PostgreSQL at `postgresql://grounduser:groundpass123@localhost/grounddata` (hardcoded in `backend/app/database.py`).

## Architecture

### Frontend

State is managed via custom hooks; components are purely presentational:

- **`useMapPoints`** (`src/hooks/useMapPoints.ts`) — Single source of truth for all `DataPoint[]` state: add, remove, select. Currently uses in-memory state with hardcoded initial data (not yet wired to the backend API).
- **`useMapControl`** (`src/hooks/useMapControl.ts`) — Holds `mapRef` and exposes `flyTo`, `panTo`, `zoomTo` imperatives for the Mapbox instance.
- **`App.tsx`** — Owns `filter` state and `filteredPoints` memo; passes everything down to `MapView` and `Sidebar`.
- **`MapView`** (`src/components/Map/`) — Renders the `react-map-gl` map with markers.
- **`Sidebar`** (`src/components/Sidebar/`) — Filter controls, type selector, point list. Uses render functions (`renderPointTypes`, `renderFilters`, etc.) rather than sub-components for JSX organization, and `useMemo` for type-count calculations.

All TypeScript types live in `src/types/index.ts`. The `@ ` alias maps to `/src`.

### Backend

FastAPI app with SQLAlchemy ORM:

- **`app/main.py`** — App factory; CORS allows `http://localhost:5173` only.
- **`app/models.py`** — `DataPointModel` SQLAlchemy model; uses plain `longitude`/`latitude` Float columns (not PostGIS).
- **`app/crud.py`** — Database operations.
- **`app/schemas.py`** — Pydantic v2 schemas for request/response validation.
- **`app/api/routes/points.py`** — REST endpoints mounted at `/api/points`.
- **`app/database.py`** — Engine, session factory, `get_db` dependency, `seed_initial_data`.

The frontend and backend are **not yet integrated** — the frontend still uses hardcoded in-memory data.

### Data Model

`DataPoint` / `DataPointModel` fields: `id`, `name`, `description`, `type` (enum: `soil | water | mineral | anomaly`), `coordinates: [longitude, latitude]`, `depth` (meters), `value`, `createdAt`.

## Testing

Frontend tests use Vitest + React Testing Library with jsdom. Test setup is in `src/test/setup.ts`; shared render helpers in `src/test/utils.tsx`. Mapbox GL is mocked in tests.

Backend tests use pytest; run from `backend/` directory.
