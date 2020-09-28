const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema(
  {
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
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: "You must supply an author",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define our indexes
storeSchema.index({
  name: "text",
  description: "text",
});

storeSchema.index({ location: "2dsphere" });

// Every single time we save a Store, will be executed this code
// Generate slug from name using the slug package
storeSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    next(); // Skip it
    return; // Stop this function from running
  }
  this.slug = slug(this.name);
  // Find other stores that have an equal slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more resilient so slug are unique
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

storeSchema.statics.getTopStores = function () {
  return this.aggregate([
    //Lookup Stores and populate their reviews
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "store",
        as: "reviews",
      },
    },
    // Filter for only items that have 2 or more reviews
    { $match: { "reviews.1": { $exists: true } } },
    // Add the average reviews field
    {
      $project: {
        photo: "$$ROOT.photo",
        name: "$$ROOT.name",
        slug: "$$ROOT.slug",
        reviews: "$$ROOT.reviews",
        averageRating: { $avg: "$reviews.rating" },
      },
    },
    // Sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 } },
    // Limit to at most 10
    { $limit: 10 },
  ]);
};

// Find reviews where the stores _id property === reviews store property
storeSchema.virtual("reviews", {
  ref: "Review", // What model to link?
  localField: "_id", // Which field on the store?
  foreignField: "store", // Which field on the review?
});

function autopopulate(next) {
  this.populate("reviews");
  next();
}

storeSchema.pre("find", autopopulate);
storeSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Store", storeSchema);
