const http = require("http");
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf-8");
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
const products = data?.products;

const server = http.createServer((req, res) => {
  console.log("path:", req.url);

  if (req.url.startsWith("/product") && req.url.split("/")[2]) {
    const id = req.url.split("/")[2];
    const product = products.find((p) => p.id === +id);
    res.setHeader("Content-Type", "text/html");
    let modifiedIndex = index
      .replace("**title**", product?.title)
      .replace("**imgUrl**", product?.thumbnail)
      .replace("**price**", product?.price)
      .replace("**rating**", product?.rating)
      .replace("**discount**", product?.discountPercentage);
    res.end(modifiedIndex);
    return;
  }

  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      const product = data?.products[0];
      let modifiedIndex = index
        .replace("**title**", product?.title)
        .replace("**imgUrl**", product?.thumbnail)
        .replace("**price**", product?.price)
        .replace("**rating**", product?.rating)
        .replace("**discount**", product?.discountPercentage);
      res.end(modifiedIndex);
      break;
    case "/api":
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>Page not found</h1>");
  }
});

server.listen(4000);
