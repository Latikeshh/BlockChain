/**
 * Centralized Validation Utilities
 * Provides reusable validation functions for frontend form validation
 */

/**
 * Check if a value is empty (null, undefined, or empty string)
 * @param {any} value - The value to check
 * @returns {boolean} - True if empty
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || value === "";
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (isEmpty(email)) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePassword = (password, minLength = 6) => {
  if (isEmpty(password)) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate enrollment number (numeric, specific length)
 * @param {string} enroll - The enrollment number to validate
 * @param {number} length - Expected length (default: 11)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateEnrollment = (enroll, length = 11) => {
  if (isEmpty(enroll)) {
    return { isValid: false, error: "Enrollment number is required" };
  }

  // Check if numeric only
  if (!/^\d+$/.test(enroll)) {
    return { isValid: false, error: "Enrollment number must contain only digits" };
  }

  if (enroll.length !== length) {
    return { isValid: false, error: `Enrollment number must be exactly ${length} digits` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate phone number (Indian format - 10 digits)
 * @param {string} phone - The phone number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (isEmpty(phone)) {
    return { isValid: false, error: "Phone number is required" };
  }

  // Indian phone format: 10 digits, may start with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate name (letters and spaces only)
 * @param {string} name - The name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateName = (name, fieldName = "Name") => {
  if (isEmpty(name)) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, error: `${fieldName} should contain only letters` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate numeric input
 * @param {string} value - The value to validate
 * @param {string} fieldName - Field name for error message
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateNumeric = (value, fieldName = "Field", min = null, max = null) => {
  if (isEmpty(value)) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!/^\d+$/.test(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }

  const numValue = parseInt(value, 10);

  if (min !== null && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== null && numValue > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate required field
 * @param {any} value - The value to check
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = "Field") => {
  if (isEmpty(value)) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: "" };
};

/**
 * Validate minimum length
 * @param {string} value - The value to check
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateMinLength = (value, minLength, fieldName = "Field") => {
  if (isEmpty(value)) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate maximum length
 * @param {string} value - The value to check
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateMaxLength = (value, maxLength, fieldName = "Field") => {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }
  return { isValid: true, error: "" };
};

/**
 * Validate date
 * @param {string} date - The date string to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDate = (date, fieldName = "Date") => {
  if (isEmpty(date)) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate dropdown selection
 * @param {string} value - The selected value
 * @param {string} fieldName - Field name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateSelect = (value, fieldName = "Selection") => {
  if (isEmpty(value)) {
    return { isValid: false, error: `Please select a ${fieldName.toLowerCase()}` };
  }
  return { isValid: true, error: "" };
};

/**
 * Validate amount (for fee/chalan)
 * @param {string} amount - The amount to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAmount = (amount) => {
  if (isEmpty(amount)) {
    return { isValid: false, error: "Amount is required" };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  if (numAmount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate account number
 * @param {string} accountNo - The account number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAccountNumber = (accountNo) => {
  if (isEmpty(accountNo)) {
    return { isValid: false, error: "Account number is required" };
  }

  // Account number should be numeric, typically 9-18 digits
  if (!/^\d+$/.test(accountNo)) {
    return { isValid: false, error: "Account number must contain only digits" };
  }

  if (accountNo.length < 9 || accountNo.length > 18) {
    return { isValid: false, error: "Account number must be between 9 and 18 digits" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate chalan number
 * @param {string} chalanNo - The chalan number to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateChalanNumber = (chalanNo) => {
  if (isEmpty(chalanNo)) {
    return { isValid: false, error: "Chalan number is required" };
  }

  // Alphanumeric with optional dashes
  if (!/^[A-Za-z0-9\-_]+$/.test(chalanNo)) {
    return { isValid: false, error: "Chalan number should be alphanumeric" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate message/description length
 * @param {string} message - The message to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateMessage = (message, minLength = 10, maxLength = 1000) => {
  if (isEmpty(message)) {
    return { isValid: false, error: "Message is required" };
  }

  if (message.length < minLength) {
    return { isValid: false, error: `Message must be at least ${minLength} characters` };
  }

  if (message.length > maxLength) {
    return { isValid: false, error: `Message must not exceed ${maxLength} characters` };
  }

  return { isValid: true, error: "" };
};

/**
 * Form validation helper - validates entire form object
 * @param {object} formData - Form data object
 * @param {object} validationRules - Rules for each field
 * @returns {object} - { isValid: boolean, errors: object }
 * 
 * @example
 * const result = validateForm(formData, {
 *   name: { validator: validateName, fieldName: "Name" },
 *   email: { validator: validateEmail },
 *   phone: { validator: validatePhone }
 * });
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const field in validationRules) {
    const rule = validationRules[field];
    const value = formData[field];
    const result = rule.validator(value, ...(rule.params || []));

    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Get first validation error from errors object
 * @param {object} errors - Errors object
 * @returns {string} - First error message
 */
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  if (keys.length > 0) {
    return errors[keys[0]];
  }
  return "";
};

