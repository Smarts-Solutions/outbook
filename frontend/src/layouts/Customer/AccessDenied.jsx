import React from 'react';
import { CircleAlert } from 'lucide-react';

const AccessDenied = () => {

  return (
    <div className="container-fluid">
      <div className="row mt-4 justify-content-center">
        <div className="col-md-8 col-lg-6 mt-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5 text-center">
              <div className="mb-4 d-flex justify-content-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-4 d-inline-flex">
                  <CircleAlert size={64} className="text-danger" />
                </div>
              </div>
              <h2 className="fw-bold mb-3">Access Denied</h2>
              <p className="text-muted mb-4 fs-5" style={{ textTransform: 'none' }}>
                You do not have permission to view this page. Please contact your administrator if you believe this is an error and you need access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
