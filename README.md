# 🌍 Ground Data Explorer

Full-stack interactive geospatial data visualization platform for exploring subsurface data points.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

---

## Features

### Frontend

- 🗺️ Interactive Mapbox map with smooth flyTo animations
- 📍 Add, select, and manage geospatial data points
- 🎨 Filter by type (soil, water, mineral, anomaly)
- 📊 Real-time statistics and counts
- 📱 Mobile-responsive design with bottom sheet
- 🧪 Comprehensive test coverage (70%+)

### Backend

- 🚀 RESTful API with FastAPI
- 🐘 PostgreSQL database with persistence
- 🐳 Docker containerization
- ✅ Data validation with Pydantic
- 📚 Interactive API documentation (Swagger UI)

---

## Tech Stack

### Frontend

- React 18 + TypeScript
- Mapbox GL JS + react-map-gl
- Vite
- Vitest + React Testing Library
- CSS Custom Properties

### Backend

- FastAPI (Python)
- PostgreSQL 15
- SQLAlchemy ORM
- Pydantic validation
- Docker + Docker Compose

---

## Quick Start (Docker - Recommended)

### Prerequisites

- Docker Desktop installed
- Mapbox account (free tier)

### Setup

**1. Clone the repository:**

```bash
git clone https://github.com/AndreaGimenez/ground-data-explorer.git
cd ground-data-explorer
```

**2. Set up environment variables:**

Frontend:

```bash
# Create .env in project root
cp .env.example .env

# Add your Mapbox token
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_API_URL=http://localhost:8000
```

Get a free Mapbox token at: https://account.mapbox.com/access-tokens/

**3. Start the backend (API + Database):**

```bash
cd backend
docker-compose up
```

**4. Initialize the database (first time only):**

In a new terminal:

```bash
cd backend
docker-compose exec backend python init_db.py
```

You should see:

```
🔧 Initializing database...
✅ Database tables created
✅ Database seeded with initial data
✅ Database initialization complete!
```

**5. Start the frontend:**

In a new terminal:

```bash
cd ..  # Back to project root
npm install
npm run dev
```

**6. Open the app:**

Frontend: http://localhost:5173  
Backend API Docs: http://localhost:8000/docs

---

## Development Workflow

### Starting Everything

**Terminal 1 - Backend:**

```bash
cd backend
docker-compose up
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

### Stopping Everything

**Backend:**

```bash
cd backend
docker-compose down
```

**Frontend:**

```
Ctrl+C in the terminal
```

### Resetting the Database

```bash
cd backend

# Stop containers and remove volumes
docker-compose down -v

# Start fresh
docker-compose up

# Re-initialize database
docker-compose exec backend python init_db.py
```

---

## Manual Setup (Without Docker)

### Backend

**Prerequisites:**

- Python 3.11+
- PostgreSQL 15+

**Setup:**

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create PostgreSQL database
createdb grounddata
psql grounddata -c "CREATE USER grounduser WITH PASSWORD 'groundpass123';"
psql grounddata -c "GRANT ALL PRIVILEGES ON DATABASE grounddata TO grounduser;"

# Initialize database
python init_db.py

# Run server
./run.sh
# Or: uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test:coverage
```

### Backend Tests

```bash
cd backend
# Coming soon
```

---

## Project Structure

```
ground-data-explorer/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       └── points.py    # API endpoints
│   │   ├── main.py              # FastAPI app
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── crud.py              # Database operations
│   │   └── database.py          # Database connection
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── run.sh
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.tsx
│   │   │   └── MapView.css
│   │   └── Sidebar/
│   │       ├── Sidebar.tsx
│   │       └── Sidebar.css
│   ├── hooks/
│   │   ├── useMapControl.ts     # Map control abstraction
│   │   ├── useMapPoints.ts      # Data management
│   │   └── useMapPoints.test.ts
│   ├── services/
│   │   └── api.ts               # API client
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── helpers.test.ts
│   ├── styles/
│   │   └── design-system.css
│   └── App.tsx
├── docs/
│   ├── 01-DECISIONS.md          # Architecture decisions
│   ├── 03-TESTING.md            # Testing strategy
│   └── 04-API.md                # API documentation
├── .env.example
├── package.json
└── README.md
```

---

## API Endpoints

**Base URL:** `http://localhost:8000`

- `GET /api/points/` - List all data points
- `POST /api/points/` - Create a new point
- `GET /api/points/{id}/` - Get a single point
- `PUT /api/points/{id}/` - Update a point
- `DELETE /api/points/{id}/` - Delete a point
- `GET /health` - Health check

**Interactive documentation:** http://localhost:8000/docs

See [API.md](./docs/04-API.md) for complete API reference.

---

## Docker Commands Reference

```bash
# Build images
docker-compose build

# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs db

# Execute command in container
docker-compose exec backend python init_db.py

# Rebuild after code changes
docker-compose build backend
docker-compose up

# Remove everything (including volumes)
docker-compose down -v
```

---

## Documentation

- **[DECISIONS.md](./docs/01-DECISIONS.md)** - Architecture decisions and refactoring journey
- **[TESTING.md](./docs/03-TESTING.md)** - Testing strategy and patterns
- **[API.md](./docs/04-API.md)** - Complete API reference

---

## Troubleshooting

### Backend won't start

- Ensure Docker Desktop is running
- Check if port 8000 or 5432 is already in use
- Try: `docker-compose down -v && docker-compose up`

### CORS errors

- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173
- Check browser console for exact error

### Database errors

- Run: `docker-compose exec backend python init_db.py`
- Check database logs: `docker-compose logs db`

### Frontend not connecting to backend

- Verify `.env` has `VITE_API_URL=http://localhost:8000`
- Restart frontend after changing `.env`
- Check backend health: http://localhost:8000/health

---

## Roadmap

### Completed ✅

- [x] Frontend with React + TypeScript
- [x] Interactive Mapbox map
- [x] Mobile responsive design
- [x] Comprehensive testing
- [x] FastAPI backend
- [x] PostgreSQL database
- [x] Docker containerization
- [x] Full-stack integration

### In Progress 🚧

- [ ] Edit point functionality
- [ ] Data export (JSON, CSV, GeoJSON)
- [ ] Search and advanced filtering

### Planned 📋

- [ ] User authentication
- [ ] PostGIS geospatial queries
- [ ] Production deployment
- [ ] CI/CD pipeline

---

## Contributing

This is a portfolio project, but feedback and suggestions are welcome!

---

## Author

**Andrea Gimenez**

- GitHub: [@AndreaGimenez](https://github.com/AndreaGimenez)

---

## License

MIT

---

**Built with ❤️ and lots of ☕**
