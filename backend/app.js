const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const FormData = require('form-data');

const { Worker } = require("worker_threads");
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
require("./app/routes")(app);
require("./app/cron/cron")(app);

// Get Token Process
// const client_id = "376ee1a2-3c24-48ac-b7cc-9a09f66b9e21";
// const tenant_id = "332dcd89-cd37-40a0-bba2-a2b91abd434a";
// const redirect_uri = encodeURIComponent("https://jobs.outbooks.com/backend/callback");
// const scope = encodeURIComponent("offline_access Sites.ReadWrite.All");
// const scope = encodeURIComponent("offline_access Files.ReadWrite.All Sites.ReadWrite.All");
// app.get('/getToken', async (req, res) => {
//    const auth_url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize` +
//     `?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`;
//  return res.redirect(auth_url);
// });


// app.get('/callback', async (req, res) => {
//  const code = req.query.code;
//  const client_secret = "peL8Q~lVqVTHX6oWbrS.Hh-XPI9dcgXQV6PJTbWc";
//  const redirect_url = "https://jobs.outbooks.com/backend/callback";
//  const scope1 = "offline_access Sites.ReadWrite.All";

//   if (!code) {
//     return res.status(400).send("Authorization code not received.");
//   }

//   try {
//     const tokenUrl = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;

//     const body = qs.stringify({
//       grant_type: "authorization_code",
//       code: code,
//       client_id: client_id,
//       client_secret: client_secret,
//       redirect_uri: redirect_url,
//       scope: scope1,
//     });

//     const response = await axios.post(tokenUrl, body, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     const tokenData = response.data;
//     console.log("✅ Token Data:", tokenData);

//     res.send(`
//       <h3>Access Token:</h3><pre>${tokenData.access_token}</pre>
//       <h3>Refresh Token:</h3><pre>${tokenData.refresh_token}</pre>
//     `);

//   } catch (err) {
//     console.error("❌ Token error:", err.response?.data || err.message);
//     res.status(500).send("Error getting access token.");
//   }
// });


app.get('/',async(req,res)=>{
 res.send("Hello Out Book")
});

app.get('/testing',async(req,res)=>{
    // main.js

 let row = { staff_fullname: "John Doe", staff_email: "shakirpnp@gmail.com"}

 sendEmailInWorker(row);
 res.send("Hello Out Book")
});

function sendEmailInWorker(row) {
  const worker = new Worker("./emailWorker.js", { type: "module" });
  worker.postMessage(row);
  worker.on("message", (msg) => console.log("MESSAGEEEE--- ",msg));
}


// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;