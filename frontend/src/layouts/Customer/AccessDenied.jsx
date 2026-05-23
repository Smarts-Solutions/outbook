import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="report-data mt-4">
        <div className="row">
          <div className="col-md-12">
           
            
            <div className="row justify-content-center my-5">
              <div className="col-lg-6 text-center">
                <div className="mb-4">
                  <img
                    src="/assets/images/error.svg"
                    alt="Access Denied"
                    style={{ width: '280px', height: 'auto' }}
                  />
                </div>
                <h4 className="fw-bold mb-3 text-dark" style={{ textTransform: 'none' }}>
                  Permission Required
                </h4>
                <p className="text-muted mb-0" style={{ textTransform: 'none', fontSize: '15px', lineHeight: '1.6' }}>
                  You do not have the required permissions.<br/> Please contact your system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;


