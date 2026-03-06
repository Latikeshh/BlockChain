const hasTeacherPermission = (req, permissionKey) => {
  if (!req || !req.user) return false;
  if (req.user.role === "admin") return true;
  if (req.user.role !== "teacher") return false;

  // Backward compatibility: old tokens without permissions keep full access.
  if (!req.user.permissions || typeof req.user.permissions !== "object") {
    return true;
  }

  return req.user.permissions[permissionKey] === true;
};

module.exports = { hasTeacherPermission };
