'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import ClassSelector from './functions/ClassSelector';
import './css/Full.css';

interface Activity {
  name: string;
  date: string;
  part?: string;
}

interface Student {
  id?: string;
  name: string;
  participatedActivities?: Activity[];
}

interface ClassItem {
  id: string;
  name: string;
  parts?: string[];
  students?: Student[];
  activities?: Activity[];
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const AddActivity: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [classData, setClassData] = useState<ClassItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [activityType, setActivityType] = useState<'global' | 'student'>('global');

  const [globalActivityName, setGlobalActivityName] = useState<string>('');
  const [globalActivityDate, setGlobalActivityDate] = useState<string>('');
  const [globalActivityPart, setGlobalActivityPart] = useState<string>('');

  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [studentActivityName, setStudentActivityName] = useState<string>('');
  const [studentActivityDate, setStudentActivityDate] = useState<string>('');

  useEffect(() => {
    if (selectedClass && selectedClass.id) {
      const fetchClassData = async () => {
        setLoading(true);
        setError('');
        try {
          const response = await fetch(`${BASE_URL}/api/classes/${selectedClass.id}`);
          if (!response.ok) throw new Error('Error fetching class data');
          const data: ClassItem = await response.json();
          setClassData(data);
          if (data.parts?.length) setGlobalActivityPart(data.parts[0]);
        } catch (err) {
          console.error(err);
          setError('Failed to load class data');
        } finally {
          setLoading(false);
        }
      };
      fetchClassData();
    }
  }, [selectedClass]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classData) {
      setMessage('Please select a class and ensure its data is loaded.');
      return;
    }

    const updatedGlobalActivities = classData.activities ? [...classData.activities] : [];
    const updatedStudents = classData.students ? [...classData.students] : [];

    if (activityType === 'global') {
      updatedGlobalActivities.push({
        name: globalActivityName,
        date: globalActivityDate,
        part: globalActivityPart,
      });
    } else {
      const newActivity: Activity = { name: studentActivityName, date: studentActivityDate };
      if (updatedStudents[selectedStudentIndex].participatedActivities) {
        updatedStudents[selectedStudentIndex].participatedActivities!.push(newActivity);
      } else {
        updatedStudents[selectedStudentIndex].participatedActivities = [newActivity];
      }
    }

    const updatedClass: ClassItem = {
      ...classData,
      activities: updatedGlobalActivities,
      students: updatedStudents,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/classes/${selectedClass?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClass),
      });
      if (!response.ok) throw new Error('Failed to update class');

      setClassData(updatedClass);
      setGlobalActivityName('');
      setGlobalActivityDate('');
      setStudentActivityName('');
      setStudentActivityDate('');
      setMessage('Activity added successfully!');
      if (classData.parts?.length) {
        setGlobalActivityPart(classData.parts[0]);
      } else {
        setGlobalActivityPart('');
      }
    } catch (err) {
      console.error(err);
      setError('Error adding activity');
    }
  };

  return (
    <div className="add-activity-container">
      <div className="class-selector">
        <ClassSelector
          onSelect={(cls: ClassItem) => {
            setSelectedClass(cls);
            setClassData(null);
          }}
        />
      </div>

      {loading && <p>Loading class data...</p>}
      {error && <p className="error">{error}</p>}

      {classData && (
        <div className="class-details-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Activity Type:</label>
              <select
                value={activityType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setActivityType(e.target.value as 'global' | 'student')
                }
              >
                <option value="global">CU Activity</option>
                <option value="student">FCU Activity</option>
              </select>
            </div>

            {activityType === 'global' && (
              <div className="global-activity-form">
                <div className="form-group">
                  <label htmlFor="globalActivityPart">Select Part:</label>
                  {classData.parts?.length ? (
                    <select
                      id="globalActivityPart"
                      value={globalActivityPart}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setGlobalActivityPart(e.target.value)
                      }
                      required
                    >
                      {classData.parts.map((part) => (
                        <option key={part} value={part}>
                          {part}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p>No parts available for this CU.</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="globalActivityName">Activity Name:</label>
                  <input
                    type="text"
                    id="globalActivityName"
                    value={globalActivityName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setGlobalActivityName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="globalActivityDate">Date:</label>
                  <input
                    type="date"
                    id="globalActivityDate"
                    value={globalActivityDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setGlobalActivityDate(e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            )}

            {activityType === 'student' && (
              <div className="student-activity-form">
                <div className="form-group">
                  <label htmlFor="studentSelect">Select FCU:</label>
                  <select
                    id="studentSelect"
                    value={selectedStudentIndex}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      setSelectedStudentIndex(parseInt(e.target.value))
                    }
                  >
                    {classData.students?.map((student, index) => (
                      <option key={student.id || index} value={index}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="studentActivityName">Activity Name:</label>
                  <input
                    type="text"
                    id="studentActivityName"
                    value={studentActivityName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStudentActivityName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentActivityDate">Date:</label>
                  <input
                    type="date"
                    id="studentActivityDate"
                    value={studentActivityDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStudentActivityDate(e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn submit-btn">
              Add Activity
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      )}

      {/* Replace navigate with Link */}
      <Link href="/list-class">
        <button className="btn back-btn">Back to CU List</button>
      </Link>
    </div>
  );
};

export default AddActivity;
