const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// const listingSchema = new Schema({
//     title: {
//         type:String,
//         required: true,
//     },
//     description: String,
//     image: {
//         type: String,
//         default : "https://pixabay.com/photos/india-varinasia-ganges-boats-1309206/",
//         set: (v) => v === "" ? "https://pixabay.com/photos/india-varinasia-ganges-boats-1309206/" : v,
//     },
//     price: Number,
//     location: String,
//     country: String
// });


//chatgpt
const listingSchema = new mongoose.Schema({
  title: { 
    type: String, 
    // required: true 
  },
  description: { 
    type: String, 
    // required: true 
  },
  image: {
    // filename: { 
    //   type: String, 
    //   // required: true 
    // },
    // url: { 
    //   type: String, 
      // required: true 
    // },
    url: String,
    filename: String
  },
  price: {
    type: Number,
    // required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  // ...............
  category: {
    type: String,
    enum: [
        "trending",
        "rooms",
        "iconic-cities",
        "mountains",
        "castles",
        "amazing-pools",
        "camping",
        "farms",
        "arctic",
        "doms",
        "boats"
    ]
},
// ......
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
  }
  // Add other fields as needed...
});

// Delete all Review if we delete Listing
listingSchema.post("findOneAndDelete", async(listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;