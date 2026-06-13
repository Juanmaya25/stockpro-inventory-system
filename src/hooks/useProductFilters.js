import { useMemo, useState } from 'react';
import { filterProducts, sortProducts } from '../utils/inventory';

/** Search, category filter and column sorting for the inventory table. */
export function useProductFilters(products) {
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sortBy, setSortBy]       = useState('name');
  const [sortDir, setSortDir]     = useState('asc');

  const filteredProducts = useMemo(
    () => sortProducts(filterProducts(products, { search, category: catFilter }), sortBy, sortDir),
    [products, search, catFilter, sortBy, sortDir],
  );

  const sortToggle = (key) => {
    if (sortBy === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
  };

  const resetFilters = () => { setSearch(''); setCatFilter('all'); };

  return { search, setSearch, catFilter, setCatFilter, sortBy, sortDir, sortToggle, filteredProducts, resetFilters };
}
