const express = require('express');
const userDb = require('./users/userDb');
const postsDb = require('./posts/postDb');

const server = express();
server.use(logger);
server.use('/users/:id', validateUserId);

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

module.exports = server;
