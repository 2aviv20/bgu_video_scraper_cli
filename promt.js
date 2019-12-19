const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let link
rl.question("insert the link of the first video\n", function(link) {
  rl.question("start from video number?\n", function(start) {
    rl.question("up to video number?\n", function(last) {
      console.log(`${link}, from ${start} to ${last}`);
      rl.close();
    });
  });
});

rl.on("close", function() {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
