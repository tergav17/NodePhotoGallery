import express from 'express';
import http from 'http';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`We are up and running, on port ${port}`);
});