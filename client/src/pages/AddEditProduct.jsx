import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNo: '',
    category: 'Other',
    purchaseDate: '',
    warrantyMonths: 12,
    price: '',
    seller: '',
    invoiceNo: '',
    notes: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data;
          setFormData({
            ...p,
            purchaseDate: p.purchaseDate ? p.purchaseDate.split('T')[0] : ''
          });
        } catch (err) {
          setError('Failed to fetch product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, formData);
        navigate(`/products/${id}`);
      } else {
        await api.post('/products', formData);
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="container">
      <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input type="text" className="form-control" name="brand" value={formData.brand} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input type="text" className="form-control" name="model" value={formData.model} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Serial Number</label>
              <input type="text" className="form-control" name="serialNo" value={formData.serialNo} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" name="category" value={formData.category} onChange={handleChange}>
                <option value="Electronics">Electronics</option>
                <option value="Appliance">Appliance</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Purchase Date *</label>
              <input type="date" className="form-control" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Warranty Duration (Months) *</label>
              <input type="number" className="form-control" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Purchase Price</label>
              <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Seller / Retailer</label>
              <input type="text" className="form-control" name="seller" value={formData.seller} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Invoice Number</label>
              <input type="text" className="form-control" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" name="notes" value={formData.notes} onChange={handleChange} rows="3"></textarea>
          </div>

          <div className="flex gap-1 mt-2">
            <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Product' : 'Save Product'}</button>
            <button type="button" className="btn" onClick={() => navigate(-1)} style={{ background: '#eee' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
