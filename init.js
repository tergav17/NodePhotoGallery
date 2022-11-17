import path from 'path';
import url from 'url';
import fs from 'fs';

console.log('Setting up login JSON...');

let userDatabase = [];

// let dummyUser = {username:'test', password:'pass', images:[]};

// userDatabase[0] = dummyUser;

console.log("Writing JSON file...");

fs.writeFileSync(getDirname() + '/json/users.json', JSON.stringify(userDatabase));

console.log("Done");

// *** GENERAL UTILITY FUNCTIONS ***

/**
 * Returns the directory path of the server
 * @returns The directory path of the server
 */
 function getDirname() {
    const filename = url.fileURLToPath(import.meta.url);
    return path.dirname(filename);
  }