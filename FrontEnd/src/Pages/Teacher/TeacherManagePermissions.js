import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { dialog } from "../../components/CustomDialog";
import "./TeacherManagePermissions.css";

export default function TeacherManagePermissions() {
  const token = localStorage.getItem("token");

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, approved, rejected, all
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responding, setResponding] = useState(false);
  const [teacherNote, setTeacherNote] = useState("");

  useEffect(() => {
    fetchPermissions();
  }, [filter]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const url = filter === "all" 
        ? "http://localhost:8000/student/permission/all"
        : `http://localhost:8000/student/permission/all?status=${filter}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPermissions(data.permissions);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (permission) => {
    dialog.confirm(
      "Approve Permission",
      `Are you sure you want to approve ${permission.studentName}'s request for ${permission.permissionType === "2nd_year" ? "Semester 3 & 4" : "Semester 5 & 6"}?`,
      async () => {
        setResponding(true);
        try {
          const res = await fetch(
            `http://localhost:8000/student/permission/respond/${permission._id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "approved", teacherNote }),
            }
          );

          const data = await res.json();

          if (res.ok) {
            dialog.success("Success", "Permission approved successfully!");
            setShowModal(false);
            setTeacherNote("");
            fetchPermissions();
          } else {
            dialog.error("Error", data.message || "Failed to approve permission");
          }
        } catch (err) {
          dialog.error("Server Error", "Unable to connect to server.");
        } finally {
          setResponding(false);
        }
      },
      "Approve",
      "Cancel"
    );
  };

  const handleReject = async (permission) => {
    if (!teacherNote.trim()) {
      dialog.error("Note Required", "Please provide a reason for rejection.");
      return;
    }

    dialog.confirm(
      "Reject Permission",
      `Are you sure you want to reject ${permission.studentName}'s request?`,
      async () => {
        setResponding(true);
        try {
          const res = await fetch(
            `http://localhost:8000/student/permission/respond/${permission._id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "rejected", teacherNote }),
            }
          );

          const data = await res.json();

          if (res.ok) {
            dialog.success("Success", "Permission rejected!");
            setShowModal(false);
            setTeacherNote("");
            fetchPermissions();
          } else {
            dialog.error("Error", data.message || "Failed to reject permission");
          }
        } catch (err) {
          dialog.error("Server Error", "Unable to connect to server.");
        } finally {
          setResponding(false);
        }
      },
      "Reject",
      "Cancel"
    );
  };

  const openRespondModal = (permission) => {
    setSelectedPermission(permission);
    setTeacherNote("");
    setShowModal(true);
  };

  const getPermissionTypeLabel = (type) => {
    return type === "2nd_year" ? "Semester 3 & 4 (2nd Year)" : "Semester 5 & 6 (3rd Year)";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-pending">Pending</span>;
      case "approved":
        return <span className="badge badge-approved">Approved</span>;
      case "rejected":
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="manage-permissions-container">
      <div className="manage-permissions-header">
        <div className="header-content">
          <h2>Student Permission Requests</h2>
          <p>Manage student requests for semester filling permissions</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
        >
          Approved
        </button>
        <button
          className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
      </div>

      {/* Permissions List */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : permissions.length === 0 ? (
        <div className="empty-state">
          <p>No permission requests found</p>
        </div>
      ) : (
        <div className="permissions-table-card">
          <table className="permissions-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Student Name</th>
                <th>Enrollment</th>
                <th>Permission Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, index) => (
                <tr key={perm._id}>
                  <td>{index + 1}</td>
                  <td>{perm.studentName}</td>
                  <td>{perm.enrollment}</td>
                  <td>{getPermissionTypeLabel(perm.permissionType)}</td>
                  <td>{getStatusBadge(perm.status)}</td>
                  <td>{new Date(perm.createdAt).toLocaleDateString()}</td>
                  <td>
                    {perm.status === "pending" ? (
                      <button
                        className="btn-respond"
                        onClick={() => openRespondModal(perm)}
                      >
                        Respond
                      </button>
                    ) : (
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedPermission(perm);
                          setTeacherNote(perm.teacherNote || "");
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Response Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="header-themed">
          <Modal.Title>
            {selectedPermission?.status === "pending" 
              ? "Respond to Permission Request" 
              : "Permission Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPermission && (
            <div className="permission-details">
              <div className="detail-row">
                <label>Student Name:</label>
                <span>{selectedPermission.studentName}</span>
              </div>
              <div className="detail-row">
                <label>Enrollment:</label>
                <span>{selectedPermission.enrollment}</span>
              </div>
              <div className="detail-row">
                <label>Permission Type:</label>
                <span>{getPermissionTypeLabel(selectedPermission.permissionType)}</span>
              </div>
              <div className="detail-row">
                <label>Current Status:</label>
                {getStatusBadge(selectedPermission.status)}
              </div>
              {selectedPermission.requestNote && (
                <div className="detail-row">
                  <label>Student Note:</label>
                  <span>{selectedPermission.requestNote}</span>
                </div>
              )}
              <div className="detail-row">
                <label>Teacher Note:</label>
                <textarea
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder={
                    selectedPermission.status === "pending"
                      ? "Enter note for the student (required for rejection)..."
                      : "View note..."
                  }
                  disabled={selectedPermission.status !== "pending"}
                  rows="3"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedPermission?.status === "pending" && (
            <>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedPermission)}
                disabled={responding || !teacherNote.trim()}
              >
                {responding ? "Rejecting..." : "Reject"}
              </Button>
              <Button
                variant="success"
                onClick={() => handleApprove(selectedPermission)}
                disabled={responding}
              >
                {responding ? "Approving..." : "Approve"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

