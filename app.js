const readline = require("readline");
const scraper = require("./scraper");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("insert course code\n", async function(code) {
  console.log(`you selected course ${code}`);
  await scraper.start(code);
  rl.close();
});

rl.on("close", function() {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
