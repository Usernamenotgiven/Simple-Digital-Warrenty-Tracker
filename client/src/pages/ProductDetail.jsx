import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Request form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [issue, setIssue] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      const [prodRes, srvRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/services/product/${id}`)
      ]);
      setProduct(prodRes.data);
      setServices(srvRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? All associated service requests will also be deleted.')) {
      try {
        await api.delete(`/products/${id}`);
        navigate('/products');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleRequestService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', { productId: id, issue, notes });
      setShowRequestForm(false);
      setIssue('');
      setNotes('');
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to create request');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!product) return <div className="container">Product not found.</div>;

  return (
    <div className="container">
      <div className="flex justify-between align-center mb-2">
        <div className="flex align-center gap-1">
          <Link to="/products" className="btn" style={{ background: '#eee', padding: '0.5rem 1rem' }}>&larr; Back</Link>
          <h2 style={{ margin: 0 }}>{product.name}</h2>
          <StatusBadge status={product.warrantyStatus} />
        </div>
        <div className="flex gap-1">
          <Link to={`/products/edit/${product._id}`} className="btn btn-primary">Edit</Link>
          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3>Product Details</h3>
          <table style={{ marginTop: '1rem' }}>
            <tbody>
              <tr><th>Brand</th><td>{product.brand}</td></tr>
              <tr><th>Model</th><td>{product.model || '-'}</td></tr>
              <tr><th>Serial No</th><td>{product.serialNo || '-'}</td></tr>
              <tr><th>Category</th><td>{product.category}</td></tr>
              <tr><th>Seller</th><td>{product.seller || '-'}</td></tr>
              <tr><th>Invoice No</th><td>{product.invoiceNo || '-'}</td></tr>
              <tr><th>Price</th><td>{product.price ? `$${product.price}` : '-'}</td></tr>
            </tbody>
          </table>
          {product.notes && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Notes:</strong>
              <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{product.notes}</p>
            </div>
          )}
        </div>

        <div className="flex" style={{ flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3>Warranty Information</h3>
            <div style={{ marginTop: '1rem' }}>
              <p className="mb-1"><strong>Purchase Date:</strong> {new Date(product.purchaseDate).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Duration:</strong> {product.warrantyMonths} months</p>
              <p className="mb-1"><strong>End Date:</strong> {new Date(product.warrantyEndDate).toLocaleDateString()}</p>
              
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: product.warrantyStatus === 'Expired' ? '#f8d7da' : '#f8f9fa',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                {product.warrantyStatus !== 'Expired' ? (
                  <>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: product.warrantyStatus === 'Active' ? '#2ecc71' : '#f1c40f' }}>
                      {product.daysRemaining}
                    </span>
                    <p>days remaining</p>
                  </>
                ) : (
                  <p style={{ fontWeight: 'bold', color: '#721c24' }}>Warranty has expired</p>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between align-center mb-1">
              <h3 style={{ margin: 0 }}>Service History</h3>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowRequestForm(!showRequestForm)}
              >
                {showRequestForm ? 'Cancel' : 'Raise Request'}
              </button>
            </div>

            {showRequestForm && (
              <form onSubmit={handleRequestService} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Issue Description *</label>
                  <input type="text" className="form-control" value={issue} onChange={e => setIssue(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)} rows="2"></textarea>
                </div>
                <button type="submit" className="btn btn-success btn-sm">Submit Request</button>
              </form>
            )}

            {services.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {services.map(srv => (
                  <div key={srv._id} style={{ borderLeft: '4px solid #3498db', paddingLeft: '1rem', background: '#f9f9f9', padding: '0.75rem' }}>
                    <div className="flex justify-between mb-1">
                      <strong>{srv.issue}</strong>
                      <span className="badge badge-active">{srv.status}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      Requested: {new Date(srv.requestDate).toLocaleDateString()}
                    </p>
                    {srv.status === 'Completed' && (
                      <p style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                        Completed: {new Date(srv.completedDate).toLocaleDateString()} | Cost: ${srv.cost}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No service requests found for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
