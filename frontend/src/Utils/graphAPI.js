import axios from "axios";
import { GetSharePointToken } from "../ReduxStore/Slice/Auth/authSlice";

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

      const driveUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives`;
      const driveResponse = await axios.get(driveUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (driveResponse.data.value?.length) {
        const drive_ID = driveResponse.data.value[0].id;

        const folderUrl = `https://graph.microsoft.com/v1.0/drives/${drive_ID}/root/children`;
        const folderResponse = await axios.get(folderUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Folder Response:", folderResponse.data);

        // const folder_ID = folderResponse.data.value.find(
        //   (item) => item.name === "jobsdocument"
        // )?.id;

         const folder_ID = folderResponse.data.value.find(
          (item) => item.name === "JobManagement"
        )?.id;

        return { site_ID, drive_ID, folder_ID };
      }
    }
  } catch (err) {
    console.log("Error fetching site and drive info:", err);
    return "";
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

      return createResponse.data.id;
    }

    const existingFolder = response.data.value.find(
      (item) => item.name === folderName
    );
    return existingFolder.id;
  } catch (err) {
    console.log("Error creating folder:", err);
    return "";
  }
};

export const uploadFileToFolder = async (site_ID, drive_ID, folder_ID, file, accessToken) => {
  try {
    const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${file.name}:/content`;

    const response = await axios.put(uploadUrl, file, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream",
      },
    });

    return response.data.webUrl;

    const itemId = response.data.id;
    const publicUrl = await generateShareableLink(drive_ID, itemId, accessToken);
    console.log("File uploaded successfully publicUrl:", publicUrl);
    return publicUrl
    return { webUrl: response.data.webUrl, publicUrl };
  } catch (err) {
    console.log("Error uploading file:", err);
    return "";
  }
};

// export const generateShareableLink = async (driveId, itemId, accessToken) => {
//   try {
//     const linkType = {
//       type: "view",
//       scope: "anonymous",
//     };

//     const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/createLink`;

//     const response = await axios.post(url, linkType, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("Shareable link generated:", response.data);
//     return response.data?.link?.webUrl;
//   } catch (err) {
//     console.error("Error generating shareable link:", err);
//     return "";
//   }
// };


export const generateShareableLink = async (driveId, itemId, accessToken) => {
  try {
    const linkType = {
      type: "view",
      scope: "anonymous", // try anonymous first
    };

    const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/createLink`;

    const response = await axios.post(url, linkType, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data?.link?.webUrl;
  } catch (err) {
    console.error("Anonymous link failed, retrying with organization...", err?.response?.data || err.message);

    // Try with "organization" if anonymous fails
    try {
      const fallbackLinkType = {
        type: "view",
        scope: "organization",
      };

      const fallbackUrl = `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${itemId}/createLink`;

      const fallbackResponse = await axios.post(fallbackUrl, fallbackLinkType, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return fallbackResponse.data?.link?.webUrl;
    } catch (finalErr) {
      console.error("Both link generations failed:", finalErr?.response?.data || finalErr.message);
      return "";
    }
  }
};


export const deleteFileFromFolder = async (site_ID, drive_ID, folder_ID, fileName, accessToken) => {
  try {
    const filePath = `${fileName}`;
    const deleteUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${filePath}`;

    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log("Error deleting file:", err);
    return "";
  }
};

export const deleteFolderFromFolder = async (site_ID, drive_ID, folder_ID, accessToken) => {
  try {
    const deleteUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}`;

    const response = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error deleting folder:", err.response ? err.response.data : err.message);
    return "";
  }
};

export const SiteUrlFolderPath = async () => {
   // let siteUrl = "https://graph.microsoft.com/v1.0/sites/outbooksglobal.sharepoint.com:/sites/SharePointOnlineforJobManagement";
   
  let siteUrl = "https://graph.microsoft.com/v1.0/sites/outbooksglobal.sharepoint.com:/sites/SharePointOnlineforJobManagement";
 // let siteUrl = "https://graph.microsoft.com/v1.0/sites/outbooksglobal.sharepoint.com:/sites/outbookjobonline";
  let folderPath = "/OutBook";
  let sharepoint_token = JSON.parse(localStorage.getItem("sharepoint_token"));
  const TokenExpire = await SharePointTokenExpire(sharepoint_token);

  if (TokenExpire) {
    const newSharePointToken = await ActivityLogData();
    if (newSharePointToken === "error") {
      localStorage.setItem("sharepoint_token", JSON.stringify('sharepoint_token_not_found'));
    } else {
      localStorage.setItem("sharepoint_token", JSON.stringify(newSharePointToken));
    }
  }
  return { siteUrl, folderPath, sharepoint_token };
};

const ActivityLogData = async () => {
  let Token;
  const token = JSON.parse(localStorage.getItem("token"));
  const req = {};
  const data = { req: req, authToken: token };
  await GetSharePointToken(data)
    .then((res) => {
      Token = res.status ? res.data : "error";
    })
    .catch(() => {
      Token = "error";
    });

  return Token;
};

const SharePointTokenExpire = async (token) => {
  if (token && token !== "sharepoint_token_not_found" && token !== "error") {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp && decodedToken.exp < currentTime;
  } else {
    return true;
  }
};
