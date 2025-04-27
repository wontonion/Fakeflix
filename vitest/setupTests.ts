// setupTest.ts
import { vi } from 'vitest';

// Mock Firebase compat library
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
    },
  };
});

// Mock firebaseUtils to reuse firebase mock
vi.mock('./src/firebase/firebaseUtils', async () => {
  const mockFirebase = (await import('firebase/compat/app')).default;
  return {
    auth: mockFirebase.auth(),
    firestore: mockFirebase.firestore(),
  };
});

// Mock IntersectionObserver (needed for useLazyLoad)
global.IntersectionObserver = class {
  constructor(_: any) {}
  observe() {}
  disconnect() {}
  unobserve() {}
} as any;
