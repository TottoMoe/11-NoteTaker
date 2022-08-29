const express = require('express');
const path = require('path');
// const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// fsUtil
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);

// GET api request route
app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json', 'utf8').then(function(data) {
    notes = [].concat(JSON.parse(data))
    res.json(notes);
  })
})

// POST api request route
app.post('/api/notes', (req, res) => {
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
app.delete('/api/notes/:id', (req, res) => {
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public.notes.html'))
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

app.listen(PORT, () => {
  console.log(`App listening on port  http://localhost:${PORT}`);
})