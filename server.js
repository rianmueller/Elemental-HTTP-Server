const http = require("http");
const fs = require("fs");

const server = http.createServer(function(request, response) {
  //   fs.readdir("./public", function(error, files) {
  //     console.log(files);
  //   });

  //   if (fs.existsSync("./public" + request.url)) {
  //       //file exists
  //   } else {
  //     // file does not exist
  //   }

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
});

server.listen(8080);
