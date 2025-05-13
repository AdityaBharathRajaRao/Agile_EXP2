import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Sidebar from './Sidebar/Sidebar';

describe('Sidebar Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    expect(document.body).toBeDefined();
  });

  it('contains navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // Check for Add Items link (not "Add Food")
    const addLink = screen.getByText(/add items/i);
    expect(addLink).toBeInTheDocument();
    
    // Check for List Items link (not "List Food")
    const listLink = screen.getByText(/list items/i);
    expect(listLink).toBeInTheDocument();
    
    // Check for Orders link
    const ordersLink = screen.getByText(/orders/i);
    expect(ordersLink).toBeInTheDocument();
  });
});
