const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  console.log("Applying User Validation Rules");
  return [
    body("email")
      .isLength({ min: 5 })
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("Invalid email format"),
    body("username")
      .isLength({ min: 8 })
      .withMessage("Username must contain 8 characters"),
    body("password")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least 1 lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least 1 uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain 1 number"),
  ];
};

const memberValidationRules = () => {
  console.log("Applying Pet Validation Rules");
  return [
    body("email")
      .isLength({ min: 5 })
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("Invalid email format"),
    body("birthday")
      .matches(/^\d{2}\/\d{2}\/\d{4}$/)
      .withMessage("use the format dd/mm/yyyy"),
    body("ward")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Please do not use numbers or special characters"),
    body("stake")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Please do not use numbers or special characters"),
    body("firstName")
      .isAlpha("en-US", { ignore: "-" })
      .withMessage(
        'Please do not use numbers, the only special character acceptable is "-"'
      ),
    body("lastName")
      .isAlpha("en-US", { ignore: "-" })
      .withMessage(
        'Please do not use numbers, the only special character acceptable is "-"'
      ),
    body("memberNum")
      .isLength(8)
      .withMessage("Member numero is 8 number long")
  ];
};

const validate = (req, res, next) => {
  console.log("Validating request...");
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log("Validation passed.");
    return next();
  }
  console.log("Validation errors:", errors.array());
  const extractedErrors = errors
    .array()
    .map((err) => ({ [err.param]: err.msg }));
  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  memberValidationRules,
  validate,
};