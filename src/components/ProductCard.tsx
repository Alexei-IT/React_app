import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { productDeleted, productToggled } from '../store/productsSlice';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(productToggled(product.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(productDeleted(product.id));
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <button 
        onClick={handleDelete}
        className="btn btn-danger"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          fontSize: '16px',
          zIndex: 1
        }}
        title="Delete product"
      >
        ×
      </button>

      <img 
        src={product.thumbnail} 
        alt={product.title}
        className="product-card-image"
      />
      
      <h3 className="product-card-title">{product.title}</h3>
      
      <p className="product-card-description">
        {product.description}
      </p>
      
      <div className="product-card-footer">
        <div className="product-card-price">${product.price}</div>
        <button 
          onClick={handleLike}
          className="btn"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            padding: '4px'
          }}
          title={product.liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          {product.liked ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;