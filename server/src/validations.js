const { body } = require("express-validator");

const authValidate = () => {
  return new Array(
    [body("username").notEmpty().withMessage("Username is required")],
    [body("password").notEmpty().withMessage("password is required")]
  );
};

const addProductValidate = () => {
  return new Array(
    [body("Name").notEmpty().withMessage("Name is required")],
    [body("Type").notEmpty().withMessage("Type is required")],
    [body("Price").notEmpty().withMessage("Price is required")],
    [body("Contents").notEmpty().withMessage("Contents is required")],
    [body("Description").notEmpty().withMessage("Description is required")]
  );
};

const deleteProductValidate = () => {
  return new Array(
    [body("Name").notEmpty().withMessage("Name is required")],
    [body("Type").notEmpty().withMessage("Type is required")],
    [body("Price").notEmpty().withMessage("Price is required")],
    [body("Contents").notEmpty().withMessage("Contents is required")],
    [body("Description").notEmpty().withMessage("Description is required")]
  );
};

const updateProductValidate = () => {
  return new Array(
    [body("Name").notEmpty().withMessage("Name is required")],
    [body("Type").notEmpty().withMessage("Type is required")],
    [body("Price").notEmpty().withMessage("Price is required")],
    [body("Contents").notEmpty().withMessage("Contents is required")],
    [body("Description").notEmpty().withMessage("Description is required")]
  );
};

module.exports = {
  authValidate,
  addProductValidate,
  deleteProductValidate,
  updateProductValidate,
};
