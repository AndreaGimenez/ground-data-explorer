# 🌍 Ground Data Explorer

Interactive geospatial data visualization platform for exploring subsurface data points.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

---

## Features

- 🗺️ Interactive Mapbox map with smooth animations
- 📍 Add, select, and manage geospatial data points
- 🎨 Filter by type (soil, water, mineral, anomaly)
- 📊 Real-time statistics and counts
- 🧪 Comprehensive test coverage (70%+)

---

## Tech Stack

- React 18 + TypeScript
- Mapbox GL JS + react-map-gl
- Vite
- Vitest + React Testing Library

---

## Installation

```bash
# Clone repository
git clone https://github.com/AndreaGimenez/ground-data-explorer.git
cd ground-data-explorer

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Add your Mapbox token to `.env`:**

```bash
VITE_MAPBOX_TOKEN=your_token_here
```

Get a free token at: https://account.mapbox.com/access-tokens/

---

## Running

```bash
# Development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── components/     # React components (MapView, Sidebar)
├── hooks/          # Custom hooks (useMapControl, useMapPoints)
├── types/          # TypeScript definitions
├── utils/          # Helper functions
└── test/           # Test setup and utilities
```

---

## Documentation

- **[DECISIONS.md](./docs/01-DECISIONS.md)** - Architecture decisions and refactoring journey
- **[TESTING.md](./docs/03-TESTING.md)** - Testing strategy and patterns

---

## Roadmap

- [ ] Visual polish and responsive design
- [ ] Edit point functionality
- [ ] Data export (JSON, CSV, GeoJSON)
- [ ] FastAPI backend
- [ ] PostgreSQL + PostGIS database
- [ ] Docker deployment

---

## Author

**Andrea Gimenez**

- GitHub: [@AndreaGimenez](https://github.com/AndreaGimenez)

---

## License

MIT
