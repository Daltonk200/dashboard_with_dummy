import React, { useState, useEffect } from 'react';
import { Product, initialProductState } from '../ProductManagementPage';

// DummyJSON API inspired categories as fallback
const FALLBACK_CATEGORIES = [
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

interface ProductFormProps {
  product: Product | null;
  categories: string[];
  onSave: (product: Omit<Product, 'id'> & { id?: number }) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  categories, 
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'> & { id?: number }>(
    product || initialProductState
  );
  
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use provided categories or fallback to predefined list if empty
  const availableCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.thumbnail);
    } else {
      setFormData(initialProductState);
      setImagePreview('');
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (['price', 'stock', 'discountPercentage', 'rating'].includes(name)) {
      setFormData({
        ...formData,
        [name]: name === 'discountPercentage' || name === 'rating' 
          ? parseFloat(value) || 0 
          : parseInt(value, 10) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        thumbnail: 'Please upload an image file'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData(prev => ({
        ...prev,
        thumbnail: result,
        images: [...prev.images, result]
      }));
      
      // Clear error if exists
      if (errors.thumbnail) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.thumbnail;
          return newErrors;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.thumbnail && !imagePreview) {
      newErrors.thumbnail = 'Product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving product:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to save product. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Title */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Product Title*
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Product title"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs italic">{errors.title}</p>
                )}
              </div>

              {/* Product Brand */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                  Brand*
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.brand ? 'border-red-500' : ''
                  }`}
                  id="brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Brand name"
                  disabled={isSubmitting}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs italic">{errors.brand}</p>
                )}
              </div>

              {/* Product Category */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category*
                </label>
                <select
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.category ? 'border-red-500' : ''
                  }`}
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs italic">{errors.category}</p>
                )}
              </div>

              {/* Product Price */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price*
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.price ? 'border-red-500' : ''
                  }`}
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">{errors.price}</p>
                )}
              </div>

              {/* Product Stock */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                  Stock*
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.stock ? 'border-red-500' : ''
                  }`}
                  id="stock"
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={isSubmitting}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs italic">{errors.stock}</p>
                )}
              </div>

              {/* Discount Percentage */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discountPercentage">
                  Discount Percentage
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="0.0"
                  disabled={isSubmitting}
                />
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                  Rating
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="0.0"
                  disabled={isSubmitting}
                />
              </div>

              {/* Product Description */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description*
                </label>
                <textarea
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  rows={4}
                  disabled={isSubmitting}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs italic">{errors.description}</p>
                )}
              </div>

              {/* Product Thumbnail */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="thumbnail">
                  Product Image*
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.thumbnail ? 'border-red-500' : ''
                    }`}
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({
                            ...prev,
                            thumbnail: '',
                            images: prev.images.filter(img => img !== prev.thumbnail)
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {errors.thumbnail && (
                  <p className="text-red-500 text-xs italic">{errors.thumbnail}</p>
                )}
              </div>
            </div>

            {/* General Error Message */}
            {errors.submit && (
              <div className="mb-4 text-red-500 text-center">{errors.submit}</div>
            )}

            {/* Form Buttons */}
            <div className="flex items-center justify-end gap-4 mt-6">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  product ? 'Update Product' : 'Add Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;