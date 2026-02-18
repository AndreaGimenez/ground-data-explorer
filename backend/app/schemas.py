from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

# Point types
PointType = Literal["soil", "water", "mineral", "anomaly"]

# Base schema with common fields
class DataPointBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., max_length=500)
    type: PointType
    coordinates: tuple[float, float] = Field(..., description="[longitude, latitude]")
    depth: float = Field(..., ge=0, description="Meters below surface")
    value: float = Field(..., ge=0, le=100)

# Schema for creating a point (no id or createdAt)
class DataPointCreate(DataPointBase):
    pass

# Schema for updating a point (all fields optional)
class DataPointUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    type: PointType | None = None
    coordinates: tuple[float, float] | None = None
    depth: float | None = Field(None, ge=0)
    value: float | None = Field(None, ge=0, le=100)

# Schema for reading a point (includes id and createdAt)
class DataPoint(DataPointBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True