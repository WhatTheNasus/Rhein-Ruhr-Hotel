import React, { useEffect, useState } from 'react';
import { getAllHotels, updateHotel, addHotel, deleteHotel } from './firebase';
import './AdminPanel.css';

function AdminPanel() {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [addingHotel, setAddingHotel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    link: '',
    rating: ''
  });

  useEffect(() => {
    if (!currentUser || !currentUser.email.endsWith('@admin.com')) {
      navigate('/signin');
    }
    const unsubscribe = onSnapshot(collection(db, 'hotels'), (snapshot) => {
      const updatedHotels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHotels(updatedHotels);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setAddingHotel(false);
    setFormData({ 
      ...hotel,
      price: hotel.price.toString(),
      rating: hotel.rating.toString()
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    const rating = parseFloat(formData.rating);

    if (isNaN(price)) {
      alert('Please enter a valid number for the price.');
      return;
    }

    if (isNaN(rating)) {
      alert('Please enter a valid number for the rating.');
      return;
    }

    const updatedFormData = {
      ...formData,
      price,
      rating
    };

    if (editingHotel) {
      updateHotel(editingHotel.id, updatedFormData).then(() => {
        setEditingHotel(null);
        setFormData({
          name: '',
          price: '',
          address: '',
          link: '',
          rating: ''
        });
        getAllHotels().then((data) => setHotels(data));
      }).catch((error) => {
        console.error('Error updating hotel:', error);
      });
    } else if (addingHotel) {
      addHotel(updatedFormData).then(() => {
        setAddingHotel(false);
        setFormData({
          name: '',
          price: '',
          address: '',
          link: '',
          rating: ''
        });
        getAllHotels().then((data) => setHotels(data));
      }).catch((error) => {
        console.error('Error adding hotel:', error);
      });
    }
  };

  const handleAddHotelClick = () => {
    setEditingHotel(null);
    setAddingHotel(true);
    setFormData({
      name: '',
      price: '',
      address: '',
      link: '',
      rating: ''
    });
  };

  const handleDelete = (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      deleteHotel(hotelId).then(() => {
        getAllHotels().then((data) => setHotels(data));
      }).catch((error) => {
        console.error('Error deleting hotel:', error);
      });
    }
  };

  const handleCancel = () => {
    setEditingHotel(null);
    setAddingHotel(false);
    setFormData({
      name: '',
      price: '',
      address: '',
      link: '',
      rating: ''
    });
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <button className="table-button add" onClick={handleAddHotelClick}>Add Hotel</button>
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
              <td className="actions">
                <button className="table-button" onClick={() => handleEdit(hotel)}>Edit</button>
                <button className="table-button delete" onClick={() => handleDelete(hotel.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(editingHotel || addingHotel) && (
        <form className="edit-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          
          <label className="form-label" htmlFor="price">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
          
          <label className="form-label" htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
          
          <label className="form-label" htmlFor="link">Website</label>
          <input type="text" id="link" name="link" value={formData.link} onChange={handleChange} required />
          
          <label className="form-label" htmlFor="rating">Rating</label>
          <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} required />
          
          <div>
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;
