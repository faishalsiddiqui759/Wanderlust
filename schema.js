const Joi = require('joi');

//joi schema for listing validation 
module.exports.listingSchema = Joi.object({
     listing : Joi.object({
     title: Joi.string().required(),
     description : Joi.string().required(),
     image: Joi.string().allow("", null),
     category: Joi.string().required(),
     price : Joi.number().min(0).required(),
     country: Joi.string().required(),
     location: Joi.string().required(),
     
     }).required()
});

//Joi schema for reviews

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required()
    }).required()  
});