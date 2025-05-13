import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Cart from './Cart';
import { StoreContext } from '../../Context/StoreContext';

// Mock the StoreContext
const mockContextValue = {
  getTotalCartAmount: vi.fn().mockReturnValue(150),
  currency: '₹',
  deliveryCharge: 50,
  cartItems: {
    '1': 2, // 2 quantities of item with id '1'
    '2': 1  // 1 quantity of item with id '2'
  },
  food_list: [
    {
      _id: '1',
      name: 'Greek Salad',
      image: 'greek-salad.jpg',
      price: 50,
      description: 'Fresh Greek salad with feta cheese',
      category: 'Salad'
    },
    {
      _id: '2',
      name: 'Pasta',
      image: 'pasta.jpg',
      price: 50,
      description: 'Delicious pasta with tomato sauce',
      category: 'Pasta'
    }
  ],
  removeFromCart: vi.fn(),
  addToCart: vi.fn(),
  token: 'mock-token'
};

// Create a wrapper component with the required providers
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <StoreContext.Provider value={mockContextValue}>
      {children}
    </StoreContext.Provider>
  </BrowserRouter>
);

describe('Cart Component', () => {
  it('renders cart items correctly', () => {
    render(<Cart />, { wrapper: TestWrapper });
    
    // Check if cart items are displayed
    expect(screen.getByText(/greek salad/i)).toBeInTheDocument();
    expect(screen.getByText(/pasta/i)).toBeInTheDocument();
    
    // Check if quantities are displayed correctly
    expect(screen.getAllByText('2')).toBeTruthy();
    expect(screen.getAllByText('1')).toBeTruthy();
  });

  it('displays correct total amount', () => {
    render(<Cart />, { wrapper: TestWrapper });
    
    // Check if subtotal is displayed correctly (150)
    expect(screen.getByText(`${mockContextValue.currency}150`)).toBeInTheDocument();
    
    // Check if delivery charge is displayed
    expect(screen.getByText(`${mockContextValue.currency}${mockContextValue.deliveryCharge}`)).toBeInTheDocument();
    
    // Check if total amount is displayed correctly (150 + 50 = 200)
    expect(screen.getByText(`${mockContextValue.currency}200`)).toBeInTheDocument();
  });

  it('calls addToCart when + button is clicked', () => {
    render(<Cart />, { wrapper: TestWrapper });
    
    // Find and click the + button for an item
    const addButtons = screen.getAllByRole('button', { name: /\+/i });
    fireEvent.click(addButtons[0]);
    
    // Check if addToCart was called with the correct item id
    expect(mockContextValue.addToCart).toHaveBeenCalledWith('1');
  });

  it('calls removeFromCart when - button is clicked', () => {
    render(<Cart />, { wrapper: TestWrapper });
    
    // Find and click the - button for an item
    const removeButtons = screen.getAllByRole('button', { name: /\-/i });
    fireEvent.click(removeButtons[0]);
    
    // Check if removeFromCart was called with the correct item id
    expect(mockContextValue.removeFromCart).toHaveBeenCalledWith('1');
  });

  it('navigates to checkout when proceed button is clicked', () => {
    render(<Cart />, { wrapper: TestWrapper });
    
    // Find and click the proceed to checkout button
    const proceedButton = screen.getByText(/proceed to checkout/i);
    expect(proceedButton).toBeInTheDocument();
    
    // We can't easily test navigation in this setup, but we can check the button exists
    expect(proceedButton.closest('a')).toHaveAttribute('href', '/order');
  });
});