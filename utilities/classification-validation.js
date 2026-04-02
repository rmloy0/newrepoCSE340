const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Registration Data Validation Rules classification 
 * ********************************* */
validate.classificationRules  = () => {
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
validate.checkRegDataClassification = async (req, res, next) => {
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



/*  **********************************
 *  Registration Data Validation Rules classification 
 * ********************************* */
validate.inventoryRules  = () => {
 return [


 
 
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide valid make car ."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model"), // on error this message is sent.

     
   
body("inv_year")
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid 4‑digit year."),

 
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

 

 
    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),

 
    body("inv_miles")
      .notEmpty()
      .withMessage("Miles are required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

   
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegDataAddInventory = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );

    return res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors
    });
  }

  next();
};


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegDataAddInventory = async (req, res, next) => {
  const errors = validationResult(req);
  const inv_id = parseInt(req.params.inventory_id, 10)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    );

    return res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classificationList,
      errors,
      inv_id
    });
  }

  next();
};


 


/*  **********************************
 *  update Data Validation Rules classification 
 * ********************************* */
validate.newInventoryRules  = () => {
 return [


 
 
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide valid make car ."), // on error this message is sent.

    // lastname is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model"), // on error this message is sent.

     
   
body("inv_year")
      .notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Year must be a valid 4‑digit year."),

 
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

 

 
    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),

 
    body("inv_miles")
      .notEmpty()
      .withMessage("Miles are required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

   
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};





module.exports = validate;
