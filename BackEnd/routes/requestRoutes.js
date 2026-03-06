const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  updateRequestStatus,
} = require("../controller/requestController");

// student submits a change request
router.post("/", auth, createRequest);

// student can list their own requests
router.get("/me", auth, getMyRequests);

// teacher or admin can view all requests
router.get("/all", auth, getAllRequests);

// teacher/admin can update request status
router.put("/:id", auth, updateRequestStatus);

module.exports = router;
