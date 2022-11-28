# NodePhotoGallery
A simple Node.JS photo uploading and display app

## Prerequisites
- [Node.js](https://nodejs.org/en/download/)
    - Linux/Unix: Install `nodejs` by following these [instructions](https://github.com/nodesource/distributions/blob/master/README.md).
    - Windows: Install it with the command `winget install OpenJS.NodeJS.LTS` on modern Windows versions
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Express.js](https://expressjs.com/en/starter/installing.html)

## How to run
0. Run `npm install` to ensure that all packages are installed.
1. Set the environment variable `PORT`
    - Linux: `export PORT=8080`
    - Windows: `set PORT=8080`
2. Run `npm run init`
3. Run `node index.js`
4. Open your browser and head to `{HOST-IP}:{PORT}`. If this instance is running locally and the `PORT` environment variable is set to `8080`, then head to `localhost:8080`.

### Alternatively

0. Navigate to https://photogallery317.azurewebsites.net/
1. You may need to wait a minute or two if Azure has decided to temporarily spin down the instance that the Node server is running on.

## How to use
1. You will first see a `Login` screen. You will want to press the `New User` button to create an account. Fill in all the fields, and then press the `Register User` button.
2. You can now log in. Afterwards, you'll see an `Upload a Photo` screen. You can upload any photo you wish alongside tags, or search for photos by tags.
    - Uploading an image will redirect you to a fullscreen view. Back out with the browser to return to the previous page.
    - Searching will ask you for a query. The page will return all images with that tag.
3. Afterwards, you can log out, restart the app, and back in to see that both login and images persist.

## Team
- Gavin Tersteeg
- Isaiah Mundy
- Yadiel Johnson
