const express = require("express");
const Movie = require("../models/movieModel");
// const movieJson = require("../movies.json")

const router = express.Router();

// router.get("/",async(req,res)=>{
//     // await Movie.create(movieJson).then(()=>{
//     //     res.json({msg:"success"});
//     // })
// });

// as req.query is key value pair req.query[key] = value  eg ?year=2007 so,obj[year] gives 2007
// to apply regex and case insensitive to each req.query key ie. [runtime,gener,year..etc]

router.get("/",async(req,res)=>{
    
    let query = {};
    // Apply regex to string fields and handle numeric fields separately

    for (let key in req.query) {
        if (isNaN(req.query[key]) && key != 'genres') {        // Apply regex for string fields
            query[key] = { $regex: req.query[key], $options: "i" };
        }
        else if(key === 'genres'){
            let genresArr = req.query.genres.split(',') // /movies?genres=Comedy,Fantasy => string to arr
            query[key] = { $in:genresArr}               //as query[key], key=genres => genres:{$in:genresArr}
        }
         else {                                                            // Directly assign the value for numeric fields
            query[key] = Number(req.query[key]);
        }

        console.log(`Query for ${key}:`, query[key]);
    }
    console.log(query);
    //const allMovies = await Movie.find(req.query);   //.find({}) all movies || ({year=2007}) queried movie

    const allMovies = await Movie.find(query).sort("titile");
    res.json({allMovies:allMovies});
    // console.log(req.query);
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