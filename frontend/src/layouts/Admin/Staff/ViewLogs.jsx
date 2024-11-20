import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ActivityLog } from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";

const ViewLogs = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token")); 
  const [getActiviyLog, setActivityLog] = useState([]);

  useEffect(() => {
    viewLogs()
  }, []);



  const viewLogs = async (row) => {
    try {
      const req = { staff_id: location?.state?.row?.id };
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


  return (
    <div className="container-fluid mt-5">
     <div className="content-title">
        <div className="tab-title">
          <h3 className="mt-0">View Logs</h3>
        </div>
      </div>
      <div className="row  report-data mt-5">
      <div className="mapWrapper">
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
                      <i className="fa-solid fa-circle-info pe-1"></i>
                    </span>
                    {item.info}
                  </div> 
                  <div className="itemDate">{item.date}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div >
  );
};

export default ViewLogs;
