const Listing = require("../models/listing.js");


module.exports.index = async (req, res) => {
    // ..........
    const { category , search} = req.query;  // <-- Get category from query parameter

    let query = {};  // <-- Initialize query object

    if (category) {
        query.category = category;  // <-- Add category to query if provided
    }

     // Add search filter for location or country
     if (search) {
        const regex = new RegExp(search, 'i');  // 'i' means case-insensitive
        query.$or = [{ location: regex }, { country: regex }];
        

    }
    // ..........
    const allListings = await Listing.find(query);
    // const allListings = await Listing.find({});
    // console.log(allListings);
    console.log("Search Query:", req.query);
    res.render("listings/index.ejs", { allListings, search });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    // console.log(listing)
    if(!listing) {
        req.flash("error", "Listing you requeted for does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const { category } = req.body.listing;  // <-- Change: Ensure category is in the request body

    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.category = category;  // <-- Change: Add category to the new listing
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");


    // 2nd method 
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error) {
    //     throw new ExpressError(400, result.error)
    // }

    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }

        // let {title, description, image, price, country, location } = req.body;
    // let listing = req.body.listing;
    
    // 1st method 
    //Throw error for all the vacant fields in a form
    // if(!newListing.title) {
    //     throw new ExpressError(400, "Title is missing.");
    // }
    // if(!newListing.description) {
    //     throw new ExpressError(400, "Description is missing.");
    // }
    // if(!newListing.location) {
    //     throw new ExpressError(400, "Location is missing.");
    // }
    
    // console.log(listing);
    
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requeted for does not exist");
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}