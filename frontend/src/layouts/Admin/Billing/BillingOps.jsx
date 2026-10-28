import React, { useState } from "react";
import { Receipt, FileText, Filter, Download, Plus, Search } from "lucide-react";

const BillingOps = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="tab-title d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h3 className="mt-0 mb-0">Billing Ops</h3>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
              <Plus size={16} />
              <span>Create Invoice / Entry</span>
            </button>
          </div>
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search by customer, invoice or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select">
                  <option value="">All Engagement Models</option>
                  <option value="fte">FTE / Dedicated</option>
                  <option value="percentage">Percentage</option>
                  <option value="hourly">Adhoc / Hourly</option>
                  <option value="custom">Customised Pricing</option>
                </select>
              </div>
              <div className="col-md-2 text-end">
                <button type="button" className="btn btn-light border w-100 d-flex align-items-center justify-content-center gap-1">
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Total Unbilled</h6>
                <h4 className="mb-0 text-primary">£0.00</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Pending Invoices</h6>
                <h4 className="mb-0 text-warning">0</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Paid This Month</h6>
                <h4 className="mb-0 text-success">£0.00</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted mb-2">Overdue Amount</h6>
                <h4 className="mb-0 text-danger">£0.00</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="card shadow-sm border-0">
          <div className="card-body py-5 text-center">
            <div className="mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-primary"
                style={{ width: "64px", height: "64px" }}
              >
                <Receipt size={32} />
              </div>
            </div>
            <h5 className="mb-2">Billing Operations</h5>
            <p className="text-muted mx-auto" style={{ maxWidth: "450px" }}>
              Manage customer billings, hourly timesheet conversions, milestone invoicing, and track outstanding payments here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingOps;
