const fs = require('fs');
const express = require('express');
const path = require ('path');
const db = require('./db/db.json')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));

//middleware code
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// route to home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// route to notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//route of * should return index.html 
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});




app.get('/api/notes', (req,res) => {
    fs.readFile('./Develop/db/db.json', 'uft8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
        }
        res.json(parsedNotes)
    });
});



//post request to save new note to db.json and return the note

app.post('/api/notes', (req,res) => {
    console.log(`${req.method} request has been received`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        const response = {
            status: 'sucess',
            body: newNote,
        };

        res.json(response);
        } else {
            res.json('Error in post note');
        }
    })
 



app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}` ));








