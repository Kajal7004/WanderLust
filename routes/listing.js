const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController  = require("../controllers/listing.js")
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

// Router.route function

router.route("/")
.get(wrapAsync ( listingController.index ))
.post(isLoggedIn, upload.single("listing[image]"), wrapAsync( listingController.createListing ))
// validateListing, "we have to add this in above line for validation"

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync( listingController.showListing ))
.put(isLoggedIn, isOwner, upload.single("listing[image]"),  wrapAsync( listingController.updateListing )) //validateListing,
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



//Index Route
// router.get("/", wrapAsync ( listingController.index ));


//Show route
// router.get("/:id", wrapAsync( listingController.showListing ));

//Create a new route
// router.post("/",isLoggedIn, validateListing, wrapAsync( listingController.createListing ));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm ));

//Update/PUT route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing ));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;