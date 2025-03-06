const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../wrapAsync/wrapAsync.js");
const { listingSchema } = require('../schema.js');
const expressError = require("../utils/expressError.js");
const controllers  = require("../controllers/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const {storage} = require("../cloudinaryConfig.js");
const multer = require('multer');
const upload = multer({storage});

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      throw new expressError(400, "bad request");
    }
    else{
      next();
    }
  }

//show route and post route in router.route
router.route("/")
.get(wrapAsync(controllers.allListings))
.post(upload.single("listing[image]"),validateListing, wrapAsync(controllers.createListings));


  
  // new route
  router.get("/new",isLoggedIn, wrapAsync(controllers.newListings));
  
  //show route and update route and delete route in router.route
  router.route("/:id")
 .get( wrapAsync(controllers.showListings))
 .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(controllers.updateListings))
 .delete(isLoggedIn,isOwner, wrapAsync(controllers.destroyListings));

  
  //edit route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(controllers.editListings));
  
  module.exports = router