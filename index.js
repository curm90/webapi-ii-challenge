const express = require('express');

const db = require('./data/db/db');
const port = process.env.PORT || 3300;
const server = express();

server.get('/', (req, res) => {
  res.send('hello world');
});

server.get('/api/posts', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved' });
    });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
