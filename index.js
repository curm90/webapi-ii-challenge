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

server.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
