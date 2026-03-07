import { useEffect, useState } from "react";
import type { DataPoint, PointType, UseMapPointsProps } from "../types";
import { generateId } from "../utils/helpers";
import { pointsApi } from "../services/api";

export const useMapPoints = (): UseMapPointsProps => {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [activePointType, setActivePointType] = useState<PointType>("soil");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pointsApi.getAll();
        setPoints(data);
      } catch (err) {
        console.error("Failed to fetch points:", err);
        setError("Failed to load data points. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  const addPoint = async (coordinates: [number, number]) => {
    try {
      // Generate a unique name
      const timestamp = new Date().toLocaleTimeString();
      const newPoint: Omit<DataPoint, "id" | "createdAt"> = {
        name: `${activePointType} point ${timestamp}`,
        description: `${activePointType} data point added at ${new Date().toLocaleString()}`,
        type: activePointType,
        coordinates,
        depth: Math.random() * 30 + 5, // Random depth 5-35m
        value: Math.random() * 100, // Random value 0-100
      };

      const createdPoint = await pointsApi.create(newPoint);
      setPoints((prev) => [...prev, createdPoint]);
      setSelectedPoint(createdPoint);
    } catch (err) {
      console.error("Failed to create point:", err);
      setError("Failed to create point. Please try again.");
    }
  };

  const removePoint = async (pointId: string) => {
    try {
      await pointsApi.delete(pointId);
      setPoints((prev) => prev.filter((point) => point.id !== pointId));
      setSelectedPoint((prev) => (prev?.id === pointId ? null : prev));
    } catch (err) {
      console.error("Failed to delete point:", err);
      setError("Failed to delete point. Please try again.");
    }
  };

  return {
    points,
    selectedPoint,
    activePointType,
    loading,
    error,
    setSelectedPoint,
    setActivePointType,
    addPoint,
    removePoint,
  };
};
