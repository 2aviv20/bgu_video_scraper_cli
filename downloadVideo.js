const http = require('http');
const fs = require('fs');
const cliProgress = require('cli-progress');

const videoFile = "mivna_netunim_13.mp4";
const file = fs.createWriteStream(`./downloads/${videoFile}`);
let fileSize;
let recived = 0;
let precentCounter = 1;

 
// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
// start the progress bar with a total value of 200 and start value of 0


const request = http.get(`http://stat.bgu.ac.il/vod/${videoFile}`, function(response) {
    // console.log(response.headers);
    console.log(`download - ${videoFile}`)
    bar1.start(100, 0);
    fileSize = parseInt(response.headers["content-length"]);
    response.pipe(file);
    response.on('data', (chunk) => {
        // console.log(`Received ${chunk.length} bytes of data.`);
        recived += parseInt(chunk.length);
        const precent = (recived / fileSize)*100;
        if(Math.round(precent) == precentCounter && precent >= 1){
            // console.log(`%${Math.round(precent)}`);
            precentCounter++;
            // update the current value in your application..
            bar1.update(precentCounter);
        }

    });
    response.on('end', (chunk) => {
        // stop the progress bar
        bar1.stop();
        console.log("done ****");
    });

});

