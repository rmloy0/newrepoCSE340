
const utilities = require("../utilities/")

const accountModel = require("../models/account-model");

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
 
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
  
}



async function loginAccount(req, res) {
  const { account_email } = req.body;
  const nav = await utilities.getNav();

  const emailExists = await accountModel.checkExistingEmail(account_email);

  if (!emailExists) {
    req.flash("notice", "Invalid email or password.");
    return res.render("account/login", {
      title: "Login",
      nav,
      account_email
    });
  }


  req.flash("notice", "Email exists.");
  return res.render("account/login", {
    title: "Login",
    nav,
    account_email
  
  });
}





/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
*  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/***********
 * build account management
 */

async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
  })
}

 /****************
 * Build account 
 */


async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  
const accountId = res.locals.accountData.account_id



const account = await accountModel.getAccountById(accountId)

 
if (!account) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

 
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    account,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
     errors: null,
  })
}
 
/*********
 * update acccount 
 */

async function updateAccount(req, res) {
  const {
    account_firstname,
    account_lastname,
    account_email
  } = req.body;
 
  const account_id = res.locals.accountData.account_id;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );



 
  if (updateResult) {
    req.flash("notice", "Account was successfully updated.");
    return res.redirect("/account/");
  }

 
  const nav = await utilities.getNav();

  req.flash("notice", "Sorry, the update failed.");
  return res.status(500).render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account: {
      account_firstname,
      account_lastname,
      account_email
    }
  });
}


/***************
 * build update password view
 * 
 */


async function buildUpdatePasswordview(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/update-password", {
    title: "Update password",
    nav,
    errors: null
  })
}


/***********
 * update password
 */



async function updatePassword(req, res) {
  const { account_password } = req.body;

  
  if (!account_password) {
    req.flash("notice", "Password is required.");
    return res.redirect("/account/update-password");
  }

 
  const hashedPassword = await bcrypt.hash(account_password, 10);

 
  const account_id = res.locals.accountData.account_id;

  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  );
 
  if (updateResult) {
    req.flash("notice", "Password was successfully updated.");
    return res.redirect("/account/");
  }

 
  const nav = await utilities.getNav();

  req.flash("notice", "Sorry, the password update failed.");
  return res.status(500).render("account/update-password", {
    title: "Update Password",
    nav,
    errors: null
  });
}

/****
 * 
 * Logout
 */

async function logout(req, res) { 
   res.clearCookie("jwt");  
   req.flash("notice", "You have been logged out.");  
   return res.redirect("/");}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, buildAccountManagement, buildUpdateAccount,  updateAccount, buildUpdatePasswordview, updatePassword, logout }

 