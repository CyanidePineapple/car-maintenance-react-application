import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  // State variables
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      axios.get('/api/parts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setParts(response.data))
      .catch((error) => console.error('Error fetching parts:', error));
    }
  }, [token, navigate]);

  const [parts, setParts] = useState([]);
  const [name, setName] = useState('');
  const [dateAcquired, setDateAcquired] = useState('');
  const [replacementDate, setReplacementDate] = useState('');
  

  // Get the token from AuthContext
  const { token } = useAuth();

  // Fetch parts when the component mounts or the token changes
  useEffect(() => {
    if (token) {
      axios.get('/api/parts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setParts(response.data))
      .catch((error) => console.error('Error fetching parts:', error));
    }
  }, [token]);

  // Function to add a new part
  const addPart = async () => {
    try {
      await axios.post(
        '/api/parts',
        { name, date_acquired: dateAcquired, replacement_date: replacementDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Clear the form
      setName('');
      setDateAcquired('');
      setReplacementDate('');

      // Refresh the parts list
      const response = await axios.get('/api/parts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParts(response.data);
    } catch (error) {
      console.error('Error adding part:', error);
    }
  };

  // Function to delete a part
  const deletePart = async (id) => {
    try {
      await axios.delete(`/api/parts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh the parts list
      const response = await axios.get('/api/parts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParts(response.data);
    } catch (error) {
      console.error('Error deleting part:', error);
    }
  };

  return (
    <div>
      <h1>Car Maintenance</h1>

      {/* Form to add a new part */}
      <div>
        <input
          type="text"
          placeholder="Part Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          value={dateAcquired}
          onChange={(e) => setDateAcquired(e.target.value)}
        />
        <input
          type="date"
          value={replacementDate}
          onChange={(e) => setReplacementDate(e.target.value)}
        />
        <button onClick={addPart}>Add Part</button>
      </div>

      {/* List of parts */}
      <ul>
        {parts.map((part) => (
          <li key={part.id}>
            <strong>{part.name}</strong>
            <br />
            Added: {new Date(part.date_acquired).toLocaleDateString()}
            <br />
            Replace by: {new Date(part.replacement_date).toLocaleDateString()}
            <br />
            <button onClick={() => deletePart(part.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
