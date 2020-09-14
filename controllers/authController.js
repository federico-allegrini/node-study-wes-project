const passport = require("passport");

exports.login = passport.authenticate("local", {
  faliureRedirect: "/login",
  faliureFlash: "Failed login!",
  successRedirect: "/",
  successFlash: "You are now logged in!",
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // 1. Check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // Carry on! They are logged in!
    return;
  }
  req.flash("error", "Oops, you must be logged in to do that!");
  res.redirect("/login");
};
