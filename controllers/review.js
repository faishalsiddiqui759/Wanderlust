const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.saveReview = async(req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "review saved");
    res.redirect(`/listing/${listing._id}`);
  }

 module.exports.destroyReview = async(req, res, next)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "review deleted");
    res.redirect(`/listing/${id}`);
} ;