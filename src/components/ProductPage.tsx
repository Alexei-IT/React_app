import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { productToggled } from '../store/productsSlice';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const product = useAppSelector(state => 
    state.products.items.find(item => item.id === Number(id))
  );

  // Состояние для текущего выбранного изображения
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Функция для смены главного изображения
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Функция для лайка
  const handleLike = () => {
    if (product) {
      dispatch(productToggled(product.id));
    }
  };

  const handleNextImage = () => {
    if (product) {
      setCurrentImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setCurrentImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (!product) {
    return (
      <div className="container text-center">
        <div className="error">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary mt-20"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Получаем текущее изображение для отображения
  const currentImage = product.images[currentImageIndex] || product.thumbnail;

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/products')}
        className="btn btn-secondary mb-20"
      >
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-gallery">
          <div style={{ position: 'relative' }}>
            <img 
              src={currentImage} 
              alt={product.title}
              className="product-main-image"
            />
            
            {product.images.length > 1 && (
              <>
                <div className="image-counter">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
                
                <button
                  onClick={handlePrevImage}
                  className="btn btn-secondary"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    opacity: 0.8
                  }}
                >
                  ‹
                </button>
                
                <button
                  onClick={handleNextImage}
                  className="btn btn-secondary"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    opacity: 0.8
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${product.title} ${index + 1}`}
                  className={`product-thumbnail ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="text-gray">{product.description}</p>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Price:</strong> 
              <span>${product.price}</span>
            </div>
            {product.discountPercentage > 0 && (
              <div className="meta-item">
                <strong>Discount:</strong>
                <span style={{ color: '#28a745' }}>
                  {product.discountPercentage}% OFF
                </span>
              </div>
            )}
            <div className="meta-item">
              <strong>Brand:</strong>
              <span>{product.brand}</span>
            </div>
            <div className="meta-item">
              <strong>Category:</strong>
              <span>{product.category}</span>
            </div>
            <div className="meta-item">
              <strong>Rating:</strong>
              <span>⭐ {product.rating}/5</span>
            </div>
            <div className="meta-item">
              <strong>Stock:</strong>
              <span style={{ 
                color: product.stock > 0 ? '#28a745' : '#dc3545'
              }}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Блок с лайком - теперь кликабельный */}
          <div 
            className="card favorite-section"
            style={{ 
              padding: '16px', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={handleLike}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
            }}
          >
            <div className="flex align-center gap-10">
              <span 
                style={{ 
                  fontSize: '24px',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {product.liked ? '❤️' : '🤍'}
              </span>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {product.liked ? 'Added to favorites' : 'Add to favorites'}
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                  Click to {product.liked ? 'remove from' : 'add to'} favorites
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="product-actions">
            <button
              onClick={() => navigate(`/edit-product/${product.id}`)}
              className="btn btn-primary"
            >
              ✏️ Edit Product
            </button>
            
            <button
              onClick={handleLike}
              className={`btn ${product.liked ? 'btn-secondary' : 'btn-primary'}`}
            >
              {product.liked ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;