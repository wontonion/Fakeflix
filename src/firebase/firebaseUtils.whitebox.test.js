import firebase from "firebase/compat/app"; 

jest.mock("firebase/compat/app", () => {
  const authFactory = jest.fn(() => ({
    onAuthStateChanged: jest.fn(),
    signInWithPopup: jest.fn(),
  }));
  authFactory.GoogleAuthProvider = jest
    .fn()
    .mockImplementation(() => ({ setCustomParameters: jest.fn() }));
  const firestoreFactory = jest.fn(() => ({
    doc: jest.fn(),
  }));
  return {
    initializeApp: jest.fn(),
    auth: authFactory,
    firestore: firestoreFactory,
    default: {
      initializeApp: jest.fn(),
      auth: authFactory,
      firestore: firestoreFactory,
    },
  };
});
jest.mock("firebase/compat/auth"); 
jest.mock("firebase/compat/firestore");

describe("firebaseUtils bootstrap", () => {
  
  beforeAll(() => {
    require("./firebaseUtils");
  });

  it("environment variables are set", () => {
    expect(process.env.REACT_APP_FIREBASE_API_KEY).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_PROJECT_ID).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_APP_ID).toBeDefined();
    expect(process.env.REACT_APP_FIREBASE_MEASUREMENT_ID).toBeDefined();
  });

  it("initializeApp executed", () => {
    expect(firebase.initializeApp).toHaveBeenCalled();
  });

  it("auth service initialized", () => {
    expect(firebase.auth).toHaveBeenCalled();
  });

  it("firestore service initialized", () => {
    expect(firebase.firestore).toHaveBeenCalled();
  });
  
  it("googleProvider service initialized", () => {
    expect(firebase.auth.GoogleAuthProvider).toHaveBeenCalled();
  });

  it("signInWithGoogle function defined", () => {
    const { signInWithGoogle } = require("./firebaseUtils");
    expect(signInWithGoogle).toBeDefined();
  });
});
