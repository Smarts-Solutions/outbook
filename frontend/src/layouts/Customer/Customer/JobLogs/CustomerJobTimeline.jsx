import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CustomerJobTimeline as CustomerJobTimelineAction } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Download, Info } from "lucide-react";
import { useCustomerAccess } from "../../../../Utils/CustomerAccessContext";

const CustomerJobTimeline = ({ job_id }) => {
  const { hasAccess } = useCustomerAccess();
  const role = JSON.parse(localStorage.getItem("role"));
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
  const [JobTimelineData, setJobTimelineData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(job_id || location.state?.job_id || sessionStorage.getItem("currentJobId"));

  useEffect(() => {
    if (job_id) {
       setCurrentJobId(job_id);
    } else if (location.state?.job_id) {
       setCurrentJobId(location.state.job_id);
    }
  }, [job_id, location.state?.job_id]);

  useEffect(() => {
    if (currentJobId) {
      GetJobTimeline();
    }
  }, [currentJobId]);

  const GetJobTimeline = async () => {
    const req = { action: "getJobTimeline", job_id: currentJobId, staff_id: StaffUserId.id };
    const data = { req: req, authToken: token };
    await dispatch(CustomerJobTimelineAction(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setJobTimelineData(res.data);
        } else {
          setJobTimelineData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const chunkedSpouseArray = chunkArray(JobTimelineData, 3);

  const handleExport = () => {
    if (!JobTimelineData || JobTimelineData.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = [];

    JobTimelineData.forEach((item) => {
      const date = new Date(item.date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      item.allContain?.forEach((subItem) => {
        exportData.push({
          Date: formattedDate,
          Time: new Date(subItem.created_at).toLocaleTimeString(),
          Message: subItem.log_message || "-",
          // Info: item.info || "-",
        });
      });
    });

    if (exportData.length === 0) {
      alert("No data to export!");
      return;
    }

    downloadCSV(exportData, "Job_Timeline.csv");
  };

  const downloadCSV = (data, filename) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    data.forEach((row) => {
      const values = headers.map((h) => `"${row[h] || ""}"`);
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  };

  return (
    <div className="">
      <div className="row">
        <div className="col-md-8">
          <div className="tab-title d-flex align-items-center">
            <h3 className="mb-0">Job Timeline</h3>

            {(hasAccess("job", "export") || role === "SUPERADMIN") && JobTimelineData && JobTimelineData.length > 0 && (
              <button
                className="btn btn-info d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2 ms-auto"
                id="btn-export"
                onClick={handleExport}
              >
                <Download size={16} />

                <span>Export Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <div className="col-lg-12  mt-2">
        <div className="my-3 col-md-7">
          <label className="form-label">Status</label>
          <select className="form-select ">
            <option value="volvo">All</option>
          </select>
        </div>
      </div> */}

      <div className="mapWrapper">
        {JobTimelineData && JobTimelineData.length > 0 ? (
          <div>
            {chunkedSpouseArray?.map((row, rowIndex) => (
              <div
                className="row"
                key={rowIndex}
                style={{
                  justifyContent: rowIndex % 2 === 0 ? "flex-start" : "flex-end", // Alternate alignment
                }}
              >
                {(rowIndex % 2 === 0 ? row : [...row].reverse()).map(
                  (
                    item,
                    index, // Reverse data for snake pattern
                  ) => (
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
                                      subItem.created_at,
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
                          <Info size={18} className="pe-1" />
                        </span>
                        {item.info}
                      </div>
                      <div className="itemDate">
                        {(() => {
                          const date = new Date(item.date);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          ); // Months are 0-based
                          const year = date.getFullYear(); // Get last two digits of the year
                          return `${day}/${month}/${year}`;
                        })()}
                      </div>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <img
              src="/assets/images/No-data-amico.png"
              alt="No data found"
              style={{ maxWidth: "300px", height: "auto" }}
            />
            <h4 className="mt-3 text-muted">No Job Timeline Data Found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerJobTimeline;
