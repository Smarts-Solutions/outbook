import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getJobTimeline } from "../../../ReduxStore/Slice/Customer/CustomerSlice"

const JobTimeline = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
  const [JobTimelineData, setJobTimelineData] = useState([]);

  useEffect(() => {
    GetJobTimeline();
  }, []);

  const GetJobTimeline = async () => {
    const req = { job_id: location.state.job_id, staff_id: StaffUserId.id }
    const data = { req: req, authToken: token }
    await dispatch(getJobTimeline(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          console.log(res.data);
          setJobTimelineData(res.data);
        }
        else {
          setJobTimelineData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const chunkedSpouseArray = chunkArray(JobTimelineData, 3);


  return (
    <div className="">
      <div className="row">
        <div className="col-md-8">
          <div className="tab-title">
            <h3>Job Timeline</h3>
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
        <div>
          {chunkedSpouseArray?.map((row, rowIndex) => (
            <div
              className="row"
              key={rowIndex}
              style={{
                justifyContent: rowIndex % 2 === 0 ? "flex-start" : "flex-end", // Alternate alignment
              }}
            >
              {(rowIndex % 2 === 0 ? row : [...row].reverse()).map((item, index) => ( // Reverse data for snake pattern
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
                              <b>{new Date(subItem.created_at).toLocaleTimeString()}</b>
                              <p>{subItem.log_message}</p>
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
                  <div className="itemDate">{(() => {
    const date = new Date(item.date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear(); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  })()}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>


    </div >
  );
};

export default JobTimeline;
