import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import * as redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer';
import { rootSaga } from '../rootSaga';
import { store, persistor } from '../store';

jest.mock('redux-saga', () => {
  const run = jest.fn();
  const sagaMiddleware = { run };
  return jest.fn(() => sagaMiddleware);
});

jest.mock('../../firebase/firebaseUtils', () => ({
  __esModule: true,
  auth: {
    signInWithPopup: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signInAnonymously: jest.fn(),
    signOut: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
  },
  googleProvider: {},
  createUserProfileDocument: jest.fn(),
  getCurrentUser: jest.fn(),
  firestore: {},
}));

jest.mock('redux-persist', () => ({ persistStore: jest.fn() }));
jest.mock('redux-logger');
jest.mock('redux-devtools-extension', () => ({
  composeWithDevTools: jest.fn(fn => fn),
}));
jest.mock('redux', () => {
  const actual = jest.requireActual('redux');
  return {
    ...actual,
    createStore: jest.fn(),
    applyMiddleware: jest.fn(() => 'middleware'),
  };
});

describe('store (whitebox)', () => {
  const sagaMiddlewareInstance = createSagaMiddleware();

  beforeAll(() => {
    persistStore.mockReturnValue('mockPersistor');
    redux.createStore.mockReturnValue('mockStore');
  });

  it('applies thunk and saga middleware, configures DevTools, runs saga, and sets up persistor', () => {
    expect(createSagaMiddleware).toHaveBeenCalled();

    expect(redux.applyMiddleware).toHaveBeenCalledWith(
      thunk,
      sagaMiddlewareInstance
    );

    expect(composeWithDevTools).toHaveBeenCalledWith('middleware');
    expect(redux.createStore).toHaveBeenCalledWith(
      rootReducer,
      'middleware'
    );

    expect(sagaMiddlewareInstance.run).toHaveBeenCalledWith(rootSaga);
    expect(persistStore).toHaveBeenCalledWith('mockStore');
    expect(store).toBe('mockStore');
    expect(persistor).toBe('mockPersistor');
  });
});
