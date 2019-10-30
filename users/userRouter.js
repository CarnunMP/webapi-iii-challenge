const express = 'express';
const userDb = require('./users/userDb');

const router = express.Router();
router.use('/users/:id', validateUserId);
router.use('/users', validateUser);
router.use('/users/:id/posts', validatePost);

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  userDb.getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          message: 'invalid user id',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'validateUserId failed: ' + err.message,
      });
    });
}

function validateUser(req, res, next) {
  const { body } = req;
  // Not sure if this is working...

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!body) {
      res.status(400).json({
        message: 'missing user data',
      });
    } else if (!body.name || body.name === "") {
      res.status(400).json({
        message: 'missing required name field',
      });
    }
  }

  next();
}

function validatePost(req, res, next) {
  const { body } = req;

  if (req.method === 'POST' || req.method === 'PUT') {
    if (!body) {
      res.status(400).json({
        message: 'missing post data',
      });
    } else if (!body.text || body.text === "") {
      res.status(400).json({
        message: 'missing required text field',
      });
    }
  }

  next();
}

module.exports = router;
