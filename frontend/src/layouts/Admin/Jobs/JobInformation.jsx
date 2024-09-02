import React from 'react'

const JobInformationPage = () => {
    return (
        <div>

            <div className='row mb-3'>
                <div className='col-md-8'>
                    <div className='tab-title'>
                        <h3>Job Information </h3>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-info text-white float-end ms-2"> <i className="ti-trash pe-1"></i>  Delete</button>
                        <button type="button" className="btn btn-info text-white float-end ">
                            <i className="fa-regular fa-pencil pe-1"></i> Edit</button>
                    </div>

                </div>
            </div>
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card card_shadow">
                            <div className="card-header card-header-light-blue align-items-center d-flex">
                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Job Information</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="mb-3 col-lg-4">
                                        <label className="form-label"> Outbook Account Manager<span className='text-danger'>*</span></label>
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
                                        <label className="form-label">Customer<span className='text-danger'>*</span></label>
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
                                        <label className="form-label">Client<span className='text-danger'>*</span></label>
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
                                            Customer Account Manager(Officer)<span className='text-danger'>*</span>
                                        </label>
                                        <select className="form-select" name="CustomerAccountManager">
                                            <option value="">Select Customer Account Manager</option>
                                            <option value={9}>nnn nnn</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-4">
                                        <label className="form-label">Service<span className='text-danger'>*</span></label>
                                        <select className="form-select" name="Service">
                                            <option value="">Select Service</option>
                                            <option value={6}>Onboarding/Setup </option>
                                        </select>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label className="form-label">Job Type<span className='text-danger'>*</span></label>
                                        <select className="form-select mb-3 jobtype" name="JobType">
                                            <option value="">Select Job Type</option>
                                            <option value={3}>VAT1</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Budgeted Hours</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Hours"
                                                    defaultValue=""
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Minutes"
                                                    defaultValue=""
                                                />
                                            </div>
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
                                            <label className="form-label">Year End</label>
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
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Hours"
                                                    defaultValue=""
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Minutes"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Review Time</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Hours"
                                                    defaultValue=""
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Minutes"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Feedback Incorporation Time</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Hours"
                                                    defaultValue=""
                                                />
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Minutes"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label"> Total Time</label>
                                            <div className="row">
                                                <div className="col-md-6 pe-0">
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={10}
                                                            aria-label="Recipient's username"
                                                            aria-describedby="basic-addon2"
                                                        />
                                                        <span className="input-group-text" id="basic-addon2">
                                                            Hours
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 ps-0">
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={10}
                                                            aria-label="Recipient's username"
                                                            aria-describedby="basic-addon2"
                                                        />
                                                        <span className="input-group-text" id="basic-addon2">
                                                            Minutes
                                                        </span>
                                                    </div>
                                                </div>


                                            </div>
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
                                                    <option value={1}>Yes</option>
                                                    <option value={0}>No</option>
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
                                                <option value={1}>Yes</option>
                                                <option value={0}>No</option>
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
                                                placeholder="Enter Trial Balance Items"
                                                name="NumberOfTrialBalanceItems"
                                                defaultValue=""
                                            />
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="form-label">Turnover</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Turnover"
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
                                                <option value="">Please Select Processing Type</option>
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
                                                <label className="form-label">Invoice Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="DD-MM-YYYY"
                                                    name="InvoiceDate"
                                                    max="2024-08-27"
                                                    defaultValue=""
                                                />
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Invoice Date</label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Hours"
                                                            defaultValue=""
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Minutes"
                                                            defaultValue=""
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="invoicedremark" className="col-lg-4">
                                                <label className="form-label">Invoice Remark</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Invoice Remark"
                                                    name="InvoiceRemark"
                                                    maxLength={500}
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
    )
}

export default JobInformationPage