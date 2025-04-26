import authReducer from '../index';
import { authActionTypes } from '../auth.types';

describe('authReducer', () => {
  const initialState = {
    currentUser: null,
    error: null,
    loading: false,
  };

  it('should return the initial state when given undefined state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  it('should set loading=true on any “start” action', () => {
    const startActions = [
      authActionTypes.EMAIL_SIGN_IN_START,
      authActionTypes.GOOGLE_SIGN_IN_START,
      authActionTypes.ANONYMOUS_SIGN_IN_START,
      authActionTypes.SIGN_UP_START,
    ];

    startActions.forEach(type => {
      const newState = authReducer(initialState, { type });
      expect(newState).toEqual({
        ...initialState,
        loading: true,
      });
    });
  });

  it('should handle SIGN_IN_SUCCESS', () => {
    const fakeUser = { id: 'u1', name: 'Alice' };
    const action = {
      type: authActionTypes.SIGN_IN_SUCCESS,
      payload: fakeUser,
    };
    const newState = authReducer(
      { ...initialState, loading: true, error: 'some error' },
      action
    );
    expect(newState).toEqual({
      currentUser: fakeUser,
      loading: false,
      error: null,
    });
  });

  it('should handle SIGN_OUT_SUCCESS', () => {
    const prevState = {
      currentUser: { id: 'u1' },
      loading: true,
      error: 'oops',
    };
    const action = { type: authActionTypes.SIGN_OUT_SUCCESS };
    const newState = authReducer(prevState, action);
    expect(newState).toEqual({
      currentUser: null,
      loading: false,
      error: null,
    });
  });

  it('should handle failure actions by setting error and loading=false', () => {
    const failureActions = [
      authActionTypes.SIGN_IN_FAILURE,
      authActionTypes.SIGN_UP_FAILURE,
      authActionTypes.SIGN_OUT_FAILURE,
    ];
    const errorMsg = 'something went wrong';

    failureActions.forEach(type => {
      const newState = authReducer(
        { ...initialState, loading: true },
        { type, payload: errorMsg }
      );
      expect(newState).toEqual({
        currentUser: null,
        loading: false,
        error: errorMsg,
      });
    });
  });

  it('should ignore unknown action types', () => {
    const prevState = { currentUser: { id: 'u1' }, loading: false, error: null };
    const newState = authReducer(prevState, { type: '__UNKNOWN__' });
    expect(newState).toBe(prevState);
  });
});
