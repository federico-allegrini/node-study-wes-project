exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  res.render("index");
};
