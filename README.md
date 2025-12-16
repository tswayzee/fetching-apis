# Fetching APIs with `fetch()` in JavaScript


### :books: Learning Goal

This project is in reference to the [Consuming an API Level Up](https://generalassembly.instructure.com/courses/1243/pages/consuming-an-api?module_item_id=134107). The goal here is to showcase how to consume API data within an express application. By the end of this walkthrough, you will be able to:
- Explain what an API is and how `fetch()` works
- Safely use an API key with environment variables
- Build an Express route that fetches API data
- Render results in an EJS view

### :confused: What is an API?

An API lets your app request data from another service.

Example: Your app asks OMDb: "Search movies titled 'Batman'." OMDb responds with JSON data!

### :hand: What is `fetch()`?

`fetch()` is a JavaScript function for making HTTP requests. You use fetch when you need to:
- Get data from a third-party API (movies, weather, maps, etc.)
- Work with data that isn’t stored in your own database

### :computer: Setup
1) Create and initialize your project with the following commands:
   - Create project directory: `mkdir fetching-apis`
   - Change directory: `cd fetching-apis`
   - Initialize an npm project: `npm init -y`
   - Open VS Code: `code .`
   - Create root files: `touch server.js .env .gitignore`

2) Install dependencies
`npm i express dotenv ejs`

   - `express`: server + routing
   - `dotenv`: loads environment variables from .env
   - `ejs`: lets us render dynamic HTML templates

### :movie_camera: Get an OMDb API Key 
In this walkthrough, we're going to be using OMDb to make API requests. OMDb (The Open Movie Database) is a public API that provides movie, TV show, and actor data that developers can fetch and use in their applications.
1) Go to the OMDb website: http://www.omdbapi.com/
2) Click API Key
3) Choose the FREE option (1,000 daily limit)
4) Fill out the form
5) Check your email and follow the activation instructions
6) Store your key in `.env`

`.env`
```
API_KEY=abc123456
PORT=3123
```

`.gitignore`:
```
.env
node_modules
```

### :dvd: OMDb API Request Basics

OMDb docs: http://www.omdbapi.com/#usage

This doesn't only apply to OMDb, when working with any third party API, it's important to review the documentation to understand its usage and available search parameters. These docs are typically written by the API’s developers and walk you through the *what*, *how*, and *why* of using their API correctly.

In reference to the OMDb docs, here's a few of the parameters:
| **Parameter** | **Required** | **Description** |
|----------|---------|---------|
| apikey | :white_check_mark: | Your API Key |
| s | :white_check_mark: | Search term |
| type | :x: | Type of result to return |
| y | :x: | Year of release |
| r | :x: | Type of return (json, xml) |
| page | :x: | Page number to return |


**Example Request URL**: http://www.omdbapi.com/?apikey={YOUR_KEY}&s=batman&type=movie

:musical_note: *You can also test the URL within Postman.*

The **JSON Response** from the request will look like this:
```
{
    "Search": [
        {
            "Title": "Batman Begins",
            "Year": "2005",
            "imdbID": "tt0372784",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BMzA2NDQzZDEtNDU5Ni00YTlkLTg2OWEtYmQwM2Y1YTBjMjFjXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "The Batman",
            "Year": "2022",
            "imdbID": "tt1877830",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman v Superman: Dawn of Justice",
            "Year": "2016",
            "imdbID": "tt2975590",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BZTJkYjdmYjYtOGMyNC00ZGU1LThkY2ItYTc1OTVlMmE2YWY1XkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman v Superman: Dawn of Justice",
            "Year": "2016",
            "imdbID": "tt2975590",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BZTJkYjdmYjYtOGMyNC00ZGU1LThkY2ItYTc1OTVlMmE2YWY1XkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman",
            "Year": "1989",
            "imdbID": "tt0096895",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BYzZmZWViM2EtNzhlMi00NzBlLWE0MWEtZDFjMjk3YjIyNTBhXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman Returns",
            "Year": "1992",
            "imdbID": "tt0103776",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BZTliMDVkYTktZDdlMS00NTAwLWJhNzYtMWIwMDZjN2ViMGFiXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman Forever",
            "Year": "1995",
            "imdbID": "tt0112462",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BMTUyNjJhZWItMTZkNS00NDc4LTllNjUtYTg3NjczMzA5ZTViXkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "Batman & Robin",
            "Year": "1997",
            "imdbID": "tt0118688",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BYzU3ZjE3M2UtM2E4Ni00MDI5LTkyZGUtOTFkMGIyYjNjZGU3XkEyXkFqcGc@._V1_SX300.jpg"
        },
        {
            "Title": "The Lego Batman Movie",
            "Year": "2017",
            "imdbID": "tt4116284",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BMTcyNTEyOTY0M15BMl5BanBnXkFtZTgwOTAyNzU3MDI@._V1_SX300.jpg"
        },
        {
            "Title": "Batman v Superman: Dawn of Justice (Ultimate Edition)",
            "Year": "2016",
            "imdbID": "tt18689424",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BOTRlNWQwM2ItNjkyZC00MGI3LThkYjktZmE5N2FlMzcyNTIyXkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg"
        }
    ],
    "totalResults": "514",
    "Response": "True"
}
```

