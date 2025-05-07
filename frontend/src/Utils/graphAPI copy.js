import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SignIn,GetSharePointToken } from  "../ReduxStore/Slice/Auth/authSlice";


export const fetchSiteAndDriveInfo = async (siteUrl, accessToken) => {
  try {
    const response = await axios.get(siteUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.id) {
      const parts = response.data.id.split(",");
      const site_ID = parts[1];

      // Fetch Drive ID
      const driveUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives`;
      const driveResponse = await axios.get(driveUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (driveResponse.data.value?.length) {
        const drive_ID = driveResponse.data.value[0].id;

        // Fetch Folder ID
        const folderUrl = `https://graph.microsoft.com/v1.0/drives/${drive_ID}/root/children`;
        const folderResponse = await axios.get(folderUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const folder_ID = folderResponse.data.value.find(
          (item) => item.name === "JobManagement"
        )?.id;

        return { site_ID, drive_ID, folder_ID };
      }
    }
  } catch (err) {
    console.error("Error fetching site and drive info:", err);
    throw err;
  }
};

export const createFolderIfNotExists = async (site_ID, drive_ID, parentFolderId, folderName, accessToken) => {
  try {
    const folderUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${parentFolderId}/children`;
    const response = await axios.get(folderUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const folderExists = response.data.value.some(
      (item) => item.name === folderName && item.folder
    );

    if (!folderExists) {
      const createFolderUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${parentFolderId}/children`;
      const folderData = {
        name: folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename",
      };

      const createResponse = await axios.post(createFolderUrl, folderData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return createResponse.data.id; // Return new folder ID
    }

    const existingFolder = response.data.value.find(
      (item) => item.name === folderName
    );
    return existingFolder.id;
  } catch (err) {
    console.error("Error creating folder:", err);
    throw err;
  }
};

export const uploadFileToFolder = async (site_ID, drive_ID, folder_ID,folder_path , file, accessToken) => {
  try {
    const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${file.name}:/content`;

    // const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/${file.name}:/content`;

    const response = await axios.put(uploadUrl, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    //  console.log("response",response);
    return response.data.webUrl;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
};

export const deleteFileFromFolder = async (site_ID, drive_ID, folder_ID, folder_path, fileName, accessToken) => {
  try {

   
    // const deleteUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/${fileName}`;
    // Construct the file path
  //  const filePath = `${folder_path}/${fileName}`; 
    const filePath = `${fileName}`; 

  const deleteUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${filePath}`;

    // Make the DELETE request
    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err;
  }
};


export const SiteUrlFolderPath = async () => {
    let siteUrl = "https://graph.microsoft.com/v1.0/sites/outbooksglobal.sharepoint.com:/sites/SharePointOnlineforJobManagement";
    let folderPath = "/OutBook"
    let sharepoint_token = JSON.parse(localStorage.getItem("sharepoint_token"));
    const TokenExpire =  await SharePointTokenExpire(sharepoint_token);
  
    if (TokenExpire) { 
     const newSharePointToken = await ActivityLogData();
     if(newSharePointToken == "error"){
        localStorage.setItem("sharepoint_token", JSON.stringify('sharepoint_token_not_found'));
      }else{
        localStorage.setItem("sharepoint_token", JSON.stringify(newSharePointToken));
      }
    }
    return { siteUrl,folderPath,sharepoint_token};
}


const ActivityLogData = async () => {
    let Token
    const token = JSON.parse(localStorage.getItem("token"));
    const req = { };
    const data = { req : req ,authToken: token };
    await GetSharePointToken(data)
      .then((res) => {
        if (res.status) {
            Token = res.data
        } else {
            Token = "error";
        }
      })
      .catch((error) => {
        Token = "error";
      });

      return Token;
};

const SharePointTokenExpire = async (token) => {
    if(token != null && token != undefined && token != "" && token != "sharepoint_token_not_found" && token != "error"){
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp && decodedToken.exp < currentTime) {
    
     return true;
    }else{
    
     return false;
    }
  }else{
    return true;
  }

};
