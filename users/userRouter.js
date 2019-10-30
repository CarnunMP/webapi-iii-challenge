const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();
router.use('/:id', validateUserId);

router.post('/', validateUser, (req, res) => {
  const { body } = req;

  userDb.insert(body)
    .then(user => {
      res.status(201).json({
        message: 'successfully added user',
        user,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  const { text } = req.body;
  const toPost = {
    user_id: req.params.id,
    text,
  }

  postDb.insert(toPost)
    .then(post => {
      res.status(201).json({
        message: 'successfully added post',
        post,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get('/:id', (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.user;

  userDb.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.user;

  userDb.remove(id)
    .then(count => {
      res.status(200).json({
        message: 'successfully deleted user',
        user: req.user,
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
  const { id } = req.user;
  const { body } = req;

  userDb.update(id, body)
    .then(count => {
      res.status(200).json({
        message: 'successfully updated user',
        user: req.user,
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
