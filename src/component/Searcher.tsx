'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase'; // Make sure this path is correct
import Link from 'next/link';
import './css/Searcher.css';

interface ClassItem {
  id: string;
  name: string;
  description: string;
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const Searcher: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allClasses, setAllClasses] = useState<ClassItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/api/classes`);
        if (!response.ok) throw new Error('Error fetching classes');
        const data: ClassItem[] = await response.json();
        setAllClasses(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch classes.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllClasses();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(allClasses);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = allClasses.filter((classItem) =>
        classItem.name.toLowerCase().includes(lowerSearch)
      );
      setFilteredResults(filtered);
    }
  }, [searchTerm, allClasses]);

  const handleClick = (id: string) => {
    router.push(`/class-details/${id}`);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut(auth);
        router.push('/');
      } catch (err) {
        console.error('Error logging out: ', err);
      }
    }
  };

  return (
    <div className="edit-class-container">
      <button className="btn logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1>Search CUs</h1>
      <div className="card" style={{ padding: '20px' }}>
        <div
          className="search-bar"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
        >
          <div className="form-group" style={{ flexGrow: 1 }}>
            <input
              type="text"
              placeholder="Enter CU name"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              style={{
                height: '40px',
                padding: '0 20px',
                fontSize: '16px',
                margin: '14px 10px 0 10px',
              }}
            />
          </div>
          <Link href="/list-class" className="no-underline">
            <button
              className="btn"
              style={{
                height: '40px',
                fontSize: '16px',
                padding: '0 20px',
                margin: '0 10px',
              }}
            >
              CU List
            </button>
          </Link>
        </div>

        {isLoading && <p>Loading classes...</p>}
        {error && <p className="error">{error}</p>}

        {filteredResults.length > 0 ? (
          <ul className="list">
            {filteredResults.map((classItem) => (
              <li
                key={classItem.id}
                className="list-item"
                onClick={() => handleClick(classItem.id)}
              >
                <div className="list-content">
                  <strong>{classItem.name}</strong>: {classItem.description}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          searchTerm.trim() !== '' && <p>No matching classes found.</p>
        )}
      </div>
    </div>
  );
};

export default Searcher;
