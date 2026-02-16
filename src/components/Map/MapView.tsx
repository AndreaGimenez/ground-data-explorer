// VERSION 2: Declarative react-map-gl implementation (2025-02-13)
// Benefits:
// ✅ Markers are React components
// ✅ React handles lifecycle automatically
// ✅ No manual Map tracking needed
// ✅ Standard React event handlers
// ✅ ~60 lines instead of ~150 (60% reduction)

import { type FC, useState, useEffect, type SetStateAction } from "react";
import type { MapViewProps } from "../../types";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import { POINT_COLORS } from "../../utils/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapView.css";
import { useMapControl } from "../../hooks/useMapControl";
const INITIAL_CENTER = { longitude: 4.9041, latitude: 52.3676 };
const INITIAL_ZOOM = 7;

export const MapView: FC<MapViewProps> = ({
  points,
  selectedPoint,
  onMapClick,
  onMarkerClick,
  activePointType,
}) => {
  const [viewState, setViewState] = useState({
    ...INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
  });

  const { mapRef, flyTo } = useMapControl();

  useEffect(() => {
    if (!selectedPoint) return;

    flyTo({
      longitude: selectedPoint.coordinates[0],
      latitude: selectedPoint.coordinates[1],
      zoom: 10,
    });
  }, [selectedPoint, flyTo]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (e: any) => {
    const { lng, lat } = e.lngLat;
    onMapClick([lng, lat]);
  };

  const handleReset = () => {
    flyTo({ ...INITIAL_CENTER, zoom: INITIAL_ZOOM });
  };

  const handleOnMove = (e: {
    viewState: SetStateAction<{
      zoom: number;
      longitude: number;
      latitude: number;
    }>;
  }) => {
    setViewState(e.viewState);
  };

  return (
    <>
      <button className="reset-button" onClick={handleReset}>
        Reset
      </button>
      <div
        className="active-type-indicator"
        style={{
          backgroundColor: POINT_COLORS[activePointType],
        }}
      >
        <span className="indicator-label">Adding:</span>
        <span className="indicator-type">{activePointType}</span>
      </div>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleOnMove}
        onClick={handleMapClick}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl />

        {points.map((point) => {
          return (
            <Marker
              key={point.id}
              longitude={point.coordinates[0]}
              latitude={point.coordinates[1]}
            >
              <div
                className={`custom-marker ${
                  selectedPoint?.id === point.id ? "selected" : ""
                }`}
                style={{ backgroundColor: POINT_COLORS[point.type] }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(point);
                }}
              />
            </Marker>
          );
        })}
      </Map>
    </>
  );
};
