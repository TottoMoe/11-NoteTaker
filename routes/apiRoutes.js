const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');

// fsUtil
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// GET api request route
router.get('/', (req, res) => {
  readFromFile('./db/db.json', 'utf8').then(function(data) {
    const notes = [].concat(JSON.parse(data))
    res.json(notes);
  })
})

// POST api request route
router.post('/', (req, res) => {
  const note = req.body;
  readFromFile('./db/db.json').then(function(data) {
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1
    notes.push(note);
    return notes;
  })
  .then(function(notes) {
    writeToFile('./db/db.json', JSON.stringify(notes))
    res.json(note);
  })
});

// DELETE api request route
router.delete('/:id', (req, res) => {
  const idToDelete = parseInt(req.params.id);
  readFromFile('./db/db.json','utf8').then(function(data) {
    const notes = [].concat(JSON.parse(data));
    const newNoteData = [];
    for (let i = 0; i < notes.length; i++) {
      if(idToDelete !== notes[i].id) {
        newNoteData.push(notes[i])
      }
    }
    return newNoteData;
  })
  .then(function(notes) {
    writeToFile('./db/db.json', JSON.stringify(notes))
    res.send('saved success!')
  }) 
})

module.exports = router;