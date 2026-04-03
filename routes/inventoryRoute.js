// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const regValidate = require('../utilities/classification-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// route to build view detail
router.get("/detail/:inventoryId", invController.buildDetailView);
router.get("/trigger-error", utilities.handleErrors ( invController.triggerError));

/****adding the / route future colling to invController new classification funtion */
router.get("/", utilities.CheckAccountTypeAccess, invController.buildmanagment);
//add classification

router.get("/add-classification", utilities.handleErrors ( invController.buildAddClassification));


// add a classification post 

router.post(
  "/add-classification",
  regValidate.classificationRules (),
    regValidate.checkRegDataClassification,
  utilities.handleErrors(invController.registerClassification)
)


router.get("/add-inventory", utilities.handleErrors ( invController.buildInventoryview));

// add inventory post 

router.post(
  "/add-inventory",
  regValidate.inventoryRules (),
    regValidate.checkRegDataAddInventory,

  utilities.handleErrors(invController.registerInventory)
)


router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView));


router.post("/update/", utilities.handleErrors(invController.updateInventory));


router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteInventoryView));

 

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));




module.exports = router;