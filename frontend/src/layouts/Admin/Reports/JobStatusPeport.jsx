import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { JobStatusReport } from "../../../ReduxStore/Slice/Report/ReportSlice";
import { useDispatch } from "react-redux";
import { convertDate ,convertDate1 } from "../../../Utils/Comman_function";
import ExportToExcel from '../../../Components/ExtraComponents/ExportToExcel';

const JobStatus = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [JobStatusData, setJobStatusData] = useState([]);

  useEffect(() => {
    GetJobStatus();
  }, []);

  const GetJobStatus = async () => {
    const data = { req: {}, authToken: token };
    await dispatch(JobStatusReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {

          console.log("Job Status Data:", res.data);
          setJobStatusData(res.data);
        } else {
          setJobStatusData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    {
      name: "Job Id",
      cell: (row) => <div title={row.job_code_id}>{row.job_code_id}</div>,
      selector: (row) => row.job_code_id,
      reorder: false,
      sortable: true,
    },
    
    {
      name: "Job Received On",
      selector: (row) => convertDate(row.job_received_on),
      reorder: false,
      sortable: true,
    },
    {
      name: "Customer Name",
      cell: (row) => (
        <div title={row.customer_trading_name}>{row.customer_trading_name}</div>
      ),
      selector: (row) => row.customer_trading_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Account Manager",
      cell: (row) => (
        <div title={row.account_manager_name}>{row.account_manager_name}</div>
      ),
      selector: (row) => row.account_manager_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Clients",
      cell: (row) => (
        <div title={row.client_trading_name}>{row.client_trading_name}</div>
      ),
      selector: (row) => row.client_trading_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Service Type",
      cell: (row) => (
        <div title={row.service_name}>{row.service_name}</div>
      ),
      selector: (row) => row.service_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name}>{row.job_type_name}</div>
      ),
      selector: (row) => row.job_type_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div title={row.status}>{row.status}</div>
      ),
      selector: (row) => row.status,
      reorder: false,
      sortable: true,
    },
    {
      name: "Allocated To",
      cell: (row) => (
        <div title={row.allocated_name}>{row.allocated_name}</div>
      ),
      selector: (row) => row.allocated_name,
      reorder: false,
      sortable: true,
    },
    
    {
      name: "Allocated to (Other)",
      cell: (row) => (
        <div title={row.multiple_staff_names}>{row.multiple_staff_names}</div>
      ),
      selector: (row) => row.multiple_staff_names,
      reorder: false,
      sortable: true,
    },
    {
      name: "Reviewer Name",
      cell: (row) => (
        <div title={row.reviewer_name}>{row.reviewer_name}</div>
      ),
      selector: (row) => row.reviewer_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Companies House Due Date",

      selector: (row) => convertDate(row.filing_Companies_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Internal Deadline",
      selector: (row) => convertDate(row.internal_deadline_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Customer Deadline",
      selector: (row) => convertDate(row.customer_deadline_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Initial Query Sent Date",
      selector: (row) => convertDate(row.query_sent_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Final Query Response Received Date",
      selector: (row) => convertDate(row.final_query_response_received_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "First Draft Sent",
      selector: (row) => convertDate(row.draft_sent_on),
      reorder: false,
      sortable: true,
    },
    {
      name: "Final Draft Sent",
      selector: (row) => convertDate(row.final_draft_sent_on),
      reorder: false,
      sortable: true,
    },
  ];


  const exportData = JobStatusData.map((item) => {
    return {
      "Job Id": item.job_code_id,
      "Customer Name": item.customer_trading_name,
      "Account Manager": item.account_manager_name,
      "Clients": item.client_trading_name,
      "Service Type": item.service_name,
      "Job Type": item.job_type_name,
      "Status": item.status,
      "Allocated To": item.allocated_name,
      "Received On": item.reviewer_name,
      "Companies House Due Date": convertDate(item.filing_Companies_date),
      "Internal Deadline": convertDate(item.internal_deadline_date),
      "Customer Deadline": convertDate(item.customer_deadline_date),
      "Initial Query Sent Date": convertDate(item.query_sent_date),
      "Final Query Response Received Date": convertDate(
        item.final_query_response_received_date
      ),
      "First Draft Sent": convertDate(item.draft_sent_on),
      "Final Draft Sent": convertDate(item.final_draft_sent_on),
    };
  });


  return (
    <div>
      <div className="report-data">
        <div className="row">
          <div className="col-md-7 mb-2">
            <div className="tab-title">
              <h3>Job Status Report</h3>
            </div>
          </div>
        </div>
        <div className="datatable-wrapper mt-minus">
          <div className="d-flex justify-content-end mb-3">
            <ExportToExcel
              className="btn btn-outline-info fw-bold float-end border-3 "
              apiData={exportData}
              fileName={`Job Status Report`}
            />
          </div>
          <Datatable
            filter={true}
            columns={columns}
            data={JobStatusData && JobStatusData}
          />
        </div>
      </div>
    </div>
  );
};

export default JobStatus;
