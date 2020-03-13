const readline = require("readline");
const request = require("request-promise");
const downloadVideo = require("./downloadVideo");
const queue = require("./queue");
const fs = require("fs");

const serverUrl = "https://bgu-scraper.herokuapp.com";

const start = async _code => {
  let urls = [];
  try {
    urls = await queue.addToQueue(_code);
    console.log(urls);
    const fileName = urls[0].replace("http://stat.bgu.ac.il/vod/","");
    fs.writeFileSync(`./downloads/${fileName}_links.txt`,urls.join("\n"));
    // download the videos from the urls array
    for (let url of urls) {
      await downloadVideo.download(url);
    }
  } catch (error) {
    console.log("******");
    console.log(error);ß
  }

};

const wakeUpTheServer = async () => {
  const options = {
    method: "GET",
    url: `${serverUrl}/wakeup`,
    headers: {
      "cache-control": "no-cache",
      Connection: "keep-alive",
      "Accept-Encoding": "gzip, deflate",
      Host: "bgu-scraper.herokuapp.com",
      "Cache-Control": "no-cache",
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  try {
    const res = request(options);
    return res;
  } catch (error) {
    return error;
  }
};

const createFolder = () => {
  const dir = "./downloads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log("download folder created");
  }
};


const init = async () =>{
  //check server status
  const res = await wakeUpTheServer();
  console.log(res);
  //create downloads folder
  createFolder();
  console.log("\n=========================\n");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question("insert course code\n", async function(code) {
  
    //get user input
    console.log(`you selected course ${code}`);
    await start(code);
    rl.close();
  });
  
  rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
  });
}
init();