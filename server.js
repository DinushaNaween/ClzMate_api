const dotenv = require('dotenv');

require('dotenv').config()
const result = dotenv.config()
 
if (result.error) {
  throw result.error
}

const http = require('http');
const app = require('./app')

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);  