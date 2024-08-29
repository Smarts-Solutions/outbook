
const axios = require('axios');
const seachCompany = async (req, res) => {
  try {

    if (req.body.search != "" && req.body.search != null && req.body.search != undefined ) {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.companieshouse.gov.uk/search/companies?q='+req.body.search,
        headers: {
          'Authorization': 'Basic bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo='
        }
      };

      await axios.request(config)
        .then((response) => {
          return res.status(200).json({ status: true,data:response.data, message: "success.." });
        })
        .catch((error) => {
     
          return res.send({ status: false, message: error.message });
        });
    } else {
      return res.status(200).json({ status: false, message: "Please enter search value" });
    }


  } catch (error) {
    return res.send({ status: false, message: error.message });

  }
};


module.exports = {
  seachCompany,
};