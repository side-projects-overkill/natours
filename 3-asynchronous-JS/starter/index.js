const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject(`Error: ${err.message}`);
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(`Error ${err.message}`);
      resolve('success');
    });
  });
};

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log(`Random dog image saved to file!`);
  })
  .catch((err) => {
    console.log(`${err}`);
  });
*/

const getDogPic = async () => {
  const data = await readFilePro(`${__dirname}/dog.txt`);
  const res = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  const res1 = superagent.get(
    `https://dog.ceo/api/breed/${data}/images/random`
  );
  const res2 = superagent.get(
    `https://dog.ceo/api/breed/${data}/images/random`
  );

  const all = await Promise.all([res, res1, res2]);
  const imgs = all.map((el) => el.body.message);
  console.log(imgs);

  await writeFilePro('dog-img.txt', imgs.join('\n'));
  console.log(`Random dog image saved to file!`);
  return 'Ready 🐕';
};

/*
console.log('Will get dog pics');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('Done getting dog pics');
  })
  .catch((err) => {
    console.log(err);
  });
*/

console.log('Will get dog pics');
(async () => {
  try {
    const x = await getDogPic();
    console.log(x);
    console.log('Done getting dog pics');
  } catch (err) {
    console.log(err);
  }
})();
