// MVC - Model View Controller
// Model QUERIES data from db
// View SHOWS data extracted
// Controller ORGANIZES all operation between Model and View

exports.myMiddleware = (req, res, next) => {
  req.name = "Fede";

  // Cookie parser is an example of Middleware
  // res.cookie("name", "Fede is cool", { maxAge: 90000000 });

  // Throw an error for see the Error Handler in action
  if (req.name === "Fede") {
    throw Error("That is stupid name");
  }
  next();
};

exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  res.render("index");
};
