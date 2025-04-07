'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import './css/Full.css';

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const AddClass: React.FC = () => {
  // CU details
  const [className, setClassName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // CU Parts (stored as strings)
  const [cuParts, setCuParts] = useState<string[]>([]);
  const [newPart, setNewPart] = useState<string>(''); // newPart is a string
  
  const [message, setMessage] = useState<string>('');

  // Save a new CU Part
  const savePart = () => {
    const trimmedPart = newPart.trim();
    if (trimmedPart && !cuParts.includes(trimmedPart)) {
      setCuParts([...cuParts, trimmedPart]);
      setNewPart('');
    }
  };

  // Handle submission of new CU to the server
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const classData = {
      name: className,
      description,
      parts: cuParts, // parts are saved as an array of strings
    };
    console.log('Sending data:', classData);
    try {
      const response = await fetch(`${BASE_URL}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData),
      });
      if (!response.ok) {
        throw new Error('Error adding CU');
      }
      await response.json();
      setMessage('CU added successfully');
      // Clear all fields after successful submit
      setClassName('');
      setDescription('');
      setCuParts([]);
    } catch (error) {
      console.error(error);
      setMessage('Failed to add CU');
    }
  };

  return (
    <div className="add-class-container">
      <div>
        <form onSubmit={handleSubmit}>
          {/* CU Details */}
          <fieldset className="section">
            <legend className="student-name">CU Details</legend>
            <div className="form-group">
              <label>CU Name:</label>
              <input
                type="text"
                value={className}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setClassName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Location: </label>
              <input
                type="text"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                required
              />
            </div>
          </fieldset>

          {/* CU Parts */}
          <fieldset className="section">
            <legend className="student-name">CU Parts</legend>
            <div className="form-group">
              <label>Part Name: </label>
              <input
                type="text"
                value={newPart}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPart(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn add-activity-btn"
              onClick={savePart}
            >
              Add Part
            </button>
            {cuParts.length > 0 && (
              <div className="activities-list-container">
                <h5>CU Parts:</h5>
                <ul className="activities-list">
                  {cuParts.map((part, idx) => (
                    <li key={part + idx}>{part}</li>
                  ))}
                </ul>
              </div>
            )}
          </fieldset>
          <button type="submit" className="btn submit-btn">
              Add CU
            </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
      <Link href="/list-class">
        <button className="btn back-btn">Back to CU List</button>
      </Link>
    </div>
  );
};

export default AddClass;
