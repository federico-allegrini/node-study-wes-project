const mongoose = require("mongoose");
const Store = mongoose.model("Store");

exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

// The "async" keyword tell to browser or server that the function can contains "await" operations
exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  // Use "await" keyrord for run asynchronous code, like synchronous one
  // Await until the asynchronous code is finish, then pass to next line
  await store.save();
  res.redirect("/");
};
