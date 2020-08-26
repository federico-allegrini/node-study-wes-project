const express = require("express");
const router = express.Router();

// Do work here
router.get("/", (req, res) => {
  // Send back stuff to client
  // res.send("Hey! It works!");
  // const jsonObj = { name: "Fede", age: 25, cool: true };
  // res.json(jsonObj);

  // Query params
  // res.send(req.query.name);
  // res.json(req.query);

  // Post params
  // res.send(req.body);

  // Render template
  // res.render("hello", { name: "Fede", dog: req.query.dog });
  res.render("content");
});

router.get("/reverse/:name/:last", (req, res) => {
  const reverse = [...req.params.name].reverse().join("");
  res.send(reverse + " - " + req.params.last);
});

module.exports = router;
