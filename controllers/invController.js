const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
 
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


invCont.buildDetailView = async function (req, res, next) {
  try {
    const inv_id = req.params.inventoryId
    const data = await invModel.getDetails(inv_id)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return next(new Error("Vehicle not found"))
    }
   
  console.log("DETAIL DATA:", data)
  console.log("VEHICLE:", data[0])

    const vehicle = data[0]

    res.render("./inventory/detail", {
      title: `$${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle
    })
  } catch (error) {
    next(error)
  }
}



 module.exports = invCont