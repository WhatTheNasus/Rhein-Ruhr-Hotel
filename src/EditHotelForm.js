import React, { useState } from 'react';

function EditHotelForm({ hotel, onSubmit, onCancel }) {
  const [name, setName] = useState(hotel.name);
  const [price, setPrice] = useState(hotel.price);
  const [address, setAddress] = useState(hotel.address);
  const [link, setLink] = useState(hotel.link);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedHotel = { ...hotel, name, price, address, link };
    onSubmit(updatedHotel);
  };

  return (
    <div className="edit-hotel-form">
      <h2>Edit Hotel</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label>
          Website:
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditHotelForm;
