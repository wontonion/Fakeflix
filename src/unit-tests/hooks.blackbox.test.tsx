import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '../redux/store'; 

import useGenreConversion from '../hooks/useGenreConversion';
import useLazyLoad from '../hooks/useLazyLoad';
import useOutsideClick from '../hooks/useOutsideClick';
import { useRetrieveCategory } from '../hooks/useRetrieveCategory';
import { useRetrieveData } from '../hooks/useRetrieveData';
import useScroll from '../hooks/useScroll';
import useViewport from '../hooks/useViewport';

// Mock IntersectionObserver for jsdom environment
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback: any) {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any;
});

vi.mock('../../firebase/firebaseUtils', () => {
  return {
    auth: {
      onAuthStateChanged: vi.fn(),
      signInWithPopup: vi.fn(),
    },
    firestore: {
      collection: vi.fn(() => ({
        get: vi.fn(() => Promise.resolve({ docs: [] })),
        doc: vi.fn(() => ({
          set: vi.fn(),
          update: vi.fn(),
          get: vi.fn(() => Promise.resolve({ exists: false })),
        })),
      })),
    },
  };
});


/**
 * TESTING STRATEGY:
 * - EP: Equivalence Partitioning
 * - BA: Boundary Analysis
 * - EG: Error Guessing
 */

// -------------------------------
// useGenreConversion
// -------------------------------
test('EP: returns genre names for valid IDs', () => {
  const { result } = renderHook(() => useGenreConversion([28, 35]));
  expect(result.current).toEqual(['Action', 'Comedy']); // Valid input
});

test('EP: returns empty for unknown IDs', () => {
  const { result } = renderHook(() => useGenreConversion([999]));
  expect(result.current).toEqual([]); // Fails gracefully
});

test('BA: edge case with empty input', () => {
  const { result } = renderHook(() => useGenreConversion([]));
  expect(result.current).toEqual([]);
});

// -------------------------------
// useLazyLoad
// -------------------------------
function LazyImage({ src }: { src: string }) {
  const ref = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.dataset.src = src;
  }, [src]);
  useLazyLoad(ref);
  return <img ref={ref} data-testid="lazy-img" alt="Lazy image" />;
}

test('EP: image renders with useLazyLoad ref', () => {
  render(<LazyImage src="example.jpg" />);
  const img = screen.getByTestId('lazy-img');
  expect(img).toBeInTheDocument();
});

// -------------------------------
// useOutsideClick
// -------------------------------
function OutsideClickExample({ onClose }: { onClose: () => void }) {
  const ref = React.useRef(null);
  useOutsideClick(ref, onClose);
  return (
    <div>
      <div ref={ref} data-testid="inside">Inside</div>
      <div data-testid="outside">Outside</div>
    </div>
  );
}

test('EP: click outside triggers onClose', () => {
  const onClose = vi.fn();
  render(<OutsideClickExample onClose={onClose} />);
  fireEvent.mouseDown(screen.getByTestId('outside'));
  expect(onClose).toHaveBeenCalled();
});

test('EP: click inside does NOT trigger onClose', () => {
  const onClose = vi.fn();
  render(<OutsideClickExample onClose={onClose} />);
  fireEvent.mouseDown(screen.getByTestId('inside'));
  expect(onClose).not.toHaveBeenCalled();
});

// -------------------------------
// useRetrieveCategory
// -------------------------------
function CategoryWrapper({ category }: { category: string }) {
  const result = useRetrieveCategory(category);
  return <div data-testid="category-result">{JSON.stringify(result)}</div>;
}

test('EG: returns items for known category', () => {
  render(<Provider store={store}><CategoryWrapper category="Trending" /></Provider>);
  expect(screen.getByTestId('category-result')).toBeInTheDocument();
});

test('EG: handles unknown category', () => {
  render(<Provider store={store}><CategoryWrapper category="UnknownCategory" /></Provider>);
  expect(screen.getByTestId('category-result')).toBeInTheDocument();
});

// -------------------------------
// useRetrieveData
// -------------------------------
function DataWrapper({ type }: { type: string }) {
  const result = useRetrieveData(type);
  return (
    <div data-testid="data-result">
      {JSON.stringify(result)}
    </div>
  );
}

test('EG: retrieves data for valid type', () => {
  render(<Provider store={store}><DataWrapper type="Trending" /></Provider>);
  expect(screen.getByTestId('data-result')).toBeInTheDocument();
});

// -------------------------------
// useScroll
// -------------------------------
test('BA: scroll detection returns boolean', () => {
  const { result } = renderHook(() => useScroll());
  expect(typeof result.current).toBe('boolean'); // Scroll state
});

// -------------------------------
// useViewport
// -------------------------------
test('EP: returns width and height of viewport', () => {
  const { result } = renderHook(() => useViewport());
  expect(result.current).toHaveProperty('width');
  expect(result.current).toHaveProperty('height');
});
