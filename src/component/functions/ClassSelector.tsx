'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface ClassItem {
  id: string;
  name: string;
  // Add any additional properties if needed
}

interface ClassSelectorProps {
  onSelect?: (cls: ClassItem) => void;
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const ClassSelector: React.FC<ClassSelectorProps> = ({ onSelect }) => {
  const [allClasses, setAllClasses] = useState<ClassItem[]>([]);
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ClassItem[]>([]);
  // Using NodeJS.Timeout to type the timer reference (adjust if needed for your env)
  const blurTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch all classes when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/classes`);
        if (!res.ok) {
          throw new Error('Error fetching classes');
        }
        const data: ClassItem[] = await res.json();
        setAllClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  // Filter suggestions based on input only when text is entered
  useEffect(() => {
    if (input.trim() === '') {
      setSuggestions([]); // Do not show suggestions when empty
      return;
    }
    const lowerInput = input.toLowerCase();
    const filtered = allClasses.filter((cls) =>
      cls.name.toLowerCase().includes(lowerInput)
    );
    setSuggestions(filtered.slice(0, 5));
  }, [input, allClasses]);

  const handleSelect = (cls: ClassItem) => {
    setInput(cls.name);
    setSuggestions([]);
    if (onSelect) {
      onSelect(cls);
    }
  };

  // Clear suggestions on blur after a short delay
  const handleBlur = () => {
    blurTimer.current = setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };

  // Only show default suggestions when input is focused and empty
  const handleFocus = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
    }
    if (input.trim() === '' && allClasses.length > 0) {
      setSuggestions(allClasses.slice(0, 5));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <label className="student-name" style={{ marginRight: '10px' }}>Select CU:</label>
      <input
        type="text"
        placeholder="Search..."
        value={input}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ width: '150px', padding: '4px' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            left: '120px',
            top: '100%',
            width: '150px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            listStyle: 'none',
            margin: 0,
            padding: '5px',
            zIndex: 1000,
            maxHeight: '150px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((cls) => (
            <li
              key={cls.id}
              style={{ padding: '5px', cursor: 'pointer' }}
              onMouseDown={() => handleSelect(cls)}
            >
              {cls.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassSelector;
