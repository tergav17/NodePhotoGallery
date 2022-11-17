import express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import url from 'url';
import fs from 'fs';

const app = express();
const port = process.env.PORT;

// *** CONSTANT DECLARATION ***

const uploadPath = '/upload';
const jsonPath = '/json';

// *** GLOBAL DECLARATION ***

let tokens = [];

// *** SETUP JSON OBJECTS ***

let userDatabase = JSON.parse(fs.readFileSync(getDirname() + jsonPath + '/users.json'));

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
  
  // New User Page
  else if (req.path == '/register') {
    fsend(res, 'html/newUser.html');
  } 

  // Search page
  else if (req.path == '/search') {
    fsend(res, 'html/search.html');
  } 

  // Error page
  else if (req.path == '/error') {
    fsend(res, 'html/error.html');
  } 

  // Serve an Image
  else if (req.path.startsWith('/u/')) {
    const imgName = req.path.substring(3);

    fsend(res, 'upload/' + imgName);
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
    image.mv(getDirname() + uploadPath + '/' + generateUploadName(image.name));

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

// *** LOGIN SERVICE STUFF ***

/**
 * Checks if a user exists or not
 * @param {*} uname User name
 * @returns If a user exists
 */
function doesUserExist(uname) {
  // Iterate over database
  for (const user of userDatabase)
    if (user.username == uname) return true;

  return false;
}

/**
 * Checks if a user can log in with a password
 * @param {*} uname Username 
 * @param {*} pass Password
 * @returns True if they match
 */
function checkUserPassword(uname, pass) {
// Iterate over database
  for (const user of userDatabase) 
    if (user.username == uname && user.password == pass) return true; 

  return false;
}

/**
 * 
 * @param {*} uname 
 * @param {*} pass 
 */
function authenticateUser(uname, pass) {

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

/**
 * Turns the uploaded filename into a randomly generated filename
 * @param {*} fin Uploaded starter filename
 * @returns A new name for the file to be stored
 */
function generateUploadName(fin) {
  const ext = fin.substring(fin.lastIndexOf('.'), fin.length);

  let serial = '';
  let fnew = '';

  while (true) {

    for (let i = 0; i < 8; i++) {
      let rand = Math.floor(Math.random() * 26) + 65;
      rand += Math.floor(Math.random() * 2) * 32;
      
      serial = serial + String.fromCharCode(rand);
    }

    // New file name
    fnew = serial + ext;

    // Read all of the files
    const files = fs.readdirSync(path.join(getDirname(), uploadPath));

    // If the directory doens't contain a copy of the file, then break
    if (!files.includes(fnew)) break;

  }

  return fnew;
}