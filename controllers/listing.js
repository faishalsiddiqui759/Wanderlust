const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const User = require("../models/users.js");


module.exports.allListings = async (req, res)=>{
    let allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
 };

 module.exports.newListings = async (req, res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate : {path:"author"}}).populate("owner");
    if(!listing){
      req.flash("error", "items you search is not found");
      return res.redirect("/listing");
    }
      let address = listing.location;
     let apiUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${address}`;
     await fetch(apiUrl)
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
      if (data.length > 0) {
        lat = data[0].lat; // Store data in variable
        lon = data[0].lon;
    }
        
    })
    .catch(error => console.error('Error:', error));
     
    let coordinate = [lat, lon];
    res.render("./listings/show.ejs", {listing, coordinate});

};

module.exports.createListings = async (req, res, next)=>{
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image.url = req.file.path;
      newListing.image.filename = req.file.filename;
      await newListing.save();
      req.flash("success", "New items created");
      res.redirect("/listing");
    };

    module.exports.editListings = async (req, res)=>{
          let {id} = req.params;
        const listing = await Listing.findById(id);
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/uploads", "/uploads/h_20,w_20");
        if(!listing){
          req.flash("error", "item you search is not found");
          return res.redirect("/listing");
        }
        res.render("./listings/edit.ejs", {listing, originalImageUrl});
      };

      module.exports.updateListings = async (req, res)=>{
        let {id} = req.params;
        if(!req.body.listing){
          throw new expressError(400, "Bad request");
        }
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
        }
        req.flash("success", "listing updated");
        res.redirect(`/listing/${id}`);
     };

     module.exports.destroyListings = async (req, res) => {
        let {id} = req.params;
      let deletedList = await Listing.findByIdAndDelete(id);
      req.flash("success", "Item deleted");
      console.log(deletedList);
      res.redirect("/listing");
    };