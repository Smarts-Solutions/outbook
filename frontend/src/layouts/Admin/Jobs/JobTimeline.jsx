import React , {useState , useEffect} from "react"; 
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const data = [
  {
    TradingName: "W120",
    Code: "012_BlaK_T_1772",
    CustomerName: "The Black T",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Admin/Support Tasks",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
  {
    TradingName: "W121",
    Code: "025_NesTea_1663",
    CustomerName: "Nestea",
    AccountManager: "Ajeet Aggarwal",
    ServiceType: "Onboarding/Setup",
    JobType: "Year End",
  },
];

const columns = [
  { name: "Trading Name", selector: (row) => row.TradingName, sortable: true },
  { name: "Customer Code", selector: (row) => row.Code, sortable: true },
  {
    name: "Customer Name",
    selector: (row) => row.CustomerName,
    sortable: true,
  },
  {
    name: "Company Number",
    selector: (row) => row.AccountManager,
    sortable: true,
  },
  { name: "Service Type", selector: (row) => row.ServiceType, sortable: true },
  { name: "Account Manager", selector: (row) => row.JobType, sortable: true },
];

const JobTimeline = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  console.log("ccc" , location.state.job_id);
  const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
  const [getJobTimeline, setJobTimeline] = useState([]);
  
useEffect(() => {
  GetJobTimeline();
}, []);

  const GetJobTimeline = async() => {
    const req = {job_id : location.state.job_id , staff_id : StaffUserId.id}
    await dispatch(getJobTimeline(req))
    .unwarp()
    .then((res) => {
      setJobTimeline(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }
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
        <div className="row">
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline report-data">
              <ul>
                <li><b >3:29:00 PM</b>
                <p>Harsh Mehta Created New Job with Job Code the_out_00001</p></li>
                <li><b >3:29:00 PM</b>
                <p>Harsh Mehta Created New Job with Job Code the_out_00001</p></li>
                <li><b >3:29:00 PM</b>
                <p>Harsh Mehta Created New Job with Job Code the_out_00001</p></li>
                <li><b >3:29:00 PM</b>
                <p>Harsh Mehta Created New Job with Job Code the_out_00001</p></li>
                <li><b >3:29:00 PM</b>
                <p>Harsh Mehta Created New Job with Job Code the_out_00001</p></li> 
               </ul>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
        </div>
        <div className="row">
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
        </div>
        <div className="row">
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
              <ul>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
               </ul>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
        </div>
        <div className="row">
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
                <h3>Title for the tooltip</h3>
                <p>This is a multiline tooltip.</p>
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div class="box">
              <div class="tooltip--multiline">
               <ul>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
                <li>Harsh Mehta Created New Job with Job Code the_out_00001</li>
               </ul>
                {/* <p>This is a multiline tooltip.</p> */}
              </div>
            </div>

            <div className="itemInfo">
              <span>
                <i class="fa-solid fa-circle-info pe-1"></i>
              </span>
              Spawned in Washington
            </div>

            <div className="itemDate">4/15/1997</div>
          </div>
          {/*
           */}
          <div className="itemBar">
            <div className="itemInfo">🎮Cybertruck Lead Designer</div>
            <div className="itemDate">Jan 2022</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTimeline;
