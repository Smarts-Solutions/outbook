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


// Get Token Process
const client_id = "376ee1a2-3c24-48ac-b7cc-9a09f66b9e21";
const tenant_id = "332dcd89-cd37-40a0-bba2-a2b91abd434a";
const redirect_uri = encodeURIComponent("https://jobs.outbooks.com/backend/callback");
const scope = encodeURIComponent("offline_access Sites.ReadWrite.All");
app.get('/getToken', async (req, res) => {
   const auth_url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize` +
    `?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`;
 return res.redirect(auth_url);

});


app.get('/callback', async (req, res) => {
 const code = req.query.code;
 const client_secret = "peL8Q~lVqVTHX6oWbrS.Hh-XPI9dcgXQV6PJTbWc";
 const redirect_url = "https://jobs.outbooks.com/backend/callback";
 const scope1 = "offline_access Sites.ReadWrite.All";

  if (!code) {
    return res.status(400).send("Authorization code not received.");
  }

  try {
    const tokenUrl = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;

    const body = qs.stringify({
      grant_type: "authorization_code",
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_url,
      scope: scope1,
    });

    const response = await axios.post(tokenUrl, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = response.data;
    console.log("✅ Token Data:", tokenData);

    res.send(`
      <h3>Access Token:</h3><pre>${tokenData.access_token}</pre>
      <h3>Refresh Token:</h3><pre>${tokenData.refresh_token}</pre>
    `);

  } catch (err) {
    console.error("❌ Token error:", err.response?.data || err.message);
    res.status(500).send("Error getting access token.");
  }
});




 const GetAccessTokenData = async() => {
  const axios = require('axios');
  const qs = require('qs');
  let data = qs.stringify({
  'grant_type': 'refresh_token',
  'client_id': '9185857f-7365-4d35-b00a-5a31dcdd58d2',
  'client_secret': 'aCE8Q~nIMereO8MzR6cDsf4QUjJIGLhuBMlcPc-t',
  'refresh_token': '1.AXkAic0tMzfNoEC7oqK5Gr1DSn-FhZFlczVNsApaMdzdWNIMASR5AA.AgABAwEAAADW6jl31mB3T7ugrWTT8pFeAwDs_wUA9P8j5F-GZwVFOh_by_NPXfxUEByMvJcplAKWNhsPQtT40epQO-lc2g1x_FflTMS94BxphBD7OSKaLes4Iyx5IjdwcpAxXB1ZZos6FvTEMe8zQ8rEVnwawlow-mIjikU01Dw7bfxMH2PdnoU-mgSszjmGfSCZfRhQpqEd0SqPznBomn7CEuHDGWqfzh-h3eqAy9mK-YtzjWSQoPceC3-ohC6gNctmAf-WxI0QyERB8xCi1oRd0U3u5by1UQtqWqo80L5T8t8iqOAhV8n6brsSmt-ZlB28bY-HQYeQ6R8G8K0US_3rWtKIBTF5ZDljnzsu_SYjb_zO9NNj8B9-L-aIRz4truIfgvhVVXParWf6MjICTJ2Tq8wKa5nZcgo6UFnS0J-u8ixeRZkjSo8Uz__Oh3pXfkeZvoRrlWITUuMkJDJt-wHvq_Y5Eq0GxMWEWBoQZDTRm5T2ZgXCSImwnePGmerSpLfODswuph2akuhs9ub7Va_feoDRZDahnmh6FCqOX98mjEBUC4k3yiZYI_ZbhZnURL_A7z_kPBcX02Hmr5-n5jVHhZHFJbFzW53DMZ3Fcxd6k8WCOKjWatwXwpeAFmpqnGBUedZL8W0D95Dny7z_qk94eemwpu_aZQl5sETFYpAJ1XU9c-HzEAzK02ppsoLBTHNV76PQ0H-Yhetvt2vF6mHcj6NpYaGM5BM3RTvq-SmXp7vdkb5Rps4Sj4jv9YdhI1Mg0odiz8pPuLbBAHyMppB4mznvsus' 
  });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://login.microsoftonline.com/332dcd89-cd37-40a0-bba2-a2b91abd434a/oauth2/v2.0/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Cookie': 'fpc=AshJ25n1ISVAouDe8Gv6k9fASJ25AQAAAByKBd8OAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

 }

app.get('/',async(req,res)=>{
 res.send("Hello Out Book")
});


// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;