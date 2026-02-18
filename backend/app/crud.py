from datetime import datetime
from uuid import uuid4
from app.database import points_db
from app.schemas import DataPoint, DataPointCreate, DataPointUpdate

def get_all_points() -> list[DataPoint]:
    """Get all points"""
    return list(points_db.values())

def get_point(point_id: str) -> DataPoint | None:
    """Get a single point by ID"""
    return points_db.get(point_id)

def create_point(point_data: DataPointCreate) -> DataPoint:
    """Create a new point"""
    point_id = str(uuid4())
    point = DataPoint(
        id=point_id,
        createdAt=datetime.now(),
        **point_data.model_dump()
    )
    points_db[point_id] = point
    return point

def update_point(point_id: str, point_data: DataPointUpdate) -> DataPoint | None:
    """Update an existing point"""
    if point_id not in points_db:
        return None
    
    existing_point = points_db[point_id]
    
    # Update only provided fields
    update_data = point_data.model_dump(exclude_unset=True)
    updated_point = existing_point.model_copy(update=update_data)
    
    points_db[point_id] = updated_point
    return updated_point

def delete_point(point_id: str) -> bool:
    """Delete a point"""
    if point_id in points_db:
        del points_db[point_id]
        return True
    return False