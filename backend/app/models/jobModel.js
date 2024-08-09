const pool = require('../config/database');

const getAddJobData = async (job) => {
  console.log("job -",job)
  const {customer_id} = job;


    return { status: true, message: 'success.', data: customer_id };


}





module.exports = {
    getAddJobData
};