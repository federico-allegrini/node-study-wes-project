const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  // req.flash("error", "<strong>Something</strong> went wrong");
  // req.flash("error", "Second message");
  // req.flash("info", "Info message");
  // req.flash("warning", "Warning message");
  // req.flash("success", "Success message");
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

// The "async" keyword tell to browser or server that the function can contains "await" operations
exports.createStore = async (req, res) => {
  // Now the response with the await is put into "store" variable
  const store = await new Store(req.body).save();
  // Flash success message in redirect page
  req.flash(
    "success",
    `Successfully Created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};
