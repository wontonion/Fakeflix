import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SignIn from '../SignIn';
import { authActionTypes } from '../../../redux/auth/auth.types';

// Mock the dependencies
jest.mock('framer-motion', () => ({
  motion: {
    form: jest.fn(({ children, ...props }) => (
      <form data-testid="motion-form" {...props}>{children}</form>
    )),
    div: jest.fn(({ children, ...props }) => (
      <div data-testid="motion-div" {...props}>{children}</div>
    )),
    button: jest.fn(({ children, ...props }) => (
      <button data-testid="motion-button" {...props}>{children}</button>
    ))
  }
}));

// Create mock store with middleware
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('SignIn Integration Tests', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        currentUser: null
      }
    });
  });

  test('full sign-in flow - dispatches correct actions on form submit', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('motion-form'));
    
    // Check that the correct action was dispatched
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: authActionTypes.EMAIL_SIGN_IN_START,
      payload: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
  });

  test('Google sign-in integration - dispatches correct action on click', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the Google sign in button
    fireEvent.click(screen.getByText('Sign in with Google'));
    
    // Check that the correct action was dispatched
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: authActionTypes.GOOGLE_SIGN_IN_START
    });
  });

  test('Anonymous sign-in integration - dispatches correct action on click', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the anonymous sign in button
    fireEvent.click(screen.getByText('Sign in anonymously'));
    
    // Check that the correct action was dispatched
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: authActionTypes.ANONYMOUS_SIGN_IN_START
    });
  });

  test('UI shows loading state when auth state is loading', () => {
    // Create a store with loading state
    const loadingStore = mockStore({
      auth: {
        loading: true,
        error: null,
        currentUser: null
      }
    });
    
    render(
      <Provider store={loadingStore}>
        <SignIn />
      </Provider>
    );
    
    // Check that buttons are disabled and have the loading class
    const buttons = screen.queryAllByTestId('motion-button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
      expect(button).toHaveClass('loading');
    });
  });
}); 