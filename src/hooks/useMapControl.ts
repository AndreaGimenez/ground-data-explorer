import { useRef, useCallback } from "react";
import { type MapRef } from "react-map-gl";
import type { FlyToOptions } from "../types";

export const useMapControl = () => {
  const mapRef = useRef<MapRef>(null);

  const flyTo = useCallback((options: FlyToOptions) => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [options.longitude, options.latitude],
      zoom: options.zoom,
      duration: options.duration ?? 1000,
      essential: true,
    });
  }, []);

  const panTo = useCallback((longitude: number, latitude: number) => {
    if (!mapRef.current) return;
    mapRef.current.panTo([longitude, latitude]);
  }, []);

  const zoomTo = useCallback((zoom: number) => {
    if (!mapRef.current) return;
    mapRef.current.zoomTo(zoom);
  }, []);

  return {
    mapRef,
    flyTo,
    panTo,
    zoomTo,
  };
};
