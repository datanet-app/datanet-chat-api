// Importing the necessary modules
import { createServer } from 'http';
import { get, request } from 'https';

// Define the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Create an HTTP server to handle requests

const server = createServer((req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*'); // اجازه به همه (یا دامنه خاص مثل http://localhost:3000)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 2. مدیریت درخواست Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // بدون محتوا
    res.end();
    return;
  }


  //>> GET
  if (req.method === 'GET' && req.url === '/fetch-data') {
    // Sending a request to the external server (https://chat.mise.ir/)
    get('https://chat.mise.ir/', (externalRes) => {
      let data = '';

      // Collect data from the response
      externalRes.on('data', chunk => {
        data += chunk;
      });

      // When all data is received, send it to the client
      externalRes.on('end', () => {
        // If the data starts with '{', we assume it's JSON and don't send it
        if (data.startsWith('{')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Received invalid data from source server' }));
        } else {
          // Otherwise, send the data back to the client
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        }
      });

    }).on('error', (err) => {
      console.error('Error fetching data:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch data' }));
    });

    return;
  }

  //>> POST
  if (req.method === 'POST' && req.url === '/fetch-data') {
    let body = '';

    // Collect data from the POST request
    req.on('data', chunk => { body += chunk; });

    // When all data is received, process it and forward to external server
    req.on('end', () => {
      // Sending a request to the external server (https://chat.mise.ir/)

      const options = {
        hostname: 'chat.mise.ir',
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': req.headers['content-type'], // حفظ نوع محتوا (Multipart یا Form-urlencoded)
          'Content-Length': Buffer.byteLength(body)
        }
      };



      const externalReq = request(options, (externalRes) => {
        let data = '';

        externalRes.on('data', chunk => {
          data += chunk;
        });

        externalRes.on('end', () => {
          // If the data starts with '{', we assume it's JSON and don't send it
          // if (data.startsWith('{')) {
          //   res.writeHead(400, { 'Content-Type': 'application/json' });
          //   res.end(JSON.stringify({ error: 'Received invalid data from source server' }));
          // } else {
          // Otherwise, send the data back to the client
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
          //  }
        });
      }).on('error', (err) => {
        console.error('Error fetching data:', err);
        if (res.writableEnded) return;
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch data' }));
      });
      // if (res.writableEnded) return;
      // // Optionally, you can send data with the external request (if needed)
      externalReq.write(body);
      externalReq.end();
    });


    return;
  }


  if (res.writableEnded) return;


  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');


});
const hostname = '0.0.0.0'; // for deployment purposes
// Start the server
server.listen(PORT,hostname, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
