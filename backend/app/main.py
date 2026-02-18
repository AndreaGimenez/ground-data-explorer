from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import points

app = FastAPI(
    title="Ground Data Explorer API",
    description="API for managing geospatial data points",
    version="1.0.0",
)

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(points.router, prefix="/api/points", tags=["points"])

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Ground Data Explorer API",
        "version": "1.0.0",
        "docs": "/docs",
    }