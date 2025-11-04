const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

// Load optional .env file (if dotenv is installed) so locals can use .env
try {
    require('dotenv').config();
} catch (e) {
    // no dotenv — that's fine
}

const DEV_URL = process.env.DEV_URL || 'http://localhost:5500/Tconcepts';
const LIVE_URL = process.env.LIVE_URL || 'https://tconcepts.be';
const BASE_URL = process.env.BASE_URL || (process.env.NODE_ENV === 'production' ? LIVE_URL : DEV_URL);
const REDIRECT_URL = process.env.REDIRECT_URL || (BASE_URL.replace(/\/$/, '') + '/index.html?submitted=true#contact');
console.log('BASE_URL=', BASE_URL, 'REDIRECT_URL=', REDIRECT_URL);

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
            // Redirect back to the configured URL after processing the form
            res.writeHead(302, { 'Location': REDIRECT_URL });
            res.end();
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
    else if (req.method === 'GET' && req.url === '/submit') {
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