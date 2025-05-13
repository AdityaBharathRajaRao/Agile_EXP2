import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Add from './Add';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Add Component', () => {
  it('renders the form correctly', () => {
    render(<Add />);
    
    // Check for form elements - using the actual text in the component
    const nameLabel = screen.getByText(/product name/i);
    expect(nameLabel).toBeInTheDocument();
    expect(screen.getByText(/product description/i)).toBeInTheDocument();
    expect(screen.getByText(/product price/i)).toBeInTheDocument();
    expect(screen.getByText(/product category/i)).toBeInTheDocument();
    expect(screen.getByText(/add$/i)).toBeInTheDocument();
  });

  it('shows error when form is submitted without image', async () => {
    render(<Add />);
    
    // Fill form data - using name attribute instead of label text
    fireEvent.change(screen.getByPlaceholderText(/type here/i), { target: { value: 'Test Food' } });
    fireEvent.change(screen.getByPlaceholderText(/write content here/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByPlaceholderText(/25/i), { target: { value: '9.99' } });
    
    // Submit form without image
    fireEvent.click(screen.getByText(/add$/i));
    
    // Check if error toast was called
    expect(toast.error).toHaveBeenCalledWith('Image not selected');
  });
});
