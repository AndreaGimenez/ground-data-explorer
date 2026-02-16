import { useMemo, useState } from "react";
import "./App.css";
import { useMapPoints } from "./hooks/useMapPoints";
import type { FilterType } from "./types";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { MapView } from "./components/Map/MapView";

export default function App() {
  const {
    points,
    selectedPoint,
    activePointType,
    setActivePointType,
    addPoint,
    removePoint,
    setSelectedPoint,
  } = useMapPoints();

  // ✅ UI concern lives in the UI layer
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPoints = useMemo(
    () => points.filter((p) => filter === "all" || p.type === filter),
    [points, filter],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Ground Data Explorer</h1>
        <p>Click on the map to add a data point</p>
      </header>

      <div className="app-body">
        <MapView
          points={filteredPoints}
          selectedPoint={selectedPoint}
          activePointType={activePointType}
          onMapClick={addPoint}
          onMarkerClick={setSelectedPoint}
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
      </div>
    </div>
  );
}
