const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplates.js');

//////////////////////////////////////-- Files --////////////////////////////////////////////////////////

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt', textOut);
// console.log('File writing done');

// This is asynchronous
// fs.readFile('./txt/start.txt', 'utf-8', (error, data1) => {
//   if (error) return console.log(`Error 💥`);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (error, data2) => {
//     fs.readFile('./txt/append.txt', 'utf-8', (error, data3) => {
//       fs.writeFile(
//         './txt/final.txt',
//         `${data2}\n${data3}`,
//         'utf-8',
//         (err, data) => {
//           console.log('File written');
//         }
//       );
//     });
//   });
// });

//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////-- Server --///////////////////////////////////////////////

const productData = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(productData);
const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slugs);

const templateOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(`./templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(
  `./templates/template-product.html`,
  'utf-8'
);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  // Overview
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);

    res.end(output);

    // Product
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const productPage = replaceTemplate(templateProduct, product);
    res.end(productPage);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(productData);

    // 404
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'yeah',
    });
    res.end(`<h1>404 | page doesn't exist</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(`Server has be started ⏳`);
});

///////////////////////////////////////////////
