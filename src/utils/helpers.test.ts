import { describe, it, expect } from "vitest";
import { formattedDepth, formattedCoordinates } from "./helpers";

describe("formattedDepth", () => {
  it("formats depth with one decimal place", () => {
    expect(formattedDepth(12.5)).toBe("12.5m below surface");
    expect(formattedDepth(5)).toBe("5.0m below surface");
    expect(formattedDepth(0)).toBe("0.0m below surface");
  });

  it("rounds to one decimal place", () => {
    expect(formattedDepth(12.56)).toBe("12.6m below surface");
    expect(formattedDepth(12.54)).toBe("12.5m below surface");
  });
});

describe("formattedCoordinates", () => {
  it("formats positive coordinates correctly", () => {
    // Amsterdam: 4.9°E, 52.4°N
    expect(formattedCoordinates([4.9041, 52.3676])).toBe("52.3676°N, 4.9041°E");
  });

  it("formats negative longitude as West", () => {
    // New York: 73.9°W, 40.7°N
    expect(formattedCoordinates([-73.9857, 40.7484])).toBe(
      "40.7484°N, 73.9857°W",
    );
  });

  it("formats negative latitude as South", () => {
    // Rio: 43.2°W, 22.9°S
    expect(formattedCoordinates([-43.1729, -22.9068])).toBe(
      "22.9068°S, 43.1729°W",
    );
  });

  it("formats both negative as South and West", () => {
    // Somewhere in South America
    expect(formattedCoordinates([-50, -10])).toBe("10.0000°S, 50.0000°W");
  });

  it("formats with 4 decimal places", () => {
    expect(formattedCoordinates([4.90412345, 52.36765432])).toBe(
      "52.3677°N, 4.9041°E",
    );
  });
});
