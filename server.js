const http = require("http");
const fs = require("fs");

const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    console.log(request.method + " " + request.url);
    if (request.url === "/") {
      fs.readFile("./public/index.html", function(error, data) {
        if (error) {
          console.log("REQUEST " + request.url + " ERROR");
        } else {
          response.writeHead(200, { "Content-type": "text/html" });
          response.write(data);
          response.end();
        }
      });
    }
    if (request.url === "/css/styles.css") {
      fs.readFile("./public/css/styles.css", function(error, data) {
        if (error) {
          console.log("REQUEST " + request.url + " ERROR");
        } else {
          response.writeHead(200, { "Content-type": "text/css" });
          response.write(data);
          response.end();
        }
      });
    }
  }
});

server.listen(8080);
