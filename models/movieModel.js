const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
        id: {type:Number,unique:true},
        title: {type:String},
        year: {type:Number},
        runtime: {type:Number},
        genres: [],
        director: {type:String},
        actors:{type:String},
        plot: {type:String},
        posterUrl: {type:String},
});

const Movie = mongoose.model("movies",movieSchema);

module.exports = Movie;