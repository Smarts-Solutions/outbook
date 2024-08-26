import React from 'react'
import Datatable from '../../../Components/ExtraComponents/Datatable';
import TaskTimesheet from './TaskTimesheet';
import MissingLogs from './MissingLogs';
import Queries from './Queries';
import Drafts from './Drafts';
import Documents from './Documents';

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
  

const JobInformation = () => {
  return (
    <div className='container-fluid'>
        
    <div className="row ">
     <div className="col-sm-12">
  <div className="page-title-box">
    <div className="row align-items-start">
      <div className="col-md-8">
      <>
    <ul className="nav nav-pills rounded-tabs"  role="tablist">
      <li className="nav-item" role="presentation">
        <button
          className="nav-link active"
          id="job-information-tab"
          data-bs-toggle="pill"
          data-bs-target="#job-information"
          type="button"
          role="tab"
          aria-controls="job-information"
          aria-selected="true"
        >
          Job Information 
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="task-timesheet-tab"
          data-bs-toggle="pill"
          data-bs-target="#task-timesheet"
          type="button"
          role="tab"
          aria-controls="task-timesheet"
          aria-selected="false"
        >
         Task Timesheet
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="job-timeline-tab"
          data-bs-toggle="pill"
          data-bs-target="#job-timeline"
          type="button"
          role="tab"
          aria-controls="job-timeline"
          aria-selected="false"
        >
          Job Timeline
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="missing-logs-tab"
          data-bs-toggle="pill"
          data-bs-target="#missing-logs"
          type="button"
          role="tab"
          aria-controls="missing-logs"
          aria-selected="false"
        >
          Missing Logs
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="queries-tab"
          data-bs-toggle="pill"
          data-bs-target="#queries"
          type="button"
          role="tab"
          aria-controls="queries"
          aria-selected="false"
        >
          Queries
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="drafts-tab"
          data-bs-toggle="pill"
          data-bs-target="#drafts"
          type="button"
          role="tab"
          aria-controls="drafts"
          aria-selected="false"
        >
          Drafts
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
          Documents
        </button>
      </li>
    
    </ul>
   
  </>

      </div>

    

    </div>

  </div>

</div>

</div>
<div className="tab-content report-data" id="pills-tabContent">
    
      <div
        className="tab-pane fade show active"
        id="job-information"
        role="tabpanel"
        aria-labelledby="job-information-tab"
      >
        <div className='row mb-3'>
                <div className='col-md-8'>
                    <div className='tab-title'>
                        <h3>Job Information </h3>
                    </div>
                </div>
                <div className='col-md-4'>
                <div>
                    <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-info text-white float-end ms-2"> <i class="ti-trash pe-1"></i>  Delete</button>
                    <button type="button" class="btn btn-info text-white float-end ">  
                     <i class="fa-regular fa-pencil pe-1"></i> Edit</button>
                     </div>    
                
                </div>
            </div>
       <div>
  <div className="row">
    <div className="col-lg-12">
      <div className="card card_shadow">
        <div className="card-header card-header-light-blue align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1 fs-16">Job Information Detail</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="mb-3 col-lg-4">
              <label className="form-label"> Outbook Account Manager</label>
              <input
                type="text"
                className="form-control"
                placeholder="Account Manager"
                disabled=""
                name="AccountManager"
                defaultValue="acoount acoount"
              />
            </div>
            <div id="invoiceremark" className="mb-3 col-lg-4">
              <label className="form-label">Customer</label>
              <input
                type="text"
                className="form-control"
                placeholder="Customer"
                disabled=""
                name="Customer"
                defaultValue="testeerete"
              />
            </div>
            <div className="col-lg-4">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                placeholder="Client Job Code"
                name="Client"
                disabled=""
                defaultValue="erewrewr"
              />
            </div>
            <div className="mb-3 col-lg-4">
              <label className="form-label">Client Job Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Client Job Code"
                name="ClientJobCode"
                defaultValue=""
              />
            </div>
            <div className="col-lg-4">
              <label className="form-label">
                Customer Account Manager(Officer)
              </label>
              <select className="form-select" name="CustomerAccountManager">
                <option value="">Select Customer Account Manager</option>
                <option value={9}>nnn nnn</option>
              </select>
            </div>
            <div className="col-lg-4">
              <label className="form-label">Service</label>
              <select className="form-select" name="Service">
                <option value="">Select Service</option>
                <option value={6}>Onboarding/Setup </option>
              </select>
            </div>
            <div className="col-lg-4 mb-3">
              <label className="form-label">Job Type</label>
              <select className="form-select mb-3 jobtype" name="JobType">
                <option value="">Select Job Type</option>
              </select>
            </div>
            <div className="col-lg-4">
              <label className="form-label">Budgeted Hours</label>
              <div className="input-group">
                <input
                  type="time"
                  name="BudgetedHours"
                  className="form-control"
                  defaultValue=":"
                />
                <span className="input-group-text">Hours</span>
              </div>
            </div>
            <div className="col-lg-4">
              <label className="form-label">Reviewer</label>
              <select className="form-select" name="Reviewer">
                <option value=""> Select Reviewer</option>
                <option value={9}>shk hu</option>
              </select>
            </div>
            <div className="col-lg-4 mb-3">
              <label className="form-label">Allocated To</label>
              <select className="form-select" name="AllocatedTo">
                <option value=""> Select Staff</option>
                <option value={4}>staff staff</option>
              </select>
            </div>
            <div className="col-lg-4">
              <label className="form-label"> Allocated On </label>
              <input
                type="date"
                className="form-control"
                placeholder="DD-MM-YYYY"
                name="AllocatedOn"
                defaultValue=""
              />
            </div>
            <div className="col-lg-4">
              <label className="form-label">Date Received On</label>
              <input
                type="date"
                className="form-control"
                placeholder="DD-MM-YYYY"
                name="DateReceivedOn"
                defaultValue=""
              />
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label"> Year End </label>
                <input
                  type="month"
                  className="form-control"
                  placeholder="MM/YYYY"
                  name="YearEnd"
                  defaultValue=""
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label">Total Preparation Time</label>
                <input
                  type="time"
                  name="TotalPreparationTime"
                  className="form-control"
                  defaultValue=":"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label">Review Time</label>
                <input
                  type="time"
                  name="ReviewTime"
                  className="form-control"
                  defaultValue=":"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label">
                  Feedback Incorporation Time
                </label>
                <input
                  type="time"
                  name="FeedbackIncorporationTime"
                  className="form-control"
                  defaultValue=":"
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="mb-3">
                <label className="form-label"> Total Time</label>
                <input
                  type="text"
                  name="TotalTime"
                  className="form-control"
                  disabled=""
                  defaultValue="0:"
                />
              </div>
            </div>
            <div id="invoice_type" className="col-lg-4">
              <label htmlFor="firstNameinput" className="form-label">
                Engagement Model
              </label>
              <select
                className="form-select invoice_type_dropdown"
                name="EngagementModel"
              >
                <option value="">Please Select Engagement Model</option>
                <option value="fte_dedicated_staffing">
                  fte_dedicated_staffing
                </option>
                <option value="customised_pricing">customised_pricing</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-12">
      <div className="card card_shadow">
        <div className="card-header align-items-center d-flex card-header-light-blue">
          <h4 className="card-title mb-0 flex-grow-1 fs-16">Deadline</h4>
        </div>
        <div className="card-body">
          <div className="" style={{ marginTop: 15 }}>
            <div className="row">
              <div className="col-lg-4 mb-3">
                <label className="form-label">Expected Delivery Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="ExpectedDeliveryDate"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Due On</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="DueOn"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Submission Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="SubmissionDeadline"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Customer Deadline Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="CustomerDeadlineDate"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">SLA Deadline Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="SLADeadlineDate"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Internal Deadline Date</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="DD-MM-YYYY"
                  name="InternalDeadlineDate"
                  defaultValue=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-12">
      <div className="card card_shadow">
        <div className="card-header card-header-light-blue align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1 fs-16">Other Task</h4>
        </div>
        <div className="card-body">
          <div className="" style={{ marginTop: 15 }}>
            <div className="row">
              <div className="col-lg-4">
                <div className="mb-3">
                  <label className="form-label">
                    Filing With Companies House Required?
                  </label>
                  <select
                    className="form-select"
                    name="FilingWithCompaniesHouseRequired"
                  >
                    <option value="">
                      Please Select Companies House Required
                    </option>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-3">
                  <label className="form-label">
                    Companies House Filing Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="CompaniesHouseFilingDate"
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <label className="form-label">Filing with HMRC Required?</label>
                <select
                  className="form-select invoice_type_dropdown"
                  name="FilingWithHMRCRequired"
                >
                  <option value="">Please Select HMRC Required</option>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div className="col-lg-4">
                <div className="mb-3">
                  <label className="form-label">HMRC Filing Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="HMRCFilingDate"
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-3">
                  <label className="form-label">
                    Opening Balance Adjustment Required
                  </label>
                  <select
                    className="form-select"
                    name="OpeningBalanceAdjustmentRequired"
                  >
                    <option value="">
                      Please Select Opening Balance Adjustment
                    </option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="mb-3">
                  <label className="form-label">
                    Opening Balance Adjustment Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="OpeningBalanceAdjustmentDate"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card card_shadow">
        <div className="card-header card-header-light-blue align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1 fs-16">Other Data </h4>
        </div>
        <div className="card-body">
          <div className="" style={{ marginTop: 15 }}>
            <div className="row">
              <div className="col-lg-4 mb-3">
                <label className="form-label">Number of Transactions </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Number of Transactions"
                  name="NumberOfTransactions"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">
                  Number of Trial Balance Items
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Number of Trial Balance Items"
                  name="NumberOfTrialBalanceItems"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Turnover</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Turnover"
                  name="Turnover"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4 mb-3">
                <label className="form-label">No.Of Employees</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="No.Of Employees"
                  name="NoOfEmployees"
                  defaultValue=""
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">VAT Reconciliation</label>
                <select
                  className="form-select invoice_type_dropdown"
                  name="VATReconciliation"
                >
                  <option value="">Please Select VAT Reconciliation</option>
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
              <div className="col-lg-4">
                <label className="form-label">Bookkeeping?</label>
                <select
                  className="form-select invoice_type_dropdown"
                  name="Bookkeeping"
                >
                  <option value="">Please Select Bookkeeping</option>
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>
              <div className="col-lg-4">
                <label className="form-label">Processing Type</label>
                <select
                  className="form-select invoice_type_dropdown"
                  name="ProcessingType"
                >
                  <option value={1}> Manual </option>
                  <option value={2}>Software</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-12">
      <div className="col-lg-12">
        <div className="card card_shadow">
          <div className="card-header card-header-light-blue align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1 fs-16">Invoice</h4>
          </div>
          <div className="card-body">
            <div style={{ marginTop: 15 }}>
              <div className="row">
                <div className="col-lg-4 mb-3">
                  <label className="form-label">Invoiced</label>
                  <select
                    className="invoiced_dropdown form-select"
                    name="Invoiced"
                  >
                    <option value="">Please Select Invoiced</option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Currency</label>
                  <select
                    className="invoiced_dropdown form-select"
                    name="Currency"
                  >
                    <option value="">Please Select Currency</option>
                    <option>Rupee</option>
                    <option>Dollar</option>
                  </select>
                </div>
                <div className="col-lg-4">
                  <label className="form-label"> Invoice Value </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Invoice Value"
                    name="InvoiceValue"
                    defaultValue=""
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label"> Invoice Date </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder="DD-MM-YYYY"
                    name="InvoiceDate"
                    defaultValue=""
                  />
                </div>
                <div className="col-lg-4">
                  <label className="form-label">Invoice Hours </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="InvoiceHours"
                      defaultValue=""
                    />
                    <span className="input-group-text">Hours</span>
                  </div>
                </div>
                <div id="invoicedremark" className="col-lg-4">
                  <label className="form-label">Invoice Remark</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Invoice Remark"
                    name="InvoiceRemark"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
      <div
        className="tab-pane fade"
        id="task-timesheet"
        role="tabpanel"
        aria-labelledby="task-timesheet-tab"
      >
        <TaskTimesheet/>
      </div>
      <div
        className="tab-pane fade"
        id="missing-logs"
        role="tabpanel"
        aria-labelledby="missing-logs-tab"
      >
        <MissingLogs/>
      </div>
      <div
        className="tab-pane fade"
        id="queries"
        role="tabpanel"
        aria-labelledby="queries-tab"
      >
        <Queries/>
      </div>
      <div
        className="tab-pane fade"
        id="drafts"
        role="tabpanel"
        aria-labelledby="drafts-tab"
      >
        <Drafts/>
      </div>
      <div
        className="tab-pane fade"
        id="documents"
        role="tabpanel"
        aria-labelledby="documents-tab"
      >
        <Documents/>
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
  )
}

export default JobInformation