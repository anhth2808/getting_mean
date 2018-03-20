var mongoose = require("mongoose");

var openTimeSchema = new mongoose.Schema({
    days: {type: String, require: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, require: true}
});
var reviewSchema = new mongoose.Schema({
    author: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    reviewText: String,
    createOn: {type: Date, "default": Date.now}
});

var locationSchema = new mongoose.Schema({
    name: {type: String, require: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    facilities: [String],
    coords: {type: [Number], index: "2dsphere", require: true},
    openingTimes: [openTimeSchema],
    reviews: [reviewSchema]
});

mongoose.model("Location", locationSchema);