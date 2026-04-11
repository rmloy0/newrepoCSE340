/****
 * Faorite router
 */

// Needed Resources
const express = require("express");
const router = new express.Router();
const favoriteController = require("../controllers/favoriteController");
const utilities = require("../utilities");
const favoriteValidate = require("../utilities/favoriteValidation");

router.post(
  "/note/:inv_id",
  favoriteValidate.favoriteNoteRules(),
  favoriteValidate.checkFavoriteNote,
  utilities.handleErrors(favoriteController.favoriteNoteUpdate),
);

router.post(
  "/:inv_id",
  utilities.handleErrors(favoriteController.favoriteUpdate),
);

router.get("/", utilities.handleErrors(favoriteController.getFavorite));

module.exports = router;
