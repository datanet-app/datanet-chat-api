import { createServer } from 'http';

// Define the server
const server = createServer((req, res) => {
  // Set the response HTTP header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send a simple "Hello" message
  res.end('Hello\n');
});

// Use the PORT environment variable or default to 3000 if not set
const port = process.env.PORT || 3000;
const hostname = '0.0.0.0'; // for deployment purposes

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
