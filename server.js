const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
// GET / => Home page (search form)
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// GET /movies => Search route (fetch OMDb results)
app.get('/movies', async (req, res) => {
    try {
        // querying user search
        const query = req.query.q
        
        // fetching data from query
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);

        // converting response to json
        const data = await response.json();

        // From the response, Search is the key
        // that displays an array of objects
        const details = data.Search
        res.render('movies/index.ejs', { 
            query, 
            details, 
            error: null 
        })
    } catch (error) {
        console.log(error)
        res.render('movies/index.ejs', { 
            query: req.query.q || '', 
            details: [], 
            error: `Cannot find any details on ${req.query.q}. Try another search!`
        })
    }
})

// Starts server and listens for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});