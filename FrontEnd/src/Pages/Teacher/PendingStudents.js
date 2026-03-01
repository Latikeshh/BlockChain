import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { dialog } from "../../components/CustomDialog";
import "./PendingStudents.css";
import StudentInfoDialog from "../../components/StudentInfoDialog";

export default function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // checkboxes track teacher review of each card
  const [sectionChecks, setSectionChecks] = useState({
    basic: false,
    contact: false,
    guardian: false,
    academic: false,
  });

  // reject modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectSections, setRejectSections] = useState({
    basic: false,
    contact: false,
    guardian: false,
    academic: false,
  });
  const [rejectNote, setRejectNote] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/pending", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStudents(data);
        } else {
          setError(data.message || "Failed to fetch students");
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingStudents();
  }, [token]);

  // called when teacher selects a row to inspect
 const handleSelect = async (student) => {
  try {
    const res = await fetch(
      `http://localhost:8000/student/view/${student._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok && data.success) {
      // merge the basic info with decrypted profile; make sure we keep the
      // student's own _id (the form response may include its own _id field)
      setSelectedStudent({
        ...data.data,
        _id: student._id,
        name: student.name,
        enroll: student.enroll,
        status: data.status,
        rejectNote: data.rejectNote,
        rejectSections: data.rejectSections,
      });
      // reset review checkboxes and rejection form
      setSectionChecks({ basic: false, contact: false, guardian: false, academic: false });
      setRejectSections({ basic: false, contact: false, guardian: false, academic: false });
      setRejectNote("");
      setShowInfoModal(true);
    } else {
      dialog.error("Error", data.message);
    }
  } catch (err) {
    dialog.error("Server Error", "Unable to fetch student profile");
  }
};

  // helper toggle for review checkboxes
  const toggleSection = (name) => {
    setSectionChecks((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const allReviewed = Object.values(sectionChecks).every((v) => v);

  // final verification with confirmation warning
  const confirmVerify = async () => {
    if (!selectedStudent || !allReviewed) return;

    dialog.confirm(
      "Verify Student",
      "Are you absolutely sure? After verification the record can no longer be changed.",
      async () => {
        try {
          const res = await fetch(`http://localhost:8000/student/verify/${selectedStudent._id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            setStudents(students.filter((s) => s._id !== selectedStudent._id));
            dialog.success("Success", "Student verified successfully!");
            setSelectedStudent(null);
            setShowInfoModal(false);
          } else {
            const msg = data.message || `Failed to verify student (status ${res.status})`;
            dialog.error("Error", msg);
          }
        } catch (err) {
          dialog.error("Server Error" + err.message, "Unable to connect to server. Please try again.");
        }
      },
      "Verify",
      "Cancel"
    );
  };

  // reject handlers
  const handleOpenReject = () => {
    // if we previously rejected this student, prefill the modal
    if (selectedStudent?.rejectSections) {
      setRejectSections({
        basic: !!selectedStudent.rejectSections.basic,
        contact: !!selectedStudent.rejectSections.contact,
        guardian: !!selectedStudent.rejectSections.guardian,
        academic: !!selectedStudent.rejectSections.academic,
      });
    }
    if (selectedStudent?.rejectNote) {
      setRejectNote(selectedStudent.rejectNote);
    }
    setShowRejectModal(true);
  };
  const handleRejectSubmit = async () => {
    const selected = Object.keys(rejectSections).filter((s) => rejectSections[s]);
    if (selected.length === 0) {
      dialog.error("No section selected", "Please pick at least one area that needs changes.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/student/reject/${selectedStudent._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sections: selected, note: rejectNote }),
      });
      const data = await res.json();
      if (res.ok) {
        dialog.success(
          "Feedback sent",
          "Student has been notified and can now revise the selected sections."
        );
        setShowRejectModal(false);
        setShowInfoModal(false);
        setSelectedStudent(null);
      } else {
        dialog.error("Error", data.message || "Unable to send feedback");
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server.");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.enroll?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pending-container">
      <div className="pending-header">
        <div>
          <h2>Pending Students</h2>
          <p>Students awaiting verification</p>
        </div>

        <input
          className="search-input"
          placeholder="Search by name or enrollment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading pending students...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="pending-table-card">
            <table className="pending-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Student Name</th>
                  <th>Enrollment No</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      No Pending Students Found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.enroll}</td>
                      <td>
                        <span className="badge-pending">Pending</span>
                      </td>
                      <td>
                        <button
                          className="btn-verify"
                          onClick={() => handleSelect(student)}
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

          {/* info modal with full student record */}
          <StudentInfoDialog
            show={showInfoModal}
            student={selectedStudent}
            sectionChecks={sectionChecks}
            toggleSection={toggleSection}
            allReviewed={allReviewed}
            onClose={() => {
              setShowInfoModal(false);
              setSelectedStudent(null);
            }}
            onVerify={confirmVerify}
            onRequestChanges={handleOpenReject}
          />

          {/* reject/feedback modal */}
          <Modal
            show={showRejectModal}
            onHide={() => setShowRejectModal(false)}
            centered
            size="md"
          >
            <Modal.Header closeButton>
              <Modal.Title>Request Changes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please select the areas that need to be updated by the student:</p>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={rejectSections.basic}
                    onChange={() => setRejectSections(prev => ({ ...prev, basic: !prev.basic }))}
                  />{' '}
                  Basic Info
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={rejectSections.contact}
                    onChange={() => setRejectSections(prev => ({ ...prev, contact: !prev.contact }))}
                  />{' '}
                  Contact
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={rejectSections.guardian}
                    onChange={() => setRejectSections(prev => ({ ...prev, guardian: !prev.guardian }))}
                  />{' '}
                  Guardian
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={rejectSections.academic}
                    onChange={() => setRejectSections(prev => ({ ...prev, academic: !prev.academic }))}
                  />{' '}
                  Academic
                </label>
              </div>
              <div style={{ marginTop: '16px' }}>
                <label>Additional note (optional):</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRejectSubmit}>
                Send Feedback
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}
