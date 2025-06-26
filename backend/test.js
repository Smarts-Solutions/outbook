const axios = require("axios");

// Your bearer token (keep this secure!)
const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IklKZ1FVd2wzYUxXSkZ1XzU5aGpFZ2hmVDdXNWkxb2VHTGZhT2RwcGluSWsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEvIiwiaWF0IjoxNzQ5ODA4NjI1LCJuYmYiOjE3NDk4MDg2MjUsImV4cCI6MTc0OTgxMzMzMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsicDEiXSwiYWlvIjoiQVpRQWEvOFpBQUFBVzJHWGhyWjBiMmVaamJ3QmdQSFhBZUZPM0ZBQ2N5dXVxSllPTm5hNlNDYkI2R2VGS2tIL0RxMHJtNGUzbW5JY1JLS3FrTVR0UUpCYTBGcTgwYThRbkFnRDRrRWJLdkdLa3V5OWFKOWhrUGhHRXNmT3R6QjVaZHZYS1NUZkhOcEluVFNaTWQyQ1JMcitRNTdUZzRwWFFoUXVNclljTWpxcGYzL1BEK05xTk5zM0pGZjBESHc2a2dQWGdJSFE3S1llIiwiYW1yIjpbInB3ZCIsIm1mYSJdLCJhcHBfZGlzcGxheW5hbWUiOiJKb2IgTWFuYWdlbWVudCIsImFwcGlkIjoiMzc2ZWUxYTItM2MyNC00OGFjLWI3Y2MtOWEwOWY2NmI5ZTIxIiwiYXBwaWRhY3IiOiIxIiwiZ2l2ZW5fbmFtZSI6IkpvYnMiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxMjIuMTY4LjExNC4xMDYiLCJuYW1lIjoiSm9icyIsIm9pZCI6ImRiYTNkNWI4LTQ5NmUtNGE4NC04NThmLTU5YTQ3MTQ0Y2EzZiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwNDkyRjYwOUE3IiwicmgiOiIxLkFYa0FpYzB0TXpmTm9FQzdvcUs1R3IxRFNnTUFBQUFBQUFBQXdBQUFBQUFBQUFBTUFTSjVBQS4iLCJzY3AiOiJvcGVuaWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFVzZXIuUmVhZCBlbWFpbCIsInNpZCI6IjAwNWM3ZmM5LWY2MGYtZmNkNy05MzAxLWI2NTg4OTBjMTA2ZiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkJ3RDVlQWo4dzJkbHhsZFpmYVVzUVZvQkI1a0RxYWN3TDRENU56b3BVbDQiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiIzMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEiLCJ1bmlxdWVfbmFtZSI6IkpvYnNAb3V0Ym9va3MuY29tIiwidXBuIjoiSm9ic0BvdXRib29rcy5jb20iLCJ1dGkiOiIyVUlMY2ZrU2VrUy1YS1BKVk9JZUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2Z0ZCI6Ild1U0JFS2pLYklaT0U1N0g5NTF0VlVMOXl4cHNTLVhGZk1jUVRLRm01OGtCWlhWeWIzQmxibTl5ZEdndFpITnRjdyIsInhtc19pZHJlbCI6IjEgMiIsInhtc19zdCI6eyJzdWIiOiJVdC00UlY0UUY3MFZMYW1URGoyMnJKUWVXQWxodW13aGIxdldJY3oybFhvIn0sInhtc190Y2R0IjoxNjAzNDU2NjAyfQ.dSUx2JuQP-17uZZ2C_oXf8EU4DtVvCqkHHzacdCydYuqTKvMPnJ6WqlN_MTnnAEtKZdnFgd07tS6P7thF5m9bQKri52EgErgwjE2g5baeYfnXqPmg2LG51xhKGQSb1PpYngm3VvhDlH87-9ppv8Xw8t5_1_9OnyCPh47Pu4NSjZoALlisrMoCz2b9sZqIQ8xeGNQR1IDZ6F0BUjUoLrHBV5pkuH315ufwFQsVQaE36jpcm3l_GNSQIxs-oYBDswNjmucYQZgnQQuZc_We92zeqeom-wCWqHbJMRgen43TjBysadIzOymGNAYmr8vp_vVBdMaInY9pvHkbZl_7-VKfw";

// Your site ID (can be fetched using `/sites/{hostname}` API)
const SITE_ID = "outbooksglobal.sharepoint.com,8b9c68a0-51d7-4068-8c90-9e54a30efa4b,1f343970-82f7-41d9-932e-90d8a4e9eb15";

// Base config
const api = axios.create({
  baseURL: "https://graph.microsoft.com/v1.0",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

async function getAllDrives() {
  try {
    const res = await api.get(`/sites/${SITE_ID}/drives`);
    return res.data.value;
  } catch (err) {
    console.error("Failed to get drives:", err.response?.data || err.message);
    return [];
  }
}

async function createFolderInDrive(driveId, folderName) {
  try {
    const body = {
      name: folderName,
      folder: {},
      "@microsoft.graph.conflictBehavior": "rename",
    };

    const res = await api.post(`/drives/${driveId}/root/children`, body);
    console.log(`✅ Folder created in drive ${driveId}:`, res.data.name);
  } catch (err) {
    console.error(`❌ Failed in drive ${driveId}:`, err.response?.data?.error?.message || err.message);
  }
}

async function run() {
  const drives = await getAllDrives();

  const writableDrives = drives.filter(drive =>
    drive.driveType === "documentLibrary" &&
    drive.name.toLowerCase().includes("documents")
  );

  console.log(`Found ${writableDrives.length} writable drive(s)`);

  for (const drive of writableDrives) {
    console.log(`📂 Creating folder in: ${drive.name}`);
    await createFolderInDrive(drive.id, "TestFolder");
  }

  console.log("✅ All done");
}
run().catch(err => {
  console.error("❌ Error in run:", err.message);
});



let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://graph.microsoft.com/v1.0/drives/b!oGici9dRaECMkJ5Uow76S3A5NB_3gtlBky6Q2KTp6xVuYPWNZ6t6RamKLuhiBcoT/root/children',
  headers: { 
     'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
