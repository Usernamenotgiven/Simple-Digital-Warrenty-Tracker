import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editCost, setEditCost] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await api.get('/services');
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleEditClick = (req) => {
    setEditingId(req._id);
    setEditStatus(req.status);
    setEditCost(req.cost || 0);
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/services/${id}`, { status: editStatus, cost: editCost });
      setEditingId(null);
      fetchRequests();
    } catch (error) {
      alert('Failed to update');
    }
  };

  const filteredRequests = statusFilter 
    ? requests.filter(r => r.status === statusFilter)
    : requests;

  return (
    <div className="container">
      <div className="flex justify-between align-center mb-2">
        <h2>Service Requests</h2>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Requested">Requested</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filteredRequests.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Issue</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req._id}>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/products/${req.productId?._id}`}>
                      {req.productId?.name}
                    </Link>
                  </td>
                  <td>{req.issue}</td>
                  <td>
                    {editingId === req._id ? (
                      <select className="form-control" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                        <option value="Requested">Requested</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span className="badge badge-active">{req.status}</span>
                    )}
                  </td>
                  <td>
                    {editingId === req._id ? (
                      <input type="number" className="form-control" value={editCost} onChange={e => setEditCost(e.target.value)} min="0" style={{ width: '80px' }} />
                    ) : (
                      `$${req.cost}`
                    )}
                  </td>
                  <td>
                    {editingId === req._id ? (
                      <div className="flex gap-1">
                        <button className="btn btn-success btn-sm" onClick={() => handleUpdate(req._id)}>Save</button>
                        <button className="btn btn-sm" onClick={() => setEditingId(null)} style={{ background: '#eee' }}>Cancel</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(req)}>Update</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No service requests found.</div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequests;
