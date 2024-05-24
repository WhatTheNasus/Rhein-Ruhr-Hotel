import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import './UserManagement.css'; // Create this file by copying styles from AdminPanel.css and adjusting as needed
import { useAuth } from './AuthContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    privilege: 'client'
  });
  const { currentUser, userPrivilege } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || userPrivilege !== 'admin') {
      navigate('/');
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'login'), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
    });
    return () => unsubscribe();
  }, [currentUser, navigate, userPrivilege]);

  const handleBackClick = () => {
    navigate('/'); // Navigate to the main dashboard page
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      privilege: user.privilege
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateDoc(doc(db, 'login', 'users'), { [editingUser.id]: formData });
        setEditingUser(null);
      } else {
        await setDoc(doc(db, 'login', 'users', formData.email), formData);
      }
      setFormData({
        email: '',
        privilege: 'client'
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'login', 'users', userId));
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      privilege: 'client'
    });
  };

  return (
    <div className="user-management-panel">
      <h1>User Management</h1>
      <button className="back-to-dashboard" onClick={handleBackClick}>Back to Dashboard</button>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Privilege</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.privilege}</td>
              <td className="actions">
                <button className="table-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="table-button delete" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          
          <label className="form-label" htmlFor="privilege">Privilege</label>
          <select id="privilege" name="privilege" value={formData.privilege} onChange={handleChange} required>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          
          <div>
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserManagement;