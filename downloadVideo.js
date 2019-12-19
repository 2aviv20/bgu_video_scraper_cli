const http = require("http");
const fs = require("fs");
const cliProgress = require("cli-progress");

module.exports = {
    download: async function (videoUrl) {
        return new Promise((resolve, reject) => {
            const fileName = videoUrl.replace("http://stat.bgu.ac.il/vod/","");
            const file = fs.createWriteStream(`./downloads/${fileName}`);
            let fileSize;
            let recived = 0;
            let precentCounter = 1;
        
            // create a new progress bar instance and use shades_classic theme
            const bar1 = new cliProgress.SingleBar(
              {},
              cliProgress.Presets.shades_classic
            );
        
            const request = http.get(`${videoUrl}`, function(
              response
            ) {
              // console.log(response.headers);
              console.log(`download - ${videoUrl}`);
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
                console.log("error ****", videoUrl);
                reject();
              });
            });
          });
    }
  };


//change the video name
//********************* */
// (async function() {
//   const videoUrl = "mivna_netunim_16.mp4";
//   let files = [];
//   for (let i = 17; i <= 26; i++) {
//     files.push(`mivna_netunim_${i}.mp4`);
//   }
//   for (let fileName of files) {
//     await download(fileName);
//   }
//   // await download(videoUrl);
// })();

// (async function() {
//     const video = new DownloadVideo();
//     await video.download("mivna_netunim_16")
// })();
