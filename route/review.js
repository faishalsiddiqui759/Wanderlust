const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../wrapAsync/wrapAsync.js");
const  { reviewSchema } = require('../schema.js');
const expressError = require("../utils/expressError.js");
const controllers = require("../controllers/review.js");
const { isLoggedIn, isAuthor } = require('../middleware.js');
const { isLoggedInReview } = require("../middleware.js");


// functions to validate server side that is  listing Schema and review Schema
const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
          throw new expressError(400, "bad request");
        }
        next();
  }
  
// post review route
router.post("/",validateReview, isLoggedInReview, wrapAsync(controllers.saveReview));
  
// delete review route 
router.delete("/:reviewId",isAuthor, isLoggedInReview, wrapAsync(controllers.destroyReview));

  module.exports = router;
  