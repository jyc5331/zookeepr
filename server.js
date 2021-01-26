//path is a node module that works with file and directory paths. It provides methods that assist working in 1/2
//production environments like Heroku 2/2
const express = require("express");
//this helps heroku run and is mandatory. It must be before const app = express
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

//use allows us to run functions on the server that our requests will pass through, this creates middleware
// parse incoming string or array data into key value pairs, extended true tells the method to search for subarrays inside of the returned data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//this middleware tells our application to link itself to every file in the public folder (in this case, css and js)
app.use(express.static("public"));

//instructs the app to actually use your routes that you've modularized
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// you can use the above app.get syntax with "/*" as the argument and it will catch any typos in browser and allow
//you to interact with them. This could be useful for error catching and user functionality and always goes last

//this allows us to have a dynamically generated port that is Heroku friendly
//this should always go last
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
