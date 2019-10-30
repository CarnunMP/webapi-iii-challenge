const express = require('express');
const postDb = require('./postDb');

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
  // Hmm... ideally I'd validatePost here. How best to go about it?
  // Import from userRouter? Put middleware in its own file(s)?
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
  const { id } = req.params;

  postDb.getById(id)
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
      console.log("yo");
      res.status(500).json({
        message: 'validatePostId failed: ' + err.message,
      });
    });
}

module.exports = router;