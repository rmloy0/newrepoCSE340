const utilities = require(".");
const { body, validationResult } = require("express-validator");
const favModel = require("../models/favorite-model");

const validate = {};

validate.favoriteNoteRules = () => {
  return [
    body("note")
      .trim()
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 200 })
      .withMessage("Note must be 200 characters or less."),
  ];
};

/* ******************************
 * Check Favorite Note Data
 * ****************************** */
validate.checkFavoriteNote = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const favorites = await favModel.getFavoriteDetails(account_id);

    return res.render("favorite/favoriteView", {
      title: "Favorites",
      nav,
      favorites,
      message: errors.array()[0].msg,
    });
  }

  next();
};

module.exports = validate;
