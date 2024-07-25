const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require("./app/routes")(app);

app.get('/',(req,res)=>{
 res.send("Hello Out Book")
});

app.get('/test',(req,res)=>{


    const axios = require('axios');

    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.companieshouse.gov.uk/search/companies?q=abc',
    headers: { 
        'Authorization': 'Basic bm9uT2Y4Snk5X2thX2ZnRzJndEZ5TkxwYThsSm1zVkd2ekZadlRiRjo='
    }
    };

    axios.request(config)
    .then((response) => {
    console.log("data -- ",response.data);
    })
    .catch((error) => {
    console.log(error);
    });

    res.send("okk....")
   });



// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;