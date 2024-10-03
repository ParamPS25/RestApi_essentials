const express = require("express");
const Movie = require("../models/movieModel");
// const movieJson = require("../movies.json")

const router = express.Router();

router.get("/",async(req,res)=>{
    // await Movie.create(movieJson).then(()=>{
    //     res.json({msg:"success"});
    // })
    const allMovies = await Movie.find({});
    res.json({allMovies:allMovies});
});

router.post("/add-movies",async(req,res)=>{
    try{
    const {id,title,year,runtime,genres,director,actors,plot,posterUrl} = req.body;
    await Movie.create({
        id:id,
        title:title,
        year:year,
        runtime:runtime,
        genres:genres,
        director:director,
        actors:actors,
        plot:plot,
        posterUrl:posterUrl,
    });
    res.status(201).json({msg:"movie added"});

    }catch(e){
    console.log(e);
    res.status(400).json({msg:e.message})
    }
});

router.get("/:movieId",async(req,res)=>{
    try{
    const listMovies = await Movie.findById(req.params.movieId);
    res.status(200).json({listMovies:listMovies})
    }
    catch(e){
        res.status(400).json({msg:e.message})
    }
});

module.exports = router;