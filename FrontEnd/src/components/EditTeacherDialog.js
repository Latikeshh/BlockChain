import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { validateName, validateEmail } from "../utils/validation";
import { dialog } from "./CustomDialog";
import "./EditTeacherDialog.css";

export default function EditTeacherDialog({ show, onHide, teacher, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: {
      dashboard: true,
      verifiedStudents: true,
      pendingStudents: true,
      changeRequests: true,
      contacts: true,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        password: "",
        permissions: {
          dashboard: teacher.permissions?.dashboard ?? true,
          verifiedStudents: teacher.permissions?.verifiedStudents ?? true,
          pendingStudents: teacher.permissions?.pendingStudents ?? true,
          changeRequests: teacher.permissions?.changeRequests ?? true,
          contacts: teacher.permissions?.contacts ?? true,
        },
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [name]: checked },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const nameResult = validateName(formData.name, "Teacher name");
    if (!nameResult.isValid) {
      dialog.error("Validation Error", nameResult.error);
      return;
    }

    // Validate email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      dialog.error("Validation Error", emailResult.error);
      return;
    }

    // Validate password if provided
    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 6) {
        dialog.error("Validation Error", "Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="edit-teacher-modal">
      <Modal.Header closeButton className="modal-header-themed">
        <Modal.Title>Edit Teacher</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="edit-form-content">
            {/* Basic Info Section */}
            <div className="form-section">
              <h5 className="section-title">Basic Information</h5>
              <div className="form-group">
                <label className="form-label-custom">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control-custom"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label-custom">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control-custom"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label-custom">
                  New Password <span className="optional-label">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-custom"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Permissions Section */}
            <div className="form-section">
              <h5 className="section-title">Permissions</h5>
              <div className="permission-grid">
                <div className="permission-item">
                  <input
                    type="checkbox"
                    id="dashboard"
                    name="dashboard"
                    checked={formData.permissions.dashboard}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="dashboard">Dashboard</label>
                </div>
                <div className="permission-item">
                  <input
                    type="checkbox"
                    id="verifiedStudents"
                    name="verifiedStudents"
                    checked={formData.permissions.verifiedStudents}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="verifiedStudents">Verified Students</label>
                </div>
                <div className="permission-item">
                  <input
                    type="checkbox"
                    id="pendingStudents"
                    name="pendingStudents"
                    checked={formData.permissions.pendingStudents}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="pendingStudents">Pending Students</label>
                </div>
                <div className="permission-item">
                  <input
                    type="checkbox"
                    id="changeRequests"
                    name="changeRequests"
                    checked={formData.permissions.changeRequests}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="changeRequests">Change Requests</label>
                </div>
                <div className="permission-item">
                  <input
                    type="checkbox"
                    id="contacts"
                    name="contacts"
                    checked={formData.permissions.contacts}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="contacts">Contacts</label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn-cancel" onClick={onHide}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
