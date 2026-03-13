import type { DataPoint, PointType } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// API response type
interface ApiDataPoint {
  id: string;
  name: string;
  description: string;
  type: PointType;
  coordinates: [number, number]; // [longitude, latitude]
  depth: number;
  value: number;
  createdAt: string; // ISO date string from API
}

// Generic fetch wrapper with error handling and JSON parsing
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ""}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Convert API response to frontend format
const fromApiFormat = (apiPoint: ApiDataPoint): DataPoint => ({
  id: apiPoint.id,
  name: apiPoint.name,
  description: apiPoint.description,
  type: apiPoint.type,
  coordinates: apiPoint.coordinates,
  depth: apiPoint.depth,
  value: apiPoint.value,
  createdAt: new Date(apiPoint.createdAt), // Convert ISO string to Date
});

// Convert frontend format to API request format
const toApiFormat = (point: Omit<DataPoint, "id" | "createdAt">) => ({
  name: point.name,
  description: point.description,
  type: point.type,
  coordinates: point.coordinates,
  depth: point.depth,
  value: point.value,
});
export interface PointTypeSuggestion {
  type: PointType;
  confidence: "high" | "medium" | "low";
  explanation: string;
  location: string;
}

export const agentApi = {
  // Get AI suggestion for point type based on coordinates
  suggestPointType: async (
    longitude: number,
    latitude: number,
  ): Promise<PointTypeSuggestion> => {
    const data = await fetchApi<PointTypeSuggestion>(
      "/api/agent/suggest-point-type",
      {
        method: "POST",
        body: JSON.stringify({ longitude, latitude }),
      },
    );
    return data;
  },
};

// API functions for data points
export const pointsApi = {
  getAll: async (): Promise<DataPoint[]> => {
    const data = await fetchApi<ApiDataPoint[]>("/api/points/");
    return data.map(fromApiFormat);
  },

  getById: async (id: string): Promise<DataPoint> => {
    const data = await fetchApi<ApiDataPoint>(`/api/points/${id}/`);
    return fromApiFormat(data);
  },

  create: async (
    point: Omit<DataPoint, "id" | "createdAt">,
  ): Promise<DataPoint> => {
    const data = await fetchApi<ApiDataPoint>("/api/points/", {
      method: "POST",
      body: JSON.stringify(toApiFormat(point)),
    });
    return fromApiFormat(data);
  },

  update: async (
    id: string,
    point: Partial<Omit<DataPoint, "id" | "createdAt">>,
  ): Promise<DataPoint> => {
    const data = await fetchApi<ApiDataPoint>(`/api/points/${id}/`, {
      method: "PUT",
      body: JSON.stringify(point),
    });
    return fromApiFormat(data);
  },

  delete: async (id: string): Promise<void> => {
    await fetchApi<void>(`/api/points/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Check if backend is healthy
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const data = await fetchApi<{ status: string }>("/health");
    return data.status === "healthy";
  } catch {
    return false;
  }
};
