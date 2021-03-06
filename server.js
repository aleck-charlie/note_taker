const express = require("express");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

let notes = [];

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data)
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', async (req, res) => {
    let newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    await fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes))
    res.json((newNote));
    
});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter((note) => note.id !== req.params.id);
    writeFileAsync(path.join(__dirname, './db/db.json'), JSON.stringify(notes));
    res.json(notes);
});

app.get("*", (req, res) => res.sendFile(path.join(dirPub, "index.html")));

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));