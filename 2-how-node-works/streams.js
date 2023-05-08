const fs = require('fs');
const url = require('url');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2: streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => res.end());
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found');
  // });

  // Solution 3: pipe fixes backpressure
  const readable = fs.createReadStream('test-file.txt');
  const { pathname } = url.parse(req.url, true);
  if (pathname === '/') {
    readable.pipe(res);
  } else {
    res.end();
  }
  // A readable source to a writeable destination
});

server.listen(8000, '0.0.0.0', () => {
  console.log('Listening . . .');
});
