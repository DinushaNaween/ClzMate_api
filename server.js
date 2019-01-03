const dotenv = require('dotenv');
const result = dotenv.config()
 
if (result.error) {
  throw result.error
}

console.log(process.env.JWT_KEY);

const http = require('http'); 
const app = require('./app')

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);  