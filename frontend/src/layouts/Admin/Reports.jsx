import React from 'react';
import Datatable from '../../Components/ExtraComponents/Datatable';


const data = [
  { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  
];


const columns = [
  { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
  { name: 'Customer Code', selector: row => row.Code, sortable: true },
  { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
  { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
  { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
  { name: 'Account Manager', selector: row => row.JobType, sortable: true },
]

function Reports() {
  return (
    <div className='container-fluid'>
              <div className="row ">
               <div className="col-sm-12">
            <div className="page-title-box">
              <div className="row align-items-start">
                <div className="col-md-8">
                <>
              <ul className="nav nav-tabs border-0"  role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="this-week-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-week"
                    type="button"
                    role="tab"
                    aria-controls="this-week"
                    aria-selected="true"
                  >
                    This week
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-week-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-week"
                    type="button"
                    role="tab"
                    aria-controls="last-week"
                    aria-selected="false"
                  >
                    Last week
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-month-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-month"
                    type="button"
                    role="tab"
                    aria-controls="last-month"
                    aria-selected="false"
                  >
                    Last month
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-quarter-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-quarter"
                    type="button"
                    role="tab"
                    aria-controls="last-quarter"
                    aria-selected="false"
                  >
                    Last quarter
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="this-6-months-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-6-months"
                    type="button"
                    role="tab"
                    aria-controls="this-6-months"
                    aria-selected="false"
                  >
                    This 6 months
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-6-months-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-6-months"
                    type="button"
                    role="tab"
                    aria-controls="last-6-months"
                    aria-selected="false"
                  >
                    Last 6 months
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="this-year-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-year"
                    type="button"
                    role="tab"
                    aria-controls="this-year"
                    aria-selected="false"
                  >
                    This year
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-year-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-year"
                    type="button"
                    role="tab"
                    aria-controls="last-year"
                    aria-selected="false"
                  >
                    Last year
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="custom-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#custom"
                    type="button"
                    role="tab"
                    aria-controls="custom"
                    aria-selected="false"
                  >
                    Custom
                  </button>
                </li>
              </ul>
             
            </>

                </div>

                {/* <div className="col-md-4  col-auto ">
               <button className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Add Customer</button>
                </div> */}

              </div>

            </div>

          </div>

        </div>
        <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="this-week"
                  role="tabpanel"
                  aria-labelledby="this-week-tab"
                >
                  <div className='report-data'>
                  <div className='tab-title'>
                    <h3>Job Status Report</h3>
                    </div>
                    <div className='datatable-wrapper'>
                      <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
                      <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
                 <Datatable 
                 filter={true}
                 columns={columns} data={data} />
                 </div>
                 </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="last-week"
                  role="tabpanel"
                  aria-labelledby="last-week-tab"
                >
                  <Datatable columns={columns} data={data} />
                </div>
                <div
                  className="tab-pane fade"
                  id="last-month"
                  role="tabpanel"
                  aria-labelledby="last-month-tab"
                >
                  Last month's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-quarter"
                  role="tabpanel"
                  aria-labelledby="last-quarter-tab"
                >
                  Last quarter's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="this-6-months"
                  role="tabpanel"
                  aria-labelledby="this-6-months-tab"
                >
                  This 6 months' content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-6-months"
                  role="tabpanel"
                  aria-labelledby="last-6-months-tab"
                >
                  Last 6 months' content...
                </div>
                <div
                  className="tab-pane fade"
                  id="this-year"
                  role="tabpanel"
                  aria-labelledby="this-year-tab"
                >
                  This year's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-year"
                  role="tabpanel"
                  aria-labelledby="last-year-tab"
                >
                  Last year's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="custom"
                  role="tabpanel"
                  aria-labelledby="custom-tab"
                >
                  Custom content...
                </div>
              </div>
      
    </div>

  );
}

export default Reports;
