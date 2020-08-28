// MVC - Model View Controller
// Model QUERIES data from db
// View SHOWS data extracted
// Controller ORGANIZES all operation between Model and View

exports.homePage = (req, res) => {
  res.render("index");
};
