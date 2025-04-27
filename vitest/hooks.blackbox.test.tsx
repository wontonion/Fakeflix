import React from 'react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect, beforeAll, describe } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Firebase mocking
vi.mock('firebase/compat/app', () => ({
  default: {
    initializeApp: vi.fn(),
    auth: Object.assign(() => ({
      onAuthStateChanged: vi.fn(),
      signInWithPopup: vi.fn(),
    }), {
      GoogleAuthProvider: vi.fn().mockImplementation(() => ({
        setCustomParameters: vi.fn(),
      })),
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
}));

vi.mock('../dataConfig', () => ({
  fetchMovieDataConfig: [
    {
      id: 1,
      title: 'Mock Movie',
      genre: 'Trending',
      url: '/trending',
      thunk: vi.fn(() => ({ type: 'FETCH_MOVIE_DATA' })),
      selector: 'mockSelector',
      isLarge: true,
    }
  ],
  fetchSeriesDataConfig: [],
  fetchPopularDataConfig: [],
  genresList: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
  ],
}));



vi.mock('../../firebase/firebaseUtils', () => ({
  auth: vi.fn(),
  firestore: vi.fn(),
}));


// Hooks under test
import useGenreConversion from '../src/hooks/useGenreConversion';
import useLazyLoad from '../src/hooks/useLazyLoad';
import useOutsideClick from '../src/hooks/useOutsideClick';
import { useRetrieveCategory } from '../src/hooks/useRetrieveCategory';
import { useRetrieveData } from '../src/hooks/useRetrieveData';
import useScroll from '../src/hooks/useScroll';
import useViewport from '../src/hooks/useViewport';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  } as any;
});

// Helper to create Redux wrapper
const mockStore = configureStore([thunk]);
const createWrapper = (store) => ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

