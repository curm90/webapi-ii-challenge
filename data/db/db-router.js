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

// router.delete('/:id', (req, res) => {
//   const { id } = req.params;
//   const postToDelete = db.findById(id);

//   db.remove(id)
//     .then(post => {
//       if (post > 0) {
//         res.status(200).json(postToDelete);
//       } else {
//         res
//           .status(404)
//           .json({ message: 'The post with the specified ID does not exist.' });
//       }
//     })
//     .catch(() => {
//       res.status(500).json({ error: 'The post could not be removed' });
//     });
// });

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const postToUpdate = req.body;

  db.update(id, postToUpdate)
    .then(post => {
      if (post > 0) {
        res.status(200).json(postToUpdate);
      } else if (!postToUpdate.title || !postToUpdate.contents) {
        res
          .status(400)
          .json({
            errorMessage: 'Please provide title and contents for the post.'
          });
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The post information could not be modified.' });
    });
});

module.exports = router;
