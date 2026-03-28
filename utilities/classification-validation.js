const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules  = () => {
  return [
   
  

    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
       
        .custom(async (classification_name) => {
            const classificationExist =
                await inventoryModel.checkExistingClassification(classification_name);
              if (classificationExist) {
                throw new Error("Classification exists ");
              }
            }),

  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "classification",
      nav,
      classification_name,
    
    });
    return;
  }
  next();
};

module.exports = validate;
