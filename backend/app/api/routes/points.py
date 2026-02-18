from fastapi import APIRouter, HTTPException, status
from app import crud
from app.schemas import DataPoint, DataPointCreate, DataPointUpdate

router = APIRouter()

@router.get("/", response_model=list[DataPoint])
def list_points():
    """Get all data points"""
    return crud.get_all_points()

@router.get("/{point_id}", response_model=DataPoint)
def get_point(point_id: str):
    """Get a single data point"""
    point = crud.get_point(point_id)
    if not point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )
    return point

@router.post("/", response_model=DataPoint, status_code=status.HTTP_201_CREATED)
def create_point(point: DataPointCreate):
    """Create a new data point"""
    return crud.create_point(point)

@router.put("/{point_id}", response_model=DataPoint)
def update_point(point_id: str, point_data: DataPointUpdate):
    """Update an existing data point"""
    point = crud.update_point(point_id, point_data)
    if not point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )
    return point

@router.delete("/{point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_point(point_id: str):
    """Delete a data point"""
    success = crud.delete_point(point_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Point with id {point_id} not found"
        )