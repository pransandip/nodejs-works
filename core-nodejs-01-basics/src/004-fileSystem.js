const fs = require("fs");
const lib = require("./001-lib");

console.time();
// const txt = fs.readFileSync("demo.txt", "utf-8");
// console.log(txt);

// This is Asynchronous
fs.readFile("demo.txt", "utf-8", (err, txt) => {
  console.log(txt);
});

console.log(lib.diff(6, 3), lib.sum(2, 2));
console.timeEnd();

 