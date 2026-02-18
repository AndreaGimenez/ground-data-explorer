from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.models import Base

# Database URL
DATABASE_URL = "postgresql://grounduser:groundpass123@localhost/grounddata"

# Create engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries (set to False in production)
    pool_pre_ping=True,  # Verify connections before using
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency for getting DB session
def get_db():
    """
    Dependency that provides a database session.
    Automatically closes the session when done.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

# Seed initial data
def seed_initial_data(db: Session):
    """Add initial sample data"""
    from uuid import uuid4
    from datetime import datetime
    from app.models import DataPointModel, PointTypeEnum
    
    # Check if data already exists
    if db.query(DataPointModel).count() > 0:
        print("ℹ️  Database already has data, skipping seed")
        return
    
    initial_points = [
        {
            "id": str(uuid4()),
            "name": "Amsterdam Sample",
            "description": "Sample data point in Amsterdam",
            "type": PointTypeEnum.soil,
            "longitude": 4.9041,
            "latitude": 52.3676,
            "depth": 12.5,
            "value": 65.3,
            "created_at": datetime.now(),
        },
        {
            "id": str(uuid4()),
            "name": "Den Haag Sample",
            "description": "Water measurement near The Hague",
            "type": PointTypeEnum.water,
            "longitude": 4.3007,
            "latitude": 52.0705,
            "depth": 8.2,
            "value": 78.9,
            "created_at": datetime.now(),
        },
        {
            "id": str(uuid4()),
            "name": "Rotterdam Sample",
            "description": "Mineral deposit detection",
            "type": PointTypeEnum.mineral,
            "longitude": 4.4777,
            "latitude": 51.9244,
            "depth": 25.0,
            "value": 45.6,
            "created_at": datetime.now(),
        },
    ]
    
    for point_data in initial_points:
        point = DataPointModel(**point_data)
        db.add(point)
    
    db.commit()
    print("✅ Database seeded with initial data")