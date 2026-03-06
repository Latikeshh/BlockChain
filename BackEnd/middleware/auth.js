const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    // Format: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    // special-case admin login token used by frontend stub
    if (token === "admin-token") {
      // no verification required; simply mark as admin user
      req.user = { role: "admin", name: "Admin" };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
