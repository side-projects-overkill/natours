const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
  setTimeout(() => console.log('Timer 1 finished'), 0);
  setImmediate(() => console.log(`Immediate 1 finished`));

  setTimeout(() => console.log(`Timer 3 finished`), 3000);
  process.nextTick(() => console.log(`Process.nextTick`));

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Encrypted');
  });
});

console.log(`Hello from the top level code`);
