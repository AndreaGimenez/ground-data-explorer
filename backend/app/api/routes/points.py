from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app import crud
from app.database import get_db
from app.schemas import DataPoint, DataPointCreate, DataPointUpdate

router = APIRouter()

@router.get("/", response_model=list[DataPoint])
def list_points(db: Session = Depends(get_db)):
    """Get all data points"""
    db_points = crud.get_all_points(db)
    
    # Convert to schema format (combine lon/lat into coordinates)
    return [
        DataPoint(
            id=point.id,
            name=point.name,
            description=point.description,
            type=point.type.value,
            coordinates=(point.longitude, point.latitude),
            depth=point.depth,
            value=point.value,
            createdAt=point.created_at,
        )
        for point in db_points
    ]

@router.get("/{point_id}", response_model=DataPoint)
def get_point(point_id: str, db: Session = Depends(get_db)):
    """Get a single data point"""
    db_point = crud.get_point(db, point_id)
    if not db_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )
    
    # Convert to schema format
    return DataPoint(
        id=db_point.id,
        name=db_point.name,
        description=db_point.description,
        type=db_point.type.value,
        coordinates=(db_point.longitude, db_point.latitude),
        depth=db_point.depth,
        value=db_point.value,
        createdAt=db_point.created_at,
    )

@router.post("/", response_model=DataPoint, status_code=status.HTTP_201_CREATED)
def create_point(point: DataPointCreate, db: Session = Depends(get_db)):
    """Create a new data point"""
    db_point = crud.create_point(db, point)
    
    # Convert to schema format
    return DataPoint(
        id=db_point.id,
        name=db_point.name,
        description=db_point.description,
        type=db_point.type.value,
        coordinates=(db_point.longitude, db_point.latitude),
        depth=db_point.depth,
        value=db_point.value,
        createdAt=db_point.created_at,
    )

@router.put("/{point_id}", response_model=DataPoint)
def update_point(point_id: str, point_data: DataPointUpdate, db: Session = Depends(get_db)):
    """Update an existing data point"""
    db_point = crud.update_point(db, point_id, point_data)
    if not db_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )
    
    # Convert to schema format
    return DataPoint(
        id=db_point.id,
        name=db_point.name,
        description=db_point.description,
        type=db_point.type.value,
        coordinates=(db_point.longitude, db_point.latitude),
        depth=db_point.depth,
        value=db_point.value,
        createdAt=db_point.created_at,
    )

@router.delete("/{point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_point(point_id: str, db: Session = Depends(get_db)):
    """Delete a data point"""
    success = crud.delete_point(db, point_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )