const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

// middleware to check if someone is logged in or not
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you have to login");
       return res.redirect("/login");
    }
    next();
}

// middleware which save originalUrl (stored in session) into locals so that we can render on original path
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// middleware for save review to varifying someone logged in or not 
module.exports.isLoggedInReview = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "you have to login");
        return res.redirect("/login");
    }
    next();
}
 
//middleware for edit and delete listing by only it's owner
module.exports.isOwner = async(req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

//middleware for deletion of reviews . only it's author can delete the reviews
module.exports.isAuthor = async(req, res, next)=>{
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!(res.locals.currUser&&review.author.equals(res.locals.currUser._id))){
        req.flash("error", "you can't delete this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}