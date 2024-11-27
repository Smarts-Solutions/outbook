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






app.get('/',async(req,res)=>{
const accessToken = await getAccessToken();
 res.send("Hello Out Book")
});


// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

module.exports = app;