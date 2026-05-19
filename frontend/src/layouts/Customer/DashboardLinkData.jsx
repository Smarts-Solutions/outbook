import React, { useState, useEffect, useRef } from "react";
import Datatable from "../../Components/ExtraComponents/Datatable";
import {
  CustomerLinkData,
  getCustomerMasterStatus,
  updateCustomerJobStatus
} from "../../ReduxStore/Slice/Customer/CustomerSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Download, ArrowLeft } from "lucide-react";
import { useCustomerAccess } from "../../Utils/CustomerAccessContext";

const DashboardLinkData = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccess, hasAnyJobAccess, hasAnyClientAccess } = useCustomerAccess();
  const role = JSON.parse(localStorage.getItem("role"));

  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const [allLinkedData, setAllLinkedData] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hararchyData, setHararchyData] = useState({
    customer: {},
    client: {},
    job: {},
  });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (location?.state?.data) {
      setHararchyData(location.state.data);
    }
  }, [location.state]);

  useEffect(() => {
    const key = location?.state?.req?.key;
    if (key && key !== "customer") {
      const module = key === "client" ? "client" : "job";
      if (!hasAccess(module, "view") && role !== "SUPERADMIN") {
        navigate("/customer/dashboard");
      }
    }
  }, [location, hasAccess, role, navigate]);

  useEffect(() => {
    GetLinkedData();
    GetStatus();
  }, []);

  const GetStatus = async () => {
    setLoading(true);
    await dispatch(getCustomerMasterStatus({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        }
      })
      .catch(() => { })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetLinkedData = async (page = 1, limit = 10, term = "") => {
    setLoading(true);
    const data = {
      req: {
        staff_id: staffDetails.id,
        key: location?.state?.req?.key,
        ids: location?.state?.req?.ids,
        page,
        limit,
        search: term,
      },
      authToken: token,
    };
    await dispatch(CustomerLinkData(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setAllLinkedData(res.data || []);
          setTotalRecords(res.pagination?.total || 0);
        } else {
          setAllLinkedData([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    GetLinkedData(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    GetLinkedData(1, newSize, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      GetLinkedData(1, pageSize, term);
    }, 500);
  };

  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { job_id: row.job_id, status_type: Number(Id) };
          const res = await dispatch(updateCustomerJobStatus({ req, authToken: token })).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetLinkedData(currentPage, pageSize, searchTerm);
          } else {
            Swal.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating status.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      }
    });
  };

  const HandleJob = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        customer: {
          id: prevState?.customer?.id || row.customer_id,
          trading_name: prevState?.customer?.trading_name || row.customer_name || row.customer_trading_name
        },
        client: {
          id: prevState?.client?.id || row.client_id,
          client_name: prevState?.client?.client_name || row.client_trading_name || row.client_name
        },
        job: row,
      };
      navigate("/customer/job/logs", {
        state: {
          job_id: row?.job_id,
          timesheet_job_id: row?.timesheet_job_id,
          data: updatedData,
          goto: "client",
          activeTab: "NoOfJobs",
        },
      });
      return updatedData;
    });
  };

  const HandleClientView = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        customer: {
          id: prevState?.customer?.id || row.customer_id,
          trading_name: prevState?.customer?.trading_name || row.customer_name || row.customer_trading_name
        },
        client: row,
      };
      navigate("/customer/client/profile", {
        state: { Client_id: row.id, activeTab: "NoOfJobs", data: updatedData },
      });
      return updatedData;
    });
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map(
        (h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`,
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

  const handleExport = async () => {
    const key = location?.state?.req?.key;
    Swal.fire({
      title: "Exporting...",
      text: "Please wait while we fetch all data.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const exportPayload = {
        req: {
          staff_id: staffDetails.id,
          key: location?.state?.req?.key,
          ids: location?.state?.req?.ids,
          page: 1,
          limit: 100000,
          search: searchTerm,
        },
        authToken: token,
      };

      const res = await dispatch(CustomerLinkData(exportPayload)).unwrap();
      Swal.close();

      if (res.status && res.data.length > 0) {
        let exportData = [];
        if (key === "client") {
          exportData = res.data.map(item => ({
            "Client Name": item.client_name,
            "Client Code": item.client_code,
            "Customer Name": item.customer_name,
            "Type": item.client_type_name,
            "Created By": item.client_created_by,
            "Created At": item.created_at,
          }));
        } else if (key === "customer") {
          exportData = res.data.map(item => ({
            "Trading Name": item.trading_name,
            "Customer Code": item.customer_code,
            "Type": item.customer_type === '1' ? "Sole Trader" : item.customer_type === '2' ? "Company" : item.customer_type === '3' ? "Partnership" : "-",
            "Account Manager": item.account_manager_firstname + " " + item.account_manager_lastname,
            "Emloyee ID": item.creator_employee_number,
            "Created by": item.customer_created_by,
            "Created At": item.created_at,
            "Status": item.status == 1 ? "Active" : "Inactive",
          }));
        } else {
          exportData = res.data.map(item => ({
            "Job ID": item.job_code_id,
            "Job Priority": item.job_priority || "-",
            "Client Name": item.client_trading_name,
            "Account Manager": item.account_manager_name || "-",
            "Job Type": item.job_type_name,
            "Status": item.status,
            "Created At": item.created_at,
          }));
        }
        downloadCSV(exportData, `${location?.state?.req?.heading || "Data"}.csv`);
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: "Export failed.", icon: "error" });
    }
  };

  const maxManagers = allLinkedData && allLinkedData.length > 0
    ? Math.max(...allLinkedData.map((row) => (row.account_managers || []).length))
    : 0;

  const dynamicManagerColumns = Array.from({ length: maxManagers }).flatMap(
    (_, index) => [
      {
        name: `Individual Account Manager`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return (
            <div title={manager?.full_name || "-"}>
              {manager?.full_name || "-"}
            </div>
          );
        },
        selector: (row) => row.account_managers?.[index]?.full_name || "-",
        sortable: true,
      },
      {
        name: `Employee ID`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return (
            <div title={manager?.employee_number || "-"}>
              {manager?.employee_number || "-"}
            </div>
          );
        },
        selector: (row) => row.account_managers?.[index]?.employee_number || "-",
        sortable: true,
      },
    ]
  );

  const JobColumns = [
    {
      name: "Job ID",
      cell: (row) => {
        return hasAnyJobAccess() ? (
          <div
            onClick={() => HandleJob(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
            title={row.job_code_id}
          >
            {row.job_code_id}
          </div>
        ) : (
          <div title={row.job_code_id}>{row.job_code_id}</div>
        );
      },
      selector: (row) => row.job_code_id,
      sortable: true,
      width: "180px"
    },
    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        return <div title={v}>{v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()}</div>;
      },
      selector: (row) => row.job_priority || "-",
      sortable: true,
    },
    {
      name: "Client Name",
      cell: (row) => <div title={row.client_trading_name || "-"}>{row.client_trading_name || "-"}</div>,
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row) => <div title={row.job_type_name}>{row.job_type_name}</div>,
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-select form-control"
          value={row.status_type}
          onChange={(e) => handleStatusChange(e, row)}
          disabled={!(hasAccess("job", "status_update") || role === "SUPERADMIN")}
        >
          {statusDataAll && statusDataAll.length > 0 ? (
            statusDataAll.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))
          ) : (
            <option value="">No Status Available</option>
          )}
        </select>
      ),
      selector: (row) => row.status,
      sortable: true,
      width: "250px"
    },
    {
      name:"Outbooks Account Manager",
      cell: (row) => (
        <div
          title={
            row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name
          }
        >
          {row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name}
        </div>
      ),
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name,
      sortable: true,
      width: "325px",
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },
  ];

  const ClientListColumns = [
    {
      name: "Client Name",
      cell: (row) => {
        return hasAnyClientAccess() ? (
          <div
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
            title={row.client_name}
          >
            {row.client_name}
          </div>
        ) : (
          <div title={row.client_name}>{row.client_name}</div>
        );
      },
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: "Client Code",
      cell: (row) => <div title={row.client_code}>{row.client_code}</div>,
      selector: (row) => row.client_code,
      sortable: true,
    },
    {
      name: "Customer Name",
      cell: (row) => <div title={row.customer_name}>{row.customer_name}</div>,
      selector: (row) => row.customer_name,
      sortable: true,
    },
    {
      name: "Client Type",
      cell: (row) => <div title={row.client_type_name}>{row.client_type_name}</div>,
      selector: (row) => row.client_type_name,
      sortable: true,
    },
  ];
  const CustomerListColumns = [
    {
      name: "Trading Name",
      selector: (row) => row.trading_name,
      sortable: true,
      cell: (row) => <div title={row.trading_name}>{row.trading_name}</div>,
    },
    {
      name: "Customer Code",
      selector: (row) => row.customer_code,
      sortable: true,
      cell: (row) => <div title={row.customer_code}>{row.customer_code}</div>,
    },
    {
      name: "Type",
      selector: (row) =>
        row.customer_type === "1"
          ? "Sole Trader"
          : row.customer_type === "2"
          ? "Company"
          : row.customer_type === "3"
          ? "Partnership"
          : "-",
      sortable: true,
      cell: (row) => {
        const type =
          row.customer_type === "1"
            ? "Sole Trader"
            : row.customer_type === "2"
            ? "Company"
            : row.customer_type === "3"
            ? "Partnership"
            : "-";
        return <div title={type}>{type}</div>;
      },
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
      cell: (row) => {
        const name =
          row.account_manager_firstname + " " + row.account_manager_lastname;
        return <div title={name}>{name}</div>;
      },
    },
    {
      name: "Emloyee ID",
      selector: (row) => row.creator_employee_number,
      sortable: true,
      cell: (row) => (
        <div title={row.creator_employee_number}>{row.creator_employee_number}</div>
      ),
    },
    {
      name: "Created by",
      selector: (row) => row.customer_created_by,
      sortable: true,
      cell: (row) => (
        <div title={row.customer_created_by}>{row.customer_created_by}</div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => <div title={row.created_at}>{row.created_at}</div>,
    },
    {
      name: "Status",
      cell: (row) => (
        <span
          className={row.status == 1 ? "text-success" : "text-danger"}
          title={row.status == 1 ? "Active" : "Inactive"}
        >
          {row.status == 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="report-data mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="row mb-5">
              <div className="tab-title col-lg-6">
                <h3>{location?.state?.req?.heading || "Dashboard Data"}</h3>
              </div>
              <div className="col-lg-6 d-flex justify-content-end align-items-center">
                <div
                  className="btn btn-info text-white blue-btn"
                  onClick={() => navigate(-1)}
                  style={{ cursor: "pointer" }}
                >
                  <ArrowLeft size={16} className="me-1" /> Back
                </div>

                {((location?.state?.req?.key === "client" ? hasAccess("client", "export") : location?.state?.req?.key === "customer" ? true : hasAccess("job", "export")) || role === "SUPERADMIN") && allLinkedData && allLinkedData.length > 0 && (
                  <div className="ms-2">
                    <button
                      className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2"
                      onClick={handleExport}
                    >
                      <Download size={16} />
                      <span>Export Excel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder={`Search ${location?.state?.req?.heading || ""}...`}
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
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
            filter={false}
            pagination={false}
            columns={
              location?.state?.req?.key === "client"
                ? ClientListColumns
                : location?.state?.req?.key === "customer"
                  ? CustomerListColumns
                  : JobColumns
            }
            data={allLinkedData || []}
          />

          {/* Pagination */}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalRecords / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />

          <select
            className="perpage-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DashboardLinkData;
