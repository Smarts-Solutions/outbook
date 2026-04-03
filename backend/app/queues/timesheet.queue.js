const { Worker } = require("worker_threads");
const path = require("path");

class Queue {

  constructor() {

    this.queue = [];
    this.running = false;
    this.maxWorkers = 2;
    this.activeWorkers = 0;

  }

  add(data) {

    return new Promise((resolve) => {

      this.queue.push({ data, resolve });

      this.process();

    });

  }

  process() {

    if (this.activeWorkers >= this.maxWorkers) return;

    const job = this.queue.shift();

    if (!job) return;

    this.activeWorkers++;

    const worker = new Worker(
      path.join(__dirname, "../workers/timesheet.worker.js"),
      {
        workerData: job.data
      }
    );

    worker.on("message", (result) => {

      job.resolve(result);

    });

    worker.on("error", (err) => {

      console.log("Worker error", err);

    });

    worker.on("exit", () => {

      this.activeWorkers--;

      this.process();

    });

  }

}

module.exports = new Queue();