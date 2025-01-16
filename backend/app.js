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










/// DEMO CODE SHAREPOINT URL////////////

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Define your tenant and credentials
const tenantId = '332dcd89-cd37-40a0-bba2-a2b91abd434a';
const clientId = 'e397ff0d-76d1-4bbc-83cc-b5dfeaa069dd';
const clientSecret = '2815faa3-e4b5-4e60-926f-bc2e6fac7cf8';
const sharepointSiteUrl = 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FSharePointOnlineforJobManagement%2FShared%20Documents%2FJobManagement&viewid=f4e4d0d1%2D1883%2D4180%2D9ea3%2D1daef2e797c1';
const libraryName = 'JobManagement';

// Step 1: Get the access token
async function getAccessToken() {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  data.append('client_id', clientId);
  data.append('client_secret', clientSecret);
  data.append('scope', 'https://graph.microsoft.com/.default');

  console.log('data ---- ',data)
  console.log('tokenUrl ---- ',tokenUrl)

  try {
    const response = await axios.post(tokenUrl, data);
    return response.data.access_token;
  } catch (error) {
    console.log('Error getting access token:');
    console.log('Error getting access token:', error.response.data);
    return 
    //throw error;
  }
}


// Step 2: Upload the image to SharePoint library
async function uploadImage(imagePath) {

    console.log('imagePath ---- ',imagePath)
    return;
  const accessToken = await getAccessToken();
  
  // Read the image file
  const fileStream = fs.createReadStream(imagePath);
  
  // Set up the form data
  const form = new FormData();
  form.append('file', fileStream);

  // SharePoint API endpoint to upload a file
  const uploadUrl = `${sharepointSiteUrl}/_api/web/GetFolderByServerRelativeUrl('/sites/SharePointOnlineforJobManagement/Shared Documents/${libraryName}')/Files/add(url='${imagePath.split('/').pop()}',overwrite=true)`;

  try {
    const response = await axios.post(uploadUrl, form, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        ...form.getHeaders()
      }
    });
    
    console.log('File uploaded successfully', response.data);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Usage example
// uploadImage('./path/to/your/image.jpg');


/// ---- END DEMO CODE SHAREPOINT URL ---- ////////////


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
// const accessToken = await getAccessToken();
// await GetAccessTokenData();
 res.send("Hello Out Book")
});


// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;