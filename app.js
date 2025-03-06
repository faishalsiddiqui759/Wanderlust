if(process.env.NODE_ENV != "production"){
  const dotenv = require("dotenv");
  dotenv.config();
}
// environmental variables are accessable in process.env and can be used anywhere - due to dotenv 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/users.js"); 

const listing = require('./route/listing.js');
const review = require('./route/review.js');
const users = require('./route/user.js');
const path = require("path");
const methodeOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const wrapAsync = require("./wrapAsync/wrapAsync.js");
const Listing = require("./models/listing.js"); 

const dbUrl = process.env.ATLAS_DB_URL;

main()
.then((res)=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
  await mongoose.connect(dbUrl);
}

const store = mongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret: "wanderlustsecret0909"
  },
  touchAfter : 24*3600
});

store.on("error", ()=>{
  console.log("error in mongo-connect", err);
})

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodeOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session({
   store,
  secret: "wanderlustsecret0909",
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
});


//middleware for storing req.flash messages in locals variable 
app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// changing root route from "/listing" to "/" 
app.get("/", (req, res)=>{
  res.redirect("/listing");
});

// route for filters
app.get("/filters", async(req, res)=>{
  let { filter } = req.query;
  let allListing = await Listing.find({category: filter});
  res.render("./listings/index.ejs", {allListing});
});

// route for search
app.post("/search", async(req, res)=>{
    let {searchText} = req.body;
    let allListing = await Listing.find({$or: [{title: searchText}, {category: searchText}, {location: searchText}, {country: searchText}]});
    if(allListing.length>0){
    res.render("./listings/index.ejs", {allListing});
    }
    else{
      if(searchText.length>0){
      req.flash("error", "Nothing found!");
      }
      res.redirect("/listing");
    }
});

//route for privacy and terms and condition 
app.get("/privacy&terms", (req, res)=>{
  res.render("./listings/privacy&terms.ejs");
});

app.use("/listing", listing);
app.use("/listing/:id/review", review);
app.use("/", users);


app.all("*", (req, res, next)=>{
  next(new expressError(404, "Page not found!"));
});  

//error handling middleware
app.use((err, req, res, next)=>{
  let{statusCode=500, message = "something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", {message});
});