/**
 * Validate transaction ID
 * @param {string} transactionId - The transaction ID to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateTransactionId = (transactionId) => {
  if (isEmpty(transactionId)) {
    return { isValid: false, error: "Transaction ID is required" };
  }

  if (!/^[A-Za-z0-9\-_]+$/.test(transactionId)) {
    return { isValid: false, error: "Transaction ID should be alphanumeric" };
  }

  if (transactionId.length < 5 || transactionId.length > 30) {
    return { isValid: false, error: "Transaction ID must be between 5 and 30 characters" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate bank name
 * @param {string} bankName - The bank name to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateBankName = (bankName) => {
  if (isEmpty(bankName)) {
    return { isValid: false, error: "Bank name is required" };
  }

  const bankNameRegex = /^[a-zA-Z\s\-'.]+$/;
  if (!bankNameRegex.test(bankName)) {
    return { isValid: false, error: "Bank name should contain only letters" };
  }

  if (bankName.length < 3) {
    return { isValid: false, error: "Bank name must be at least 3 characters" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate semester marks (0-100)
 * @param {string} marks - The marks to validate
 * @param {string} semester - The semester name for error message
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateSemMarks = (marks, semester = "Marks") => {
  if (isEmpty(marks)) {
    return { isValid: false, error: `${semester} is required` };
  }

  const numMarks = parseFloat(marks);
  if (isNaN(numMarks)) {
    return { isValid: false, error: `${semester} must be a number` };
  }

  if (numMarks < 0 || numMarks > 100) {
    return { isValid: false, error: `${semester} must be between 0 and 100` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate branch selection
 * @param {string} branch - The branch to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateBranch = (branch) => {
  return validateSelect(branch, "Branch");
};

/**
 * Validate year selection
 * @param {string} year - The year to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateYear = (year) => {
  return validateSelect(year, "Year");
};

/**
 * Validate gender selection
 * @param {string} gender - The gender to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateGender = (gender) => {
  return validateSelect(gender, "Gender");
};

/**
 * Validate semester selection
 * @param {string} semester - The semester to validate
 * @param {string} year - The year to validate semester against
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateSemester = (semester, year) => {
  if (isEmpty(semester)) {
    return { isValid: false, error: "Semester is required" };
  }

  // Get valid semesters based on year
  let validSemesters = [];
  if (year === "1st Year") {
    validSemesters = ["Semester 1", "Semester 2"];
  } else if (year === "2nd Year") {
    validSemesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];
  } else if (year === "3rd Year") {
    validSemesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];
  }

  if (validSemesters.length > 0 && !validSemesters.includes(semester)) {
    return { isValid: false, error: "Please select a valid semester for your year" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate address
 * @param {string} address - The address to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAddress = (address) => {
  if (isEmpty(address)) {
    return { isValid: false, error: "Address is required" };
  }

  if (address.length < 10) {
    return { isValid: false, error: "Address must be at least 10 characters" };
  }

  if (address.length > 200) {
    return { isValid: false, error: "Address must not exceed 200 characters" };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate age is at least minimum years
 * @param {string} dob - Date of birth string
 * @param {number} minAge - Minimum age required
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateAge = (dob, minAge = 15) => {
  if (isEmpty(dob)) {
    return { isValid: false, error: "Date of birth is required" };
  }

  const birthDate = new Date(dob);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < minAge) {
    return { isValid: false, error: `Minimum age must be ${minAge} years` };
  }

  return { isValid: true, error: "" };
};

/**
 * Validate semester marks based on year
 * @param {object} formData - Form data containing year and semester fields
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateSemestersByYear = (formData) => {
  const errors = {};
  let isValid = true;

  const year = formData.year;

  // Define required semesters based on year
  let requiredSemesters = [];
  if (year === "1st Year") {
    requiredSemesters = ["sem1", "sem2"];
  } else if (year === "2nd Year") {
    requiredSemesters = ["sem1", "sem2", "sem3", "sem4"];
  } else if (year === "3rd Year") {
    requiredSemesters = ["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"];
  }

  // Validate only required semesters
  requiredSemesters.forEach(sem => {
    const marks = formData[sem];
    if (isEmpty(marks)) {
      errors[sem] = `${sem.replace('sem', 'Semester ')} is required`;
      isValid = false;
    } else {
      const result = validateSemMarks(marks, `Semester ${sem.replace('sem', '')}`);
      if (!result.isValid) {
        errors[sem] = result.error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * Validate complete student profile with year-based validation
 * @param {object} profileData - The student profile data object
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateStudentProfile = (profileData) => {
  const errors = {};
  let isValid = true;

  // Basic Information Validation
  const nameResult = validateName(profileData.name, "Student name");
  if (!nameResult.isValid) {
    errors.name = nameResult.error;
    isValid = false;
  }

  const enrollResult = validateEnrollment(profileData.enroll);
  if (!enrollResult.isValid) {
    errors.enroll = enrollResult.error;
    isValid = false;
  }

  const branchResult = validateBranch(profileData.branch);
  if (!branchResult.isValid) {
    errors.branch = branchResult.error;
    isValid = false;
  }

  const yearResult = validateYear(profileData.year);
  if (!yearResult.isValid) {
    errors.year = yearResult.error;
    isValid = false;
  }

  // Age validation - minimum 15 years for all students
  const dobResult = validateAge(profileData.dob, 15);
  if (!dobResult.isValid) {
    errors.dob = dobResult.error;
    isValid = false;
  }

  const genderResult = validateGender(profileData.gender);
  if (!genderResult.isValid) {
    errors.gender = genderResult.error;
    isValid = false;
  }

  // Contact Information Validation
  const phoneResult = validatePhone(profileData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error;
    isValid = false;
  }

  const emailResult = validateEmail(profileData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
    isValid = false;
  }

  const addressResult = validateAddress(profileData.address);
  if (!addressResult.isValid) {
    errors.address = addressResult.error;
    isValid = false;
  }

  // Guardian Details Validation
  const fatherNameResult = validateName(profileData.fatherName, "Father's name");
  if (!fatherNameResult.isValid) {
    errors.fatherName = fatherNameResult.error;
    isValid = false;
  }

  const motherNameResult = validateName(profileData.motherName, "Mother's name");
  if (!motherNameResult.isValid) {
    errors.motherName = motherNameResult.error;
    isValid = false;
  }

  const parentPhoneResult = validatePhone(profileData.parentPhone);
  if (!parentPhoneResult.isValid) {
    errors.parentPhone = parentPhoneResult.error;
    isValid = false;
  }

  // Academic Performance Validation - based on year
  const semResult = validateSemestersByYear(profileData);
  if (!semResult.isValid) {
    Object.assign(errors, semResult.errors);
    isValid = false;
  }

  return { isValid, errors };
};

/**
 * Validate complete chalan details
 * @param {object} chalanData - The chalan data object
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateChalanDetails = (chalanData) => {
  const errors = {};
  let isValid = true;

  const chalanNoResult = validateChalanNumber(chalanData.chalanNo);
  if (!chalanNoResult.isValid) {
    errors.chalanNo = chalanNoResult.error;
    isValid = false;
  }

  const chalanDateResult = validateDate(chalanData.chalanDate, "Chalan date");
  if (!chalanDateResult.isValid) {
    errors.chalanDate = chalanDateResult.error;
    isValid = false;
  }

  const bankNameResult = validateBankName(chalanData.bankName);
  if (!bankNameResult.isValid) {
    errors.bankName = bankNameResult.error;
    isValid = false;
  }

  const amountResult = validateAmount(chalanData.amount);
  if (!amountResult.isValid) {
    errors.amount = amountResult.error;
    isValid = false;
  }

  const transactionIdResult = validateTransactionId(chalanData.transactionId);
  if (!transactionIdResult.isValid) {
    errors.transactionId = transactionIdResult.error;
    isValid = false;
  }

  return { isValid, errors };
};

export default {
  isEmpty,
  validateEmail,
  validatePassword,
  validateEnrollment,
  validatePhone,
  validateName,
  validateNumeric,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateDate,
  validateSelect,
  validateAmount,
  validateAccountNumber,
  validateChalanNumber,
  validateMessage,
  validateForm,
  getFirstError,
  // Student Profile Validators
  validateTransactionId,
  validateBankName,
  validateSemMarks,
  validateBranch,
  validateYear,
  validateGender,
  validateAddress,
  validateAge,
  validateSemestersByYear,
  validateStudentProfile,
  validateChalanDetails
};

