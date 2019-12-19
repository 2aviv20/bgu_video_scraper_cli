const http = require("http");
const fs = require("fs");
const cliProgress = require("cli-progress");

//change the video name
//********************* */
(async function() {
  const videoFile = "mivna_netunim_16.mp4";
  let files = [];
  for (let i = 17; i <= 26; i++) {
    files.push(`mivna_netunim_${i}.mp4`);
  }
  for (let fileName of files) {
    await download(fileName);
  }
  // await download(videoFile);
})();

function download(videoFile) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`./downloads/${videoFile}`);
    let fileSize;
    let recived = 0;
    let precentCounter = 1;

    // create a new progress bar instance and use shades_classic theme
    const bar1 = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    const request = http.get(`http://stat.bgu.ac.il/vod/${videoFile}`, function(
      response
    ) {
      // console.log(response.headers);
      console.log(`download - ${videoFile}`);
      bar1.start(100, 0);
      fileSize = parseInt(response.headers["content-length"]);
      response.pipe(file);
      response.on("data", chunk => {
        recived += parseInt(chunk.length);
        const precent = (recived / fileSize) * 100;
        if (
          Math.round(precent) == precentCounter &&
          precent >= 1 &&
          precent <= 100
        ) {
          precentCounter++;
          // update the current value in your application..
          bar1.update(precentCounter);
        }
      });
      response.on("end", chunk => {
        // stop the progress bar
        bar1.stop();
        //reset varibles
        fileSize = 0;
        recived = 0;
        precentCounter = 1;
        console.log("done ****");
        resolve();
      });

      response.on("error", chunk => {
        // stop the progress bar
        bar1.stop();
        //reset varibles
        fileSize = 0;
        recived = 0;
        precentCounter = 1;
        console.log("error ****", videoFile);
        reject();
      });
    });
  });
}
