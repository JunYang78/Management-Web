'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import ClassSelector from './functions/ClassSelector'
import './css/Full.css';

interface ClassItem {
  id: string;
  name: string;
  // Add any other properties for a class if needed
}

interface Student {
  id?: string;
  name: string;
  participatedActivities: string[]; // Adjust type as needed
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const AddStudent: React.FC = () => {
  // State for selected class from ClassSelector
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  
  // State for existing FCUs (students) for the selected CU (class)
  const [existingFCUs, setExistingFCUs] = useState<Student[]>([]);

  // New student state (name and activities)
  const [newStudent, setNewStudent] = useState<Student>({
    name: '',
    participatedActivities: [],
  });
  
  // Message for feedback (success/error)
  const [message, setMessage] = useState<string>('');

  // Fetch existing FCUs when selectedClass changes
  useEffect(() => {
    const fetchFCUs = async () => {
      if (selectedClass) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/classes/${selectedClass.id}/students`
          );
          if (!response.ok) {
            throw new Error('Error fetching FCUs');
          }
          const data: Student[] = await response.json();
          setExistingFCUs(data);
        } catch (error) {
          console.error(error);
          setExistingFCUs([]);
        }
      }
    };

    fetchFCUs();
  }, [selectedClass]);

  // Handle saving the new student (sending update to the server)
  const handleSaveStudent = async () => {
    if (!selectedClass) {
      setMessage('Please select a class.');
      return;
    }
    if (!newStudent.name.trim()) {
      setMessage('Student name is required.');
      return;
    }
    const studentData = {
      name: newStudent.name.trim(),
      participatedActivities: newStudent.participatedActivities,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/classes/${selectedClass.id}/students`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        }
      );
      if (!response.ok) {
        throw new Error('Error adding student');
      }
      await response.json();
      setMessage('FCU added successfully');
      // Clear fields for next entry
      setNewStudent({ name: '', participatedActivities: [] });
      // Optionally, re-fetch the FCU list after adding a new one
      const updatedResponse = await fetch(
        `${BASE_URL}/api/classes/${selectedClass.id}/students`
      );
      const updatedData: Student[] = await updatedResponse.json();
      setExistingFCUs(updatedData);
    } catch (error) {
      console.error(error);
      setMessage('Failed to add FCU');
    }
  };

  return (
    <div className="add-student-container">
      
      {/* Class Selector */}
      <div className="class-selector">
        <ClassSelector onSelect={(cls: ClassItem) => setSelectedClass(cls)} />
      </div>

      {/* Section for displaying existing FCUs for the selected CU */}
      {selectedClass && (
        <div className="existing-fcus-section">
          <h3 className="student-name">Existing FCUs</h3>
          {existingFCUs.length > 0 ? (
            <ul>
              {existingFCUs.map((fcu, index) => (
                <li key={fcu.id || index}> - {fcu.name}</li>
              ))}
            </ul>
          ) : (
            <p>No FCUs found for this CU.</p>
          )}
        </div>
      )}
      
      {/* FCU (Student) Details Form */}
      {selectedClass && (
        <div className="student-details-card">
          <form>
            <div className="form-group">
              <label>FCU Name:</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                required
              />
            </div>
            
            <button type="button" className="btn submit-btn" onClick={handleSaveStudent}>
              Save FCU
            </button>
          </form>
        </div>
      )}
      
      {message && <p className="message">{message}</p>}
      
      <Link href="/list-class">
        <button className="btn back-btn">Back to CU List</button>
      </Link>
    </div>
  );
};

export default AddStudent;
