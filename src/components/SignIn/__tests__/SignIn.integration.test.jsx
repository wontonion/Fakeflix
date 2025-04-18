import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import SignIn from '../SignIn';
import { authActionTypes } from '../../../redux/auth/auth.types';
import { act } from 'react-dom/test-utils';

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

// Create custom render function
const customRender = async (ui, options = {}) => {
  let result;
  await act(async () => {
    result = render(ui, options);
  });
  return result;
};

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
    // Clear any previous actions
    store.clearActions();
  });

  test('full sign-in flow - dispatches correct actions on form submit', async () => {
    await customRender(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Fill in the form
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('E-mail'), {
        target: { value: 'test@example.com' }
      });
    });
    
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' }
      });
    });
    
    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByTestId('motion-form'));
    });
    
    // Wait for and check that the correct action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0]).toEqual({
        type: authActionTypes.EMAIL_SIGN_IN_START,
        payload: {
          email: 'test@example.com',
          password: 'password123'
        }
      });
    });
  });

  test('Google sign-in integration - dispatches correct action on click', async () => {
    await customRender(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the Google sign in button
    await act(async () => {
      fireEvent.click(screen.getByText('Sign in with Google'));
    });
    
    // Check that the correct action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0]).toEqual({
        type: authActionTypes.GOOGLE_SIGN_IN_START
      });
    });
  });

  test('Anonymous sign-in integration - dispatches correct action on click', async () => {
    await customRender(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the anonymous sign in button
    await act(async () => {
      fireEvent.click(screen.getByText('Sign in anonymously'));
    });
    
    // Check that the correct action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0]).toEqual({
        type: authActionTypes.ANONYMOUS_SIGN_IN_START
      });
    });
  });

  test('UI shows loading state when auth state is loading', async () => {
    // Create a store with loading state
    const loadingStore = mockStore({
      auth: {
        loading: true,
        error: null,
        currentUser: null
      }
    });
    
    await customRender(
      <Provider store={loadingStore}>
        <SignIn />
      </Provider>
    );
    
    // Check that buttons are disabled and have the loading class
    await waitFor(() => {
      const buttons = screen.queryAllByTestId('motion-button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach(button => {
        expect(button).toBeDisabled();
        expect(button).toHaveClass('loading');
      });
    });
  });
}); 