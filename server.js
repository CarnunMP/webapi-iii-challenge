const express = require('express');
const userDb = require('./users/userDb');
const postsDb = require('./posts/postDb');

const server = express();
server.use(logger);
server.use('/users/:id', validateUserId);
server.use('/users', validateUser);
server.use('/users/:id/posts', validatePost);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware
function logger(req, res, next) {
  console.log(req.method, req.url, new Date().toISOString());
  next();
}

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

module.exports = server;
