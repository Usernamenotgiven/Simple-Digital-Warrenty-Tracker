import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = '?';
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}&`;
      if (status) query += `status=${status}&`;
      
      const res = await api.get(`/products${query}`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, status]);

  return (
    <div className="container">
      <div className="flex justify-between align-center mb-2">
        <h2>My Products</h2>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      <div className="card filters">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select 
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Appliance">Appliance</option>
          <option value="Furniture">Furniture</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Other">Other</option>
        </select>

        <select 
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center mt-2">Loading...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-3">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card text-center mt-2">
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
