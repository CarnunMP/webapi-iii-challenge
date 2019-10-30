const express = 'express';
const userDb = require('../users/userDb');
const postDb = require('./posts/postDb');

const router = express.Router();
router.use('/:id', validatePostId);

router.get('/', (req, res) => { 
  postDb.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});
 
router.get('/:id', (req, res) => {
  const { id } = req.post;

  postDb.getById(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.post;

  postDb.remove(id)
    .then(count => {
      res.status(200).json({
        message: 'successfully deleted post',
        post: req.post,
        count,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.post;
  const { body } = req;

  postDb.update(id, body)
    .then(count => {
      res.status(200).json({
        message: 'sucessfully updated post',
        post: req.post,
        changes: body,
        count,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { post_id } = req.params;

  postDb.getById(post_id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({
          message: 'invalid post id',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'validatePostId failed: ' + err.message,
      });
    });
}

module.exports = router;