### :trident: Let's Code!

:feet: **Step 1**: Add the following starter code in `server.js`:
```
// DEPENDENCIES
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Run the server: `node server.js` or `nodemon`

:feet: **Step 2**: Add middleware to read form and URL query data:
```
// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

- `express.urlencoded(...)` lets your app read form submissions
- `express.json()` lets your app read JSON bodies (useful later)

:feet: **Step 3.1**: Add a "home" route that renders a search page using `ejs`.

Create folders/files:
```
mkdir views
touch views/index.ejs
```

In `views/index.ejs`. We're going to setup a form, a couple of code snippets to pay attention to:

`<form action="/movies" method="GET">`
`action="/movies"` 
- Tells the browser where to send the request when the form is submitted, in our case: `/movies`

`<input type="text" name="q" placeholder="Search movies..." />` 
- The input field allows the user to type in a search term. The `name="q"` attribute defines the key used in the query string, so whatever the user enters can be accessed in `server.js` using `req.query.q`.

:pushpin: Complete code for `views/index.ejs`:
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Movie Search</title>
</head>
<body>
    <h1>Welcome to the OMDb Search Page!</h1>

    <form action="/movies" method="GET">
        <input type="text" name="q" placeholder="Search movies..." />
        <button type="submit">Search</button>
    </form>
</body>
</html>
```

:feet: **Step 3.2**: Back in `server.js`, add the following to render the `index.ejs` template that searches for movies:
```
app.get("/", (req, res) => {
  res.render("index.ejs");
});
```
:feet: **Step 4**: Develop a `/movies` route that fetches OMDb data. We want to accomplish the following:
- Read the user query from `req.query.q`
- Build the OMDb URL using your API key
- Fetch the data using `fetch()`
- Convert to JSON with `response.json()`
- Render results (in step 5!)

:pushpin: Add to `server.js`
```
app.get('/movies', async (req, res) => {
    try {
        // querying user search, saving it to variable
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
            details: data.Search, 
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
```


:feet: **Step 5**: Render the OMDB results from the users search.
Reviewing the data flow:
1) User submits form
2) Express fetches API data
3) Express sends data to EJS
4) EJS renders HTML dynamically
5) Browser displays the results

First off, create a movies view folder + file:
```
mkdir views/movies
touch views/movies/index.ejs
```


:eyes: Near the top of the `README`, take a look at the JSON response and get familiar with the keys within the movie object  (ie: Title, Poster, Year, etc.). With this data, you should know exactly what you're rendering onto the page. 

`details` is a property passed from `res.render`, the following code snippet is iterating through that array of objects and displaying the query data:

```
<ul>
    <% details.forEach(detail => { %>
    <li>
        <strong><%= detail.Title %></strong> (<%= detail.Year %>)
        <% if (detail.Poster && detail.Poster !== "N/A") { %>
        <div>
            <img src="<%= detail.Poster %>" alt="<%= detail.Title %>" width="120" />
        </div>
        <% } %>
    </li>
    <% }) %>
</ul>
```

:pushpin: Complete code for `views/movies/index.ejs`
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Results for <%= query %></title>
    </head>
    <body>
    <a href="/">Back</a>
    <h1>Results for: <%= query %></h1>

    <form action="/movies" method="GET">
        <input type="text" name="q" value="<%= query %>" />
        <button type="submit">Search</button>
    </form>

    <% if (error) { %>
        <p><strong>Error:</strong> <%= error %></p>
    <% } %>

    <% if (!error && details.length === 0) { %>
        <p>No results.</p>
    <% } %>

    <ul>
        <% details.forEach(detail => { %>
        <li>
            <strong><%= detail.Title %></strong> (<%= detail.Year %>)
            <% if (detail.Poster && detail.Poster !== "N/A") { %>
            <div>
                <img src="<%= detail.Poster %>" alt="<%= detail.Title %>" width="120" />
            </div>
            <% } %>
        </li>
        <% }) %>
    </ul>
</body>
</html>
```

### :checkered_flag: **Test It!** 
1) If server isn't running: `node server.js` or `nodemon`
2) Go to: `http://localhost:3000`
3) Search a movie title (ex: matrix). You should be redirected to `/movies?q=matrix` and see the results rendered!

### :rocket: Continue to Level Up!
- [OMDb Docs](https://www.omdbapi.com/#usage): play around with more advanced queries
- [Saving API Data With Mongoose](https://pages.git.generalassemb.ly/modular-curriculum-all-courses/consuming-an-api/saving-api-data-with-mongoose/): to get an idea of how to save your data to MongoDB
- Add styling to the project