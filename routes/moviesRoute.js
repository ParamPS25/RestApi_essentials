const express = require("express");
const Movie = require("../models/movieModel");
// const movieJson = require("../movies.json")

const router = express.Router();

//router.get("/",async(req,res)=>{
//     await Movie.create(movieJson).then(()=>{
//         res.json({msg:"success"});
//     })
// });

// as req.query is key value pair req.query[key] = value  eg ?year=2007 so,obj[year] gives 2007
// to apply regex and case insensitive to each req.query key ie. [runtime,gener,year..etc]

router.get("/",async(req,res)=>{
    console.log(req.query)
    try{
        let sortFlag = false;
        let sortFix = '';
        let selectFlag = false;
        let selectFix = '';

        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let skip = (page - 1) * limit;


        let query = {};
        // Apply regex to string fields and handle numeric fields separately

        for (let key in req.query) {
            if (key === 'page' || key === 'limit') {
                continue;
            }
            if (isNaN(req.query[key]) && key != 'genres' && key != 'sort' && key != 'select') {        // Apply regex for string fields
                query[key] = { $regex: req.query[key], $options: "i" };
            }
            else if(key === 'genres'){
                let genresArr = req.query.genres.split(',') // /movies?genres=Comedy,Fantasy => string to arr
                query[key] = { $in:genresArr}               //as query[key], key=genres => genres:{$in:genresArr}
            }
            else if(key === 'sort'){                            // as movies?sort=title,year => seprate , with space as Movie.find().sort(sortQuery)
                sortFlag = true;

                sortFix = req.query.sort.replace(","," ");
                console.log('Sort fields:', sortFix);
            }
            else if(key === 'select'){
                selectFlag = true;

                selectFix = req.query.select.replace(","," ");
                console.log('select fields', selectFix);
            }
            else {                                                            // Directly assign the value for numeric fields
                query[key] = Number(req.query[key]);
            }

            console.log(`Query for ${key}:`, query[key]);   // query must be undefined for sort select page limit skip as it is queryObj passing to find required documents in Movie model whereas select,sort,page,limit are function which are applied on it !!
        }
        console.log(query);
        //const allMovies = await Movie.find(req.query);   //.find({}) all movies || ({year=2007}) queried movie

        let allMovies;
        if(skip != null){
        if(sortFlag){
            allMovies = selectFlag ? await Movie.find(query).sort(sortFix).select(selectFix).skip(skip).limit(limit)
                                    : await Movie.find(query).sort(sortFix).skip(skip).limit(limit);;
        }else{
            allMovies = selectFlag ? await Movie.find(query).select(selectFix).skip(skip).limit(limit)
                                    : await Movie.find(query).skip(skip).limit(limit);
        }
    }else{
        allMovies = await Movie.find(query);
    }
        res.json({allMovies:allMovies});
    
    }catch(e){
        res.status(500).json({msg:"internal server error"})
    }
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