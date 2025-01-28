const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
.then((res)=>{
    console.log();
})
.catch((err)=>{
    console.log(err);
});

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
});



// app.get("/test", async(req, res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "bank of the beach",
//         price: 1200,
//         location: "Colenganj, Srinagar",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample data was saved");
//     res.send("succesfull testing");
// });


//home route
app.get("/", (req, res)=>{
  res.send("home route is working");
});


//show route
app.get("/listing", async (req, res)=>{
   let allListing = await Listing.find({});
   res.render("./listings/index.ejs", {allListing});
});

// new route
app.get("/listing/new", (req, res)=>{
    res.render("./listings/new.ejs");
});


app.get("/listing/:id", async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

// create route 
app.post("/listing", async (req, res)=>{
const newListing = new Listing(req.body.listing);
  await newListing.save()
  res.redirect("/listing");
});

//edit route
app.get("/listing/:id/edit", async (req, res)=>{
    let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", {listing});
});

//update route
app.put("/listing/:id", async (req, res)=>{
   let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
   res.redirect(`/listing/${id}`);
});

//delete route 
app.delete("/listing/:id", async (req, res) => {
    let {id} = req.params;
  let deletedList = await Listing.findByIdAndDelete(id); 
  console.log(deletedList);
  res.redirect("/listing");
});