const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Auto trim before store into DB
    required: "Please enter a store name!", // If the field isn't passed return this error message
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: [
      {
        type: Number,
        required: "You must supply coordinates!",
      },
    ],
    address: {
      type: String,
      required: "You must supply an address!",
    },
  },
});

// Every single time we save a Store, will be executed this code
// Generate slug from name using the slug package
storeSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    next(); // Skip it
    return; // Stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resilient so slug are unique
});

module.exports = mongoose.model("Store", storeSchema);
