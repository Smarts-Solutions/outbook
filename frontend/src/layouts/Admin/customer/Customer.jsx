import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { GET_ALL_CUSTOMERS } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getDateRange } from "../../../Utils/Comman_function";

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("this-year");
  const role = JSON.parse(localStorage.getItem("role"));

  const [searchTerm, setSearchTerm] = useState("");
  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
  });

  const accessData =
    JSON.parse(localStorage.getItem("accessData")).find(
      (item) => item.permission_name === "customer"
    )?.items || [];

  useEffect(() => {
    const updatedAccess = { insert: 0, update: 0, delete: 0 };

    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
    });

    setAccessData(updatedAccess);
  }, [accessData]);

  useEffect(() => {
    GetAllCustomerData();
  }, [activeTab]);

  const tabs = [
    { id: "this-week", label: "This week" },
    { id: "last-week", label: "Last week" },
    { id: "this-month", label: "This month" },
    { id: "last-month", label: "Last month" },
    { id: "last-quarter", label: "Last quarter" },
    { id: "this-6-months", label: "This 6 months" },
    { id: "this-year", label: "This year" },
    { id: "last-year", label: "Last year" },
  ];

  const columns = [
    {
      name: "Trading Name",
      cell: (row) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "150px",
          }}
        >
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
            title={row.trading_name}
          >
            {row.trading_name}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Customer Code",
      selector: (row) => row.customer_code,
      sortable: true,
      width: "250px",
    },
    {
      name: "Company Name",
      cell: (row) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "200px",
          }}
        >
          <a title={row.company_name}>{row.company_name}</a>
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Company Number",
      selector: (row) => (row.company_number == null ? "" : row.company_number),
      sortable: true,
      width: "200px",
    },
    {
      name: "Type",
      selector: (row) =>
        row.customer_type === 1
          ? "Sole Trader"
          : row.customer_type === 2
          ? "Company"
          : row.customer_type === 3
          ? "Partnership"
          : "-",
      sortable: true,
      width: "150px",
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
      width: "180px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          {row.form_process === "4" ? (
            <span className="badge bg-success">Complete</span>
          ) : (
            <span className="badge bg-danger">In Progress</span>
          )}
        </div>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: "Actions",
      cell: (row) => {
        const hasUpdateAccess = getAccessData.update === 1;
        const hasDeleteAccess = getAccessData.delete === 1;

        return (
          <div style={{ textAlign: "center" }}>
            {role === "ADMIN" || role === "SUPERADMIN" ? (
              <>
                <button className="edit-icon" onClick={() => handleEdit(row)}>
                  <i className="ti-pencil" />
                </button>
                <button
                  className="delete-icon"
                  onClick={() => handleDelete(row)}
                >
                  <i className="ti-trash text-danger" />
                </button>
              </>
            ) : (
              <>
                {hasUpdateAccess && (
                  <button className="edit-icon" onClick={() => handleEdit(row)}>
                    <i className="ti-pencil" />
                  </button>
                )}
                {hasDeleteAccess && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row)}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                )}
              </>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  const GetAllCustomerData = async () => {
    const req = { action: "get", staff_id: staffDetails.id };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(GET_ALL_CUSTOMERS(data)).unwrap();
      if (response.status) {
        const filteredData = response.data.filter((item) => {
          const itemDate = new Date(item.created_at);
          const { startDate, endDate } = getDateRange(activeTab);
          return itemDate >= startDate && itemDate <= endDate;
        });
        setCustomerData(filteredData);
        setFilteredData(filteredData); // Initialize filtered data
      } else {
        setCustomerData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = customerData.filter((item) => {
      return (
        item.trading_name?.toLowerCase().includes(searchValue) ||
        item.customer_code?.toLowerCase().includes(searchValue) ||
        item.company_name?.toLowerCase().includes(searchValue) ||
        item.company_number?.toLowerCase().includes(searchValue) ||
        (item.account_manager_firstname + " " + item.account_manager_lastname)
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

    setFilteredData(filtered);
  };

  const HandleClientView = (row) => {
    navigate("/admin/Clientlist", { state: row });
  };

  const handleEdit = (row) => {
    navigate("/admin/editcustomer", { state: row });
  };

  const handleDelete = (row) => {
    // Implement delete functionality
  };

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row">
          <div className="col-md-8">
            <div className="tab-title">
              <h3 className="mt-0">Customers</h3>
            </div>
          </div>
          {role === "ADMIN" || role === "SUPERADMIN" ? (
            <div className="col-md-4">
              <Link
                to="/admin/addcustomer"
                className="btn btn-info text-white float-end blue-btn"
              >
                <i className="fa fa-plus" /> Add Customer
              </Link>
            </div>
          ) : (
            getAccessData.insert === 1 && (
              <div className="col-md-4">
                <Link
                  to="/admin/addcustomer"
                  className="btn btn-info text-white float-end blue-btn"
                >
                  <i className="fa fa-plus" /> Add Customer
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="col-sm-12">
          <div className="page-title-box pt-0">
            <div className="row align-items-start">
              <div className="col-md-8">
                <ul
                  className="nav nav-pills rounded-tabs"
                  id="pills-tab"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
                      <button
                        className={`nav-link ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                        id={`${tab.id}-tab`}
                        data-bs-toggle="pill"
                        data-bs-target={`#${tab.id}`}
                        type="button"
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-4 col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content" id="pills-tabContent">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${
                activeTab === tab.id ? "show active" : ""
              }`}
              id={tab.id}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
            >
              <div className="card-datatable">
                <Datatable columns={columns} data={filteredData} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customer;
