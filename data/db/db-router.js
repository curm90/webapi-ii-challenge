const express = require('express');
const db = require('./db');

const router = express.Router();

router.post('/', (req, res) => {
  const post = req.body;
  db.insert(post)
    .then(data => {
      console.log(data);
    })
    .catch(() => {
      res.status(500).json({
        error: 'There was an error while saving the post to the database'
      });
    });
});

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
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

module.exports = router;
