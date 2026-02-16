import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMapPoints } from "./useMapPoints";

describe("useMapPoints", () => {
  it("initializes with default points", () => {
    const { result } = renderHook(() => useMapPoints());
    console.log("result.current.points.length", result.current.points.length);
    expect(result.current.points.length).toBeGreaterThan(0);
    expect(result.current.selectedPoint).toBeNull();
    expect(result.current.activePointType).toBe("soil");
  });

  // it("adds a point", () => {
  //   const { result } = renderHook(() => useMapPoints());
  //   const initialCount = result.current.points.length;

  //   act(() => {
  //     result.current.addPoint([4.9041, 52.3676]);
  //   });

  //   expect(result.current.points.length).toBe(initialCount + 1);
  //   expect(result.current.selectedPoint).not.toBeNull();
  //   expect(result.current.selectedPoint?.coordinates).toEqual([
  //     4.9041, 52.3676,
  //   ]);
  // });

  // it("adds point with active type", () => {
  //   const { result } = renderHook(() => useMapPoints());

  //   act(() => {
  //     result.current.setActivePointType("water");
  //   });

  //   act(() => {
  //     result.current.addPoint([5.0, 53.0]);
  //   });

  //   const newPoint = result.current.points[result.current.points.length - 1];
  //   expect(newPoint.type).toBe("water");
  // });

  // it("removes a point", () => {
  //   const { result } = renderHook(() => useMapPoints());
  //   const initialCount = result.current.points.length;
  //   const pointToRemove = result.current.points[0];

  //   act(() => {
  //     result.current.removePoint(pointToRemove.id);
  //   });

  //   expect(result.current.points.length).toBe(initialCount - 1);
  //   expect(
  //     result.current.points.find((p) => p.id === pointToRemove.id),
  //   ).toBeUndefined();
  // });

  // it("removes selected point and clears selection", () => {
  //   const { result } = renderHook(() => useMapPoints());
  //   const pointToRemove = result.current.points[0];

  //   act(() => {
  //     result.current.setSelectedPoint(pointToRemove);
  //   });

  //   expect(result.current.selectedPoint?.id).toBe(pointToRemove.id);

  //   act(() => {
  //     result.current.removePoint(pointToRemove.id);
  //   });

  //   expect(result.current.selectedPoint).toBeNull();
  // });

  // it("sets selected point", () => {
  //   const { result } = renderHook(() => useMapPoints());
  //   const point = result.current.points[0];

  //   act(() => {
  //     result.current.setSelectedPoint(point);
  //   });

  //   expect(result.current.selectedPoint?.id).toBe(point.id);
  // });

  // it("changes active point type", () => {
  //   const { result } = renderHook(() => useMapPoints());

  //   expect(result.current.activePointType).toBe("soil");

  //   act(() => {
  //     result.current.setActivePointType("mineral");
  //   });

  //   expect(result.current.activePointType).toBe("mineral");
  // });
});
