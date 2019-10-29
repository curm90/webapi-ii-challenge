const express = require('express');
const db = require('./db');

const router = express.Router();

router.post('/', (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    db.insert({ title, contents })
      .then(data => {
        res.status(201).json({
          id: data.id,
          title,
          contents
        });
      })
      .catch(() => {
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        });
      });
  }
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

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(post => {
      if (post) {
        res.status(200).json({ message: 'Post was deleted successfully' });
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res.status(500).json({ error: 'The post could not be removed.' });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title || !contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    db.update(id, { title, contents })
      .then(post => {
        if (post > 0) {
          res.status(200).json({ ...post, title, contents });
        } else {
          res.status(404).json({
            message: 'The post with the specified ID does not exist.'
          });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'The post information could not be modified.' });
      });
  }
});

router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  db.findPostComments(id)
    .then(postComments => {
      if (postComments) {
        res.status(200).json(postComments);
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' });
    });
});

router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  db.findById(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      } else if (!text) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide text for the comment.' });
      } else {
        db.insertComment({ text, post_id: id }).then(comment => {
          res.status(201).json(comment);
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: 'There was an error while saving the comment to the database'
      });
    });
});

module.exports = router;
