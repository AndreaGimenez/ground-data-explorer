import { useState, useEffect } from "react";
import type { DataPoint, PointType } from "../types";
import { pointsApi, agentApi, PointTypeSuggestion } from "../services/api";

export const useMapPoints = () => {
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [activePointType, setActivePointType] = useState<PointType>("soil");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<PointTypeSuggestion | null>(
    null,
  );
  const [pendingCoordinates, setPendingCoordinates] = useState<
    [number, number] | null
  >(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      setIsAnalyzing(true);
      setPendingCoordinates(coordinates);

      const suggestion = await agentApi.suggestPointType(
        coordinates[0],
        coordinates[1],
      );

      setAiSuggestion(suggestion);
      setIsAnalyzing(false);
    } catch (err) {
      console.error("Failed to get AI suggestion:", err);
      setError("Failed to analyze location. Please try again.");
      setIsAnalyzing(false);
      setPendingCoordinates(null);
    }
  };

  const acceptSuggestion = async () => {
    if (!aiSuggestion || !pendingCoordinates) return;

    try {
      const newPoint: Omit<DataPoint, "id" | "createdAt"> = {
        name: `${aiSuggestion.type} point - ${aiSuggestion.location}`,
        description: `AI suggested: ${aiSuggestion.explanation}`,
        type: aiSuggestion.type,
        coordinates: pendingCoordinates,
        depth: Math.random() * 30 + 5,
        value: Math.random() * 100,
      };

      const createdPoint = await pointsApi.create(newPoint);
      setPoints((prev) => [...prev, createdPoint]);
      setSelectedPoint(createdPoint);

      setAiSuggestion(null);
      setPendingCoordinates(null);
    } catch (err) {
      console.error("Failed to create point:", err);
      setError("Failed to create point. Please try again.");
    }
  };

  const overrideSuggestion = async (selectedType: PointType) => {
    if (!aiSuggestion || !pendingCoordinates) return;

    try {
      const newPoint: Omit<DataPoint, "id" | "createdAt"> = {
        name: `${selectedType} point - ${aiSuggestion.location}`,
        description: `User override. AI suggested ${aiSuggestion.type}, user chose ${selectedType}. Location: ${aiSuggestion.location}`,
        type: selectedType,
        coordinates: pendingCoordinates,
        depth: Math.random() * 30 + 5,
        value: Math.random() * 100,
      };

      const createdPoint = await pointsApi.create(newPoint);
      setPoints((prev) => [...prev, createdPoint]);
      setSelectedPoint(createdPoint);

      setAiSuggestion(null);
      setPendingCoordinates(null);
    } catch (err) {
      console.error("Failed to create point:", err);
      setError("Failed to create point. Please try again.");
    }
  };

  const cancelSuggestion = () => {
    setAiSuggestion(null);
    setPendingCoordinates(null);
  };

  const removePoint = async (id: string) => {
    try {
      await pointsApi.delete(id);
      setPoints((prev) => prev.filter((p) => p.id !== id));
      if (selectedPoint?.id === id) {
        setSelectedPoint(null);
      }
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
    aiSuggestion,
    isAnalyzing,
    setSelectedPoint,
    setActivePointType,
    addPoint,
    acceptSuggestion,
    overrideSuggestion,
    cancelSuggestion,
    removePoint,
  };
};
