# Architectural Decisions

## 1. react-map-gl vs raw mapbox-gl

**Context:** Need interactive map with dynamic markers

**Options Considered:**

1. Raw mapbox-gl
   - Pros: Full control, smaller bundle
   - Cons: Imperative, manual lifecycle management
2. react-map-gl
   - Pros: Declarative, React-idiomatic
   - Cons: +15kb, abstraction layer

**Decision:** react-map-gl

**Rationale:**

- Eliminated ~50 lines of imperative DOM code
- React handles marker lifecycle automatically
- TypeScript integration cleaner
- 15kb cost acceptable for <1000 markers

**When I'd Choose Differently:**

- 10k+ markers → raw mapbox-gl with WebGL clustering
- Need custom marker pooling → raw mapbox-gl
- Team unfamiliar with React → raw mapbox-gl

**Code:** See commented-out implementation in MapView.tsx

## Decision: Render Functions for Clean JSX

**Date:** 2025-02-13

**Context:**
Sidebar component has multiple sections with `.map()` logic that clutters
the main render method.

**Decision:** Extract map logic into render functions

**Implementation:**

```typescript
// Instead of inline:
<div>{pointTypes.map((type) => <button>...</button>)}</div>

// Use render functions:
const renderPointTypes = () => {
  return pointTypes.map((type) => <button>...</button>);
};

return <div>{renderPointTypes()}</div>;
```

**Benefits:**

- Main render shows component structure clearly
- Logic grouped by purpose (renderPointTypes, renderFilters, etc.)
- Easy to locate specific rendering logic
- No separate component files needed
- Props/state still in scope

**Naming Convention:**

- `render...()` - Returns JSX elements
- `get...()` - Returns data/values
- `handle...()` - Event handlers

**When NOT to use:**

- Very simple one-liner maps → keep inline
- Need reusability across components → extract to component
- Need to test in isolation → extract to component

**Alternative considered:**
Separate components (PointTypeButton, FilterButton, etc.) - rejected
because no reuse needed yet and render functions provide sufficient
organization without file overhead.

**Principle:**
Balance between readability (extract) and simplicity (inline).
Render functions are the sweet spot for component-scoped complexity.

## Decision: Memoized Type Counts for Performance

**Date:** 2025-02-13

**Context:**
Sidebar displays count of points for each type (soil, water, mineral, anomaly)
in the filter buttons. Initially implemented with repeated filtering.

**Problem Identified:**

```typescript
// ❌ Original approach - repeated filtering:
const getTypeCount = (type: PointType) => {
  return points.filter(p => p.type === type).length;
};

// Called 4 times per render:
renderFilters() {
  return filters.map(f => (
    <button>{f} ({getTypeCount(f)})</button>
  ));
}
```

**Performance Issue:**

- With n points and 4 types: O(n × 4) = O(4n) per render
- Example: 1000 points = 4000 iterations per render
- Sidebar re-renders on: point add, point remove, filter change, selection
- 10 re-renders = 40,000 unnecessary iterations!

**Solution:** Memoized count calculation

```typescript
// ✅ Optimized approach - count once, use many:
const typeCounts = useMemo(() => {
  const counts: Record<PointType, number> = {
    soil: 0,
    water: 0,
    mineral: 0,
    anomaly: 0,
  };

  points.forEach(point => counts[point.type]++);

  return counts;
}, [points]);

// O(1) lookup:
<button>{f} ({typeCounts[f]})</button>
```

**Performance Improvement:**

- Complexity: O(4n) → O(n) per calculation
- Memoization: Only recalculates when `points` array changes
- Result: 40x better for 1000 points with 10 re-renders

**Why useMemo?**

- Expensive computation (iterating all points)
- Result depends only on `points` (stable dependency)
- Prevents recalculation on unrelated re-renders (filter change, selection)

**Data Structure Choice:**

```typescript
Record<PointType, number>; // Chosen - O(1) lookup by type
vs;
Map<PointType, number>; // Same performance, but Record is simpler
vs;
Array.filter(); // O(n) per lookup - rejected
```

**When NOT to optimize like this:**

- Small arrays (< 100 items) - filter is fast enough
- Infrequent re-renders - optimization overhead > benefit
- Simple one-time calculations - useMemo adds complexity

**When TO optimize like this:**

- Large datasets (> 100 items)
- Frequent re-renders (user interactions)
- Multiple lookups per render (4 filter buttons)

**Measurement approach:**
Could add performance logging:

```typescript
console.time('typeCounts');
const counts = /* calculation */;
console.timeEnd('typeCounts');
```

For production: React DevTools Profiler would show the difference.

**Lesson:**
Always consider algorithmic complexity:

- Repeated filters in render = red flag
- Ask: "How many times does this run?"
- Data structures matter: Map/Record for lookups vs Array for iteration
