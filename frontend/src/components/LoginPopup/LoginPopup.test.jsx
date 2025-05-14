import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPopup from './LoginPopup';
import { StoreContext } from '../../Context/StoreContext';

// Mock dependencies
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn()
  }
}));

describe('LoginPopup Component', () => {
  const mockSetShowLogin = vi.fn();
  
  const contextValue = {
    setToken: vi.fn(),
    url: 'http://localhost:4000',
    loadCartData: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <StoreContext.Provider value={contextValue}>
        <LoginPopup setShowLogin={mockSetShowLogin} />
      </StoreContext.Provider>
    );
    
    // Check if the component renders with Sign Up as default state
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    
    // Check if form elements exist
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    // Check if the button exists
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
    
    // Check if the login link exists
    expect(screen.getByText('Login here')).toBeInTheDocument();
  });

  test('switches between login and signup modes', () => {
    render(
      <StoreContext.Provider value={contextValue}>
        <LoginPopup setShowLogin={mockSetShowLogin} />
      </StoreContext.Provider>
    );
    
    // Initially in Sign Up mode
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    
    // Switch to Login mode
    fireEvent.click(screen.getByText('Login here'));
    
    // Now in Login mode
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument();
    
    // Switch back to Sign Up mode
    fireEvent.click(screen.getByText('Click here'));
    
    // Back in Sign Up mode
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });
});
