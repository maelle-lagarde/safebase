import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddDbModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    user: "",
    host: "",
    name: "",
    password: "",
    port: "",
    type: "MySql",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/databases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la base de données');
      }

      const data = await response.json();
      console.log('Base de données ajoutée:', data);
      toast.success('Base de données ajoutée avec succès!');

      setFormData({
        user: "",
        host: "",
        name: "",
        password: "",
        port: "",
        type: "MySql",
      });

      onClose();

    } catch (err) {
      console.error('Erreur:', err.message);
      toast.error('Erreur lors de l\'ajout de la base de données');
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add database</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-add-db">
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              placeholder="user"
            />
          </div>
          <div className="input-add-db">
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleChange}
              required
              placeholder="host"
            />
          </div>
          <div className="input-add-db">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="name"
            />
          </div>
          <div className="input-add-db">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="password"
            />
          </div>
          <div className="input-add-db">
            <input
              type="text"
              name="port"
              value={formData.port}
              onChange={handleChange}
              required
              placeholder="port"
            />
          </div>
          <div className="input-add-db">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              placeholder="type"
            >
              <option value="MySql">MySQL</option>
              <option value="Postgres">PostgreSQL</option>
            </select>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button type="submit" id="save-btn">save</button>
            <button type="button" id="cancel-btn" onClick={onClose} style={{ marginLeft: "10px" }}>
            cancel
            </button>
          </div>
        </form>
        <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
        />
      </div>
    </div>
  );
}
