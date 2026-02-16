# Testing Strategy

## Overview

This project uses Vitest and React Testing Library for comprehensive test coverage. Tests are co-located with their source files and follow the AAA (Arrange-Act-Assert) pattern.

## Test Stack

- **Vitest** - Fast unit test runner, built for Vite
- **React Testing Library** - Component testing with user-centric queries
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers for DOM assertions

## Running Tests
```bash
# Run all tests
npm test

# Watch mode (re-runs on file change)
npm test -- --watch

# Coverage report
npm test:coverage

# UI mode (visual test interface)
npm test:ui
```

## Test Structure

Tests are co-located with their source files:
```
src/
├── components/
│   └── Sidebar/
│       ├── Sidebar.tsx
│       └── Sidebar.test.tsx     ← Component tests
├── hooks/
│   ├── useMapPoints.ts
│   └── useMapPoints.test.ts     ← Hook tests
└── utils/
    ├── helpers.ts
    └── helpers.test.ts          ← Utility tests
```

## Coverage Goals

- **Overall:** 70-80%
- **Utilities:** 90%+
- **Hooks:** 80%+
- **Components:** 70%+

## What We Test

### ✅ Do Test
- Business logic (useMapPoints hook)
- Helper functions (formatters)
- Component rendering (correct output)
- User interactions (clicks, selections)
- Edge cases (empty states, null values)

### ❌ Don't Test
- Third-party libraries (Mapbox, react-map-gl)
- CSS styles (visual regression is separate)
- Implementation details (internal state)
- Trivial code (simple getters)

## Test Patterns

### AAA Pattern (Arrange-Act-Assert)
```typescript
it('adds a point', () => {
  // Arrange - set up test data
  const { result } = renderHook(() => useMapPoints());
  
  // Act - perform action
  act(() => {
    result.current.addPoint([4.9, 52.3]);
  });
  
  // Assert - verify result
  expect(result.current.points.length).toBeGreaterThan(0);
});
```

### Naming Convention
```typescript
// ✅ Good - descriptive, behavior-focused
it('removes selected point and clears selection', () => {})
it('formats negative latitude as South', () => {})

// ❌ Bad - vague, implementation-focused
it('works correctly', () => {})
it('calls setState', () => {})
```

### Test User Behavior, Not Implementation
```typescript
// ✅ Good - tests what user sees/does
await user.click(screen.getByRole('button', { name: 'soil' }));
expect(screen.getByText('Test Point 1')).toBeInTheDocument();

// ❌ Bad - tests implementation details
expect(component.state.isOpen).toBe(true);
expect(mockSetState).toHaveBeenCalled();
```

## Bugs Found Through Testing

### Bug #1: Coordinate Direction Labels Swapped

**Date:** 2025-02-16

**Test that found it:**
```typescript
it('formats positive coordinates correctly', () => {
  expect(formatCoordinates([4.9041, 52.3676])).toBe('52.3676°N, 4.9041°E');
});
```

**Bug:**
```typescript
// ❌ Wrong - latitude got E/W, longitude got N/S
return `${Math.abs(lat).toFixed(4)}°${lngDir}, ${Math.abs(lng).toFixed(4)}°${latDir}`;
```

**Fix:**
```typescript
// ✅ Correct - latitude gets N/S, longitude gets E/W
return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
```

**Impact:**
All displayed coordinates in the sidebar were showing incorrect direction labels.
Amsterdam was shown as "52.37°E" (impossible - that would be East, but latitude is N/S).

**Lesson:**
This bug existed in production code and went unnoticed during manual testing because
the numbers looked "close enough". Automated tests with specific assertions caught it
immediately. This demonstrates the value of testing edge cases and exact formatting.

### Bug #2: Coordinate Array Destructuring Order

**Date:** 2025-02-16

**Test that found it:**
```typescript
it('formats with 4 decimal places', () => {
  expect(formatCoordinates([4.90412345, 52.36765432])).toBe('52.3677°N, 4.9041°E');
});
```

**Bug:**
```typescript
// ❌ Wrong - destructuring in geographic order
const [lat, lng] = coordinates; 
// But coordinates are [longitude, latitude] per GeoJSON!
```

**Fix:**
```typescript
// ✅ Correct - GeoJSON/Mapbox standard order
const [lng, lat] = coordinates;
```

**Impact:**
Coordinates were being interpreted backwards, causing incorrect latitude/longitude assignments.

**Lesson:**
GeoJSON/Mapbox uses [longitude, latitude] order (mathematical x, y) while humans typically
say "latitude, longitude" (geographic convention). This mismatch is a common source of bugs.
Tests caught it before it reached production.

## Mock Management

### Clearing Mocks Between Tests
```typescript
describe('Component', () => {
  // Create mocks once at top level
  const mockOnClick = vi.fn();
  const mockOnChange = vi.fn();

  // Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('test 1', () => {
    // mockOnClick starts clean
  });

  it('test 2', () => {
    // mockOnClick starts clean again
  });
});
```

### Mock Options
```typescript
vi.clearAllMocks()  // Clears call history, keeps implementation
vi.resetAllMocks()  // Also resets implementation to undefined
vi.restoreAllMocks() // Restores original implementation
```

## Test Utilities

### Custom Render Function

Located in `src/test/utils.tsx`:
```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { ...options }),
  };
};

export * from '@testing-library/react';
export { customRender as render };
```

### Usage
```typescript
import { render, screen } from '../../test/utils';

it('clicks a button', async () => {
  const { user } = render(<MyComponent />);
  await user.click(screen.getByRole('button'));
});
```

## Future Improvements

- [ ] E2E tests with Playwright
- [ ] Visual regression testing
- [ ] Increase coverage to 80%+
- [ ] Performance benchmarks
- [ ] Accessibility testing (axe)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
