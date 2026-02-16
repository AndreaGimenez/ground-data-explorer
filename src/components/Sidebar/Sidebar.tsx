import { useMemo, type FC } from "react";
import type {
  DataPoint,
  FilterType,
  PointType,
  SidebarProps,
} from "../../types";
import "./Sidebar.css";
import {
  formattedCoordinates,
  formattedDepth,
  POINT_COLORS,
} from "../../utils/helpers";

export const Sidebar: FC<SidebarProps> = ({
  points,
  selectedPoint,
  filter,
  activePointType,
  onFilterChange,
  onPointTypeChange,
  onPointSelect,
  onPointRemove,
}) => {
  const pointTypes: PointType[] = ["soil", "water", "mineral", "anomaly"];
  const filters: FilterType[] = ["all", "soil", "water", "mineral", "anomaly"];

  const typeCounts = useMemo(() => {
    const counts: Record<PointType, number> = {
      soil: 0,
      water: 0,
      mineral: 0,
      anomaly: 0,
    };

    points.forEach((point) => counts[point.type]++);

    return counts;
  }, [points]);

  const renderPointTypes = () => {
    return pointTypes.map((type) => (
      <button
        key={type}
        className={`type-button ${activePointType === type ? "active" : ""}`}
        style={{
          backgroundColor:
            activePointType === type ? POINT_COLORS[type] : "transparent",
          borderColor: POINT_COLORS[type],
          color: activePointType === type ? "white" : POINT_COLORS[type],
        }}
        onClick={() => onPointTypeChange(type)}
      >
        {type}
      </button>
    ));
  };

  const renderFilters = () =>
    filters.map((f) => (
      <button
        key={f}
        className={`filter-button ${filter === f ? "active" : ""}`}
        onClick={() => onFilterChange(f)}
      >
        {f === "all" ? (
          <>All ({points.length})</>
        ) : (
          <>
            <span
              className="filter-dot"
              style={{ backgroundColor: POINT_COLORS[f as PointType] }}
            />
            {f} ({typeCounts[f as PointType]})
          </>
        )}
      </button>
    ));

  const renderPointDetails = (point: DataPoint) => {
    return (
      <div className="point-details">
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{point.type}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Depth:</span>
          <span className="detail-value">{formattedDepth(point.depth)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Value:</span>
          <span className="detail-value">{point.value.toFixed(1)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            {formattedCoordinates(point.coordinates)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Description:</span>
          <span className="detail-value">{point.description}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Created:</span>
          <span className="detail-value">
            {point.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  const renderPointsList = () => {
    if (points.length === 0) {
      return (
        <p className="empty-state">No points yet. Click the map to add some!</p>
      );
    }

    return (
      <div className="points">
        {points.map((point) => (
          <div
            key={point.id}
            className={`point-item ${selectedPoint?.id === point.id ? "selected" : ""}`}
            onClick={() => onPointSelect(point)}
          >
            <div className="point-item-header">
              <div className="point-item-title">
                <span
                  className="point-dot"
                  style={{ backgroundColor: POINT_COLORS[point.type] }}
                />
                <span className="point-name">{point.name}</span>
              </div>
              <button
                className="remove-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPointRemove(point.id);
                }}
                aria-label="Remove point"
              >
                ×
              </button>
            </div>

            {selectedPoint?.id === point.id && renderPointDetails(point)}
          </div>
        ))}
      </div>
    );
  };
  console.log("re render");
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Data Points</h2>
        <span className="point-count">{points.length} total</span>
      </div>

      <div className="section">
        <h3>Add New Point</h3>
        <div className="point-type-selector">{renderPointTypes()}</div>
        <p className="hint">
          Click on the map to add a {activePointType} point
        </p>
      </div>

      <div className="section">
        <h3>Filter</h3>
        <div className="filter-buttons">{renderFilters()}</div>
      </div>

      <div className="section points-list">
        <h3>Points List</h3>
        {renderPointsList()}
      </div>
    </div>
  );
};
