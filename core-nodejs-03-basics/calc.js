process.stdin.on("data", (chunk) => {
  const input = chunk.toString().trim();

  // escape hatch
  if (input === "quit") {
    process.exit(0);
  }

  try {
    const value = eval(input);
    console.log(`${value}`);
  } catch (exception) {
    console.log("I dont know how to do that");
  }

  process.stdout.write("Enter your simple equation: ");
});

process.stdout.write("Enter your simple equation: ");
