import React, { useState, useEffect, useRef } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { linkedData } from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Update_Customer_Status,
  Update_Status,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import ReactPaginate from "react-paginate";
import { Download,ArrowLeft,Plus } from "lucide-react";

const JobStatus = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [allLinkedData, setAllLinkedData] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    GetLinkedData(newPage, pageSize, "");
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    GetLinkedData(1, newSize, "");
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

  const [hararchyData, setHararchyData] = useState({
    customer: {},
    client: {},
    job: {},
  });

  useEffect(() => {
    GetLinkedData();
    GetStatus();
  }, []);

  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
    client: 0,
    job: 0,
    all_customers: 0,
    all_clients: 0,
    all_jobs: 0,
    staff: 0,
  });

  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer",
    )?.items || [];

  const accessData1 =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client",
    )?.items || [];

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job",
    )?.items || [];

  const accessDataAllCustomer =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_customers",
    )?.items || [];

  const accessDataAllJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_jobs",
    )?.items || [];

  const accessDataClients =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_clients",
    )?.items || [];

  const accessDataStaff =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "staff",
    )?.items || [];

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = {
      insert: 0,
      update: 0,
      delete: 0,
      view: 0,
      client: 0,
      job: 0,
      all_customers: 0,
      all_clients: 0,
      all_jobs: 0,
      staff: 0,
    };
    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    accessData1.forEach((item) => {
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });

    accessDataJob.forEach((item) => {
      if (item.type === "view") updatedAccess.job = item.is_assigned;
    });

    accessDataAllCustomer.forEach((item) => {
      if (item.type === "view") updatedAccess.all_customers = item.is_assigned;
    });
    accessDataAllJob.forEach((item) => {
      if (item.type === "view") updatedAccess.all_jobs = item.is_assigned;
    });
    accessDataClients.forEach((item) => {
      if (item.type === "view") updatedAccess.all_clients = item.is_assigned;
    });
    accessDataStaff.forEach((item) => {
      if (item.type === "view") updatedAccess.staff = item.is_assigned;
    });

    setAccessData(updatedAccess);
  }, []);


  const GetStatus = async () => {
    setLoading(true);
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetLinkedData = async (page = 1, limit = 10, term) => {
    setLoading(true);
    const data = {
      req: {
        staff_id: location?.state?.req?.staff_id,
        key: location?.state?.req?.key,
        ids: location?.state?.req?.ids,
        page,
        limit,
        search: term,
      },
      authToken: token,
    };
    await dispatch(linkedData(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setAllLinkedData(res.data);
          setTotalRecords(res.pagination.total);
        } else {
          setAllLinkedData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const HandleClientView = (row) => {
    if (row.form_process == "4") {
      navigate("/admin/Clientlist", { state: row });
    } else {
      Swal.fire({
        title: "Form not completed",
        text: "Please complete the form",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleChangeStatus = async (e, row) => {
    const newStatus = e.target.value;

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
          const req = { customer_id: row.id, status: newStatus };
          const res = await dispatch(
            Update_Customer_Status({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetLinkedData();
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
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Status change was not performed",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
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
          const res = await dispatch(
            Update_Status({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetLinkedData();
          } else if (res.data === "W") {
            Swal.fire({
              title: "Warning",
              text: res.message,
              icon: "warning",
              confirmButtonText: "Ok",
              timer: 3000,
              timerProgressBar: true,
            });
          } else {
            Swal.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
            timerProgressBar: true,
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Status change was not performed",
          icon: "error",
          confirmButtonText: "Ok",
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
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
      cell: (row) => (
        <div title={row.job_code_id}>
          {getAccessData.view == 1 ||
            getAccessData.all_jobs == 1 ||
            role === "SUPERADMIN" ? (
            <a
              onClick={() => HandleJob(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.job_code_id}
            </a>
          ) : (
            <a>{row.job_code_id}</a>
          )}
        </div>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        const cap = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return <div title={cap}>{cap}</div>;
      },
      selector: (row) => {
        if (!row.job_priority) return "-";
        return (
          row.job_priority.charAt(0).toUpperCase() +
          row.job_priority.slice(1).toLowerCase()
        );
      },
      sortable: true,
    },
    {
      name: "Client Name",
      cell: (row) => (
        <div title={row.client_trading_name || "-"}>
          {row.client_trading_name || "-"}
        </div>
      ),
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Account Manager",
      cell: (row) => (
        <div title={row.account_manager_name || "-"}>
          {row.account_manager_name || "-"}
        </div>
      ),
      selector: (row) => row.account_manager_name || "-",
      sortable: true,
    },
    {
      name: "Employee ID",
      cell: (row) => (
        <div title={row.account_manager_employee_number || "-"}>
          {row.account_manager_employee_number || "-"}
        </div>
      ),
      selector: (row) => row.account_manager_employee_number || "-",
      sortable: true,
    },
    ...dynamicManagerColumns,
    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name || "-"}>{row.job_type_name || "-"}</div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    // {
    //   name: "Job Status",
    //   cell: (row) => <div title={row.status || "-"}>{row.status || "-"}</div>,
    //   selector: (row) => row.status || "-",
    //   sortable: true,
    // },

    {
      name: "Status",
      selector: (row) => {
        const status = statusDataAll.find(
          (s) => Number(s.id) === Number(row.status_type),
        );
        return status ? status.name.toLowerCase() : "-";
      },
      sortable: true,
      cell: (row) => (
        <div>
          <select
            className="form-select form-control"
            value={row.status_type}
            onChange={(e) => handleStatusChange(e, row)}
            disabled={!(getAccessData.update === 1 || role === "SUPERADMIN")}
          >
            {statusDataAll.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      ),
      width: "325px",
    },

    {
      name: "Client Contact Person",
      cell: (row) => (
        <div
          title={
            row.account_manager_officer_first_name +
            " " +
            row.account_manager_officer_last_name || "-"
          }
        >
          {row.account_manager_officer_first_name +
            " " +
            row.account_manager_officer_last_name || "-"}
        </div>
      ),
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name || "-",
      sortable: true,
    },
    {
      name: "Client Job Code",
      cell: (row) => (
        <div title={row.client_job_code || "-"}>
          {row.client_job_code || "-"}
        </div>
      ),
      selector: (row) => row.client_job_code || "-",
      sortable: true,
    },
    // {
    //   name: "Outbook Account Manager",
    //   cell: (row) => (
    //     <div
    //       title={
    //         row.outbooks_acount_manager_first_name +
    //         " " +
    //         row.outbooks_acount_manager_last_name || "-"
    //       }
    //     >
    //       {row.outbooks_acount_manager_first_name +
    //         " " +
    //         row.outbooks_acount_manager_last_name || "-"}
    //     </div>
    //   ),

    //   selector: (row) =>
    //     row.outbooks_acount_manager_first_name +
    //     " " +
    //     row.outbooks_acount_manager_last_name || "-",
    //   sortable: true,
    // },
    {
      name: "Allocated To",
      cell: (row) => (
        // <div title={row.allocated_first_name == null ? "-" :
        //  row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name}>
        //   {row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name}
        // </div>

        <div>
          {row?.allocated_first_name != null
            ? row?.allocated_first_name + " " + row?.allocated_last_name
            : "-"}
        </div>
      ),

      selector: (row) =>
        row.allocated_first_name == null
          ? "-"
          : row.allocated_first_name + " " + row.allocated_last_name == null
            ? "-"
            : row.allocated_last_name,
      sortable: true,
    },
    {
      name: "Timesheet",
      cell: (row) => (
        <div
          title={
            row.total_hours_status == "1" && row.total_hours != null
              ? row.total_hours.split(":")[0] +
              "h " +
              row.total_hours.split(":")[1] +
              "m"
              : "-"
          }
        >
          {row.total_hours_status == "1" && row.total_hours != null
            ? row.total_hours.split(":")[0] +
            "h " +
            row.total_hours.split(":")[1] +
            "m"
            : "-"}
        </div>
      ),

      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null
          ? row.total_hours.split(":")[0] +
          "h " +
          row.total_hours.split(":")[1] +
          "m"
          : "-",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Created By",
      cell: (row) => (
        <div title={row.job_created_by || "-"}>{row.job_created_by || "-"}</div>
      ),
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },

    {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>{row.created_at || "-"}</div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
  ];

  const columnsCustomer = [
    {
      name: "Trading Name",
      cell: (row) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {role === "SUPERADMIN" && row.status == 1 ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a>
          ) : getAccessData.client == 1 && row.status == 1 ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a>
          ) : (
            row.trading_name
          )}
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },
    {
      name: "Customer Code",
      cell: (row) => <div title={row.customer_code}>{row.customer_code}</div>,
      selector: (row) => row.customer_code,
      sortable: true,
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
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
      cell: (row) => (
        <div
          title={
            row.account_manager_firstname + " " + row.account_manager_lastname
          }
          className="data-table-cell"
          data-fulltext={
            row.account_manager_firstname + " " + row.account_manager_lastname
          }
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.account_manager_firstname + " " + row.account_manager_lastname}
        </div>
      ),
    },
    {
      name: "Emloyee ID",
      selector: (row) => row.employee_number,
      cell: (row) => (
        <div title={row.employee_number}>{row.employee_number}</div>
      ),
      sortable: true,
    },
    {
      name: "Created by",
      selector: (row) => row.customer_created_by,
      cell: (row) => (
        <div title={row.customer_created_by}>{row.customer_created_by}</div>
      ),
      sortable: true,
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      cell: (row) => <div title={row.created_at}>{row.created_at}</div>,
      sortable: true,
    },

    {
      name: "Status",
      cell: (row) => (
        <div>
          <div>
            {row.form_process === "4" ? (
              <select
                className="form-select form-control"
                value={row.status}
                onChange={(e) => handleChangeStatus(e, row)}
              >
                <option value="0" className="text-danger">
                  Inactive
                </option>
                <option value="1" className="text-success">
                  Active
                </option>
              </select>
            ) : (
              <span className="text-warning">Inprogress</span>
            )}
          </div>
        </div>
      ),
      selector: (row) => (row.status == "1" ? 1 : 0),
      sortable: true,
    },
  ];

  const ClientListColumns = [

    {
      name: "Client Name",
      cell: (row) => (
        <div>
          {getAccessData.job === 1 ||
            getAccessData.all_jobs == 1 ||
            role === "SUPERADMIN" ? (
            <a
              onClick={() => HandleClientProfileView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.client_name}
            </a>
          ) : (
            row.client_name
          )}
        </div>
      ),
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: "Client Code",
      cell: (row) => (
        <div title={row.client_code || "-"}>{row.client_code || "-"}</div>
      ),
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Customer Name",
      cell: (row) => (
        <div title={row.customer_name || "-"}>{row.customer_name || "-"}</div>
      ),
      selector: (row) => row.customer_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Client Type",
      cell: (row) => (
        <div title={row.client_type_name == null ? "-" : row.client_type_name}>
          {row.client_type_name == null ? "-" : row.client_type_name}
        </div>
      ),
      selector: (row) =>
        row.client_type_name == null ? "-" : row.client_type_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Created By",
      cell: (row) => (
        <div title={row.client_created_by || "-"}>
          {row.client_created_by || "-"}
        </div>
      ),
      selector: (row) => row.client_created_by || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>{row.created_at || "-"}</div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Status",

      selector: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Deactive"}
          </span>
        </div>
      ),
      sortable: true,
      width: "130px",
    },
  ];

  const columnsStaff = [
    {
      name: "Full Name",
      cell: (row) => (
        <div title={row.first_name + " " + row.last_name}>
          {row.first_name + " " + row.last_name}
        </div>
      ),
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email Address",
      cell: (row) => <div title={row.email}>{row.email}</div>,
      selector: (row) => row.email,
      sortable: true,
      width: "165px",
    },
    {
      name: "Phone",
      cell: (row) => (
        <div
          title={
            row.phone && row.phone_code
              ? row.phone_code + "-" + row.phone
              : " - "
          }
        >
          {row.phone && row.phone_code
            ? row.phone_code + "-" + row.phone
            : " - "}
        </div>
      ),
      selector: (row) =>
        row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - ",
      sortable: true,
      width: "150px",
    },
    {
      name: "Role",
      cell: (row) => <div title={row.role_name}>{row.role_name}</div>,
      selector: (row) => row.role_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Line Manager",
      selector: (row) => row.line_manager_name || "-",
      sortable: true,
      width: "200px",
      reorder: false,
    },
    {
      name: "Employee ID",
      selector: (row) => row.employee_number || "-",
      sortable: true,
      width: "200px",
      reorder: false,
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      // width: "250px",
    },
  ];

  const HandleJob = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        job: row,
      };
      navigate("/admin/job/logs", {
        state: {
          job_id: row?.job_id,
          timesheet_job_id: row?.timesheet_job_id,
          data: updatedData,
          goto: "client",
          activeTab: location?.state?.activeTab,
        },
      });
      return updatedData;
    });
  };


  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "Export ke liye koi data nahi hai.",
        icon: "info",
      });
      return;
    }
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

    setLoading(true);

    try {
      const exportPayload = {
        req: {
          staff_id: location?.state?.req?.staff_id,
          key: location?.state?.req?.key,
          ids: location?.state?.req?.ids,
          page: 1,
          limit: 100000,
          search: searchTerm,
        },
        authToken: token,
      };

      const res = await dispatch(linkedData(exportPayload)).unwrap();

      if (!res.status || !res.data || res.data.length === 0) {
        Swal.fire({
          title: "No Data",
          text: "Export ke liye koi data nahi hai.",
          icon: "info",
        });
        return;
      }

      const allData = res.data;

      if (key === "customer") {
        const data = allData.map((item) => ({
          "Trading Name": item.trading_name || "-",
          "Customer Code": item.customer_code || "-",
          Type:
            item.customer_type === "1"
              ? "Sole Trader"
              : item.customer_type === "2"
                ? "Company"
                : item.customer_type === "3"
                  ? "Partnership"
                  : "-",
          "Account Manager":
            (item.account_manager_firstname || "") +
            " " +
            (item.account_manager_lastname || ""),
          "Employee ID": item.employee_number || "-",
          "Created by": item.customer_created_by || "",
          "Created At": item.created_at || "",
          Status:
            item.form_process === "4"
              ? item.status == "1"
                ? "Active"
                : "Inactive"
              : "Inprogress",
        }));
        downloadCSV(data, "Customers.csv");
      } else if (key === "client") {
        const data = allData.map((item) => ({
          "Client Name": item.client_name || "-",
          "Client Code": item.client_code || "-",
          "Customer Name": item.customer_name || "-",
          "Client Type": item.client_type_name || "-",
          "Created By": item.client_created_by || "-",
          "Created At": item.created_at || "-",
          Status: item.status === "1" ? "Active" : "Deactive",
        }));
        downloadCSV(data, "Clients.csv");
      } else if (key === "staff") {
        const data = allData.map((item) => ({
          "Full Name": (item.first_name || "") + " " + (item.last_name || ""),
          Email: item.email || "-",

          Phone: item.phone
            ? ` ${item.phone_code ? item.phone_code + "-" + item.phone : item.phone}`
            : "-",
          Role: item.role_name || "-",
          "Line Manager": item.line_manager_name || "-",
          "Employee ID": item.employee_number || "-",
          Status: item.status === "1" ? "Active" : "Inactive",
        }));
        downloadCSV(data, "Staff.csv");
      } else {
            const exportMaxManagers = allData && allData.length > 0
                ? Math.max(...allData.map((row) => (row.account_managers || []).length))
                : 0;
            
            const data = allData.map((item) => {
                const status = statusDataAll.find(
                    (s) => Number(s.id) === Number(item.status_type)
                );
                
                const rowData = {
                    "Job ID": item.job_code_id || "-",
                    "Job Priority": item.job_priority
                        ? item.job_priority.charAt(0).toUpperCase() +
                        item.job_priority.slice(1).toLowerCase()
                        : "-",
                    "Client Name": item.client_trading_name || "-",
                    "Account Manager": item.account_manager_name || "-",
                    "Employee ID": item.account_manager_employee_number || "-",
                };

                // Add dynamic managers to export
                for (let i = 0; i < exportMaxManagers; i++) {
                    const manager = item.account_managers?.[i];
                    rowData[`Individual Account Manager ${i + 1}`] = manager?.full_name || "-";
                    rowData[`Employee ID ${i + 1}`] = manager?.employee_number || "-";
                }

                // Add remaining fields
                Object.assign(rowData, {
                    "Job Type": item.job_type_name || "-",
                    Status: status ? status.name : "-",
                    "Client Contact Person":
                        (item.account_manager_officer_first_name || "") +
                        " " +
                        (item.account_manager_officer_last_name || ""),
                    "Client Job Code": item.client_job_code || "-",
                    // "Outbook Account Manager":
                    //     (item.outbooks_acount_manager_first_name || "") +
                    //     " " +
                    //     (item.outbooks_acount_manager_last_name || ""),
                    "Allocated To": item.allocated_first_name
                        ? item.allocated_first_name + " " + item.allocated_last_name
                        : "-",
                    Timesheet:
                        item.total_hours_status == "1" && item.total_hours
                            ? item.total_hours.split(":")[0] +
                            "h " +
                            item.total_hours.split(":")[1] +
                            "m"
                            : "-",
                    Invoicing: item.invoiced == "1" ? "YES" : "NO",
                    "Created By": item.job_created_by || "-",
                    "Created At": item.created_at || "-",
                });

                return rowData;
            });
            downloadCSV(data, `Jobs_${key || "all"}.csv`);
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: "Export failed.", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const HandleClientProfileView = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        client: row,
      };
      navigate("/admin/client/profile", {
        state: { Client_id: row.id, data: updatedData },
      });
      return updatedData;
    });
  };

  return (
    <div>
      <div className="report-data mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <div className="row mb-5">
                <div className="tab-title col-lg-6">
                  <h3>{location?.state?.req?.heading}</h3>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div
                    className="btn btn-info text-white blue-btn"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft size={16}/> Back
                  </div>

                  {(role === "SUPERADMIN" ||
                    (getAccessData.insert === 1 && getAccessData.view === 1)) &&
                    location?.state?.req?.heading == "Customers" && (
                      <div className="ms-2">
                        <Link
                          to="/admin/addcustomer"
                          className="btn btn-outline-info fw-bold float-end border-3"
                        >
                          <Plus size={16}/> Add Customer
                        </Link>
                      </div>
                    )}

                  {allLinkedData && allLinkedData.length > 0 && (
                    <div className="ms-2">
                      <button
                        className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2"
                        onClick={handleExport}
                      >
                            <Download size={16}/>

                        <span>Export Excel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Row */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder={`Search ${location?.state?.req?.heading || ""}`}
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
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

          {role === "SUPERADMIN" ? (
            <Datatable
              filter={false}
              pagination={false}
              columns={
                location?.state?.req?.key === "client"
                  ? ClientListColumns
                  : location?.state?.req?.key === "customer"
                    ? columnsCustomer
                    : location?.state?.req?.key === "staff"
                      ? columnsStaff
                      : JobColumns
              }
              data={allLinkedData || []}
            />
          ) : (
            <>
              {(getAccessData.view === 1 ||
                getAccessData.all_customers === 1) &&
                location?.state?.req?.key === "customer" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={columnsCustomer}
                    data={allLinkedData || []}
                  />
                )}

              {(getAccessData.client === 1 ||
                getAccessData.all_clients === 1) &&
                location?.state?.req?.key === "client" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={ClientListColumns}
                    data={allLinkedData || []}
                  />
                )}

              {(getAccessData.job === 1 || getAccessData.all_jobs === 1) &&
                location?.state?.req?.key === "job" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={JobColumns}
                    data={allLinkedData || []}
                  />
                )}

              {(getAccessData.job === 1 || getAccessData.all_jobs === 1) &&
                location?.state?.req?.key === "pending_job" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={JobColumns}
                    data={allLinkedData || []}
                  />
                )}

              {(getAccessData.job === 1 || getAccessData.all_jobs === 1) &&
                location?.state?.req?.key === "completed_job" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={JobColumns}
                    data={allLinkedData || []}
                  />
                )}

              {getAccessData.staff === 1 &&
                location?.state?.req?.key === "staff" && (
                  <Datatable
                    filter={false}
                    pagination={false}
                    columns={columnsStaff}
                    data={allLinkedData || []}
                  />
                )}
            </>
          )}

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

export default JobStatus;
