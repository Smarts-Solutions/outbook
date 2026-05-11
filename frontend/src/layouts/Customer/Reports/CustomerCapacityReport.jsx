import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { useDispatch } from "react-redux";
import { CustomerGetAllTaskByStaff } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";

const CustomerCapacityReport = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [capacityData, setCapacityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCapacity();
  }, []);

  const fetchCapacity = async () => {
    setLoading(true);
    const data = { req: { action: "capacityReport" }, authToken: token };
    await dispatch(CustomerGetAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setCapacityData(res.data);
        } else {
          setCapacityData([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      name: "Staff Name",
      selector: (row) => row.staff_fullname,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
    },
    {
      name: "Active Jobs",
      selector: (row) => row.active_jobs,
      sortable: true,
    },
    {
      name: "Total Budgeted Time",
      selector: (row) => row.total_budgeted_time,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="report-data">
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="tab-title">
              <h3 className="fw-bold">Capacity Report</h3>
            </div>
          </div>
        </div>

        <div className="datatable-wrapper mt-minus">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <Datatable
            filter={true}
            columns={columns}
            data={capacityData}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerCapacityReport;