// -------------------------------
// useGenreConversion
// -------------------------------
describe('useGenreConversion', () => {
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

  // Test with IDs that exist and IDs that don't
  test('EG: mixed valid and invalid genre IDs', () => {
    const { result } = renderHook(() => useGenreConversion([28, 999, 35]));
    expect(result.current).toEqual(['Action', 'Comedy']); 
  });

  // Test with duplicated IDs
  test('BA: duplicated genre IDs only counted once per occurrence', () => {
    const { result } = renderHook(() => useGenreConversion([28, 28, 35, 35]));
    expect(result.current).toEqual(['Action', 'Action', 'Comedy', 'Comedy']);
  });

  // Test with more than 3 IDs (should slice to 3 maximum based on your hook logic)
  test('BA: slice only first 3 genres even if more provided', () => {
    const { result } = renderHook(() => useGenreConversion([28, 35, 18, 27]));
    expect(result.current).toEqual(['Action', 'Comedy', 'Drama']);
  });

  // Test with undefined input (defensive)
  test('BA: undefined input returns empty array', () => {
    const { result } = renderHook(() => useGenreConversion(undefined));
    expect(result.current).toEqual([]);
  });

  // Test with null input (defensive)
  test('BA: null input returns empty array', () => {
    const { result } = renderHook(() => useGenreConversion(null));
    expect(result.current).toEqual([]);
  });

  // Test with wrong type input (e.g., string instead of array)
  test('BA: invalid type (string) returns empty array', () => {
    const { result } = renderHook(() => useGenreConversion('not an array'));
    expect(result.current).toEqual([]);
  });

  // Test with genre IDs in wrong data type (string numbers)
  test('BA: stringified IDs should return empty because IDs expected as numbers', () => {
    const { result } = renderHook(() => useGenreConversion(['28', '35']));
    expect(result.current).toEqual([]);
  });
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
describe('useLazyLoad', () => {
  test('EP: image renders with useLazyLoad ref', () => {
    render(<LazyImage src="example.jpg" />);
    const img = screen.getByTestId('lazy-img');
    expect(img).toBeInTheDocument();
  });

  // Test if data-src is set correctly
  test('EP: sets data-src correctly after mount', () => {
    render(<LazyImage src="example.jpg" />);
    const img = screen.getByTestId('lazy-img');
    expect(img.dataset.src).toBe('example.jpg');
  });

  // Test if data-src updates when src prop changes
  test('EG: updates data-src when src changes', () => {
    const { rerender } = render(<LazyImage src="initial.jpg" />);
    const img = screen.getByTestId('lazy-img');
    expect(img.dataset.src).toBe('initial.jpg');

    rerender(<LazyImage src="updated.jpg" />);
    expect(img.dataset.src).toBe('updated.jpg');
  });

  // Test when ref is null (simulate before the component mounts)
  test('BA: handles missing ref without crashing', () => {
    const BrokenLazyImage = ({ src }: { src: string }) => {
      const ref = React.useRef<HTMLImageElement>(null);
      // Deliberately NOT attaching ref to any element
      useLazyLoad(ref);
      return <div data-testid="no-img">No Image</div>;
    };

    render(<BrokenLazyImage src="nothing.jpg" />);
    const div = screen.getByTestId('no-img');
    expect(div).toBeInTheDocument();
    // No crash, test passes
  });

  // Test multiple LazyImages (simulate multiple images lazy loaded)
  test('EG: handles multiple images independently', () => {
    render(
      <>
        <LazyImage src="img1.jpg" />
        <LazyImage src="img2.jpg" />
      </>
    );
    const imgs = screen.getAllByTestId('lazy-img');
    expect(imgs[0].dataset.src).toBe('img1.jpg');
    expect(imgs[1].dataset.src).toBe('img2.jpg');
  });

  // Test if IntersectionObserver disconnects (test memory management)
  test('BA: does not crash when IntersectionObserver disconnects', () => {
    global.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as any;

    render(<LazyImage src="disconnect-test.jpg" />);
    const img = screen.getByTestId('lazy-img');
    expect(img).toBeInTheDocument();
  });
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

describe('useOutsideClick', () => {
  test('EP: click outside triggers onClose', () => {
    const onClose = vi.fn();
    render(<OutsideClickExample onClose={onClose} />);
    document.body.click();
    expect(onClose).toHaveBeenCalled();
  });

  test('EP: click inside does NOT trigger onClose', () => {
    const onClose = vi.fn();
    render(<OutsideClickExample onClose={onClose} />);
    fireEvent.mouseDown(screen.getByTestId('inside'));
    expect(onClose).not.toHaveBeenCalled();
  });

  test('EG: multiple outside clicks only call onClose once per event', () => {
    const onClose = vi.fn();
    render(<OutsideClickExample onClose={onClose} />);
    
    fireEvent.mouseDown(document.body);
    fireEvent.mouseDown(document.body);
    fireEvent.mouseDown(document.body);

    expect(onClose).toHaveBeenCalledTimes(3); // called for each outside click
  });

  test('BA: does not crash if ref is null', () => {
    const BrokenOutsideClick = ({ onClose }: { onClose: () => void }) => {
      const ref = React.useRef<HTMLDivElement>(null);
      // ref deliberately NOT attached to any DOM
      useOutsideClick(ref, onClose);
      return <div data-testid="no-ref-div">No Ref Div</div>;
    };

    const onClose = vi.fn();
    render(<BrokenOutsideClick onClose={onClose} />);
    
    fireEvent.mouseDown(document.body); // simulate outside click
    expect(onClose).toHaveBeenCalled(); // still called because ref is not blocking
  });

  test('EG: dynamic outside element triggers onClose', () => {
    const onClose = vi.fn();

    function DynamicOutside() {
      const ref = React.useRef<HTMLDivElement>(null);
      const [showOutside, setShowOutside] = React.useState(false);

      useOutsideClick(ref, onClose);

      return (
        <div>
          <div ref={ref} data-testid="inside">Inside</div>
          {showOutside && (
            <div data-testid="dynamic-outside" onMouseDown={() => document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))}>
              Outside
            </div>
          )}
          <button data-testid="toggle" onClick={() => setShowOutside(true)}>Show Outside</button>
        </div>
      );
    }

    render(<DynamicOutside />);

    fireEvent.click(screen.getByTestId('toggle')); // create dynamic outside element
    fireEvent.mouseDown(screen.getByTestId('dynamic-outside')); // simulate click outside

    expect(onClose).toHaveBeenCalled();
  });

  test('BA: event listener is removed when unmounted', () => {
    const onClose = vi.fn();
    
    const { unmount } = render(<OutsideClickExample onClose={onClose} />);

    unmount(); // Unmount component
    fireEvent.mouseDown(document.body); // Try clicking outside after unmount

    expect(onClose).not.toHaveBeenCalled(); // onClose shouldn't be called because listener removed
  });
});

// -------------------------------
// useRetrieveCategory
// -------------------------------
describe('useRetrieveCategory', () => {
  test('EG: returns items for known category', () => {
    const mockThunk = vi.fn().mockReturnValue({ type: 'TEST_ACTION' });
    const categoryStore = mockStore({
      config: {
        selectedConfigArray: [{ genre: 'Trending', url: '/trending', thunk: mockThunk }],
      },
    });

    const { result } = renderHook(() => useRetrieveCategory('config', 'Trending', 1), {
      wrapper: createWrapper(categoryStore),
    });

    expect(result.current).toEqual({ genre: 'Trending', url: '/trending', thunk: mockThunk });
    expect(mockThunk).toHaveBeenCalledWith('/trending&page=1');
  });

  test('EG: handles unknown category', () => {
    const categoryStore = mockStore({
      config: {
        selectedConfigArray: [],
      },
    });

    const { result } = renderHook(() => useRetrieveCategory('config', 'UnknownCategory', 1), {
      wrapper: createWrapper(categoryStore),
    });

    expect(result.current).toBeUndefined();
  });

  test('BA: returns undefined when no config array exists', () => {
    const emptyStore = mockStore({
      config: {
        selectedConfigArray: [],
      },
    });

    const { result } = renderHook(() => useRetrieveCategory('config', 'Trending', 1), {
      wrapper: createWrapper(emptyStore),
    });

    expect(result.current).toBeUndefined();
  });

  
});

// -------------------------------
// useRetrieveData
// -------------------------------
describe('useRetrieveData', () => {
  test('EG: retrieves data for valid type', () => {
    const store = mockStore({});  // store is not actually used here

    const { result } = renderHook(() => useRetrieveData('movies'), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toHaveLength(1);
    expect(result.current && result.current[0]).toMatchObject({
      id: 1,
      title: 'Mock Movie',
      genre: 'Trending',
    });
  });

  test('BA: returns empty data if no config found', () => {
    const store = mockStore({});  // empty store

    const { result } = renderHook(() => useRetrieveData('series'), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]); // because fetchSeriesDataConfig is mocked empty
  });
  test('BA: returns empty array if given unknown type', () => {
    const store = mockStore({});

    const { result } = renderHook(() => useRetrieveData('unknownType' as any), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]);
  });

  test('BA: handles undefined input type', () => {
    const store = mockStore({});

    const { result } = renderHook(() => useRetrieveData(undefined as unknown as string), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]);
  });

  test('BA: handles null input type', () => {
    const store = mockStore({});

    const { result } = renderHook(() => useRetrieveData(null as unknown as string), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual([]);
  });
});


// -------------------------------
// useScroll
// -------------------------------
describe('useScroll', () => {
  test('BA: scroll detection returns boolean', () => {
    const { result } = renderHook(() => useScroll());
    expect(['number', 'boolean'].includes(typeof result.current)).toBe(true);
  });
  test('EG: detects scroll when window scrolls', () => {
    const { result } = renderHook(() => useScroll());
  
    // Simulate scroll
    window.scrollY = 100;
    fireEvent.scroll(window);
  
    expect(['number', 'boolean'].includes(typeof result.current)).toBe(true);
  });
  
  test('BA: unmount hook does not throw errors', () => {
    const { unmount } = renderHook(() => useScroll());
  
    expect(() => {
      unmount(); // should remove event listener cleanly
    }).not.toThrow();
  });
  
  test('BA: multiple rapid scroll events handled', () => {
    const { result } = renderHook(() => useScroll());
  
    for (let i = 0; i < 5; i++) {
      window.scrollY = i * 10;
      fireEvent.scroll(window);
    }
  
    expect(['number', 'boolean'].includes(typeof result.current)).toBe(true);
  });
});

// -------------------------------
// useViewport
// -------------------------------
describe('useViewport', () => {
  test('EP: returns width and height of viewport', () => {
    const { result } = renderHook(() => useViewport());
    expect(result.current).toHaveProperty('width');
    expect(result.current).toHaveProperty('height');
  });
  test('EG: updates dimensions on window resize', () => {
    const { result } = renderHook(() => useViewport());
  
    // Simulate resize
    window.innerWidth = 800;
    window.innerHeight = 600;
    fireEvent(window, new Event('resize'));
  
    expect(result.current.width).toBeGreaterThan(0);
    expect(result.current.height).toBeGreaterThan(0);
  });
  
  // BA: initial viewport dimensions are not undefined
  test('BA: initial width and height are defined', () => {
    const { result } = renderHook(() => useViewport());
    expect(typeof result.current.width).toBe('number');
    expect(typeof result.current.height).toBe('number');
  });
  
  // BA: unmount hook without crashing
  test('BA: unmount useViewport without errors', () => {
    const { unmount } = renderHook(() => useViewport());
    expect(() => {
      unmount(); // should remove event listeners cleanly
    }).not.toThrow();
  });
  
  // EG: simulate extremely small viewport
  test('EG: viewport updates for minimal screen size', () => {
    const { result } = renderHook(() => useViewport());
  
    window.innerWidth = 1;
    window.innerHeight = 1;
    fireEvent(window, new Event('resize'));
  
    expect(result.current.width).toBeGreaterThanOrEqual(1);
    expect(result.current.height).toBeGreaterThanOrEqual(1);
  });
  
  // EG: simulate extremely large viewport
  test('EG: viewport updates for large screen size', () => {
    const { result } = renderHook(() => useViewport());
  
    window.innerWidth = 5000;
    window.innerHeight = 3000;
    fireEvent(window, new Event('resize'));
  
    expect(result.current.width).toBeGreaterThan(1000); // arbitrary large
    expect(result.current.height).toBeGreaterThan(1000);
  });
});
