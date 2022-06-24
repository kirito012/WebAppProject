let http = require('http');
let fs = require("fs");

let html = fs.readFile('./Client Side/index.html', function (err) {
    if (err) {
        throw err; 
    }
});

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(html);
  response.end('Hello World');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');