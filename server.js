const http = require("http");
const fs = require("fs");

const server = http.createServer(function(request, response) {
  //   fs.readdir("./public", function(error, files) {
  //     console.log(files);
  //   });

  // GET REQUESTS
  if (request.method === "GET") {
    console.log(request.method + " " + request.url);
    // GET (invalid path)
    if (!fs.existsSync("./public" + request.url)) {
      fs.readFile("./public/404.html", function(error, data) {
        if (error) {
          console.log("REQUEST " + request.url + " ERROR");
        } else {
          response.writeHead(404, { "Content-type": "text/html" });
          response.write(data);
          response.end();
          console.log(request.url + " does not exist");
        }
      });
    } else {
      if (request.url === "/") {
        // GET /
        fs.readFile("./public/index.html", function(error, data) {
          if (error) {
            console.log("REQUEST " + request.url + " ERROR");
          } else {
            response.writeHead(200, { "Content-type": "text/html" });
            response.write(data);
            response.end();
          }
        });
        // GET /css/styles.css
      } else if (request.url === "/css/styles.css") {
        fs.readFile("./public/css/styles.css", function(error, data) {
          if (error) {
            console.log("REQUEST " + request.url + " ERROR");
          } else {
            response.writeHead(200, { "Content-type": "text/css" });
            response.write(data);
            response.end();
          }
        });
        // GET (request.url)
      } else if (request.url) {
        fs.readFile("./public" + request.url, function(error, data) {
          if (error) {
            console.log("REQUEST " + request.url + " ERROR");
          } else {
            response.writeHead(200, { "Content-type": "text/html" });
            response.write(data);
            response.end();
          }
        });
      }
    }
  }

  // POST REQUESTS
  //   if (request.method === "POST") {
  //     console.log(request.method + " " + request.url);
  //     let body = "";
  //     request.on("data", function(data) {
  //       body += data;
  //       console.log("Partial body: " + body);
  //     });
  //     request.on("end", function() {
  //       console.log("Body: " + body);
  //       response.writeHead(200, { "Content-Type": "text/html" });
  //       response.end("post received");
  //     });

  if (request.method === "POST") {
    console.log(request.method + " " + request.url);
    request.on("data", function(data) {
      let body = data.toString();

      request.on("end", function() {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end();
      });

      // CREATE FILE AND POPULATE WITH FORM DATA
      console.log(body);
    });
  }
});

server.listen(8080);
