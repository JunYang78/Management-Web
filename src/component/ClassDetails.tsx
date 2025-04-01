'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './css/ClassInfo.css';

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

interface ClassData {
  id: string;
  name: string;
  description: string;
  activities?: Activity[];
  students?: Student[];
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const ClassDetails: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/classes/${id}`);
        if (!response.ok) throw new Error('Failed to fetch class details');
        const data: ClassData = await response.json();
        setClassData(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch class details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClass();
  }, [id]);

  if (loading) return <p className="loading">Loading class details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!classData) return <p className="no-data">No class details available.</p>;

  const groupedActivities: Record<string, Activity[]> = classData.activities
    ? classData.activities.reduce((acc: Record<string, Activity[]>, activity) => {
        const part = activity.part || 'Uncategorized';
        if (!acc[part]) acc[part] = [];
        acc[part].push(activity);
        return acc;
      }, {})
    : {};

  return (
    <div className="class-container">
      <div className="header">
        <h1 className="class-name">{classData.name}</h1>
        <p className="class-description">Location: {classData.description}</p>
      </div>

      <hr className="separator" />

      {/* CU Activities Section */}
      <div className="activities-section">
        <h2>CU Parts</h2>
        <hr />
        {classData.activities && classData.activities.length > 0 ? (
          Object.keys(groupedActivities).map((part, idx) => (
            <div key={idx} className="activity-group">
              <h3>{part}</h3>
              <ul className="activities-list">
                {groupedActivities[part].map((act, index) => (
                  <li key={index}>
                    {act.name} — {formatDate(act.date)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="no-activities">No activities available.</p>
        )}
      </div>

      <hr className="separator" />

      {/* FCU Section */}
      <div className="activities-section">
        <h2>FCUs</h2>
        <hr />
        {classData.students && classData.students.length > 0 ? (
          <div className="students-container">
            {classData.students.map((student, index) => (
              <div key={index} className="activity-group">
                <h3 className="student-name">{student.name}</h3>
                {student.participatedActivities?.length ? (
                  <ul className="activities-list">
                    {student.participatedActivities.map((act, idx) => (
                      <li key={idx}>
                        {act.name} — {formatDate(act.date)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-activities">No activities for this student.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-students">No FCU available.</p>
        )}
      </div>

      <div className="button-group">
        <Link href="/searcher">
          <button className="btn back-btn">Back to Search</button>
        </Link>
      </div>
    </div>
  );
};

export default ClassDetails;
