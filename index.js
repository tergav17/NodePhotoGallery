import express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cookies from 'cookie-parser';
import path from 'path';
import url from 'url';
import fs from 'fs';

const app = express();
const port = process.env.PORT;

// *** CONSTANT DECLARATION ***

const uploadPath = '/upload';
const jsonPath = '/json';
const scriptPath = '/scripts';

// *** GLOBAL DECLARATION ***

let tokens = [];

// *** SETUP JSON OBJECTS ***

let userDatabase = JSON.parse(fs.readFileSync(getDirname() + jsonPath + '/users.json'));

/**
 * Looks through all of the users and deletes any images that no longer exists
 */
function untrackDeletedImages() {
  // Iterate through users
  for (const user of userDatabase) {
    for (let i = 0; i < user.images.length; i++) {
      if (!checkUploadName(user.images[i].imageName)) {
        user.images.splice(i);
        i--;
      }
    }
  }
}
untrackDeletedImages();
updateUserDatabase();

// *** EXPRESS URL RESOLUTION STUFF ***

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookies());

/**
 * We handle HTTP get requests here
 */
app.get('/*', (req, res) => {
  // Default page
  if (req.path == '/') {
    const tid = parseInt(req.cookies.token);

    // Authenticate user or redirect
    if (!checkToken(tid)) {
      return res.redirect('/login');
    }

    fsend(res, 'html/home.html');
  } 
  
  // Login page
  else if (req.path == '/login') {
    fsend(res, 'html/login.html');
  } 
  
  // New User Page
  else if (req.path == '/register') {
    fsend(res, 'html/register.html');
  } 

  // Search page
  else if (req.path == '/search') {
    const tid = parseInt(req.cookies.token);

    // Authenticate user or redirect
    if (!checkToken(tid)) {
      return res.redirect('/login');
    }

    fsend(res, 'html/search.html');
  } 

  // Error page
  else if (req.path == '/error') {
    fsend(res, 'html/error.html');
  } 

  // Unit test pag 
  else if (req.path == '/tests') {
    doTest(res);
  }

  // Serve an Image
  else if (req.path.startsWith('/u/')) {
    const imgName = req.path.substring(3);

    fsend(res, uploadPath + '/' + imgName);
  }

  // Serve a Script
  else if (req.path.startsWith('/src/')) {
    const scriptName = req.path.substring(4);

    fsend(res, scriptPath + scriptName);
  }

  // Cannot resolve path
  else res.send('Invalid path ' + req.path + '!');
});

/**
 * We handle HTTP post requests here
 */
