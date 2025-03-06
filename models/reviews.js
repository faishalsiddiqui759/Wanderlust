// schemas and models for reviews and every listing will containing multiple reviews.go to listing schema and store reference of reviews in listing

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require("./users.js");


const reviewsSchema = new Schema({
    comment : String, 
    rating : {
        type: Number, 
        max: 5,
        min: 1,
        default:1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", reviewsSchema);

