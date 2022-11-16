import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import url from 'url';

const app = express();
const port = process.env.PORT;

// *** EXPRESS URL RESOLUTION STUFF ***

app.use(fileUpload());

/**
 * We handle HTTP get requests here
 */
app.get('/*', (req, res) => {
  // Default page
  if (req.path == '/') {
    fsend(res, 'html/home.html');
  } 
  
  // Login page
  else if (req.path == '/login') {
    fsend(res, 'html/login.html');
  } 
  
  // Cannot resolve path
  else res.send('Invalid path ' + req.path + '!');
});

/**
 * We handle HTTP post requests here
 */
app.post('/*', (req, res) => {

  // General image upload portal here
  if(req.path == '/upload') {
    // Grab an image (if it exists) out of the attached file
    const { image } = req.files;
    
    // Check to see if it exists
    if (!image) {
      console.log("Empty upload detected!");
      return res.sendStatus(400);
    }

    // Make sure it is actually an image
    if (!/image/.test(image.mimetype)) {
      console.log('Non-image upload detected!');
      console.log('Image mimetype: ' + image.mimetype);
      return res.sendStatus(400);
    }

    console.log("Recieved an image");

    // Send all good status
    res.sendStatus(200);
  }
});

app.listen(port, () => {
  console.log(`We are up and running, on port ${port}`);
});

/**
 * Sends a file from the default directory
 * @param {*} res Express resource
 * @param {*} file File name
 */
function fsend(res, file) {
  const dirname = getDirname();

  res.sendFile(path.join(dirname, '/' + file));
}

// *** GENERAL UTILITY FUNCTIONS ***

/**
 * Returns the directory path of the server
 * @returns The directory path of the server
 */
function getDirname() {
  const filename = url.fileURLToPath(import.meta.url);
  return path.dirname(filename);
}