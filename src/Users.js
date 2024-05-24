import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Users.css'; // Import the CSS file for styling

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(updatedUsers);
    });
    return () => unsubscribe();
  }, []);

  const updateUserPrivilege = async (userId, newPrivilege) => {
    console.log("User ID:", userId);
    console.log("New Privilege:", newPrivilege);
    try {
      await setDoc(doc(db, 'users', userId), { privilege: newPrivilege }, { merge: true });
      console.log('User privilege updated successfully.');
    } catch (error) {
      console.error('Error updating user privilege:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/'); // Navigate to the main dashboard page
  };

  return (
    <div className="admin-panel">
      <h1>Privilege Management</h1>
      <button className="back-to-dashboard" onClick={handleBackClick}>Back to Dashboard</button>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Privilege</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.privilege}
                  onChange={(e) => updateUserPrivilege(user.id, e.target.value)}
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
