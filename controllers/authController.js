const passport = require("passport");

exports.login = passport.authenticate("local", {
  faliureRedirect: "/login",
  faliureFlash: "Failed login!",
  successRedirect: "/",
  successFlash: "You are now logged in!",
});
