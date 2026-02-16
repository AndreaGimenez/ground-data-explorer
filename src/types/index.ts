import { type Dispatch, type SetStateAction } from "react";

export type PointType = "soil" | "water" | "mineral" | "anomaly";

export type Coordinates = [longitude: number, latitude: number];
export interface DataPoint {
  id: string;
  name: string;
  description: string;
  type: PointType;
  coordinates: [number, number]; // [longitude, latitude]
  depth: number; // meters below surface
  value: number; // measurement value
  createdAt: Date;
}

export interface MapState {
  center: [number, number];
  zoom: number;
}

export type FilterType = PointType | "all";

export type UseMapPointsProps = {
  points: DataPoint[];
  selectedPoint: DataPoint | null;
  setSelectedPoint: Dispatch<SetStateAction<DataPoint | null>>;
  activePointType: PointType;
  setActivePointType: Dispatch<SetStateAction<PointType>>;
  addPoint: (coordinates: [number, number]) => void;
  removePoint: (pointId: string) => void;
};

export interface MapViewProps {
  points: DataPoint[];
  selectedPoint: DataPoint | null;
  activePointType: PointType;
  onMapClick: (coordinates: [number, number]) => void;
  onMarkerClick: (point: DataPoint) => void;
}
export interface FlyToOptions {
  longitude: number;
  latitude: number;
  zoom: number;
  duration?: number;
}

export interface SidebarProps {
  points: DataPoint[];
  selectedPoint: DataPoint | null;
  filter: FilterType;
  activePointType: PointType;
  onFilterChange: (filter: FilterType) => void;
  onPointTypeChange: (type: PointType) => void;
  onPointSelect: (point: DataPoint) => void;
  onPointRemove: (id: string) => void;
}
