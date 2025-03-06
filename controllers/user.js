const User = require('../models/users.js');

module.exports.signUpForm = (req, res)=>{
    res.render("./listings/signUp.ejs");
};

module.exports.signUp = async(req, res)=>{
    try{
    let {email, username, password} = req.body;
    let newUser = new User({email, username});
    let registerUser = await User.register(newUser, password);
    req.login(registerUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
    console.log(registerUser);
     return res.redirect("/listing");
    });
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
};

module.exports.loginForm = async(req, res)=>{
    res.render("./listings/login.ejs");
    
};

module.exports.logginPost = async(req, res)=>{
    req.flash("success", "You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = async(req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "logged out");
        res.redirect("/listing");
    })
}