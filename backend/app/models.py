from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class PointTypeEnum(str, enum.Enum):
    soil = "soil"
    water = "water"
    mineral = "mineral"
    anomaly = "anomaly"

class DataPointModel(Base):
    __tablename__ = "data_points"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    type = Column(Enum(PointTypeEnum), nullable=False, index=True)
    
    # ✅ Simple columns instead of PostGIS (for now)
    longitude = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    
    depth = Column(Float, nullable=False)
    value = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)

    def __repr__(self):
        return f"<DataPoint(id={self.id}, name={self.name}, type={self.type})>"