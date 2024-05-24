import React, { useEffect, useState } from 'react';
import { getAllHotels, updateHotel, addHotel, deleteHotel, uploadHotelImage } from './firebase';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import { collection, onSnapshot } from 'firebase/firestore';
import './AdminPanel.css';

function AdminPanel() {
  const [hotels, setHotels] = useState([]);
  const [editingHotel, setEditingHotel] = useState(null);
  const [addingHotel, setAddingHotel] = useState(false);
  const { currentUser, setCurrentUser, userPrivilege, setUserPrivilege } = useAuth(); // Get currentUser from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    address: '',
    link: '',
    rating: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!currentUser || userPrivilege != 'admin') {
      navigate('/');
    }
    const unsubscribe = onSnapshot(collection(db, 'hotels'), (snapshot) => {
      const updatedHotels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHotels(updatedHotels);
    });
    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleBackClick = () => {
    navigate('/'); // Navigate to the main dashboard page
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
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
  
    try {
      let hotelId;
  
      if (editingHotel) {
        await updateHotel(editingHotel.id, updatedFormData);
        hotelId = editingHotel.id;
        setEditingHotel(null);
      } else if (addingHotel) {
        const newHotelRef = await addHotel(updatedFormData);
        hotelId = newHotelRef.id;
        console.log('New hotel ID:', hotelId);
  
        // Upload the image file if it exists
        if (imageFile) {
          await uploadHotelImage(hotelId, imageFile);
          console.log(`Uploaded image file to folder: images/${hotelId}/`);
        }
  
        // Close the form after adding the hotel
        setAddingHotel(false);
      }
  
      setFormData({
        name: '',
        price: '',
        address: '',
        link: '',
        rating: ''
      });
      setImageFile(null);
  
      const data = await getAllHotels();
      setHotels(data);
  
    } catch (error) {
      console.error('Error processing hotel:', error);
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

  const handleCancelEdit = () => {
    setEditingHotel(null);
    setAddingHotel(false);
    setFormData({
      name: '',
      price: '',
      address: '',
      link: '',
      rating: ''
    });
    setImageFile(null);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotel(hotelId);
        console.log(`Hotel with ID ${hotelId} deleted`);

        const data = await getAllHotels();
        setHotels(data);

      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <button className="add-hotel" onClick={handleAddHotelClick}>Add Hotel</button>
      <button className="back-to-dashboard" onClick={handleBackClick}>Back to Dashboard</button>
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
          
          <label className="form-label" htmlFor="image">Image</label>
          <input type="file" id="image" name="image" accept="image/jpeg" onChange={handleImageChange} required={addingHotel} />
          
          <div>
            <button type="submit">Save</button>
            <button type="button" className="cancel" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminPanel;