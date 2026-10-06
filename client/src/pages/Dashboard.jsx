import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (!stats) return <div className="container">Error loading dashboard</div>;

  const total = stats.totalProducts || 1; // avoid div by zero
  const activePercent = (stats.activeCount / total) * 100;
  const expiringPercent = (stats.expiringSoonCount / total) * 100;
  const expiredPercent = (stats.expiredCount / total) * 100;

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1rem', color: '#3498db' }}>Hi, {user?.name} 👋</h2>
      <div className="flex justify-between align-center mb-2">
        <h2>Dashboard</h2>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      {stats.expiringSoonCount > 0 && (
        <div className="alert-box">
          <strong>Warning:</strong> You have {stats.expiringSoonCount} product(s) with warranties expiring in less than 30 days.
        </div>
      )}

      <div className="grid grid-cols-4 mb-2">
        <div className="card stat-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="card stat-card">
          <h3>Active Warranties</h3>
          <p style={{ color: '#2ecc71' }}>{stats.activeCount}</p>
        </div>
        <div className="card stat-card">
          <h3>Expiring Soon</h3>
          <p style={{ color: '#f1c40f' }}>{stats.expiringSoonCount}</p>
        </div>
        <div className="card stat-card">
          <h3>Expired</h3>
          <p style={{ color: '#e74c3c' }}>{stats.expiredCount}</p>
        </div>
      </div>

      <div className="card mb-2">
        <h3>Warranty Status Overview</h3>
        <div className="status-bar">
          <div className="status-bar-active" style={{ width: `${activePercent}%` }} title="Active"></div>
          <div className="status-bar-expiring" style={{ width: `${expiringPercent}%` }} title="Expiring Soon"></div>
          <div className="status-bar-expired" style={{ width: `${expiredPercent}%` }} title="Expired"></div>
        </div>
        <div className="flex justify-between" style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
          <span>Active ({stats.activeCount})</span>
          <span>Expiring Soon ({stats.expiringSoonCount})</span>
          <span>Expired ({stats.expiredCount})</span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3>Service Requests</h3>
          <div className="flex justify-between mb-1">
            <span>Open Requests: <strong>{stats.openServiceRequests}</strong></span>
            <span>Total Cost: <strong>${stats.totalServiceCost}</strong></span>
          </div>
          {stats.recentServiceRequests.length > 0 ? (
            <table style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Issue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentServiceRequests.map(req => (
                  <tr key={req._id}>
                    <td>{req.productId?.name}</td>
                    <td>{req.issue}</td>
                    <td>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No recent service requests.</p>
          )}
          <div className="mt-2 text-center">
            <Link to="/services">View All Requests</Link>
          </div>
        </div>

        <div className="card">
          <h3>Expiring Soon List</h3>
          {stats.expiringSoonList.length > 0 ? (
            <ul>
              {stats.expiringSoonList.map(prod => (
                <li key={prod._id} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #eee' }}>
                  <div className="flex justify-between">
                    <strong>{prod.name}</strong>
                    <span style={{ color: '#e67e22' }}>{prod.daysRemaining} days left</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                    Ends: {new Date(prod.warrantyEndDate).toLocaleDateString()}
                  </div>
                  <Link to={`/products/${prod._id}`} style={{ fontSize: '0.85rem' }}>View Details</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products expiring soon.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
