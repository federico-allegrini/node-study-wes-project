exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  res.render("index");
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

exports.createStore = (req, res) => {
  res.json(req.body);
};
