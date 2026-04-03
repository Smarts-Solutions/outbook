const { parentPort, workerData } = require("worker_threads");

// const saveTimesheet = require("../services/saveTimesheet");
const saveTimesheet = require("../services/timeSheet/timeSheetService").saveTimesheet;



(async () => {

  try {

    const result = await saveTimesheet(workerData);

    parentPort.postMessage({
      status: true,
      result
    });

  } catch (error) {

    parentPort.postMessage({
      status: false,
      error: error.message
    });

  }

})();