app.post('/*', (req, res) => {

  // General image upload portal here
  if(req.path == '/post/upload') {

    try {
      // Grab an image (if it exists) out of the attached file
      const { image } = req.files;
      
      const tid = parseInt(req.cookies.token);

      let username = '';

      // Authenticate user and get username
      if (!checkToken(tid)) {
        console.log("Invalid token " + tid);
        return res.redirect('/error');
      } else {
        username = getUsername(tid);
      }

      // Check to see if it exists
      if (!image) {
        console.log("Empty upload detected!");
        return res.redirect('/error');
      }

      // Make sure it is actually an image
      if (!/image/.test(image.mimetype)) {
        console.log('Non-image upload detected!');
        console.log('Image mimetype: ' + image.mimetype);
        return res.redirect('/error');
      }

      console.log("Received an image for user " + username + " with tags: " + req.body.tags);

      // Move it to the uploads directory
      const uploadName = generateUploadName(image.name)
      image.mv(getDirname() + uploadPath + '/' + uploadName);

      // Lets add a record in the user array
      for (const user of userDatabase) {
        if (user.username == username) {
          const imageRecord = {imageName:uploadName, tags:req.body.tags};

          user.images.push(imageRecord);
        }
      }
      updateUserDatabase();

      // Redirect to image proper
      // If I was had time, I would do like a viewer page
      // but I do not
      res.redirect('/u/' + uploadName);
    } catch {
      // If something goes wrong with file uploading, just dump over to error
      return res.redirect('/error');
    }
  }

  // Username password authentication
  else if (req.path == '/post/login') {
    const body = req.body;

    let response = {valid:false, token:-1};

    if (checkUserPassword(body.username, body.password)) {
      response.token = authenticateUser(body.username);
      response.valid = true;
    }

    res.send(response);
  }

  // User creation endpoint
  else if (req.path == "/post/register") {
    const body = req.body;

    let response = {valid:false, token:-1};

    if (!checkUser(body.username) && (body.username.length > 0 && body.password.length > 3)) {
      let newUser = {username:body.username, password:body.password, images:[]};

      userDatabase.push(newUser);
      updateUserDatabase();

      response.token = authenticateUser(body.username);
      response.valid = true;
    }

    res.send(response);
  }

  // File search endpoint
  else if (req.path == "/post/search") {
    const body = req.body;

    let response = [];

    const tid = parseInt(req.cookies.token);

    let username = '';
    
    // Authenticate user and get username
    if (!checkToken(tid)) {
      console.log("Invalid token " + tid);
      return res.redirect('/error');
    } else {
      username = getUsername(tid);
    }
    
    // Lookup relevant images
    for (const user of userDatabase) {
      if (user.username == username) {
        for (const image of user.images) {
          let tags = image.tags;

          if (tags.toLowerCase().indexOf(body.query.toLowerCase()) !== -1)
            response.push(image);
        }
      }
    }

    res.send(response);
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
 * Writes new changes to the users.json file
 */
function updateUserDatabase() {
  fs.writeFileSync(getDirname() + jsonPath + '/users.json', JSON.stringify(userDatabase));
}

/**
 * Checks if a user exists or not
 * @param {*} uname User name
 * @returns If a user exists
 */
function checkUser(uname) {
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
 * Authenticates a user, adds a token, and returns it
 * @param {*} uname Username
 * @returns The new token
 */
function authenticateUser(uname) {
  let rand = -1;

  // Make a unique new random token
  while (true) {
    rand = Math.floor(Math.random() * 1000000000);

    if(!checkToken(rand)) break;
  }

  let token = {id:rand, username:uname};
  tokens.push(token);

  return token;
}

/**
 * Checks if a token is valid
 * @param {*} tid Token ID
 * @returns If a token is valid
 */
function checkToken(tid) {
  for (const token of tokens)
    if (token.id == tid) return true;

  return false;
}

/**
 * Returns the username attached to the token
 * @param {*} tid Token ID
 * @returns Username
 */
function getUsername(tid) {
  for (const token of tokens)
    if (token.id == tid) return token.username;

  return 'missingno';
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

    // If the directory doens't contain a copy of the file, then break
    if (!checkUploadName(fnew)) break;

  }

  return fnew;
}

/**
 * Checks to see if a file name already exists in uploads
 * @param {*} fin File name
 * @returns If it exists
 */
function checkUploadName(fin) {
  // Read all of the files
  const files = fs.readdirSync(path.join(getDirname(), uploadPath));

  return files.includes(fin);
}

// *** UNIT TEST FUNCTIONS ***

/**
 * Performs a number of tests on the application
 * @param {*} res Express response
 */
function doTest(res) {
  res.write("SE 317 Unit Testing Endpoint");
  res.write("\n");
  


  res.end();
}

/**
 * Asserts that a test is passing
 * @param {*} res Express response
 * @param {*} test Test label
 * @param {*} result Result of test
 * @param {*} expected Expected result
 */
function assertEqual(res, test, result, expected) {
  res.write("TEST LABEL: " + test);
  res.write("\n");

  res.write("OUTCOME: " + result);
  res.write("\n");

  res.write("EXPECTED RESULT: " + expected);
  res.write("\n");

  res.write("TEST STATUS: " + (result == expected) ? "PASS" : "FAIL");
  res.write("\n\n");
}