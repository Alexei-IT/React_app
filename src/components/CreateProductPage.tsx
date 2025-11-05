import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../hooks/redux';
import { productAdded } from '../store/productsSlice';
import { Product, ProductFormData } from '../types';

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
    reset,
    trigger
  } = useForm<ProductFormData>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      brand: '',
      category: '',
      thumbnail: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const thumbnailUrl = watch('thumbnail');
  const titleValue = watch('title');
  const priceValue = watch('price');

  const validateImageUrl = (url: string) => {
    if (!url) return 'Image URL is required';
    
    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(url)) {
      return 'Please enter a valid URL (must start with http:// or https://)';
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
    if (!/^\d+(\.\d{1,2})?$/.test(price.toString())) {
      return 'Price can have up to 2 decimal places';
    }
    return true;
  };

  const validateTitle = (title: string) => {
    if (!title.trim()) return 'Product title is required';
    if (title.length < 2) return 'Title must be at least 2 characters';
    if (title.length > 100) return 'Title must be less than 100 characters';
    
    const specialChars = /[<>{}[\]\\]/;
    if (specialChars.test(title)) {
      return 'Title contains invalid characters';
    }
    
    return true;
  };

  const validateDescription = (description: string) => {
    if (!description.trim()) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters';
    if (description.length > 1000) return 'Description must be less than 1000 characters';
    
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 3) return 'Description should have at least 3 words';
    
    return true;
  };

  const validateBrand = (brand: string) => {
    if (!brand.trim()) return 'Brand is required';
    if (brand.length < 2) return 'Brand must be at least 2 characters';
    if (brand.length > 50) return 'Brand must be less than 50 characters';
    
    return true;
  };

  const onSubmit = async (data: ProductFormData) => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    const newProduct: Product = {
      id: Date.now(),
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price.toFixed(2)),
      discountPercentage: 0,
      rating: 0,
      stock: 100,
      brand: data.brand.trim(),
      category: data.category,
      thumbnail: data.thumbnail.trim(),
      images: [data.thumbnail.trim()],
      liked: false
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch(productAdded(newProduct));
    
    alert(`Product "${data.title}" created successfully!`);
    reset();
    navigate('/products');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all fields?')) {
      reset();
    }
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
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const descriptionLength = watch('description')?.length || 0;
  const titleLength = watch('title')?.length || 0;
  const brandLength = watch('brand')?.length || 0;

  return (
    <div className="container">
      <div className="create-product-form">
        <div className="form-header">
          <h2>Create New Product</h2>
          <p className="form-subtitle">Fill in the details below to add a new product to the catalog</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex-column gap-20">
          
          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="title" className="form-label">
                Product Title *
              </label>
              <span className="char-counter">
                {titleLength}/100
              </span>
            </div>
            <input
              type="text"
              id="title"
              {...register('title', {
                validate: validateTitle
              })}
              className={`form-control ${errors.title ? 'error' : !titleValue ? '' : 'success'}`}
              placeholder="Enter product title (e.g., iPhone 15 Pro Max)"
            />
            {errors.title ? (
              <span className="form-error">
                ⚠️ {errors.title.message}
              </span>
            ) : titleValue && (
              <span className="form-success">✓ Good product title</span>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <span className="char-counter">
                {descriptionLength}/1000
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                validate: validateDescription
              })}
              className={`form-control ${errors.description ? 'error' : !watch('description') ? '' : 'success'}`}
              placeholder="Describe the product features, benefits, and key specifications..."
            />
            {errors.description ? (
              <span className="form-error">
                ⚠️ {errors.description.message}
              </span>
            ) : watch('description') && descriptionLength >= 10 && (
              <span className="form-success">
                ✓ Good description ({Math.ceil(descriptionLength / 10)} words)
              </span>
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
                className={`form-control ${errors.price ? 'error' : !priceValue ? '' : 'success'}`}
                placeholder="0.00"
              />
            </div>
            {errors.price ? (
              <span className="form-error">
                ⚠️ {errors.price.message}
              </span>
            ) : priceValue && priceValue > 0 && (
              <span className="form-success">
                ✓ Valid price: ${priceValue.toFixed(2)}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="form-label-wrapper">
              <label htmlFor="brand" className="form-label">
                Brand *
              </label>
              <span className="char-counter">
                {brandLength}/50
              </span>
            </div>
            <input
              type="text"
              id="brand"
              {...register('brand', {
                validate: validateBrand
              })}
              className={`form-control ${errors.brand ? 'error' : !watch('brand') ? '' : 'success'}`}
              placeholder="Enter brand name (e.g., Apple, Samsung, Nike)"
            />
            {errors.brand ? (
              <span className="form-error">
                ⚠️ {errors.brand.message}
              </span>
            ) : watch('brand') && (
              <span className="form-success">✓ Valid brand name</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category *
            </label>
            <select
              id="category"
              {...register('category', {
                required: 'Please select a category'
              })}
              className={`form-control ${errors.category ? 'error' : !watch('category') ? '' : 'success'}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
            {errors.category ? (
              <span className="form-error">
                ⚠️ {errors.category.message}
              </span>
            ) : watch('category') && (
              <span className="form-success">
                ✓ {formatCategoryName(watch('category'))}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="thumbnail" className="form-label">
              Image URL *
            </label>
            <input
              type="url"
              id="thumbnail"
              {...register('thumbnail', {
                validate: validateImageUrl
              })}
              className={`form-control ${errors.thumbnail ? 'error' : !thumbnailUrl ? '' : 'success'}`}
              placeholder="https://example.com/product-image.jpg"
            />
            {errors.thumbnail ? (
              <span className="form-error">
                ⚠️ {errors.thumbnail.message}
              </span>
            ) : thumbnailUrl && (
              <span className="form-success">✓ Valid image URL</span>
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

          <div className="form-stats">
            <div className="stat-item">
              <span className="stat-label">Fields completed:</span>
              <span className="stat-value">
                {Object.values(watch()).filter(val => val && val.toString().length > 0).length} / 6
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Form status:</span>
              <span className={`stat-value ${isValid ? 'valid' : 'invalid'}`}>
                {isValid ? 'Ready to submit' : 'Needs attention'}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary w-50"
              disabled={isSubmitting || !isValid || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
            
            <div className="action-buttons">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline"
                disabled={!isDirty}
              >
                Clear Form
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;