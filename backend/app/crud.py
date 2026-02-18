from datetime import datetime
from uuid import uuid4
from sqlalchemy.orm import Session
from app.models import DataPointModel, PointTypeEnum
from app.schemas import DataPointCreate, DataPointUpdate

def get_all_points(db: Session) -> list[DataPointModel]:
    """Get all points from database"""
    return db.query(DataPointModel).all()

def get_point(db: Session, point_id: str) -> DataPointModel | None:
    """Get a single point by ID"""
    return db.query(DataPointModel).filter(DataPointModel.id == point_id).first()

def create_point(db: Session, point_data: DataPointCreate) -> DataPointModel:
    """Create a new point in database"""
    point_id = str(uuid4())
    
    # Extract coordinates
    longitude, latitude = point_data.coordinates
    
    # Create model instance
    db_point = DataPointModel(
        id=point_id,
        name=point_data.name,
        description=point_data.description,
        type=PointTypeEnum(point_data.type),
        longitude=longitude,
        latitude=latitude,
        depth=point_data.depth,
        value=point_data.value,
        created_at=datetime.now(),
    )
    
    # Add to database
    db.add(db_point)
    db.commit()
    db.refresh(db_point)  # Get the saved instance with all fields
    
    return db_point

def update_point(db: Session, point_id: str, point_data: DataPointUpdate) -> DataPointModel | None:
    """Update an existing point"""
    db_point = get_point(db, point_id)
    if not db_point:
        return None
    
    # Update fields that were provided
    update_data = point_data.model_dump(exclude_unset=True)
    
    # Handle coordinates separately
    if "coordinates" in update_data:
        longitude, latitude = update_data.pop("coordinates")
        db_point.longitude = longitude
        db_point.latitude = latitude
    
    # Update other fields
    for field, value in update_data.items():
        if field == "type":
            value = PointTypeEnum(value)
        setattr(db_point, field, value)
    
    db.commit()
    db.refresh(db_point)
    
    return db_point

def delete_point(db: Session, point_id: str) -> bool:
    """Delete a point from database"""
    db_point = get_point(db, point_id)
    if not db_point:
        return False
    
    db.delete(db_point)
    db.commit()
    
    return True