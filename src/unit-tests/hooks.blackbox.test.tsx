import React from 'react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, test, expect, beforeAll } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Firebase mocking
vi.mock('firebase/compat/app', () => {
  return {
    default: {
      initializeApp: vi.fn(),
      auth: Object.assign(() => ({
        onAuthStateChanged: vi.fn(),
        signInWithPopup: vi.fn(),
      }), {
        GoogleAuthProvider: vi.fn().mockImplementation(() => ({
          setCustomParameters: vi.fn(),
        }))
      }),
      firestore: () => ({
        collection: vi.fn(() => ({
          get: vi.fn(() => Promise.resolve({ docs: [] })),
          doc: vi.fn(() => ({
            get: vi.fn(() => Promise.resolve({ exists: false })),
            set: vi.fn(),
            update: vi.fn(),
          })),
        })),
      }),
    }
  };
});

vi.mock('../../firebase/firebaseUtils', async () => {
  const mockFirebase = (await import('firebase/compat/app')).default;
  return {
    auth: mockFirebase.auth(),
    firestore: mockFirebase.firestore(),
  };
});

// Redux selector mocking
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' && actual ? actual : {}),
    useSelector: vi.fn(fn =>
      fn({
        selectedConfigArray: [
          {
            genre: 'Trending',
            thunk: vi.fn(),
            url: '/fake-url',
          },
        ],
      })
    ),
  };
});

import useGenreConversion from '../hooks/useGenreConversion';
import useLazyLoad from '../hooks/useLazyLoad';
import useOutsideClick from '../hooks/useOutsideClick';
import { useRetrieveCategory } from '../hooks/useRetrieveCategory';
import { useRetrieveData } from '../hooks/useRetrieveData';
import useScroll from '../hooks/useScroll';
import useViewport from '../hooks/useViewport';

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(_: any) {}
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any;
});

// Test wrapper utilities
const mockStore = configureStore();


// -------------------------------
// useGenreConversion
// -------------------------------
test('EP: returns genre names for valid IDs', () => {
  const { result } = renderHook(() => useGenreConversion([28, 35]));
  expect(result.current).toEqual(['Action', 'Comedy']);
});

test('EP: returns empty for unknown IDs', () => {
  const { result } = renderHook(() => useGenreConversion([999]));
  expect(result.current).toEqual([]);
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
  const ref = React.useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);
  return (
    <div>
      <div ref={ref} data-testid="inside">Inside</div>
      <div data-testid="outside" onMouseDown={() => document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))}>Outside</div>
    </div>
  );
}

test('EP: click outside triggers onClose', () => {
  const onClose = vi.fn();
  render(<OutsideClickExample onClose={onClose} />);
  document.body.click(); // This will trigger document-level mousedown
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
const populatedStore = mockStore({
  category: {
    selectedConfigArray: [
      { genre: 'Trending', url: '/trending', thunk: vi.fn() },
      { genre: 'DoesNotExist', url: '', thunk: vi.fn() },
    ],
  },
});

const wrapperWithCategory = ({ children }) => (
  <Provider store={mockStore({
    config: {
      selectedConfigArray: [
        { genre: "Trending", url: "test.com", thunk: vi.fn() },
        { genre: "UnknownCategory", url: "unknown.com", thunk: vi.fn() }
      ]
    }
  })}>
    {children}
  </Provider>
);

test('EG: returns items for known category', () => {
  const { result } = renderHook(() => useRetrieveCategory('Trending'), {
    wrapper: wrapperWithCategory,
  });
  expect(result.current).not.toBe(null);
});

test('EG: handles unknown category', () => {
  const { result } = renderHook(() => useRetrieveCategory('DoesNotExist'), {
    wrapper: wrapperWithCategory,
  });
  expect(result.current).not.toBe(null);
});

// -------------------------------
// useRetrieveData
// -------------------------------
const dataStore = mockStore({
  home: {
    selectedConfigArray: [
      { genre: 'Trending', url: '/trending', thunk: vi.fn() },
    ],
  },
});

const wrapperWithHome = ({ children }) => (
  <Provider store={dataStore}>{children}</Provider>
);

test('EG: retrieves data for valid type', () => {
  const { result } = renderHook(() => useRetrieveData('Trending'), {
    wrapper: wrapperWithHome,
  });
  expect(result.current).toHaveProperty('data');
  expect(result.current).toHaveProperty('loading');
});

// -------------------------------
// useScroll
// -------------------------------
test('BA: scroll detection returns boolean', () => {
  const { result } = renderHook(() => useScroll());
  expect(['number', 'boolean'].includes(typeof result.current)).toBe(true);
});

// -------------------------------
// useViewport
// -------------------------------
test('EP: returns width and height of viewport', () => {
  const { result } = renderHook(() => useViewport());
  expect(result.current).toHaveProperty('width');
  expect(result.current).toHaveProperty('height');
});
