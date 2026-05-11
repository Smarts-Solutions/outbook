import React from 'react';

const CustomerCapacityReport = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <i className="bi bi-clock-history text-primary" style={{ fontSize: '4rem' }}></i>
              </div>
              <h3 className="fw-bold mb-3">Capacity Report</h3>
              <p className="text-muted mb-0">
                The Capacity Report is currently under development and will be available soon.
                This report will help you track the workload and availability of your assigned staff members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCapacityReport;
