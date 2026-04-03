const invModel = require("../models/inventory-model");
const utilities = require("../utilities");


const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();

  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inventoryId;
    const data = await invModel.getDetails(inv_id);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      return next(new Error("Vehicle not found"));
    }

    const vehicle = data[0];

    const detail = await utilities.getDetails(vehicle);

    res.render("./inventory/detail", {
      title: `$${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,

      detail,
    });
  } catch (error) {
    next(error);
  }
};

/// funtion to build new classification view  add new classification & add new car then move to form

invCont.buildmanagment = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList()
 
  res.render("./inventory/management", { title: "Vehicle Management", nav, errors: null, classificationList });
};

 

// add classifcation view

invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav();

  res.render("./inventory/add-classification", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Add classification
 * *************************************** */

invCont.registerClassification = async function (req, res) {
  const { classification_name } = req.body;
  console.log(classification_name);
  const nav = await utilities.getNav();

  if (!classification_name) {
    req.flash("notice", "Classification name is required.");
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }

  const result = await invModel.registerClassification(classification_name);

  if (result && result.rows && result.rows.length > 0) {
    req.flash("notice", "Classification added successfully.");
    return res.redirect("/inv");
  }

  req.flash("notice", "Sorry, the classification could not be added.");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Add inventory
 * *************************************** */

invCont.buildInventoryview = async function (req, res) {
  const nav = await utilities.getNav();
  const classificationList  = await utilities.buildClassificationList();

  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

invCont.registerclassification = async function (req, res) {
  const { classification_name } = req.body;
  console.log(classification_name);
  const nav = await utilities.getNav();

  if (!classification_name) {
    req.flash("notice", "Classification name is required.");
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }

  const result = await invModel.registerClassification(classification_name);

  if (result && result.rows && result.rows.length > 0) {
    req.flash("notice", "Classification added successfully.");
    return res.redirect("/inv");
  }

  req.flash("notice", "Sorry, the classification could not be added.");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

// registerInventory

invCont.registerInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationList  = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

 
  console.log("POST INVENTORY BODY:", req.body);
  console.log("classification_id:", classification_id);


  const regResult = await invModel.AddInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
 

  if (regResult) {
    req.flash("notice", "Vehicle added successfully.");
    return res.redirect("/inv");
  }
  
  req.flash("notice", "Failed to add vehicle.");
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList ,
    errors: null
  });
};


 /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/*****************
 * Edit inventory
 */
 

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id, 10)
  let nav = await utilities.getNav()
  const data = await invModel.getDetails(inv_id)
  const itemData  = data[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  console.log("ITEM DATA:", itemData)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


 
/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id, 10)
  let nav = await utilities.getNav()
  const data = await invModel.getDetails(inv_id)
  const itemData  = data[0]
   const itemName = `${itemData.inv_make} ${itemData.inv_model}`
 
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,

    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,  
    inv_price: itemData.inv_price,
    
    classification_id: itemData.classification_id
  })
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id} = req.body
  console.log(inv_id)
  const deleteResult = await invModel.deleteInventoryItem(
    inv_id)

  if (deleteResult) {
    const itemName = deleteResult.inv_id + " " + deleteResult.inv_id
    req.flash("notice", `The ${itemName} was successfully delete.`)
    res.redirect("/inv/")
  } else {
 
    const itemName = `${inv_id} ${inv_id}`
    req.flash("notice", "Sorry, the delete  failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    
    errors: null,
    inv_id,
  
    })
  }
}

module.exports = invCont;
