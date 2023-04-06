const fs = require("fs");

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log('File writing done');

// This is asynchronous
fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
  if (error) return console.log(`Error 💥`);
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
    fs.readFile("./txt/append.txt", "utf-8", (error, data3) => {
      fs.writeFile(
        "./txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err, data) => {
          console.log("File written");
        }
      );
    });
  });
});
