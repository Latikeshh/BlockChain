import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { dialog } from "../../components/CustomDialog";
import "./VerifiedStudents.css";

export default function VerifiedStudents() {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [storingBlock, setStoringBlock] = useState(false);
  const [storedStudents, setStoredStudents] = useState([]);

  useEffect(() => {
    /* FETCH VERIFIED STUDENTS */
    const fetchVerified = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/verified", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerified();
  }, [token]);

  /* CHECK IF STUDENT HAS ALL 6 SEMS */
  const hasAllSems = (student) => {
    return student.sem1 && student.sem2 && student.sem3 &&
      student.sem4 && student.sem5 && student.sem6;
  };

  /* HANDLE STORE TO BLOCKCHAIN */
  const handleStoreToBlock = async (studentFormId) => {
    if (storingBlock) return;

    dialog.confirm(
      "Store to Blockchain",
      "Are you sure you want to store this verified student data in the blockchain? This action cannot be undone.",
      async () => {
        setStoringBlock(true);
        try {
          const res = await fetch("http://localhost:8000/api/savebydatabase", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ studentId: studentFormId }),
          });

          const data = await res.json();

          if (res.ok) {
            setStoredStudents([...storedStudents, studentFormId]);
            dialog.success("Success", "Student data stored in blockchain successfully!");

            // Remove the stored student from the local list
            setStudents(students.filter(s => s._id !== studentFormId));

            setShowInfoModal(false);
            setSelectedStudent(null);
          } else {
            dialog.error("Error", data.message || "Failed to store data in blockchain");
          }
        } catch (err) {
          dialog.error("Server Error", "Unable to connect to server. Please try again.");
        } finally {
          setStoringBlock(false);
        }
      },
      "Store",
      "Cancel"
    );
  };

  /* HANDLE VIEW STUDENT */
  const handleViewStudent = async (student) => {
    try {
      // Check if student data exists in blockchain
      let studentData = null;
      let isFromBlockchain = false;

      const blockRes = await fetch(
        `http://localhost:8000/api/student/enroll/${student.enroll}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.student) {
          // Student is stored in blockchain, use blockchain data
          studentData = blockData.student;
          isFromBlockchain = true;

          // Track that this student is stored in blockchain
          if (!storedStudents.includes(student._id)) {
            setStoredStudents([...storedStudents, student._id]);
          }
        }
      }

      // If not in blockchain, use database data
      if (!studentData) {
        studentData = student;
        isFromBlockchain = false;
      }

      // Set the student data in state
      setSelectedStudent({
        ...studentData,
        _id: student._id,
        formId: student._id,
        isFromBlockchain: isFromBlockchain,
      });

      setShowInfoModal(true);
    } catch (err) {
      // On error, still show the database data
      setSelectedStudent({
        ...student,
        _id: student._id,
        formId: student._id,
        isFromBlockchain: false,
      });
      setShowInfoModal(true);
    }
  };

  /* FILTERED LIST */
  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="verified-container">
      {/* HEADER */}
      <div className="verified-header">
        <div className="header-content">
          <h2>Verified Students</h2>
          <p>List of all approved students</p>
        </div>

        <input
          className="search-input"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="verified-table-card">
          <table className="verified-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Student Name</th>
                <th>Enrollment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No Verified Students Found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.enroll}</td>
                    <td>
                      <span className="badge-verified">Verified</span>
                    </td>
                    <td>
                      <button
                        className="btn-verify"
                        onClick={() => handleViewStudent(s)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* STUDENT INFO MODAL */}
      <Modal
        show={showInfoModal}
        onHide={() => {
          setShowInfoModal(false);
          setSelectedStudent(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="header-themed">
          <Modal.Title>Student Information</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedStudent && (
            <div className="profile-form">
              {/* Photo Section */}
              {selectedStudent.photo && (
                <div className="photo-section">
                  <div className="photo-preview">
                    <img
                      src={`http://localhost:8000/uploads/${selectedStudent.photo}`}
                      alt="Student"
                    />
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="section-card modal-section">
                <h5 className="section-title">Basic Information</h5>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Name</label>
                    <p>{selectedStudent.name}</p>
                  </div>
                  <div className="form-group">
                    <label>Enrollment</label>
                    <p>{selectedStudent.enroll}</p>
                  </div>
                  {selectedStudent.branch && (
                    <div className="form-group">
                      <label>Branch</label>
                      <p>{selectedStudent.branch}</p>
                    </div>
                  )}
                  {selectedStudent.year && (
                    <div className="form-group">
                      <label>Year</label>
                      <p>{selectedStudent.year}</p>
                    </div>
                  )}
                  {selectedStudent.dob && (
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <p>{new Date(selectedStudent.dob).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedStudent.gender && (
                    <div className="form-group">
                      <label>Gender</label>
                      <p>{selectedStudent.gender}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="section-card modal-section">
                <h5 className="section-title">Contact Information</h5>
                <div className="form-grid">
                  {selectedStudent.phone && (
                    <div className="form-group">
                      <label>Phone Number</label>
                      <p>{selectedStudent.phone}</p>
                    </div>
                  )}
                  {selectedStudent.email && (
                    <div className="form-group">
                      <label>Email Address</label>
                      <p>{selectedStudent.email}</p>
                    </div>
                  )}
                  {selectedStudent.address && (
                    <div className="form-group full-width">
                      <label>Address</label>
                      <p>{selectedStudent.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guardian Details */}
              <div className="section-card modal-section">
                <h5 className="section-title">Guardian Details</h5>
                <div className="form-grid">
                  {selectedStudent.fatherName && (
                    <div className="form-group">
                      <label>Father's Name</label>
                      <p>{selectedStudent.fatherName}</p>
                    </div>
                  )}
                  {selectedStudent.motherName && (
                    <div className="form-group">
                      <label>Mother's Name</label>
                      <p>{selectedStudent.motherName}</p>
                    </div>
                  )}
                  {selectedStudent.parentPhone && (
                    <div className="form-group">
                      <label>Parent's Contact</label>
                      <p>{selectedStudent.parentPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Performance */}
              <div className="section-card modal-section">
                <h5 className="section-title">Academic Performance (Semester Marks %)</h5>
                <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  {["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"].map((sem, idx) =>
                    (selectedStudent[sem] || selectedStudent[sem] === 0) && (
                      <div className="form-group" key={sem}>
                        <label>Semester {idx + 1}</label>
                        <p>{selectedStudent[sem]}%</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {!selectedStudent.isFromBlockchain && !storedStudents.includes(selectedStudent._id) && (
                <div className="store-block-action mt-3">
                  <Button
                    className="btn-store-block"
                    onClick={() => handleStoreToBlock(selectedStudent._id)}
                    variant="success"
                    disabled={storingBlock}
                  >
                    {storingBlock ? "Storing..." : "Secure"}
                  </Button>
                  <p className="store-block-note">Click to store student data in blockchain for secure verification.</p>
                </div>
              )}

              {/* {storedStudents.includes(selectedStudent._id) && (
                <div className="stored-indicator mt-3">
                  <span className="badge badge-success">✓ Stored in Blockchain</span>
                </div>
              )} */}

              {/* Data Source Indicator */}
              {storedStudents.includes(selectedStudent._id) && selectedStudent.isFromBlockchain ? (
                <div className="stored-indicator mt-2">
                  <span className="badge badge-success">✓ Data from Blockchain</span>
                </div>
              ) : (
                <div className="stored-indicator mt-2">
                  <span className="badge badge-warning">⚠ Data from Database (Not in Blockchain)</span>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowInfoModal(false);
            setSelectedStudent(null);
          }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
