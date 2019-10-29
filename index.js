const express = require('express');

const port = process.env.PORT || 3300;
const server = express();

server.get('/', (req, res) => {
  res.send('hello world');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
