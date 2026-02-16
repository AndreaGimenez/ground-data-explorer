import type { Coordinates, PointType } from "../types";

export const POINT_COLORS: Record<PointType, string> = {
  soil: "#8B4513",
  water: "#1E90FF",
  mineral: "#FFD700",
  anomaly: "#FF4500",
};

export const generateId = (): string => {
  return `point-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export const formattedDepth = (depth: number): string => {
  return `${depth.toFixed(1)}m below surface`;
};

export const formattedCoordinates = (coordinates: Coordinates): string => {
  const [lng, lat] = coordinates;

  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";

  // Format: "latitude°N/S, longitude°E/W" (human-readable order)
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};
