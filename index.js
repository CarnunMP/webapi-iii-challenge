// code away!
require('dotenv').config(); // Day 4 stretch

const server = require('./server');
const PORT = process.env.PORT; // Day 4 stretch

server.listen(PORT, () => {
  console.log(`\n* Server running on http://localhost:${PORT} *\n`);
})