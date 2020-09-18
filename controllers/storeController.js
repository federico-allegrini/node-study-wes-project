const mongoose = require("mongoose");
const Store = mongoose.model("Store");
const multer = require("multer"); // Upload photo
const jimp = require("jimp"); // Transform foto
const uuid = require("uuid"); // Generate unique id

const multerOptions = {
  storage: multer.memoryStorage(), //Save temporary on memory of server, not on disk
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith("image/"); //mimetype is the real type of file, extension isn't enough
    if (isPhoto) {
      // If the first argument of next is ==null, it isn't an error and the second argument is the value returned
      next(null, true);
    } else {
      // If the first argument of next is !=null, it is considered as an error
      next({ message: "That filetype isn't allowed!" }, false);
    }
  },
};

exports.homePage = (req, res) => {
  console.log("[storeController - homePage] " + req.name);
  // req.flash("error", "<strong>Something</strong> went wrong");
  // req.flash("error", "Second message");
  // req.flash("info", "Info message");
  // req.flash("warning", "Warning message");
  // req.flash("success", "Success message");
  res.render("index");
};

exports.upload = multer(multerOptions).single("photo");

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  // Multer put into req.file the uploaded photo
  if (!req.file) {
    next(); // Skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split("/")[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // Now resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // Once the photo is written on file system, keep going
  next();
};

exports.addStore = (req, res) => {
  res.render("editStore", { title: "Add Store" });
};

// The "async" keyword tell to browser or server that the function can contains "await" operations
exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  // Now the response with the await is put into "store" variable
  const store = await new Store(req.body).save();
  // Flash success message in redirect page
  req.flash(
    "success",
    `Successfully Created ${store.name}. Care to leave a review?`
  );
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();
  res.render("stores", { title: "Stores", stores });
};

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error("You must own a store in order to edit it!");
  }
};

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // 2. Confirm they are the owner of the store
  confirmOwner(store, req.user);
  // 3. Render out the edit form so the user can update their store
  res.render("editStore", { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // 1. Set the location data to be a point
  req.body.location.type = "Point";
  // 2. Find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead the new one
    runValidators: true,
  }).exec();
  // 3. Redirect them the store and tell them it worked
  req.flash(
    "success",
    `Succesfully updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View Store ➡</a>`
  );
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await (await Store.findOne({ slug: req.params.slug })).populate(
    "author"
  );
  if (!store) return next();
  res.render("store", { store, title: store.name });
};

exports.getStoreByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storePromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storePromise]);
  res.render("tags", { tags, title: "Tags", tag, stores });
};
