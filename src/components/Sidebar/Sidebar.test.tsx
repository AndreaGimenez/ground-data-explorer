import { describe, it, expect, vi, beforeEach } from "vitest"; // ✅ Add beforeEach
import { render, screen } from "../../test/utils";
import { Sidebar } from "./Sidebar";
import type { DataPoint } from "../../types";

const mockPoints: DataPoint[] = [
  {
    id: "test-1",
    name: "Test Point 1",
    description: "A test point",
    type: "soil",
    coordinates: [4.9, 52.3],
    depth: 10,
    value: 50,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "test-2",
    name: "Test Point 2",
    description: "Another test point",
    type: "water",
    coordinates: [5.0, 53.0],
    depth: 15,
    value: 75,
    createdAt: new Date("2024-01-02"),
  },
];

describe("Sidebar", () => {
  // ✅ Create mocks once
  const mockOnFilterChange = vi.fn();
  const mockOnPointTypeChange = vi.fn();
  const mockOnPointSelect = vi.fn();
  const mockOnPointRemove = vi.fn();

  const defaultProps = {
    points: mockPoints,
    selectedPoint: null,
    filter: "all" as const,
    activePointType: "soil" as const,
    onFilterChange: mockOnFilterChange,
    onPointTypeChange: mockOnPointTypeChange,
    onPointSelect: mockOnPointSelect,
    onPointRemove: mockOnPointRemove,
  };

  // ✅ Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header with correct count", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Data Points")).toBeInTheDocument();
    expect(screen.getByText("2 total")).toBeInTheDocument();
  });

  it("renders all points in list", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText("Test Point 1")).toBeInTheDocument();
    expect(screen.getByText("Test Point 2")).toBeInTheDocument();
  });

  it("shows empty state when no points", () => {
    render(<Sidebar {...defaultProps} points={[]} />);

    expect(screen.getByText(/No points yet/i)).toBeInTheDocument();
  });

  it("renders point type selector buttons", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByRole("button", { name: "soil" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "water" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "mineral" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "anomaly" })).toBeInTheDocument();
  });

  it("highlights active point type", () => {
    render(<Sidebar {...defaultProps} activePointType="water" />);

    const waterButton = screen.getByRole("button", { name: "water" });
    expect(waterButton).toHaveClass("active");
  });

  it("calls onPointTypeChange when type button clicked", async () => {
    const { user } = render(<Sidebar {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "water" }));

    expect(mockOnPointTypeChange).toHaveBeenCalledWith("water");
    expect(mockOnPointTypeChange).toHaveBeenCalledTimes(1);
  });

  it("renders filter buttons with counts", () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByText(/All \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/soil \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/water \(1\)/)).toBeInTheDocument();
  });

  it("highlights selected point", () => {
    render(<Sidebar {...defaultProps} selectedPoint={mockPoints[0]} />);

    const selectedItem = screen
      .getByText("Test Point 1")
      .closest(".point-item");
    expect(selectedItem).toHaveClass("selected");
  });

  it("shows point details when selected", () => {
    render(<Sidebar {...defaultProps} selectedPoint={mockPoints[0]} />);

    expect(screen.getByText("10.0m below surface")).toBeInTheDocument();
    expect(screen.getByText("50.0")).toBeInTheDocument();
  });

  it("calls onPointSelect when point clicked", async () => {
    const { user } = render(<Sidebar {...defaultProps} />);

    await user.click(screen.getByText("Test Point 1"));

    expect(mockOnPointSelect).toHaveBeenCalledWith(mockPoints[0]);
    expect(mockOnPointSelect).toHaveBeenCalledTimes(1);
  });

  it("calls onPointRemove when remove button clicked", async () => {
    const { user } = render(<Sidebar {...defaultProps} />);

    const removeButtons = screen.getAllByLabelText("Remove point");
    await user.click(removeButtons[0]);

    expect(mockOnPointRemove).toHaveBeenCalledWith("test-1");
    expect(mockOnPointRemove).toHaveBeenCalledTimes(1);
  });

  it("stops propagation on remove button click", async () => {
    const { user } = render(<Sidebar {...defaultProps} />);

    const removeButtons = screen.getAllByLabelText("Remove point");
    await user.click(removeButtons[0]);

    // Should NOT call onPointSelect
    expect(mockOnPointSelect).not.toHaveBeenCalled();
    // Should ONLY call onPointRemove
    expect(mockOnPointRemove).toHaveBeenCalledWith("test-1");
    expect(mockOnPointRemove).toHaveBeenCalledTimes(1);
  });
});
