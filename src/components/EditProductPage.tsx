// src/components/EditProductPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { productUpdated } from '../store/productsSlice';
import { Product, ProductFormData } from '../types';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const product = useAppSelector(state => 
    state.products.items.find(item => item.id === Number(id))
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<ProductFormData>({
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail
    } : undefined,
    mode: 'onChange'
  });

  const thumbnailUrl = watch('thumbnail');

  const validateImageUrl = (url: string) => {
    if (!url) return 'Image URL is required';
    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(url)) {
      return 'Please enter a valid URL';
    }
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    if (!hasValidExtension) {
      return 'URL should point to an image (jpg, png, gif, webp, svg)';
    }
    return true;
  };

  const validatePrice = (price: number) => {
    if (!price && price !== 0) return 'Price is required';
    if (price < 0.01) return 'Price must be at least $0.01';
    if (price > 1000000) return 'Price cannot exceed $1,000,000';
    return true;
  };

  const validateTitle = (title: string) => {
    if (!title.trim()) return 'Product title is required';
    if (title.length < 2) return 'Title must be at least 2 characters';
    if (title.length > 100) return 'Title must be less than 100 characters';
    return true;
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters';
    if (description.length > 1000) return 'Description must be less than 1000 characters';
    return true;
  };

  const validateBrand = (brand: string) => {
    if (!brand.trim()) return 'Brand is required';
    if (brand.length < 2) return 'Brand must be at least 2 characters';
    if (brand.length > 50) return 'Brand must be less than 50 characters';
    return true;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price.toFixed(2)),
      brand: data.brand.trim(),
      category: data.category,
      thumbnail: data.thumbnail.trim(),
      images: [data.thumbnail.trim()]
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(productUpdated(updatedProduct));
    
    alert(`Product "${data.title}" updated successfully!`);
    navigate(`/products/${product.id}`);
  };

  const categories = [
    'smartphones',
    'laptops',
    'fragrances',
    'skincare',
    'groceries',
    'home-decoration',
    'furniture',
    'tops',
    'womens-dresses',
    'womens-shoes',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'womens-watches',
    'womens-bags',
    'womens-jewellery',
    'sunglasses',
    'automotive',
    'motorcycle',
    'lighting'
  ];

  const formatCategoryName = (category: string) => {
    return category.split('-').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!product) {
    return (
      <div className="container text-center">
        <div className="error">
          <h2>Product not found</h2>
          <p>The product you're trying to edit doesn't exist.</p>
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

  return (
    <div className="container">
      <div className="create-product-form">
        <div className="form-header">
          <h2>Edit Product</h2>
          <p className="form-subtitle">Update the product information below</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex-column gap-20">
          
          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="title" className="form-label">
                Product Title *
              </label>
              <span className="char-counter">
                {watch('title')?.length || 0}/100
              </span>
            </div>
            <input
              type="text"
              id="title"
              {...register('title', { validate: validateTitle })}
              className={`form-control ${errors.title ? 'error' : watch('title') ? 'success' : ''}`}
              placeholder="Enter product title"
            />
            {errors.title && (
              <span className="form-error">⚠️ {errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <span className="char-counter">
                {watch('description')?.length || 0}/1000
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              {...register('description', { validate: validateDescription })}
              className={`form-control ${errors.description ? 'error' : watch('description') ? 'success' : ''}`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <span className="form-error">⚠️ {errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price ($) *
            </label>
            <div className="price-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0.01"
                {...register('price', { 
                  valueAsNumber: true, 
                  validate: validatePrice 
                })}
                className={`form-control ${errors.price ? 'error' : watch('price') ? 'success' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <span className="form-error">⚠️ {errors.price.message}</span>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="brand" className="form-label">
                Brand *
              </label>
              <span className="char-counter">
                {watch('brand')?.length || 0}/50
              </span>
            </div>
            <input
              type="text"
              id="brand"
              {...register('brand', { validate: validateBrand })}
              className={`form-control ${errors.brand ? 'error' : watch('brand') ? 'success' : ''}`}
              placeholder="Enter brand name"
            />
            {errors.brand && (
              <span className="form-error">⚠️ {errors.brand.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              {...register('category', { required: 'Please select a category' })}
              className={`form-control ${errors.category ? 'error' : watch('category') ? 'success' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((category: string) => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="form-error">⚠️ {errors.category.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail" className="form-label">
              Image URL *
            </label>
            <input
              type="url"
              id="thumbnail"
              {...register('thumbnail', { validate: validateImageUrl })}
              className={`form-control ${errors.thumbnail ? 'error' : watch('thumbnail') ? 'success' : ''}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail && (
              <span className="form-error">⚠️ {errors.thumbnail.message}</span>
            )}
            
            {thumbnailUrl && !errors.thumbnail && (
              <div className="image-preview">
                <span className="image-preview-label">Image Preview:</span>
                <img 
                  src={thumbnailUrl} 
                  alt="Preview" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary w-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating Product...
                </>
              ) : (
                'Update Product'
              )}
            </button>
            
            <div className="action-buttons">
              <button
                type="button"
                onClick={() => navigate(`/products/${product.id}`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-outline"
              >
                Back to Products
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;