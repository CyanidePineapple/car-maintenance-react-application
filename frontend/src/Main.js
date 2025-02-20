import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Main = () => {
  const [parts, setParts] = useState([]);
  const [name, setName] = useState('');
  const [dateAcquired, setDateAcquired] = useState('');
  const [replacementDate, setReplacementDate] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/parts', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => setParts(response.data));
    }
  }, [token]);

  const addPart = async () => {
    await axios.post('http://localhost:5000/api/parts', { name, date_acquired: dateAcquired, replacement_date: replacementDate }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setName('');
    setDateAcquired('');
    setReplacementDate('');
    // Refresh parts list
    const response = await axios.get('http://localhost:5000/api/parts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setParts(response.data);
  };

  return (
    <div>
      <h1>Car Maintenance</h1>
      <div>
        <input type="text" placeholder="Part Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="date" value={dateAcquired} onChange={(e) => setDateAcquired(e.target.value)} />
        <input type="date" value={replacementDate} onChange={(e) => setReplacementDate(e.target.value)} />
        <button onClick={addPart}>Add Part</button>
      </div>
      <ul>
        {parts.map((part) => (
          <li key={part.id}>
            {part.name} - Added: {part.date_acquired} - Replace by: {part.replacement_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;