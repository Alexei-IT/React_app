import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProducts, selectFilteredProducts } from '../store/productsSlice';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { useNavigate } from 'react-router-dom';

const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector(state => state.products);
  const products = useAppSelector(selectFilteredProducts);
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  let content: React.ReactNode;

  if (status === 'loading') {
    content = <div className="loading">🔄 Loading products...</div>;
  } else if (status === 'succeeded') {
    content = (
      <>
        <div className="products-info">
          <p>Showing {products.length} products</p>
        </div>
        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </>
    );
  } else if (status === 'failed') {
    content = <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="flex-between align-center">
          <h1>Products</h1>
          <div className="header-actions">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              {showFilters ? '🙈 Hide Filters' : '🔍 Show Filters'}
            </button>
            <button
              onClick={() => navigate('/create-product')}
              className="btn btn-success"
            >
              ➕ Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="products-layout">
        {showFilters && (
          <aside className="filters-sidebar">
            <ProductFilters />
          </aside>
        )}
        
        <main className={`products-main ${showFilters ? 'with-filters' : ''}`}>
          {content}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;