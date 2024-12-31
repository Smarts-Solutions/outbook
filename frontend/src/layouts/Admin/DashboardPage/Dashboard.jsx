import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardData,
  ActivityLog,
} from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import qs from 'qs';

const Dashboard = () => {
  const [visibleLogs, setVisibleLogs] = useState(4); // Initially show 5 logs

  // Handle "Load More" functionality
  const loadMoreLogs = () => {
    setVisibleLogs((prev) => prev + 4); // Show 5 more logs each time
  };
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const getActiveTab = sessionStorage.getItem('activDashborde');
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const [dashboard, setDashboard] = useState([]);
  const [getActiviyLog, setActivityLog] = useState([]);

  const currentDate = new Date();
  const [selectedTab, setSelectedTab] = useState(getActiveTab || "this_week");

  const handleTabChange = (event) => {
    sessionStorage.setItem('activDashborde', event.target.value);
    setSelectedTab(event.target.value);
  };

  const hours = currentDate.getHours();

  let greeting;
  if (hours < 12) {
    greeting = "Good Morning!";
  } else if (hours < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  useEffect(() => {
    GetDashboardData();
  }, [selectedTab]);

  useEffect(() => {
    ActivityLogData();
  }, []);

  const GetDashboardData = async () => {
    const req = { staff_id: staffDetails.id, date_filter: selectedTab };
    const data = { req: req, authToken: token };
    await dispatch(DashboardData(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setDashboard(res.data);
        } else {
          setDashboard([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ActivityLogData = async () => {
    const req = { staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(ActivityLog(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setActivityLog(res.data);
        } else {
          setActivityLog([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { month: "short", day: "numeric" };
    const monthDay = date.toLocaleDateString("en-US", options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const time = date.toLocaleTimeString("en-US", timeOptions);
    return `${monthDay} (${time.toUpperCase()})`;
  };


  const handleClick = async (type, data, heading) => {
    if (parseInt(data.count) === 0) {
      return;
    }
    const req = { staff_id: staffDetails.id, key: type, ids: data.ids, heading: heading }
    navigate("/admin/dashboard/data", { state: { req: req } });
  }






  // Start Process SharePoint Refresh Process Start //

  const [newAccessToken, setNewAccessToken] = useState("");
  const [error, setError] = useState("");
// Refresh Token
  const refreshToken = async () => {
    // const refreshToken = "1.AXkAic0tMzfNoEC7oqK5Gr1DSn-FhZFlczVNsApaMdzdWNIMASR5AA.AgABAwEAAADW6jl31mB3T7ugrWTT8pFeAwDs_wUA9P8j5F-GZwVFOh_by_NPXfxUEByMvJcplAKWNhsPQtT40epQO-lc2g1x_FflTMS94BxphBD7OSKaLes4Iyx5IjdwcpAxXB1ZZos6FvTEMe8zQ8rEVnwawlow-mIjikU01Dw7bfxMH2PdnoU-mgSszjmGfSCZfRhQpqEd0SqPznBomn7CEuHDGWqfzh-h3eqAy9mK-YtzjWSQoPceC3-ohC6gNctmAf-WxI0QyERB8xCi1oRd0U3u5by1UQtqWqo80L5T8t8iqOAhV8n6brsSmt-ZlB28bY-HQYeQ6R8G8K0US_3rWtKIBTF5ZDljnzsu_SYjb_zO9NNj8B9-L-aIRz4truIfgvhVVXParWf6MjICTJ2Tq8wKa5nZcgo6UFnS0J-u8ixeRZkjSo8Uz__Oh3pXfkeZvoRrlWITUuMkJDJt-wHvq_Y5Eq0GxMWEWBoQZDTRm5T2ZgXCSImwnePGmerSpLfODswuph2akuhs9ub7Va_feoDRZDahnmh6FCqOX98mjEBUC4k3yiZYI_ZbhZnURL_A7z_kPBcX02Hmr5-n5jVHhZHFJbFzW53DMZ3Fcxd6k8WCOKjWatwXwpeAFmpqnGBUedZL8W0D95Dny7z_qk94eemwpu_aZQl5sETFYpAJ1XU9c-HzEAzK02ppsoLBTHNV76PQ0H-Yhetvt2vF6mHcj6NpYaGM5BM3RTvq-SmXp7vdkb5Rps4Sj4jv9YdhI1Mg0odiz8pPuLbBAHyMppB4mznvsus";
    // const url = "https://login.microsoftonline.com/332dcd89-cd37-40a0-bba2-a2b91abd434a/oauth2/v2.0/token";
    // const data = {
    //   grant_type: "refresh_token",
    //   client_id: "9185857f-7365-4d35-b00a-5a31dcdd58d2",
    //   client_secret: "aCE8Q~nIMereO8MzR6cDsf4QUjJIGLhuBMlcPc-t",
    //   refresh_token: refreshToken,
    // };

    // try {
    //   const response = await axios.post(url, new URLSearchParams(data));
    //   console.log("New Access Token: " + response);
    //   if (response.data.access_token) {

    //     console.log("New Access Token: IFFFFF " + response);
    //     setNewAccessToken(response.data.access_token);
    //   } else {
    //     console.log("New Access Token: ELSEEEEE " + response);
    //     setError("Error refreshing access token: " + JSON.stringify(response.data));
    //   }
    // } catch (err) {
    //   console.log("New Access Token: Err " + err);
    //   setError("Error: " + err.message);
    // }

   
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
      console.log("response - ",response);
    })
    .catch((error) => {
      console.log(error);
    });
    



  };



 let site_ID = "";
 let folder_path = "/Shared Documents/Job Management"; // Replace with your folder path
 let drive_ID = "";
 let folder_ID = "";

  // get data
  const [data, setData] = useState(null);

  const accessToken =
    "eyJ0eXAiOiJKV1QiLCJub25jZSI6IjVPX3ZKWG9tRTVPLUFlZV93TnFKczgyOTZOblltVnRlZWFxZnRGa0hjbTAiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEvIiwiaWF0IjoxNzM1NjQyNzMzLCJuYmYiOjE3MzU2NDI3MzMsImV4cCI6MTczNTY0NzM1NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhZQUFBQTg4TDRzc2c4OWJDZHk0MDBHWG91UTJQWWs3S3VTN29jQ3B4a3V3RWRuQ2NYT2FpV0dvU3NWVW9FVXFPcDRIVnMiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik91dGJvb2tBcHAiLCJhcHBpZCI6IjkxODU4NTdmLTczNjUtNGQzNS1iMDBhLTVhMzFkY2RkNThkMiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQmhhZ2F0IiwiZ2l2ZW5fbmFtZSI6Ik5pa2l0YSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwMy4xMDMuMjEzLjIxNyIsIm5hbWUiOiJOaWtpdGEgQmhhZ2F0Iiwib2lkIjoiNDI2MWM4MTMtMjViNC00ZjM1LWJmNmItNGE5NzVjZjBhMDU3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0MUFFRkI5QTQiLCJyaCI6IjEuQVhrQWljMHRNemZOb0VDN29xSzVHcjFEU2dNQUFBQUFBQUFBd0FBQUFBQUFBQUFNQVNSNUFBLiIsInNjcCI6Ik15RmlsZXMuUmVhZCBNeUZpbGVzLldyaXRlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiLUFhU09zbnd2T0hmZkhzZmJjbmgwenBKNUtZckhxQ0RiaFluN0hMZmctayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjMzMmRjZDg5LWNkMzctNDBhMC1iYmEyLWEyYjkxYWJkNDM0YSIsInVuaXF1ZV9uYW1lIjoiTmlraXRhLkJoYWdhdEBvdXRib29rcy5jb20iLCJ1cG4iOiJOaWtpdGEuQmhhZ2F0QG91dGJvb2tzLmNvbSIsInV0aSI6ImVFaGx6OE5DeWstRG1ZOWROR3YtQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImNmMWMzOGU1LTM2MjEtNDAwNC1hN2NiLTg3OTYyNGRjZWQ3YyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDIyIiwieG1zX3N0Ijp7InN1YiI6IjRidjJCemlEWUxUNThPVzV6UF91N2Zqc3RkLWFxVEYzamFuZHdDbF9WdkUifSwieG1zX3RjZHQiOjE2MDM0NTY2MDJ9.E0mr6Po_ez3BAHR_64WAdYfqIy_8rrIGS7ZP3ktqC5VYR4tz247g9IWy9z6OyELPGFo20IT4danf2sadYp9d0votF_k2XypPuZBVzMPZqu3Uw9Pw8254NLXt7a6E7JXfGOeyOp4jkTEqDcrtRsJ9bkQZ-aHn1l4JZ4P9P0T90BJ30khLbh61eN1h6AC8nLWC09cdb8efYCvgJkE2CqUVJ6NODTs8sc2woaf4N2WefWGrY27T8wGGdPBezbUCM4OmNj_wRvZLwZsaVZSytia3q3SJsLBbq10YZOUt6qKaysa6O5Av2ly_ndQUGpTAKpM8P0tOn40ABFabU47hBnX5dA";

  const siteUrl =
    "https://graph.microsoft.com/v1.0/sites/outbooksglobal.sharepoint.com:/sites/SharePointOnlineforJobManagement";

  const fetchData = async () => {
    try {
      const response = await axios.get(siteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
   
      if(response.data.id != undefined && response.data.id != null && response.data.id != ""){
        const parts = response.data.id.split(",");
        site_ID = parts[1];
       

        // Get Drive ID
        const driveUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives`;
        //const driveUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drive/root:${folder_path}:/children`;
        
        const driveResponse = await axios.get(driveUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if(driveResponse.data.value != undefined && driveResponse.data.value != null && driveResponse.data.value != ""){

          drive_ID = driveResponse.data.value[0].id;


          

          // Get Folder ID
          const folderUrl = `https://graph.microsoft.com/v1.0/drives/${drive_ID}/root/children`;
          const folderResponse = await axios.get(folderUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          
          if(folderResponse.data.value != undefined && folderResponse.data.value != null && folderResponse.data.value != ""){

            const jobManagementObject = folderResponse.data.value.find((item) => item.name === "JobManagement");

            if(jobManagementObject != undefined && jobManagementObject != null && jobManagementObject != ""){
              folder_ID = jobManagementObject.id;
            }

            console.log("site - ID ", site_ID);
            console.log("drive_ID - ID ", drive_ID);
            console.log("folder_ID", folder_ID);


            return {site_ID: site_ID,drive_ID :drive_ID,folder_ID:folder_ID};

              //uploadFileToFolder
              const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/shk.txt:/content`;
              const file = new Blob(["Hello, SHK"], { type: "text/plain" });
              const formData = new FormData();
              formData.append("file", file);

              const uploadResponse = await axios.put(uploadUrl, formData, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              });

            console.log("uploadResponse - ",uploadResponse);






            // Upload an image
            // const imagePath = "/Activity.PNG";
            // const imageFile = await readFileAsBlob(imagePath); // Helper function to read file as Blob
            // const imageUploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/SHK.png:/content`;

            // const imageUpload =   await axios.put(imageUploadUrl, imageFile, {
            //   headers: {
            //     Authorization: `Bearer ${accessToken}`,
            //     "Content-Type": "image/png",
            //   },
            // });

            // console.log("Image uploaded successfully.",imageUpload);

            // Upload a PDF
          //   const pdfPath = "C:/Users/SHK/Desktop/SHK.pdf";
          //   const pdfFile = await readFileAsBlob(pdfPath); // Helper function to read file as Blob
          //   const pdfUploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/SHK.pdf:/content`;

          //  const pdfUpload =  await axios.put(pdfUploadUrl, pdfFile, {
          //     headers: {
          //       Authorization: `Bearer ${accessToken}`,
          //       "Content-Type": "application/pdf",
          //     },
          //   });

          //   console.log("PDF uploaded successfully.",pdfUpload);


          }







        } 











      }


      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const readFileAsBlob = async (filePath) => {
    const response = await fetch(filePath);
    return response.blob();
  };









  const uploadImage = async (file) => {
    const val = await fetchData();
    
    
    let site_ID = val.site_ID;
    let drive_ID = val.drive_ID;
    let folder_ID = val.folder_ID;
    
    console.log("site_ID - ",site_ID);
    console.log("drive_ID - ",drive_ID);
    console.log("folder_ID - ",folder_ID);
    console.log("folder_path - ",folder_path);
    console.log("accessToken - ",accessToken);

    try {
      
      const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/${file.name}:/content`;
  
      const response = await axios.put(uploadUrl, file, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type, // Ensure correct MIME type
        },
      });
  
      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };











  // File selection handler
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadImage(file);
  } else {
    console.error("No file selected.");
  }
};




  // End Process SharePoint Refresh Process End //


 

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="page-title-box">
              <div className="row">
                <div className="col">
                  <p className="mb-0 page-subtitle">{greeting}</p>
                  <h2 className="page-title mt-1">{staffDetails.role_name}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-8">
            <>
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="form-group">
                    <select
                      className="form-select"
                      id="tabSelect"
                      value={selectedTab}
                      onChange={(e) => handleTabChange(e)}
                    >
                      <option value="this_week">This Week</option>
                      <option value="last_week">Last Week</option>
                      <option value="this_month">This Month</option>
                      <option value="last_month">Last Month</option>
                      <option value="this_quarter">This Quarter</option>
                      <option value="last_quarter">Last Quarter</option>
                      <option value="this_six_month">This 6 Months</option>
                      <option value="last_six_month">Last 6 Months</option>
                      <option value="this_year">This Year</option>
                      <option value="last_year">Last Year</option>
                    </select>
                  </div>
                </div>



                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="form-group">

                    {/* <button className="form-control" onClick={refreshToken}>Refresh Token</button> */}
                    <button className="form-control" onClick={fetchData}>Refresh Token</button>
                    {newAccessToken && <p>New Access Token: {newAccessToken}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}

                  </div>

                  <div>
                  <input type="file" onChange={handleFileChange} />
                  </div>
                </div>

              </div>
              <div className="tab-content mt-5">

                <div className="tab-pane show active">
                  <div className="row justify-content-center">
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CUSTOMERS
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("customer", dashboard.customer, "Customers")}
                            >
                              <h3 className="my-4">{dashboard.customer && dashboard.customer.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/users.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CLIENTS
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("client", dashboard.client, "Clients")}

                            >
                              <h3 className="my-4">{dashboard.client && dashboard.client.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/teamwork.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card ">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF STAFF
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("staff", dashboard.staff, "Staff")}
                            >
                              <h3 className="my-4">{dashboard.staff && dashboard.staff.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/handshake.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className=" mb-1">NO OF JOBS</p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("job", dashboard.job, "Jobs")}
                            >
                              <h3 className="my-4">{dashboard.job && dashboard.job.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/suitcase.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                PENDING JOBS
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("pending_job", dashboard.pending_job, "Pending Jobs")}
                            >
                              <h3 className="my-4">{dashboard.pending_job && dashboard.pending_job.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/pending.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 col-xl-4 col-lg-6" style={{ cursor: 'pointer' }}>
                      <div className="card report-card dashboard-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                COMPLETED JOBS
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between"
                              onClick={() => handleClick("completed_job", dashboard.completed_job, "Completed Jobs")}

                            >
                              <h3 className="my-4">{dashboard.completed_job && dashboard.completed_job.count}</h3>
                              <img
                                className="dashboad-img"
                                src="/assets/images/dashboards/time-management.png"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
          <div className="col-lg-4 col-md-4 mt-2">
            <div className="card activity-card">
              <div className="card-header border-bottom-0">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title">Activity</h4>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="analytic-dash-activity" data-simplebar="init">
                  <div className="simplebar-mask1">
                    <div className="">
                      <div className="simplebar-content" style={{ padding: 0 }}>
                        <div className="activity">
                          {/* Conditional Rendering */}
                          <div>
                            {getActiviyLog && getActiviyLog.length > 0 ? (
                              getActiviyLog.slice(0, visibleLogs).map((item, index) => {
                                return (
                                  <div className="activity-info" key={index}>
                                    <div className="icon-info-activity">
                                      <i className="fa-solid fa-circle"></i>
                                    </div>
                                    <div className="activity-info-text">
                                      <div className="">
                                        <small className="">{formatDate(item?.created_at)}</small>
                                        <p className="">{item?.log_message}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="no-data-found">
                                <img
                                  src="/assets/images/No-data-amico.png"
                                  alt="No data found"
                                  style={{ maxWidth: "100%", height: "auto" }}
                                />
                                <p className="text-center">No Activity Logs Found</p>
                              </div>
                            )}

                            {/* Show "Load More" button if there are more logs */}
                            {getActiviyLog && getActiviyLog.length > visibleLogs && (
                              <div className="load-more-btn-container text-center">
                                <button className="btn btn-info w-75" onClick={loadMoreLogs}>
                                  Load More

                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
