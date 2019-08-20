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

  if (request.method === "POST") {
    request.on("data", function(data) {
      // Parse the POST data
      let formDataObject = {};
      let formDataArray = data.toString().split("&");

      for (let i in formDataArray) {
        let keys = formDataArray[i].split("=");
        formDataObject[keys[0]] = keys[1];
      }
      if (!formDataObject["elementName"]) {
        console.log("Missing elementName");
        request.on("end", function() {
          response.writeHead(500, { "Content-Type": "application/json" });
          let responseBody = {
            error: "Missing elementName"
          };
          response.end(JSON.stringify(responseBody));
        });
      } else {
        if (
          formDataObject["elementName"].toLowerCase() === "index" ||
          formDataObject["elementName"].toLowerCase() === "404"
        ) {
          formDataObject["elementName"] = "invalidName";
        }

        // Create new HTML file and populate with POST data
        let newElement = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>The Elements - ${formDataObject["elementName"]}</title>
    <link rel="stylesheet" href="/css/styles.css" />
  </head>
  <body>
    <h1>${formDataObject["elementName"]}</h1>
    <h2>${formDataObject["elementSymbol"]}</h2>
    <h3>Atomic number ${formDataObject["elementAtomicNumber"]}</h3>
    <p>
      ${formDataObject["elementDescription"]}
    </p>
    <p><a href="/">back</a></p>
  </body>
</html>
`;
        fs.writeFile(
          "./public/" + formDataObject["elementName"].toLowerCase() + ".html",
          newElement,
          function(error) {
            if (error) throw error;
            console.log("File created successfully");
          }
        );

        // Update index.html

        fs.readFile("./public/index.html", function(error, data) {
          if (error) throw error;

          // copy file to memory
          let indexHTML = data.toString();
          if (indexHTML.search(formDataObject["elementName"]) === -1) {
            // add element to end of list
            let addedElement = indexHTML.replace(
              "</ol>",
              `  <li>
        <a href="/${formDataObject["elementName"].toLowerCase()}.html">${
                formDataObject["elementName"]
              }</a>
      </li>
    </ol>`
            );

            // update the count of elements
            let split = addedElement.split("\n");
            split.splice(10, 1);
            let join = split.join("\n").replace(
              "</h2>",
              `</h2>
    <h3>There are ${addedElement.split("<li>").length - 1}</h3>`
            );

            // write to index.html
            fs.writeFile("./public/index.html", join, function(error) {
              if (error) throw error;
              console.log("index.html updated successfully");
            });
          } else {
            console.log("index.html already updated with element");
          }
        });

        request.on("end", function() {
          response.writeHead(200, { "Content-Type": "application/json" });
          const responseBody = { success: "true" };
          response.end(JSON.stringify(responseBody));
        });
      }
    });
  }

  // PUT requests

  if (request.method === "PUT") {
    request.on("data", function(data) {
      console.log(request.method + " " + request.url);

      // Parse the PUT data
      let formDataObject = {};
      let formDataArray = data.toString().split("&");

      for (let i in formDataArray) {
        let keys = formDataArray[i].split("=");
        formDataObject[keys[0]] = keys[1];
      }

      // File must exist
      if (!fs.existsSync("./public" + request.url)) {
        console.log("resource " + request.url + " does not exist");
        request.on("end", function() {
          response.writeHead(500, { "Content-Type": "application/json" });
          let responseBody = {
            error: "resource " + request.url + " does not exist"
          };
          response.end(JSON.stringify(responseBody));
        });
        // File name must match element name
      } else if (
        "./public" + request.url !==
        "./public/" + formDataObject["elementName"].toLowerCase() + ".html"
      ) {
        console.log(
          "resource " +
            request.url +
            " and element name " +
            formDataObject["elementName"].toLowerCase() +
            ".html" +
            " do not match"
        );
        request.on("end", function() {
          response.writeHead(500, { "Content-Type": "application/json" });
          let responseBody = {
            error:
              "resource " +
              request.url +
              " and element name " +
              formDataObject["elementName"].toLowerCase() +
              ".html" +
              " do not match"
          };
          response.end(JSON.stringify(responseBody));
        });
        // All input fields must be populated
      } else if (
        !formDataObject["elementName"] ||
        !formDataObject["elementSymbol"] ||
        !formDataObject["elementAtomicNumber"] ||
        !formDataObject["elementDescription"]
      ) {
        console.log("Missing one or more values");
        request.on("end", function() {
          response.writeHead(500, { "Content-Type": "application/json" });
          let responseBody = {
            error: "Missing one or more values"
          };
          response.end(JSON.stringify(responseBody));
        });
        // File name must not be index or 404
      } else if (
        formDataObject["elementName"] === "index" ||
        formDataObject["elementName"] === "404"
      ) {
        console.log("Invalid elementName");
        request.on("end", function() {
          response.writeHead(500, { "Content-Type": "application/json" });
          let responseBody = {
            error: "Invalid elementName"
          };
          response.end(JSON.stringify(responseBody));
        });
        // Create new HTML file and populate with POST data
      } else {
        let newElement = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>The Elements - ${formDataObject["elementName"]}</title>
      <link rel="stylesheet" href="/css/styles.css" />
    </head>
    <body>
      <h1>${formDataObject["elementName"]}</h1>
      <h2>${formDataObject["elementSymbol"]}</h2>
      <h3>Atomic number ${formDataObject["elementAtomicNumber"]}</h3>
      <p>
        ${formDataObject["elementDescription"]}
      </p>
      <p><a href="/">back</a></p>
    </body>
  </html>
  `;
        fs.writeFile(
          "./public/" + formDataObject["elementName"].toLowerCase() + ".html",
          newElement,
          function(error) {
            if (error) throw error;
            console.log("File created successfully");
          }
        );

        request.on("end", function() {
          response.writeHead(200, { "Content-Type": "application/json" });
          let responseBody = { success: "true" };
          response.end(JSON.stringify(responseBody));
        });
      }
    });
  }

  // DELETE requests

  if (request.method === "DELETE") {
    console.log(request.method + " " + request.url);

    // File must exist
    if (!fs.existsSync("./public" + request.url)) {
      console.log("resource " + request.url + " does not exist");
      request.on("end", function() {
        response.writeHead(500, { "Content-Type": "application/json" });
        let responseBody = {
          error: "resource " + request.url + " does not exist"
        };
        response.end(JSON.stringify(responseBody));
      });
      // File must be user-created
    } else if (
      request.url === "/index.html" ||
      request.url === "/404.html" ||
      request.url === "/css/styles.css"
    ) {
      console.log("resource " + request.url + " cannot be deleted");
      request.on("end", function() {
        response.writeHead(500, { "Content-Type": "application/json" });
        let responseBody = {
          error: "resource " + request.url + " cannot be deleted"
        };
        response.end(JSON.stringify(responseBody));
      });
    } else {
      // Delete file
      fs.unlinkSync("./public" + request.url);

      // Update index.html
      fs.readFile("./public/index.html", function(error, data) {
        if (error) throw error;

        // Copy index.html to memory
        let indexHTML = data.toString();
        // Find the element that matches the request.url
        let split = indexHTML.split("\n");
        for (let i = 0; i < split.length; i++) {
          if (split[i].includes(request.url) === true) {
            // Splice that element from the list
            split.splice(i - 1, 3);
          }
        }
        // Count all remaining elements
        let count = 0;
        for (let i = 0; i < split.length; i++) {
          if (split[i].includes("<li>") === true) {
            count++;
          }
        }
        // Replace <h3>
        for (let i = 0; i < split.length; i++) {
          if (split[i].includes("<h3>") === true) {
            split[i] = "    <h3>There are " + count + "</h3>";
          }
        }
        // Rebuild index.html
        indexHTML = split.join("\n");
        console.log(indexHTML);
        fs.writeFile("./public/index.html", indexHTML, function(error) {
          if (error) throw error;
          console.log("index.html updated successfully");
        });
      });

      request.on("end", function() {
        response.writeHead(200, { "Content-Type": "application/json" });
        const responseBody = { success: "true" };
        response.end(JSON.stringify(responseBody));
      });

      // Send success response
      request.on("end", function() {
        response.writeHead(200, { "Content-Type": "application/json" });
        let responseBody = { success: true };
        response.end(JSON.stringify(responseBody));
      });
    }
  }
});

server.listen(8080);
