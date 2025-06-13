const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const FormData = require('form-data');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require("./app/routes")(app);






app.get('/',async(req,res)=>{
 res.send("Hello Out Book")
});


// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;