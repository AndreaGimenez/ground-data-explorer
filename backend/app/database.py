from datetime import datetime
from app.schemas import DataPoint

# In-memory storage (temporary - will be replaced with PostgreSQL)
points_db: dict[str, DataPoint] = {}

# Initial seed data
def seed_initial_data():
    """Add some initial points for testing"""
    from uuid import uuid4
    
    initial_points = [
        {
            "id": str(uuid4()),
            "name": "Amsterdam Sample",
            "description": "Sample data point in Amsterdam",
            "type": "soil",
            "coordinates": (4.9041, 52.3676),
            "depth": 12.5,
            "value": 65.3,
            "createdAt": datetime.now(),
        },
        {
            "id": str(uuid4()),
            "name": "Den Haag Sample",
            "description": "Water measurement near The Hague",
            "type": "water",
            "coordinates": (4.3007, 52.0705),
            "depth": 8.2,
            "value": 78.9,
            "createdAt": datetime.now(),
        },
        {
            "id": str(uuid4()),
            "name": "Rotterdam Sample",
            "description": "Mineral deposit detection",
            "type": "mineral",
            "coordinates": (4.4777, 51.9244),
            "depth": 25.0,
            "value": 45.6,
            "createdAt": datetime.now(),
        },
    ]
    
    for point_data in initial_points:
        point = DataPoint(**point_data)
        points_db[point.id] = point

# Seed on import
seed_initial_data()