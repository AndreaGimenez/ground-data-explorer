import { useState } from "react";
import type { DataPoint, PointType, UseMapPointsProps } from "../types";
import { generateId } from "../utils/helpers";

// Sample data to start with
const INITIAL_POINTS: DataPoint[] = [
  {
    id: "point-1",
    name: "Sample Site A",
    description: "High mineral concentration detected",
    type: "mineral",
    coordinates: [4.9041, 52.3676],
    depth: 12.5,
    value: 87.3,
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "point-2",
    name: "Sample Site B",
    description: "Underground water layer",
    type: "water",
    coordinates: [4.4777, 51.9244],
    depth: 8.2,
    value: 94.1,
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "point-3",
    name: "Sample Site C",
    description: "Soil composition analysis",
    type: "soil",
    coordinates: [4.3007, 52.0705],
    depth: 5.0,
    value: 62.8,
    createdAt: new Date("2026-02-01"),
  },
];

export const useMapPoints = (): UseMapPointsProps => {
  const [points, setPoints] = useState<DataPoint[]>(INITIAL_POINTS);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [activePointType, setActivePointType] = useState<PointType>("soil");

  const addPoint = (coordinates: [number, number]) => {
    const newPoint: DataPoint = {
      id: generateId(),
      name: `Site ${points.length + 1}`,
      description: "New data point added",
      type: activePointType,
      coordinates,
      depth: Math.random() * 20,
      value: Math.random() * 100,
      createdAt: new Date(),
    };
    setPoints((prevPoints) => [...prevPoints, newPoint]);
    setSelectedPoint(newPoint);
  };

  const removePoint = (pointId: string) => {
    setPoints((prevPoints) =>
      prevPoints.filter((point) => point.id !== pointId),
    );
    setSelectedPoint((prevPoint) =>
      prevPoint?.id === pointId ? null : prevPoint,
    );
  };

  return {
    points,
    selectedPoint,
    setSelectedPoint,
    activePointType,
    setActivePointType,
    addPoint,
    removePoint,
  };
};
