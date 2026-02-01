// Import the http module to create a web server
const http = require('http');

// Define the server
const server = http.createServer((req, res) => {
  // Set the response HTTP header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send a simple "Hello" message
  res.end('Hello\n');
});

// Define the server's port and hostname
const port = 3000;
const hostname = 'localhost';

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
