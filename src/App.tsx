import { useMemo, useState } from "react";
import "./App.css";
import { useMapPoints } from "./hooks/useMapPoints";
import type { FilterType } from "./types";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { MapView } from "./components/Map/MapView";
import { AISuggestionModal } from "./components/AISuggestionModal/AISuggestionModal";

export default function App() {
  const {
    points,
    selectedPoint,
    activePointType,
    setActivePointType,
    addPoint,
    removePoint,
    setSelectedPoint,
    loading,
    error,
    aiSuggestion,
    acceptSuggestion,
    overrideSuggestion,
    cancelSuggestion,
    isAnalyzing,
  } = useMapPoints();

  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPoints = useMemo(
    () => points.filter((p) => filter === "all" || p.type === filter),
    [points, filter],
  );

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🌍 Ground Data Explorer</h1>
          <p>Interactive geospatial data visualization platform</p>
        </header>
        <div className="app-loading">
          <div className="loading-spinner"></div>
          <p>Loading data points...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🌍 Ground Data Explorer</h1>
          <p>Interactive geospatial data visualization platform</p>
        </header>
        <div className="app-error">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Ground Data Explorer</h1>
        <p>
          Interactive geospatial data visualization platform with AI-powered
          type detection
        </p>
      </header>

      <div className="app-body">
        <MapView
          points={filteredPoints}
          selectedPoint={selectedPoint}
          activePointType={activePointType}
          onMapClick={addPoint}
          onMarkerClick={setSelectedPoint}
          isAnalyzing={isAnalyzing}
        />

        <Sidebar
          points={filteredPoints}
          selectedPoint={selectedPoint}
          filter={filter}
          activePointType={activePointType}
          onFilterChange={setFilter}
          onPointTypeChange={setActivePointType}
          onPointSelect={setSelectedPoint}
          onPointRemove={removePoint}
        />

        {aiSuggestion && (
          <AISuggestionModal
            suggestion={aiSuggestion}
            onAccept={acceptSuggestion}
            onReject={overrideSuggestion}
            onCancel={cancelSuggestion}
          />
        )}
      </div>
    </div>
  );
}
