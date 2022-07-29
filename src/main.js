const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const files = require("./data/data.json");
const options = require("./settings/options");

const wait = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));

async function downloadAllFiles() {
  for (let index = 0; index < files.length; index++) {
    const { alias, url } = files[index];

    console.log(`File ${alias} Download Begun`);

    const response = await fetch(url);

    const writeStream = fs.createWriteStream(
      path.join(__dirname, "..", `//download//${alias}.${options.format}`)
    );

    response.body.pipe(writeStream);

    async function write() {
      return new Promise((resolve, reject) => {
        writeStream.on("finish", function () {
          resolve("complete");
        });
        writeStream.on("error", reject);
      });
    }

    await write();

    console.log(`----- DOWNLOAD COMPLETE -----`);

    await wait(options.awaitTime);
  }
}

downloadAllFiles()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.log(err);
  });
