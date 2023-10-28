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
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
  


//api get request
app.get('/api/notes', (req, res) => {   
    console.info(`${req.method} request received to get reviews`);  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        //returning json if successful
        res.status(200).json(parsedNotes);
      }
    });
  });
  


  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in db.json in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save in db.json
      const newNote = {
        title,
        text,
        review_id: uuidv4(),
      };
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          db.push(newNote)
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });
 



app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}` ));








