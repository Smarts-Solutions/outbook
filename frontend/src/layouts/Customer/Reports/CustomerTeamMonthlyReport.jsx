import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerTeamMonthlyReport as fetchTeamMonthlyReport } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const CustomerTeamMonthlyReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTeamReport();
  }, []);

  const getTeamReport = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(fetchTeamMonthlyReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setTeamData(res.data);
        } else {
          setTeamData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnClick = (ids) => {
    if (!ids) return;
    navigate("/customer/report/jobs", { state: { job_ids: ids } });
  };

  const columns = [
    {
      name: "Staff Name",
      selector: (row) => row.staff_name,
      sortable: true,
    },
    {
      name: "No.Of Jobs Completed",
      cell: (row) => (
        row.number_of_job_completed > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.job_ids)}
          >
            {row.number_of_job_completed}
          </div>
        ) : (
          <div>{row.number_of_job_completed}</div>
        )
      ),
      selector: (row) => row.number_of_job_completed,
      sortable: true,
    },
  ];

  const handleExport = () => {
    const exportData = teamData.map((row) => ({
      "Staff Name": row.staff_name,
      "No.Of Jobs Completed": row.number_of_job_completed,
    }));
    downloadCSV(exportData, "Team_Performance_Report.csv");
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map((h) => `"${row[h] || 0}"`);
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
    <div>
      <div className="report-data">
        <div className="row">
          <div className="col-md-7 mb-5">
            <div className="tab-title">
              <h3>Team Performance Report by Month</h3>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-end align-items-center mb-5">
            {teamData && teamData.length > 0 && (
                <button
                  className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span>Export Excel</span>
                </button>
            )}
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
            data={teamData && teamData}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerTeamMonthlyReport;
