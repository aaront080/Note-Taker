const fs = require('fs');
const express = require('express');
const path = require ('path');
const db = require('./db/db.json')
const { v4: uuidv4 } = require('uuid')
const util = require('util');

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



/*const writeToFile = (destination, content) => 
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`))

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            const parsedDate = JSON.parse(data);
            parsedDate.push(content);
            writeToFile(file, parsedDate);
        }
    })
}/*

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
  

/*app.get('/api/notes', (req,res) => {
    fs.readFile('./db/db.json', 'uft8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedNotes = JSON.parse(data);
        }
        res.json(parsedNotes)
    });
});*/

app.get('/api/notes', (req, res) => {
    // Send a message to the client
    // res.status(200).json(`${req.method} request received to get reviews`);
  
    // Log our request to the terminal
    console.info(`${req.method} request received to get reviews`);
  
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        // return res.status(500).json('Error in posting review');
      } else {
        // Convert string into JSON object
        const parsedReviews = JSON.parse(data);
  
        res.status(200).json(parsedReviews);
      }
    });
  });
  


  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        review_id: uuidv4(),
      };
  
      // Obtain existing reviews
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          // return res.status(500).json('Error in posting review');
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          db.push(newNote)
  
          // Write updated reviews back to the file
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
  
  


//post request to save new note to db.json and return the note

/*app.post('/api/notes', (req,res) => {
    console.log(`${req.method} request has been received`);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');

        res.json('Note added!');
        } else {
        res.json('Error in post note');
        }
    }) */
 



app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT}` ));








