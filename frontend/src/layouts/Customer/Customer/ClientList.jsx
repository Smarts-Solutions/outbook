import React, { useEffect, useState, useRef } from "react";
import { GET_ASSIGNED_CLIENTS } from "../../../Services/CustomerUser/customerPortalService";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { Download } from "lucide-react";

const ClientList = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const response = await GET_ASSIGNED_CLIENTS(token);
    if (response.status) {
      setClientData(response.data);
      setFilteredData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filtered = clientData.filter((item) => {
      const matchesSearch =
        item.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || item.status == statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredData(filtered);
  }, [searchTerm, statusFilter, clientData]);

  const handleExport = () => {
    const headers = ["Client Name", "Client Code", "Customer Name", "Type", "Created by", "Created At", "Status"];
    const csvData = filteredData.map((item) => [
      item.client_name,
      item.client_code,
      item.customer_name,
      item.client_type_name || "-",
      item.client_created_by,
      item.created_at,
      item.status == 1 ? "Active" : "Inactive"
    ]);

    const csvContent = [headers.join(","), ...csvData.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "My_Clients.csv";
    a.click();
  };

  const columns = [
    {
      name: "Client Name",
      cell: (row) => (
        <span style={{ color: "#26bdf0", fontWeight: "bold", cursor: "default" }}>
          {row.client_name}
        </span>
      ),
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: "Client Code",
      selector: (row) => row.client_code,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
    },
    {
      name: "Client Type",
      selector: (row) => row.client_type_name || "-",
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.client_created_by,
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
              <h3 className="mt-0">Clients</h3>
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
                placeholder="Search Clients"
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
                <option value="">All Status</option>
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

export default ClientList;
