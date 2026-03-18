import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ActivityLog } from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import Swal from "sweetalert2";
import { ArrowLeft, Download ,Info } from "lucide-react";

const ViewLogs = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [getActiviyLog, setActivityLog] = useState([]);

  useEffect(() => {
    viewLogs();
  }, []);

  const viewLogs = async (row) => {
    try {
      const req = { staff_id: location?.state?.row?.id, type: "staff" };
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
    } catch (error) {
      return;
    }
  };

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const chunkedSpouseArray = chunkArray(getActiviyLog, 3);


const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) {
    Swal.fire({ title: "No Data", text: "Export ke liye koi data nahi hai.", icon: "info" });
    return;
  }
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  data.forEach((row) => {
    const values = headers.map(
      (h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`
    );
    csvRows.push(values.join(","));
  });
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};



const handleExport = () => {

  const flatData = [];

  getActiviyLog.forEach((item) => {
    item.allContain.forEach((log) => {
      const date = new Date(item.date);
      const formattedDate = 
        String(date.getDate()).padStart(2, "0") + "/" +
        String(date.getMonth() + 1).padStart(2, "0") + "/" +
        date.getFullYear();

      const logTime = new Date(log.created_at).toLocaleTimeString();

      flatData.push({
        "Date": formattedDate,
        "Time": logTime,
        "Activity": log.log_message,
      });
    });
  });

  downloadCSV(flatData, "Activity_Logs.csv");
};




  return (
    <div className="container-fluid mt-5">
      <div className="content-title">
        <div className="row">
          <div className="tab-title col-auto">
            <h3 className="mt-0">View Logs</h3>
          </div>
          <div className="col-auto ms-auto">
             {getActiviyLog && getActiviyLog.length > 0 && (
    <button
      className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2 me-2 float-end"
      onClick={handleExport}
    >
     <Download size={16}/>
      <span>Export Excel</span>
    </button>
  )}
            <div
              className="btn btn-info text-white float-end blue-btn me-2"
              onClick={() => {
                window.history.back();
              }}
            >
             <ArrowLeft size={16}/> Back
            </div>
          </div>
        </div>
      </div>

      <div className="row  report-data mt-5">
        {/* <div className="mapWrapper">
          <div>
            {chunkedSpouseArray?.map((row, rowIndex) => (
              <div className="row" key={rowIndex} style={{ justifyContent: rowIndex % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                {row.map((item, index) => (
                  <div className="itemBar" key={index} style={{ textAlign: rowIndex % 2 === 0 ? 'left' : 'right' }}>
                    <div className="box">
                      <div className="tooltip--multiline report-data">

                        {item?.allContain?.map((item, index) => (
                          <div key={index}>
                            <ul>
                              <li>
                                <li><b>{new Date(item.created_at).toLocaleTimeString()}</b></li>
                                <p>{item.log_message}</p>
                              </li>
                            </ul>
                          </div>
                        ))}

                      </div>
                    </div>
                    <div className="itemInfo">
                      <span>
                       <Info size={16} className="me-1" />
                      </span>
                      {item.info}
                    </div>
                    <div className="itemDate">{item.date}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div> */}

        <div className="mapWrapper">
        <div>
  {chunkedSpouseArray && chunkedSpouseArray.length > 0 ? (
    chunkedSpouseArray?.map((row, rowIndex) => (
      <div
        className="row"
        key={rowIndex}
        style={{
          justifyContent:
            rowIndex % 2 === 0 ? "flex-start" : "flex-end", // Alternate alignment
        }}
      >
        {(rowIndex % 2 === 0 ? row : [...row].reverse()).map(
          (item, index) => (
            <div
              className="itemBar"
              key={index}
              style={{
                textAlign: rowIndex % 2 === 0 ? "left" : "right", // Alternate text alignment
              }}
            >
              <div className="box">
                <div className="tooltip--multiline report-data">
                  {item?.allContain?.map((subItem, subIndex) => (
                    <div key={subIndex}>
                      <ul>
                        <li>
                          <b>
                            {new Date(
                              subItem.created_at
                            ).toLocaleTimeString()}
                          </b>
                          <p>{subItem.log_message}</p>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="itemInfo">
                <span>
                 <Info size={16} />
                </span>
                {item.info}
              </div>
              <div className="itemDate">
                {(() => {
                  const date = new Date(item.date);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  ); // Months are 0-based
                  const year = date.getFullYear(); // Full year
                  return `${day}/${month}/${year}`;
                })()}
              </div>
            </div>
          )
        )}
      </div>
    ))
  ) : (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src="/assets/images/No-data-amico.png"
        alt="No Data Found"
        style={{ width: "200px", height: "auto" }}
      />
      <p>No Data Found</p>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
