const express = require("express");
const { animals } = require("./data/animals");

//this helps heroku run and is mandatory. It must be before const app = express
const PORT = process.env.PORT || 3001;

const app = express();

function filterByQuery(query, animalsArray) {
  let filteredResults = animalsArray;
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

//get takes two arguments, the first establishes from whence, the second is a callback function with instructions
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

//this allows us to have a dynamically generated port that is Heroku friendly
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
