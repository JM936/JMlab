import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const mockSearch = jest.fn();
  const mockSetTerm = jest.fn();

  beforeEach(() => {
    render(
      <Navbar 
        searchTerm="" 
        setSearchTerm={mockSetTerm} 
        onSearch={mockSearch} 
      />
    );
  });

  it('renders search input', () => {
    expect(screen.getByPlaceholderText('Buscar ensaios ou artigos...')).toBeInTheDocument();
  });

  it('calls onSearch when button clicked', () => {
    fireEvent.click(screen.getByText('Buscar'));
    expect(mockSearch).toHaveBeenCalled();
  });

  it('updates search term on input change', () => {
    const input = screen.getByPlaceholderText('Buscar ensaios ou artigos...');
    fireEvent.change(input, { target: { value: 'concreto' } });
    expect(mockSetTerm).toHaveBeenCalledWith('concreto');
  });
});