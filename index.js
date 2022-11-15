import express from 'express';
import path from 'path';
import url from 'url';

const app = express();
const port = process.env.PORT;

// *** EXPRESS URL RESOLUTION STUFF ***

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

app.listen(port, () => {
  console.log(`We are up and running, on port ${port}`);
});

/**
 * Sends a file from the default directory
 * @param {*} res Express resource
 * @param {*} file File name
 */
function fsend(res, file) {
  var dirname = getDirname();

  res.sendFile(path.join(dirname, '/' + file));
}

// *** GENERAL UTILITY FUNCTIONS ***

/**
 * Returns the directory path of the server
 * @returns The directory path of the server
 */
function getDirname() {
  var filename = url.fileURLToPath(import.meta.url);
  return path.dirname(filename);
}