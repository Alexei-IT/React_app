import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/products' && location.pathname === '/');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="flex align-center gap-20">
          <Link 
            to="/products" 
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            📦 All Products
          </Link>
          <Link 
            to="/create-product" 
            className={`nav-link ${isActive('/create-product') ? 'active' : ''}`}
          >
            ➕ Create Product
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;