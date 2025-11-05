// src/components/ProductFilters.tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { 
  filterChanged, 
  priceRangeChanged, 
  categoryFilterChanged, 
  searchQueryChanged,
  filtersReset,
  selectUniqueCategories 
} from '../store/productsSlice';

const ProductFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filter, priceRange, categoryFilter, searchQuery } = useAppSelector(state => state.products);
  const categories = useAppSelector(selectUniqueCategories);
  const products = useAppSelector(state => state.products.items);

  const minPrice = 0;
  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(priceRangeChanged([min, max]));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(categoryFilterChanged(category));
  };

  const handleSearchChange = (query: string) => {
    dispatch(searchQueryChanged(query));
  };

  const handleResetFilters = () => {
    dispatch(filtersReset());
  };

  const areFiltersActive = 
    priceRange[0] > minPrice || 
    priceRange[1] < maxPrice || 
    categoryFilter !== 'all' || 
    searchQuery.trim() !== '';

  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h3>Filters</h3>
        {areFiltersActive && (
          <button 
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="filter-group">
        <label className="filter-label">Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="form-control"
          placeholder="Search products..."
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Show</label>
        <div className="filter-buttons">
          <button 
            onClick={() => dispatch(filterChanged('all'))}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Products
          </button>
          <button 
            onClick={() => dispatch(filterChanged('favorites'))}
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
          >
            ❤️ Favorites
          </button>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-control"
        >
          {categories.map((category: string) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          Price Range: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
        </label>
        <div className="price-range">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="1"
            value={priceRange[0]}
            onChange={(e) => handlePriceRangeChange(Number(e.target.value), priceRange[1])}
            className="price-slider"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="1"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange(priceRange[0], Number(e.target.value))}
            className="price-slider"
          />
        </div>
        <div className="price-labels">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;