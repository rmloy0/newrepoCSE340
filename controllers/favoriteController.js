const favModel = require("../models/favorite-model");
const utilities = require("../utilities");

const favCont = {};

favCont.favoriteUpdate = async function (req, res, next) {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to use favorites.");
    return res.redirect("/account/login");
  }

  const inv_id = req.params.inv_id;
  const account_id = res.locals.accountData.account_id;
  await favModel.addFavorite(account_id, inv_id);

  return res.redirect(`/inv/detail/${inv_id}`);
};

favCont.getFavorite = async function (req, res, next) {
  if (!res.locals.accountData) {
    req.flash("notice", "Please log in to view your favorites.");
    return res.redirect("/account/login");
  }

  const account = res.locals.accountData.account_id;

  const data = await favModel.getFavoriteDetails(account);
  const nav = await utilities.getNav();

  res.render("./favorite/favoriteView", {
    title: "Favorite list",
    nav,
    favorites: data,
    message: null,
  });
};

favCont.favoriteNoteUpdate = async function (req, res, next) {
  if (!res.locals.accountData) {
    return res.redirect("/account/login");
  }

  const account_id = res.locals.accountData.account_id;
  const inv_id = req.params.inv_id;
  let { note } = req.body;

  if (!note || note.trim() === "") {
    note = null;
  }

  await favModel.updateNote(account_id, inv_id, note);

  res.redirect("/favorite");
};

module.exports = favCont;
