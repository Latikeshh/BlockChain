import React, { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar";
import { dialog } from "../../components/CustomDialog";
import { 
  validateName, 
  validateEmail, 
  validatePhone, 
  validateBranch, 
  validateYear, 
  validateGender, 
  validateAddress, 
  validateAge, 
  validateSemMarks 
} from "../../utils/validation";
import "./StudentProfile.css";

export default function StudentProfile() {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Permission states for semester filling
  const [secondYearPermission, setSecondYearPermission] = useState(null);
  const [thirdYearPermission, setThirdYearPermission] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // rejection metadata (if teacher sent feedback)
  const [status, setStatus] = useState(""); // pending|verified|rejected
  const [rejectNote, setRejectNote] = useState("");
  const [rejectSections, setRejectSections] = useState({});
  const [persistedMarks, setPersistedMarks] = useState({
    sem3: "",
    sem4: "",
    sem5: "",
    sem6: "",
  });

  const [form, setForm] = useState(() => {
    // start with values from localStorage user if available
    const user = localStorage.getItem("user");
    let initial = {
      name: "",
      enroll: "",
      branch: "",
      year: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      fatherName: "",
      motherName: "",
      parentPhone: "",
      sem1: "",
      sem2: "",
      sem3: "",
      sem4: "",
      sem5: "",
      sem6: "",
    };
    if (user) {
      try {
        const u = JSON.parse(user);
        if (u.name) initial.name = u.name;
        if (u.enroll) initial.enroll = u.enroll;
      } catch {} // ignore parse errors
    }
    return initial;
  });

  /* ================= LOAD PROFILE ================= */
 useEffect(() => {
  const fetchProfile = async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const enroll = user?.enroll;

      // =============================
      // STEP 1 : FETCH BY ENROLL API
      // =============================

      const studentRes = await fetch(
        `http://localhost:8000/api/student/enroll/${enroll}`
      );

      const studentData = await studentRes.json();

      console.log("Enroll API:", studentData);

      if (studentRes.ok && (studentData.data || studentData.student)) {

  const s = studentData.data || studentData.student;

        setForm((prev) => ({
          ...prev,
          name: s.name || "",
          enroll: s.enroll || "",
          branch: s.branch || "",
          year: s.year || "",
          dob: s.dob ? s.dob.substring(0, 10) : "",
          gender: s.gender || "",
          phone: s.phone || "",
          email: s.email || "",
          address: s.address || "",
          fatherName: s.fatherName || "",
          motherName: s.motherName || "",
          parentPhone: s.parentPhone || "",

          // semester marks auto fill
          sem1: s.sem1 || "",
          sem2: s.sem2 || "",
          sem3: s.sem3 || "",
          sem4: s.sem4 || "",
          sem5: s.sem5 || "",
          sem6: s.sem6 || "",
        }));

        setPersistedMarks({
          sem3: s.sem3 || "",
          sem4: s.sem4 || "",
          sem5: s.sem5 || "",
          sem6: s.sem6 || "",
        });

        // Lock because data came from master database
        setIsProfileLocked(true);
        setHasProfile(true);

      }

      // =============================
      // STEP 2 : FALLBACK student/me
      // =============================
      else {

        console.log("Enroll API empty. Fetching /student/me...");

        const res = await fetch("http://localhost:8000/student/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("Profile API:", data);

        if (res.ok && data.success && data.data) {

          setIsProfileLocked(data.isProfileLocked === true);
          setHasProfile(true);
          setStatus(data.status || "");
          setRejectNote(data.rejectNote || "");
          setRejectSections(data.rejectSections || {});

          const profile = data.data;

          setForm({
            name: profile.name || "",
            enroll: profile.enroll || "",
            branch: profile.branch || "",
            year: profile.year || "",
            dob: profile.dob ? profile.dob.substring(0, 10) : "",
            gender: profile.gender || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: profile.address || "",
            fatherName: profile.fatherName || "",
            motherName: profile.motherName || "",
            parentPhone: profile.parentPhone || "",
            sem1: profile.sem1 || "",
            sem2: profile.sem2 || "",
            sem3: profile.sem3 || "",
            sem4: profile.sem4 || "",
            sem5: profile.sem5 || "",
            sem6: profile.sem6 || "",
          });

          setPersistedMarks({
            sem3: profile.sem3 || "",
            sem4: profile.sem4 || "",
            sem5: profile.sem5 || "",
            sem6: profile.sem6 || "",
          });

          if (profile.photo) {
            setPhoto(`http://localhost:8000/uploads/${profile.photo}`);
          }

        }
      }

      fetchPermissions();

    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, []);

  /* ================= FETCH PERMISSIONS ================= */
  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch 2nd year permission status
      const secondYearRes = await fetch("http://localhost:8000/student/permission/status/2nd_year", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const secondYearData = await secondYearRes.json();
      if (secondYearData.success) {
        setSecondYearPermission(secondYearData.permission);
      }

      // Fetch 3rd year permission status
      const thirdYearRes = await fetch("http://localhost:8000/student/permission/status/3rd_year", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const thirdYearData = await thirdYearRes.json();
      if (thirdYearData.success) {
        setThirdYearPermission(thirdYearData.permission);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
    // Refresh permissions when window gains focus (user returns to this page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchPermissions();
      }
    };
    
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Auto-select academic year when permission gets approved.
  // 3rd year approval has higher priority than 2nd year approval.
  useEffect(() => {
    const approvedYear =
      thirdYearPermission?.status === "approved"
        ? "3rd Year"
        : secondYearPermission?.status === "approved"
        ? "2nd Year"
        : null;

    if (!approvedYear) return;

    setForm((prev) => {
      if (prev.year === approvedYear) return prev;
      return { ...prev, year: approvedYear };
    });
  }, [secondYearPermission?.status, thirdYearPermission?.status]);

  /* ================= PERMISSION HANDLERS ================= */
  const handleRequestPermission = async (permissionType) => {
    dialog.confirm(
      "Request Permission",
      permissionType === "2nd_year"
        ? "Do you want to request permission to fill Semester 3 & 4 marks (2nd Year)?"
        : "Do you want to request permission to fill Semester 5 & 6 marks (3rd Year)?",
      async () => {
        setIsRequestingPermission(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:8000/student/permission/request", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ permissionType }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            dialog.success("Request Submitted", "Your permission request has been sent to the teacher.");
            // Refresh permissions to get latest status
            await fetchPermissions();
          } else {
            dialog.error("Error", data.message || "Failed to submit request");
          }
        } catch (err) {
          console.error("Error requesting permission:", err);
          dialog.error("Server Error", "Unable to connect to server. Please try again.");
        } finally {
          setIsRequestingPermission(false);
        }
      },
      "Request",
      "Cancel"
    );
  };

  // Check if user has permission for a specific permission type
  const hasPermission = (permissionType) => {
    const permission = permissionType === "2nd_year" ? secondYearPermission : thirdYearPermission;
    return permission && permission.status === "approved";
  };

  const hasValue = (value) => value !== "" && value !== null && value !== undefined;
  // Lock logic must depend on saved backend values only, not current typing.
  const hasSecondYearMarks = hasValue(persistedMarks.sem3) && hasValue(persistedMarks.sem4);
  const hasThirdYearMarks = hasValue(persistedMarks.sem5) && hasValue(persistedMarks.sem6);
  const canEditLockedAcademic =
    (hasPermission("2nd_year") && !hasSecondYearMarks) ||
    (hasPermission("3rd_year") && !hasThirdYearMarks);

  /* ================= HANDLERS ================= */

  // determine if a given section may be edited by the student
  const canEditSection = React.useCallback((section) => {
    // Special case for academic section - allow editing if user has permission
    if (section === "academic") {
      // Allow if profile is not locked
      if (!isProfileLocked) return true;

      // Locked profile: one-time update per approved permission stage
      return canEditLockedAcademic;
    }
    
    // Basic details remain locked after profile is submitted
    if (section === "basic") {
      if (!isProfileLocked) return true;
      return false;
    }
    
    if (status === "rejected") {
      // only sections that were explicitly rejected
      return !!rejectSections[section];
    }
    return !isProfileLocked;
  }, [isProfileLocked, canEditLockedAcademic, status, rejectSections]);

  const handleChange = (e, section) => {
    if (!canEditSection(section)) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    if (!canEditSection("basic")) return; // photo part of basic section
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  // Determine which semesters to show based on year and permissions
  const getVisibleSemesters = (year) => {
    // For locked profiles, visibility follows approved permissions.
    if (isProfileLocked) {
      if (hasPermission("3rd_year")) {
        return ["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"];
      }
      if (hasPermission("2nd_year")) {
        return ["sem1", "sem2", "sem3", "sem4"];
      }
    }

    switch (year) {
      case "1st Year":
        return ["sem1", "sem2"];
      case "2nd Year":
        // Need permission for sem3 & sem4
        if (hasPermission("2nd_year")) {
          return ["sem1", "sem2", "sem3", "sem4"];
        }
        return ["sem1", "sem2"];
      case "3rd Year":
        // Need permission for sem5 & sem6
        if (hasPermission("3rd_year")) {
          return ["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"];
        }
        // Also need 2nd year permission for sem3 & sem4
        if (hasPermission("2nd_year")) {
          return ["sem1", "sem2", "sem3", "sem4"];
        }
        return ["sem1", "sem2"];
      default:
        return [];
    }
  };

  const visibleSemesters = getVisibleSemesters(form.year);
  const canShowSecondPermission = form.year === "2nd Year" || form.year === "3rd Year" || !!secondYearPermission;
  const canShowThirdPermission = form.year === "3rd Year" || hasPermission("2nd_year") || !!thirdYearPermission;

  // determine whether all required fields have some value
  const isFormValid = React.useMemo(() => {
    // If profile is locked but current permission stage allows update,
    // only validate visible semesters.
    if (isProfileLocked && canEditLockedAcademic) {
      // For permission-based update, only require visible semesters
      const required = [...visibleSemesters];
      return required.every((f) => form[f] !== "" && form[f] !== null);
    }
    
    if (status === "rejected") {
      // only fields in editable sections must be filled
      const required = [];
      if (canEditSection("basic")) {
        required.push("name", "enroll", "branch", "year", "dob", "gender");
      }
      if (canEditSection("contact")) {
        required.push("phone", "email", "address");
      }
      if (canEditSection("guardian")) {
        required.push("fatherName", "motherName", "parentPhone");
      }
      if (canEditSection("academic")) {
        // Only require visible semesters based on year
        required.push(...visibleSemesters);
      }
      return required.every((f) => form[f] !== "" && form[f] !== null);
    }
    
    // For new profile submission, only validate visible semesters
    const required = ["name", "enroll", "branch", "year", "dob", "gender", "phone", "email", "address", "fatherName", "motherName", "parentPhone"];
    const allRequired = [...required, ...visibleSemesters];
    return allRequired.every((f) => form[f] !== "" && form[f] !== null);
  }, [form, status, isProfileLocked, visibleSemesters, canEditLockedAcademic, canEditSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProfileLocked && !canEditLockedAcademic) {
      dialog.warning("Profile Locked", "Second year data is locked. You can update only after 3rd year permission is approved.");
      return;
    }

    // If profile is locked with active permission stage, only validate the year and academic fields
    if (isProfileLocked && canEditLockedAcademic) {
      // Validate year
      const yearResult = validateYear(form.year);
      if (!yearResult.isValid) {
        dialog.error("Validation Error", yearResult.error);
        return;
      }

      // Validate academic performance - only validate visible semesters based on year
      if (canEditSection("academic") && visibleSemesters.length > 0) {
        for (const sem of visibleSemesters) {
          if (form[sem]) {
            const marksResult = validateSemMarks(form[sem], `Semester ${sem.replace('sem', '')}`);
            if (!marksResult.isValid) {
              dialog.error("Validation Error", marksResult.error);
              return;
            }
          }
        }
      }
    } else {
      // Validate basic information
      if (canEditSection("basic")) {
        const nameResult = validateName(form.name, "Student name");
        if (!nameResult.isValid) {
          dialog.error("Validation Error", nameResult.error);
          return;
        }

        const branchResult = validateBranch(form.branch);
        if (!branchResult.isValid) {
          dialog.error("Validation Error", branchResult.error);
          return;
        }

        const yearResult = validateYear(form.year);
        if (!yearResult.isValid) {
          dialog.error("Validation Error", yearResult.error);
          return;
        }

        const genderResult = validateGender(form.gender);
        if (!genderResult.isValid) {
          dialog.error("Validation Error", genderResult.error);
          return;
        }

        const dobResult = validateAge(form.dob, 15);
        if (!dobResult.isValid) {
          dialog.error("Validation Error", dobResult.error);
          return;
        }
      }

      // Validate contact information
      if (canEditSection("contact")) {
        const phoneResult = validatePhone(form.phone);
        if (!phoneResult.isValid) {
          dialog.error("Validation Error", phoneResult.error);
          return;
        }

        const emailResult = validateEmail(form.email);
        if (!emailResult.isValid) {
          dialog.error("Validation Error", emailResult.error);
          return;
        }

        const addressResult = validateAddress(form.address);
        if (!addressResult.isValid) {
          dialog.error("Validation Error", addressResult.error);
          return;
        }
      }

      // Validate guardian details
      if (canEditSection("guardian")) {
        const fatherNameResult = validateName(form.fatherName, "Father's name");
        if (!fatherNameResult.isValid) {
          dialog.error("Validation Error", fatherNameResult.error);
          return;
        }

        const motherNameResult = validateName(form.motherName, "Mother's name");
        if (!motherNameResult.isValid) {
          dialog.error("Validation Error", motherNameResult.error);
          return;
        }

        const parentPhoneResult = validatePhone(form.parentPhone);
        if (!parentPhoneResult.isValid) {
          dialog.error("Validation Error", parentPhoneResult.error);
          return;
        }
      }

      // Validate academic performance - only validate visible semesters based on year
      if (canEditSection("academic") && visibleSemesters.length > 0) {
        for (const sem of visibleSemesters) {
          if (form[sem]) {
            const marksResult = validateSemMarks(form[sem], `Semester ${sem.replace('sem', '')}`);
            if (!marksResult.isValid) {
              dialog.error("Validation Error", marksResult.error);
              return;
            }
          }
        }
      }
    }

    if (!isFormValid) {
      dialog.error("Incomplete Form", "Please fill out every field before saving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const isLockedUpdateFlow = isProfileLocked && canEditLockedAcademic;

      if (!isLockedUpdateFlow && photoFile) {
        formData.append("photo", photoFile);
      }
      
      const res = await fetch(
        isLockedUpdateFlow
          ? "http://localhost:8000/student/form/update"
          : "http://localhost:8000/student/form",
        {
        method: isLockedUpdateFlow ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Determine success message based on permission status
        if (isProfileLocked) {
          dialog.success("Success", "Semester Marks Updated Successfully ✅");
        } else {
          dialog.success("Success", "Profile Saved Successfully ✅");
        }

        setHasProfile(true);
        
        // Reload profile data from backend to get latest isProfileLocked status
        try {
          const token = localStorage.getItem("token");
          const profileRes = await fetch("http://localhost:8000/student/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const profileData = await profileRes.json();
          
          if (profileRes.ok && profileData.success) {
            // Update lock status from the Student model
            setIsProfileLocked(profileData.isProfileLocked === true);
            setHasProfile(profileData.hasProfile === true);
            setStatus(profileData.status || "pending");
            setRejectNote(profileData.rejectNote || "");
            setRejectSections(profileData.rejectSections || {});
            
            // Update form with latest data from backend
            if (profileData.data) {
              const profile = profileData.data;
              setForm({
                name: profile.name || "",
                enroll: profile.enroll || "",
                branch: profile.branch || "",
                year: profile.year || "",
                dob: profile.dob ? profile.dob.substring(0, 10) : "",
                gender: profile.gender || "",
                phone: profile.phone || "",
                email: profile.email || "",
                address: profile.address || "",
                fatherName: profile.fatherName || "",
                motherName: profile.motherName || "",
                parentPhone: profile.parentPhone || "",
                sem1: profile.sem1 || "",
                sem2: profile.sem2 || "",
                sem3: profile.sem3 || "",
                sem4: profile.sem4 || "",
                sem5: profile.sem5 || "",
                sem6: profile.sem6 || "",
              });
              setPersistedMarks({
                sem3: profile.sem3 || "",
                sem4: profile.sem4 || "",
                sem5: profile.sem5 || "",
                sem6: profile.sem6 || "",
              });

              if (profile.photo) {
                setPhoto(`http://localhost:8000/uploads/${profile.photo}`);
              }
            }
          }
        } catch (profileErr) {
          console.error("Error reloading profile:", profileErr);
          // Fallback: just lock the profile locally
          setIsProfileLocked(true);
        }

        // Refresh permissions after profile submission to get latest status
        await fetchPermissions();
      } else {
        dialog.error("Error", data.message);
      }
    } catch (err) {
      console.error(err);
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    }
  };
         
  if (isLoading) {
    return (
      <div className="student-page-wrapper">
        <StudentSidebar />
        <div className="student-layout">
          <div className="setalignment">
            <div className="profile-container">
              <div className="loading-spinner"></div>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="student-page-wrapper">
      <StudentSidebar />
      <div className="student-layout">
        <div className="setalignment">
          <div className="profile-container">
            <div className="profile-header">
              <h2>Student Profile</h2>
              <p className="subtitle">
                {isProfileLocked
                  ? "Your profile has been saved successfully"
                  : hasProfile
                  ? "View your profile details"
                  : "Complete your academic & personal details"}
              </p>
            </div>

            {status === "rejected" && (
              <div className="rejected-banner">
                <span className="lock-icon">⚠️</span>
                <div className="locked-text">
                  <strong>Changes Requested</strong>
                  <p>
                    Your teacher has asked you to update the following sections: <br />
                    {Object.entries(rejectSections)
                      .filter(([_, v]) => v)
                      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(", ") || "(none specified)"}
                  </p>
                  {rejectNote && <p>Note: {rejectNote}</p>}
                </div>
              </div>
            )}
            {isProfileLocked && status !== "rejected" && (
              <div className="locked-banner">
                <span className="lock-icon">🔒</span>
                <div className="locked-text">
                  <strong>Profile Saved & Locked</strong>
                  <p>Your profile data has been securely saved and cannot be modified.</p>
                </div>
              </div>
            )}

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="photo-section">
                <div className="photo-preview">
                  {photo ? (
                    <img src={photo} alt="Profile" />
                  ) : (
                    <div className="photo-placeholder">
                      <span>📷</span>
                      <p>Upload Photo</p>
                    </div>
                  )}
                </div>
                {canEditSection("basic") && (
                  <label className="file-upload-btn">
                    <input type="file" onChange={handlePhoto} accept="image/*" />
                    Choose Photo
                  </label>
                )}
              </div>

              <div className="section-card">
                <h3>Basic Information</h3>
                <div className="form-grid basic-info-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Enrollment Number</label>
                    <input
                      type="text"
                      name="enroll"
                      value={form.enroll}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter enrollment number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={form.branch}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter branch"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      required
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      style={{ marginTop: 0, height: "44px", padding: "12px 14px" }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                    required
                      name="gender"
                      value={form.gender}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                    required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                    required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                    required
                      name="address"
                      value={form.address}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Guardian Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Father's Name</label>
                    <input
                    required
                      type="text"
                      name="fatherName"
                      value={form.fatherName}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <input
                    required
                      type="text"
                      name="motherName"
                      value={form.motherName}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent's Contact</label>
                    <input
                    required
                      type="tel"
                      name="parentPhone"
                      value={form.parentPhone}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter parent's contact"
                    />
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Academic Performance (Semester Marks %)</h3>
                <p className="semester-info">
                  {hasPermission("3rd_year") && "Showing Semesters 1-6 (Third Year - Permission Granted)"}
                  {!hasPermission("3rd_year") && hasPermission("2nd_year") && "Showing Semesters 1-4 (Second Year - Permission Granted)"}
                  {!hasPermission("2nd_year") && form.year === "1st Year" && "Showing Semesters 1-2 (First Year)"}
                  {!hasPermission("2nd_year") && form.year === "2nd Year" && "Showing Semesters 1-2 (Second Year - Limited)"}
                  {!hasPermission("3rd_year") && !hasPermission("2nd_year") && form.year === "3rd Year" && "Showing Semesters 1-2 (Third Year - Limited)"}
                  {!form.year && "Please select a year to see available semesters"}
                </p>

                {/* Permission Status & Request Section */}
                {form.year && (
                  <div className="permission-section">
                    {/* 2nd Year Permission Status */}
                    {canShowSecondPermission && (
                      <div className="permission-status">
                        {secondYearPermission?.status === "approved" ? (
                          <div className="permission-granted">
                            <span className="permission-icon">✅</span>
                            <span>Permission Granted for Semester 3 & 4</span>
                          </div>
                        ) : secondYearPermission?.status === "pending" ? (
                          <div className="permission-pending">
                            <span className="permission-icon">⏳</span>
                            <span>Permission Request Pending for Semester 3 & 4</span>
                          </div>
                        ) : secondYearPermission?.status === "rejected" ? (
                          <div className="permission-rejected">
                            <span className="permission-icon">❌</span>
                            <span>Permission Rejected for Semester 3 & 4</span>
                            {secondYearPermission?.teacherNote && <p className="teacher-note">Note: {secondYearPermission.teacherNote}</p>}
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="permission-request-btn"
                            onClick={() => handleRequestPermission("2nd_year")}
                            disabled={isRequestingPermission}
                          >
                            {isRequestingPermission ? "Requesting..." : "Request Permission for Semester 3 & 4"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* 3rd Year Permission Status */}
                    {canShowThirdPermission && (
                      <div className="permission-status">
                        {thirdYearPermission?.status === "approved" ? (
                          <div className="permission-granted">
                            <span className="permission-icon">✅</span>
                            <span>Permission Granted for Semester 5 & 6</span>
                          </div>
                        ) : thirdYearPermission?.status === "pending" ? (
                          <div className="permission-pending">
                            <span className="permission-icon">⏳</span>
                            <span>Permission Request Pending for Semester 5 & 6</span>
                          </div>
                        ) : thirdYearPermission?.status === "rejected" ? (
                          <div className="permission-rejected">
                            <span className="permission-icon">❌</span>
                            <span>Permission Rejected for Semester 5 & 6</span>
                            {thirdYearPermission?.teacherNote && <p className="teacher-note">Note: {thirdYearPermission.teacherNote}</p>}
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="permission-request-btn"
                            onClick={() => handleRequestPermission("3rd_year")}
                            disabled={isRequestingPermission}
                          >
                            {isRequestingPermission ? "Requesting..." : "Request Permission for Semester 5 & 6"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {visibleSemesters.length > 0 ? (
                  <div className="form-grid academic-grid">
                    {visibleSemesters.map((sem, index) => (
                      <div className="form-group" key={sem}>
                        <label>Semester {index + 1}</label>
                        <input
                          type="number"
                          name={sem}
                          value={form[sem]}
                          onChange={(e) => handleChange(e, "academic")}
                          disabled={!canEditSection("academic")}
                          placeholder="%"
                          min="0"
                          max="100"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-semester-message">
                    <p>Select a year above to enter semester marks</p>
                  </div>
                )}
              </div>

              {!isProfileLocked || canEditLockedAcademic ? (
                <button type="submit" className="save-btn" disabled={!isFormValid}>
                  {isProfileLocked ? "Update Semester Marks" : "Save Profile"}
                </button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
