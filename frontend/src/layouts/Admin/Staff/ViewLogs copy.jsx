import React from "react";
import { Link } from "react-router-dom";
import Datatable from "../../../Components/ExtraComponents/Datatable";

const data = [
  {
    ModuleName: "job",
    LogMessage:
      "Account Manager Vikas Patel added a new client on 24/09/2024 at 14:09. Client Code: cli_THE_Win_00007",
    SysytemIp: "The Black T",
    PermissionType: "Insert",
  },
  {
    ModuleName: "job",
    LogMessage:
      "Account Manager Vikas Patel edited the client information on 24/09/2024 at 14:09. Client Code: cli_THE_Win_00007.",
    SysytemIp: "The Black T",
    PermissionType: "Update",
  },
];

const columns = [
  {
    name: "Module Name",
    selector: (row) => row.ModuleName,
    sortable: true,
    width: "150px",
  },
  { name: "Log Message", selector: (row) => row.LogMessage, sortable: true },
  {
    name: "System Ip",
    selector: (row) => row.SysytemIp,
    sortable: true,
    width: "250px",
  },
  {
    name: "Permission Type",
    selector: (row) => row.PermissionType,
    sortable: true,
  },
];

const ViewLogs = () => {
  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="tab-title">
          <h3 className="mt-0">View Logs</h3>
        </div>
      </div>
      <div className="row report-data mt-5">
        <div className="col-md-12">
          <div className="mapWrapper">
            <div className="row">
              <div className="itemBar">
                <div className="box">
                  <div className="tooltip--multiline report-data">
                    <div>
                      <ul>
                        <li>
                          <b>11:30:51 AM</b>
                        </li>
                        <p>
                          Admin Amit Amit sent the missing logs for job code:
                          QQQ_QQQ_000023
                        </p>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li>
                          <b>11:13:50 AM</b>
                        </li>
                        <p>
                          Admin Amit Amit sent the queries for job code:
                          QQQ_QQQ_000023
                        </p>
                      </ul>
                    </div>
                    <div>
                      <ul>
                        <li>
                          <b>11:08:55 AM</b>
                        </li>
                        <p>Admin Amit Amit created job code: QQQ_QQQ_000023</p>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>
                {/*
                 */}
                <div className="itemDate">4/15/1997</div>
                {/*
                 */}
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2004</div>
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2010</div>
              </div>
            </div>
            <div className="row">
              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2019</div>
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2014</div>
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2012</div>
              </div>
            </div>
            <div className="row">
              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2019</div>
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">2019</div>
              </div>

              <div className="itemBar">
                <div className="itemInfo">
                  <span>
                    <i className="fa-solid fa-circle-info pe-1" />
                  </span>
                </div>

                <div className="itemDate">Nov 2019</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
