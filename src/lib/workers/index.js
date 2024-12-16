/* eslint-disable */

const { parentPort } = require("node:worker_threads");

// Perform the heavy computation
let sum = 0;

for (let i = 0; i < 10_000_000_000; i++) {
  sum += 2;
}

// Send the result back to the main thread
parentPort.postMessage(sum);
