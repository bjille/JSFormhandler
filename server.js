const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();

        });
        req.on('end', () => {
            const parsedData = querystring.parse(body);
            console.log('Form Data:', parsedData);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Form submission received\n');
        });
    } else if (req.method === 'GET' && req.url === '/') {
        fs.readFile('Tconcepts/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error\n');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
        )
    }
    else if (req.method === 'GET' && req.url === 'submit') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Submit endpoint\n');

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
    }

});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});