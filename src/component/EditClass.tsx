"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import "./css/EditClass.css";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface Activity {
  name: string;
  date: string;
  part?: string;
}

interface Student {
  name: string;
  participatedActivities?: Activity[];
}

const EditClass: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [globalActivities, setGlobalActivities] = useState<Activity[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parts, setParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editGlobalModal, setEditGlobalModal] = useState({
    show: false,
    index: null as number | null,
    name: "",
    date: "",
    part: "",
  });

  const [editStudentModal, setEditStudentModal] = useState({
    show: false,
    studentIndex: null as number | null,
    name: "",
    participatedActivities: [] as Activity[],
  });

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/classes/${id}`);
        if (!response.ok) throw new Error("Failed to fetch class");
        const data = await response.json();
        setClassName(data.name);
        setDescription(data.description);
        setGlobalActivities(data.activities || []);
        setStudents(data.students || []);
        setParts(data.parts || []);
      } catch (err) {
        console.error(err);
        setError("Error loading class");
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  const updateClassOnServer = async (updatedObj: any = {}) => {
    const updatedClass = {
      name: className,
      description,
      activities: globalActivities,
      students,
      parts,
      ...updatedObj,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!response.ok) throw new Error("Error updating class");
    } catch (error) {
      console.error(error);
      setError("Failed to update class on server");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-class-container">
      <h2>Edit {className}</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <fieldset className="section">
          <legend>CU Details</legend>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                updateClassOnServer({ name: e.target.value });
              }}
            />
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                updateClassOnServer({ description: e.target.value });
              }}
            />
          </div>
        </fieldset>

        <fieldset className="section">
          <legend>CU Parts</legend>
          {parts.length > 0 ? (
            parts.map((part) => {
              const partActivities = globalActivities.filter((act) => act.part === part);
              return (
                <div key={part} className="part-group">
                  <h4>{part}</h4>
                  {partActivities.length > 0 ? (
                    <ul className="list">
                      {partActivities.map((act, idx) => (
                        <li
                          key={`${act.name}-${act.date}-${idx}`}
                          className="list-item"
                          onClick={() =>
                            setEditGlobalModal({
                              show: true,
                              index: globalActivities.findIndex(
                                (a) => a.name === act.name && a.date === act.date && a.part === act.part
                              ),
                              name: act.name,
                              date: act.date,
                              part: act.part || "",
                            })
                          }
                        >
                          {act.name} — {formatDate(act.date)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No activities for {part}.</p>
                  )}
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setEditGlobalModal({ show: true, index: null, name: "", date: "", part })
                    }
                  >
                    Add Activity for {part}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No parts defined.</p>
          )}
        </fieldset>

        <fieldset className="section">
          <legend>FCUs</legend>
          {students.length > 0 ? (
            <ul className="list">
              {students.map((student, sIdx) => (
                <li
                  key={`${student.name}-${sIdx}`}
                  className="list-item"
                  onClick={() =>
                    setEditStudentModal({
                      show: true,
                      studentIndex: sIdx,
                      name: student.name,
                      participatedActivities: student.participatedActivities || [],
                    })
                  }
                >
                  <strong>{student.name}</strong>
                  {(student.participatedActivities ?? []).length > 0 && (
                    <ul className="nested-list">
                      {student.participatedActivities!.map((act, aIdx) => (
                        <li key={`${act.name}-${act.date}-${aIdx}`}>{act.name} — {formatDate(act.date)}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No FCUs available.</p>
          )}
        </fieldset>
      </div>

      <Link href="/list-class">
        <button className="btn back-btn">Back</button>
      </Link>

      {/* Global Modal */}
      {editGlobalModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editGlobalModal.index === null ? "Add CU Activity" : "Edit CU Activity"}</h3>
            <div className="form-group">
              <label>Activity Name:</label>
              <input
                type="text"
                value={editGlobalModal.name}
                onChange={(e) => setEditGlobalModal({ ...editGlobalModal, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Activity Date:</label>
              <input
                type="date"
                value={editGlobalModal.date}
                onChange={(e) => setEditGlobalModal({ ...editGlobalModal, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Activity Part:</label>
              <input
                type="text"
                value={editGlobalModal.part}
                onChange={(e) => setEditGlobalModal({ ...editGlobalModal, part: e.target.value })}
              />
            </div>
            <div className="button-group">
              <button
                type="button"
                className="btn submit-btn"
                onClick={async () => {
                  const updated = [...globalActivities];
                  const newActivity = {
                    name: editGlobalModal.name,
                    date: editGlobalModal.date,
                    part: editGlobalModal.part,
                  };
                  if (editGlobalModal.index === null) {
                    updated.push(newActivity);
                  } else {
                    updated[editGlobalModal.index] = newActivity;
                  }
                  setGlobalActivities(updated);
                  setEditGlobalModal({ show: false, index: null, name: "", date: "", part: "" });
                  await updateClassOnServer({ activities: updated });
                }}
              >
                Save
              </button>
              {editGlobalModal.index !== null && (
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this activity?")) {
                      const updated = globalActivities.filter((_, i) => i !== editGlobalModal.index);
                      setGlobalActivities(updated);
                      setEditGlobalModal({ show: false, index: null, name: "", date: "", part: "" });
                      await updateClassOnServer({ activities: updated });
                    }
                  }}
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                className="btn"
                onClick={() => setEditGlobalModal({ show: false, index: null, name: "", date: "", part: "" })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {editStudentModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit FCU</h3>
            <div className="form-group">
              <label>FCU Name:</label>
              <input
                type="text"
                value={editStudentModal.name}
                onChange={(e) => setEditStudentModal({ ...editStudentModal, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Activities:</label>
              {editStudentModal.participatedActivities.map((activity, idx) => (
                <div key={idx} className="fcu-activity">
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => {
                      const updated = [...editStudentModal.participatedActivities];
                      updated[idx].name = e.target.value;
                      setEditStudentModal({ ...editStudentModal, participatedActivities: updated });
                    }}
                    placeholder="Activity Name"
                  />
                  <input
                    type="date"
                    value={activity.date}
                    onChange={(e) => {
                      const updated = [...editStudentModal.participatedActivities];
                      updated[idx].date = e.target.value;
                      setEditStudentModal({ ...editStudentModal, participatedActivities: updated });
                    }}
                  />
                  <button
                    type="button"
                    className="btn delete-btn"
                    onClick={() => {
                      const updated = editStudentModal.participatedActivities.filter((_, i) => i !== idx);
                      setEditStudentModal({ ...editStudentModal, participatedActivities: updated });
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const updated = [...editStudentModal.participatedActivities, { name: "", date: "" }];
                  setEditStudentModal({ ...editStudentModal, participatedActivities: updated });
                }}
              >
                Add Activity
              </button>
            </div>
            <div className="button-group">
              <button
                type="button"
                className="btn submit-btn"
                onClick={async () => {
                  const updated = [...students];
                  updated[editStudentModal.studentIndex!] = {
                    name: editStudentModal.name,
                    participatedActivities: editStudentModal.participatedActivities,
                  };
                  setStudents(updated);
                  setEditStudentModal({ show: false, studentIndex: null, name: "", participatedActivities: [] });
                  await updateClassOnServer({ students: updated });
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn delete-btn"
                onClick={async () => {
                  const updated = students.filter((_, i) => i !== editStudentModal.studentIndex);
                  setStudents(updated);
                  setEditStudentModal({ show: false, studentIndex: null, name: "", participatedActivities: [] });
                  await updateClassOnServer({ students: updated });
                }}
              >
                Delete FCU
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  setEditStudentModal({ show: false, studentIndex: null, name: "", participatedActivities: [] })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditClass;