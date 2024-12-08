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
      <div className="col-lg-12  mt-2">
        <div className="my-3 col-md-7">
          <label className="form-label">Status</label>
          <select className="form-select ">
            <option value="volvo">All</option>
          </select>
        </div>
      </div>
      <div className="mapWrapper">
        <div>
          {chunkedSpouseArray.map((row, rowIndex) => (
            <div className="row" key={rowIndex} style={{ justifyContent: rowIndex % 2 === 0 ? 'flex-start' : 'flex-end' }}>
              {row.map((item, index) => (
                <div className="itemBar" key={index} style={{ textAlign: rowIndex % 2 === 0 ? 'left' : 'right' }}>
                  <div className="box">
                    <div className="tooltip--multiline report-data">
                      {console.log()}
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
    </div >
  );
};

export default JobTimeline;
