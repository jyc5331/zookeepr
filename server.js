const fs = require("fs");
//path is a node module that works with file and directory paths. It provides methods that assist working in 1/2
//production environments like Heroku 2/2
const path = require("path");
const express = require("express");
const { animals } = require("./data/animals");

//this helps heroku run and is mandatory. It must be before const app = express
const PORT = process.env.PORT || 3001;

const app = express();

//use allows us to run functions on the server that our requests will pass through, this creates middleware
// parse incoming string or array data into key value pairs, extended true tells the method to search for subarrays inside of the returned data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach((trait) => {
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  return filteredResults;
}

//goes through the array and returns a single specified instance
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

// add animal to json file and animals array in this function
function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  //a synchronoous version of fs.writeFile that doesn't have a callback function, better for smaller databases
  fs.writeFileSync(
    //the following writes our animal array to animals/jason __dirname specifies where the information will go
    path.join(__dirname, "./data/animals.json"),
    //information must be saved as JSON!, null stops us from editing our existing data, 2 puts white spaces between vars for legibility
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

//get takes two arguments, the first establishes from whence, the second is a callback function with instructions
//add what is after the slash to your URL or it will not display in the browser

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

//this allows us to access an individual animal by id at localhost and sends a 404 error if the application does not load properly
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/animals", (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal is not properly formatted.");
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

//this allows us to have a dynamically generated port that is Heroku friendly
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
