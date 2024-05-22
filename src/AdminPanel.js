
import React, { useEffect, useState } from 'react';
import { getAllHotels, updateHotel } from './firebase'; // Import the necessary Firebase functions
import './AdminPanel.css';

function AdminPanel() {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    link: '',
    rating: ''
  });

  useEffect(() => {
    // Fetch all hotels when component mounts
    getAllHotels().then((data) => {
      setHotels(data);
    });
  }, []);

  // Function to handle editing of a hotel
  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({ ...hotel }); // Set form data to the selected hotel's data
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHotel) {
      // Remove the 'id' field from the formData object
      const { id, ...updatedData } = formData;
      updateHotel(editingHotel.id, updatedData).then(() => {
        // Once update is successful, clear editing state
        setEditingHotel(null);
        setFormData({
          name: '',
          price: '',
          address: '',
          link: '',
          rating: ''
        });
      });
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Address</th>
            <th>Website</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.price}</td>
              <td>{hotel.address}</td>
              <td><a href={hotel.link} target="_blank" rel="noopener noreferrer">{hotel.link}</a></td>
              <td>{hotel.rating}</td>
              <td>
                <button onClick={() => handleEdit(hotel)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingHotel && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
          <input type="text" name="link" value={formData.link} onChange={handleChange} placeholder="Website" />
          <input type="text" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;