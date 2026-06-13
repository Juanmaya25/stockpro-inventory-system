import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../test/utils';
import { Sales } from './Sales';

const noop = vi.fn();

const sales = [
  { id: 1, date: '2026-04-30', product: 'Laptop', client: 'ABC', qty: 1, total: 300, method: 'Tarjeta' },
  { id: 2, date: '2026-04-29', product: 'Mouse',  client: 'XYZ', qty: 2, total: 100, method: 'Efectivo' },
];

describe('<Sales>', () => {
  it('renders the transaction count and rows', () => {
    renderWithTheme(<Sales sales={sales} monthlySales={400} onExport={noop} onAdd={noop} onDelete={noop} />);
    expect(screen.getByText('2 transacciones registradas')).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });

  it('computes the average ticket from the sales total', () => {
    // total 400 / 2 sales = 200 average ticket
    renderWithTheme(<Sales sales={sales} monthlySales={400} onExport={noop} onAdd={noop} onDelete={noop} />);
    expect(screen.getByText('$200')).toBeInTheDocument();
  });
});
