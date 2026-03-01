import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "../Pages/Student/StudentProfile.css"; // reuse grid/section styles
import "./StudentInfoDialog.css";

export default function StudentInfoDialog({
  show,
  student,
  sectionChecks,
  toggleSection,
  allReviewed,
  onClose,
  onVerify,
  onRequestChanges,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      aria-labelledby="student-info-modal"
    >
      <Modal.Header closeButton className="header-themed">
        <Modal.Title id="student-info-modal">Student Information</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {student && (
          <div className="profile-form">
            {student.status === "rejected" && (
              <div className="teacher-reject-info">
                <p>
                  <strong>Previously flagged sections:</strong>{" "}
                  {student.rejectSections
                    ? Object.entries(student.rejectSections)
                        .filter(([_, v]) => v)
                        .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                        .join(", ")
                    : "(none)"}
                </p>
                {student.rejectNote && <p>Note: {student.rejectNote}</p>}
              </div>
            )}
            {/* photo section */}
            {student.photo && (
              <div className="photo-section">
                <div className="photo-preview">
                  <img
                    src={`http://localhost:8000/uploads/${student.photo}`}
                    alt="Student"
                  />
                </div>
              </div>
            )}

            {/* sections -- basic, contact, guardian, academic */}
            <div className="section-card modal-section">
              <div className="section-header">
                <h5 className="section-title">Basic Information</h5>
                <input
                  type="checkbox"
                  checked={sectionChecks.basic}
                  onChange={() => toggleSection("basic")}
                />
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Name</label>
                  <p>{student.name}</p>
                </div>
                <div className="form-group">
                  <label>Enrollment</label>
                  <p>{student.enroll}</p>
                </div>
                {student.branch && (
                  <div className="form-group">
                    <label>Branch</label>
                    <p>{student.branch}</p>
                  </div>
                )}
                {student.year && (
                  <div className="form-group">
                    <label>Year</label>
                    <p>{student.year}</p>
                  </div>
                )}
                {student.dob && (
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <p>{new Date(student.dob).toLocaleDateString()}</p>
                  </div>
                )}
                {student.gender && (
                  <div className="form-group">
                    <label>Gender</label>
                    <p>{student.gender}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="section-card modal-section">
              <div className="section-header">
                <h5 className="section-title">Contact Information</h5>
                <input
                  type="checkbox"
                  checked={sectionChecks.contact}
                  onChange={() => toggleSection("contact")}
                />
              </div>
              <div className="form-grid">
                {student.phone && (
                  <div className="form-group">
                    <label>Phone Number</label>
                    <p>{student.phone}</p>
                  </div>
                )}
                {student.email && (
                  <div className="form-group">
                    <label>Email Address</label>
                    <p>{student.email}</p>
                  </div>
                )}
                {student.address && (
                  <div className="form-group full-width">
                    <label>Address</label>
                    <p>{student.address}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="section-card modal-section">
              <div className="section-header">
                <h5 className="section-title">Guardian Details</h5>
                <input
                  type="checkbox"
                  checked={sectionChecks.guardian}
                  onChange={() => toggleSection("guardian")}
                />
              </div>
              <div className="form-grid">
                {student.fatherName && (
                  <div className="form-group">
                    <label>Father's Name</label>
                    <p>{student.fatherName}</p>
                  </div>
                )}
                {student.motherName && (
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <p>{student.motherName}</p>
                  </div>
                )}
                {student.parentPhone && (
                  <div className="form-group">
                    <label>Parent's Contact</label>
                    <p>{student.parentPhone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="section-card modal-section">
              <div className="section-header">
                <h5 className="section-title">
                  Academic Performance (Semester Marks %)
                </h5>
                <input
                  type="checkbox"
                  checked={sectionChecks.academic}
                  onChange={() => toggleSection("academic")}
                />
              </div>
              <div
                className="form-grid"
                style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "12px 15px" }}
              >
                {[
                  "sem1",
                  "sem2",
                  "sem3",
                  "sem4",
                  "sem5",
                  "sem6",
                ].map((sem, idx) =>
                  (student[sem] || student[sem] === 0) && (
                    <div className="form-group" key={sem}>
                      <label>Semester {idx + 1}</label>
                      <p>{student[sem]}%</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="verify-action">
              <Button
                className="btn-reject-modal"
                onClick={onRequestChanges}
                variant="outline-danger"
              >
                Request Changes
              </Button>
              <Button
                className="btn-verify-modal"
                onClick={onVerify}
                disabled={!allReviewed}
              >
                Verify Student
              </Button>
            </div>
            {!allReviewed && (
              <p className="review-note">Please check every section before verifying.</p>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

StudentInfoDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  student: PropTypes.object,
  sectionChecks: PropTypes.object.isRequired,
  toggleSection: PropTypes.func.isRequired,
  allReviewed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  onRequestChanges: PropTypes.func.isRequired,
};
