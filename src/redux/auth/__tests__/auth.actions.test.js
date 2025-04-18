import {
  emailSignInStart,
  googleSignInStart,
  anonymousSignInStart,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure
} from '../auth.actions';
import { authActionTypes } from '../auth.types';

describe('Auth Actions', () => {
  test('emailSignInStart should create an action to sign in with email and password', () => {
    const emailAndPassword = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const expectedAction = {
      type: authActionTypes.EMAIL_SIGN_IN_START,
      payload: emailAndPassword
    };
    
    expect(emailSignInStart(emailAndPassword)).toEqual(expectedAction);
  });
  
  test('googleSignInStart should create an action to sign in with Google', () => {
    const expectedAction = {
      type: authActionTypes.GOOGLE_SIGN_IN_START
    };
    
    expect(googleSignInStart()).toEqual(expectedAction);
  });
  
  test('anonymousSignInStart should create an action to sign in anonymously', () => {
    const expectedAction = {
      type: authActionTypes.ANONYMOUS_SIGN_IN_START
    };
    
    expect(anonymousSignInStart()).toEqual(expectedAction);
  });
  
  test('signInSuccess should create an action with the user data', () => {
    const user = {
      id: '123',
      email: 'test@example.com',
      displayName: 'Test User'
    };
    
    const expectedAction = {
      type: authActionTypes.SIGN_IN_SUCCESS,
      payload: user
    };
    
    expect(signInSuccess(user)).toEqual(expectedAction);
  });
  
  test('signInFailure should create an action with the error', () => {
    const error = new Error('Authentication failed');
    
    const expectedAction = {
      type: authActionTypes.SIGN_IN_FAILURE,
      payload: error
    };
    
    expect(signInFailure(error)).toEqual(expectedAction);
  });
  
  test('signOutStart should create an action to start sign out process', () => {
    const expectedAction = {
      type: authActionTypes.SIGN_OUT_START
    };
    
    expect(signOutStart()).toEqual(expectedAction);
  });
  
  test('signOutSuccess should create an action for successful sign out', () => {
    const expectedAction = {
      type: authActionTypes.SIGN_OUT_SUCCESS
    };
    
    expect(signOutSuccess()).toEqual(expectedAction);
  });
  
  test('signOutFailure should create an action with the error', () => {
    const error = new Error('Sign out failed');
    
    const expectedAction = {
      type: authActionTypes.SIGN_OUT_FAILURE,
      payload: error
    };
    
    expect(signOutFailure(error)).toEqual(expectedAction);
  });
}); 