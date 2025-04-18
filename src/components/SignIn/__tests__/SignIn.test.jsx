import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignIn from '../SignIn';
import { emailSignInStart, googleSignInStart, anonymousSignInStart } from '../../../redux/auth/auth.actions';

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

// Mock Redux store
const mockStore = configureStore([]);

describe('SignIn Component', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        loading: false,
        error: null,
        currentUser: null
      }
    });
    
    // Mock dispatch
    store.dispatch = jest.fn();
  });

  test('renders sign in form', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in anonymously')).toBeInTheDocument();
  });

  test('submits the form with email and password', async () => {
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
    
    // Check if the correct action was dispatched
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        emailSignInStart({ 
          email: 'test@example.com', 
          password: 'password123' 
        })
      );
    });
  });

  test('initiates Google sign in when button is clicked', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the Google sign in button
    fireEvent.click(screen.getByText('Sign in with Google'));
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(googleSignInStart());
  });

  test('initiates anonymous sign in when button is clicked', () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Click the anonymous sign in button
    fireEvent.click(screen.getByText('Sign in anonymously'));
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(anonymousSignInStart());
  });

  test('displays loader when loading', () => {
    store = mockStore({
      auth: {
        loading: true,
        error: null,
        currentUser: null
      }
    });
    
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Check if loader is displayed instead of button text
    const buttons = screen.queryAllByTestId('motion-button');
    buttons.forEach(button => {
      expect(button).toHaveClass('loading');
    });
  });

  test('validates email format', async () => {
    render(
      <Provider store={store}>
        <SignIn />
      </Provider>
    );
    
    // Fill in the form with invalid email
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'invalid-email' }
    });
    
    // Trigger validation by focusing and blurring
    fireEvent.focus(screen.getByPlaceholderText('E-mail'));
    fireEvent.blur(screen.getByPlaceholderText('E-mail'));
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('motion-form'));
    
    // The dispatch should not be called with invalid data
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'EMAIL_SIGN_IN_START'
      })
    );
  });
}); 