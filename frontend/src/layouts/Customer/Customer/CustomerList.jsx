import React, { useEffect, useState, useRef } from "react";
import { GET_ASSIGNED_CUSTOMERS } from "../../../Services/CustomerUser/customerPortalService";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { Download } from "lucide-react";

const CustomerList = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await GET_ASSIGNED_CUSTOMERS(token);
    if (response.status) {
      setCustomerData(response.data);
      setFilteredData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filtered = customerData.filter((item) => {
      const matchesSearch =
        item.trading_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer_code?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || item.status == statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, customerData]);

  const handleExport = () => {
    const headers = ["Trading Name", "Customer Code", "Type", "Account Manager", "Employee Id", "Created by", "Created At", "Status"];
    const csvData = filteredData.map((item) => [
      item.trading_name,
      item.customer_code,
      item.customer_type === "1" ? "Sole Trader" : item.customer_type === "2" ? "Company" : "Partnership",
      `${item.account_manager_firstname || ""} ${item.account_manager_lastname || ""}`,
      item.account_manager_employee_number,
      item.customer_created_by,
      item.created_at,
      item.status == 1 ? "Active" : "Inactive"
    ]);

    const csvContent = [headers.join(","), ...csvData.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "My_Customers.csv";
    a.click();
  };

  const columns = [
    {
      name: "Trading Name",
      cell: (row) => (
        <span style={{ color: "#26bdf0", fontWeight: "bold", cursor: "default" }}>
          {row.trading_name}
        </span>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },
    {
      name: "Customer Code",
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
      selector: (row) => `${row.account_manager_firstname || ""} ${row.account_manager_lastname || ""}`,
      sortable: true,
    },
    {
      name: "Employee Id",
      selector: (row) => row.account_manager_employee_number,
      sortable: true,
    },
    {
      name: "Created by",
      selector: (row) => row.customer_created_by,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.status == 1 ? "text-success" : "text-danger"}>
          {row.status == 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row">
          <div className="col-md-6">
            <div className="tab-title">
              <h3 className="mt-0">Customers</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="card-datatable">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Search Customers"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2 float-end"
                onClick={handleExport}
              >
                <Download size={16} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <Datatable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
