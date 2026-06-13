import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeContext';
import { StockBadge } from './StockBadge';

const renderBadge = (props) =>
  render(<ThemeProvider><StockBadge {...props} /></ThemeProvider>);

describe('<StockBadge>', () => {
  it('shows "Agotado" when stock is 0', () => {
    renderBadge({ stock: 0, minStock: 5 });
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  it('shows "Stock bajo" at or below the minimum', () => {
    renderBadge({ stock: 4, minStock: 5 });
    expect(screen.getByText('Stock bajo')).toBeInTheDocument();
  });

  it('shows "En stock" above the minimum', () => {
    renderBadge({ stock: 50, minStock: 5 });
    expect(screen.getByText('En stock')).toBeInTheDocument();
  });
});
