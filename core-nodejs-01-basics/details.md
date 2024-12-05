`In node every file is a module`

### Common.js module example:

```
function sum(a, b) {
  return a + b;
}

exports.sum = sum;
```

```
exports.sum = (a, b) => {
  return a + b;
}

```

### ES module example:

```
const diff = (a, b) => {
  return a - b;
};

const sum = (a, b) => {
  return a + b;
};

export { sum, diff };
```

`In Callback first parameter will be error`

This is Asynchronous

```
fs.readFile("demo.txt", "utf-8", (err, txt) => {
  // readFile is asynchronous
  console.log(txt);
});

```

`Why you using prisma ?`

- Prisma is a tool to communicate to our database from Node js
- Its a ORM(Object relational mapping)
- you can create data model in one file(prisma schema)
- It is a type safe database client
- Hassle-free migrations
- It has prisma studio (Visual database browser)

`Dependencies`

- Major version | Minor version | patch version
- \* | ^ | ~
