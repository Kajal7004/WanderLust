// const Joi = require('joi');


// module.exports.listingSchema = Joi.object({
//     listing : Joi.object({
//         title : Joi.string().required(),
//         description : Joi.string().required(),
//         location : Joi.string().required(),
//         country : Joi.string().required(),
//         price : Joi.number().required().min(0),
//         image : Joi.string().allow("", null),
//     }).required(),
// })

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),        // Validates that 'title' must be a string and is required
        description: Joi.string().required(),  // Validates that 'description' must be a string and is required
        location: Joi.string().required(),     // Validates that 'location' must be a string and is required
        country: Joi.string().required(),      // Validates that 'country' must be a string and is required
        price: Joi.number().required().min(0), // Validates that 'price' must be a number >= 0 and is required
        
        image: Joi.object({  // Make image an object with url field
            url: Joi.string().required()  // Ensure image.url is a string and required
        }).required(),
        
        // {
        // This shows error because in schema we define image as an object but in this part we try to define simply
        // image: Joi.string().allow("", null),   // Validates that 'image' must be a string, but can also be empty or null
    // }

    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});