
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


        //   axios({
        //     method: 'get',
        //     url: `https://api.companieshouse.gov.uk/company/${companyNumber}/officers`,
        //     headers: {
        //         'Authorization': 'Basic bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo='
        //     }
        // })
        //     .then(officerResponse => {
        //         console.log('Officer details:', officerResponse.data);
        //     })
        //     .catch(err => {
        //         console.error('Error fetching officer details:', err);
        //     });
 

      
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

const getCompanyOfficerDetails = async (req, res) => {
  try {

    if (req.body.company_number != "" && req.body.company_number != null && req.body.company_number != undefined ) {

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.companieshouse.gov.uk/company/'+req.body.company_number+'/officers',
        headers: {
          'Authorization': 'Basic bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo='
        }
      };

       await axios.request(config)
        .then((response) => {
          return res.status(200).json({ status: true,data:response.data.items, message: "success.." });
        })
        .catch((error) => {
          return res.send({ status: false, message: error.message });
        });

        
    } else {
      return res.status(200).json({ status: false, message: "Please enter company number" });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });

  }
}



module.exports = {
  seachCompany,
  getCompanyOfficerDetails
};