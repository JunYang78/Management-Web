'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './css/ListClass.css';

interface ClassItem {
  id: string;
  name: string;
  // Add any other properties your class might have
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const Listclass: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/classes`);
        if (!response.ok) {
          throw new Error('Error fetching classes');
        }
        const data: ClassItem[] = await response.json();
        setClasses(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch classes.');
      }
    };

    fetchClasses();
  }, []);

  // Function to handle deletion of a class
  const handleDelete = async (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent navigation when deleting
    const confirmed = window.confirm('Are you sure you want to delete this class?');
    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/api/classes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete class');
      }
      setClasses((prev) => prev.filter((classItem) => classItem.id !== id));
    } catch (error) {
      console.error(error);
      setError('Failed to delete class.');
    }
  };

  // Clicking a list item directs to the edit page
  const handleClick = (id: string) => {
    router.push(`/edit-class/${id}`);
  };

  return (
    <div className="edit-class-container">
      <Link href="/searcher" className="no-underline">
        <button className="btn back-btn">Back</button>
      </Link>
      <h1>CU List</h1>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <div className="button-group" style={{ marginBottom: '20px' }}>
          <Link href="/add-class" className="no-underline">
            <button className="btn">Add CU</button>
          </Link>
          <Link href="/add-student" className="no-underline">
            <button className="btn" style={{ marginLeft: '10px' }}>Add FCU</button>
          </Link>
          <Link href="/add-activity" className="no-underline">
            <button className="btn" style={{ marginLeft: '10px' }}>Add Activity</button>
          </Link>
        </div>
        {classes.length > 0 ? (
          <ul className="list">
            {classes.map((classItem) => (
              <li
                key={classItem.id}
                className="list-item"
                onClick={() => handleClick(classItem.id)}
              >
                <div className="list-content">
                  <strong>{classItem.name}</strong>
                </div>
                <button
                  className="btn"
                  onClick={(e) => handleDelete(classItem.id, e)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes found.</p>
        )}
      </div>
    </div>
  );
};

export default Listclass;
