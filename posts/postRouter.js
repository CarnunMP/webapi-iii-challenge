const express = 'express';
const postDb = require('./posts/postDb');

const router = express.Router();
router.use('./users/:id/posts/:post_id', validatePostId);

router.get('/', (req, res) => {

});
 
router.get('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

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