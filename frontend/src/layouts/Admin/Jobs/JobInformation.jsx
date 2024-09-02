import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { GetAllJabData, AddAllJobType, GET_ALL_CHECKLIST } from '../../../ReduxStore/Slice/Customer/CustomerSlice';
import { Get_All_Job_List } from "../../../ReduxStore/Slice/Customer/CustomerSlice";


const JobInformationPage = ({ job_id }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const location = useLocation();
    const [AllJobData, setAllJobData] = useState([]);
    const dispatch = useDispatch();
    const [JobInformationData, setJobInformationData] = useState({
        AccountManager: "",
        Customer: "",
        Client: "",
        ClientJobCode: "",
        CustomerAccountManager: "",
        Service: "",
        JobType: "",
        BudgetedHours: "",
        Reviewer: "",
        AllocatedTo: "",
        AllocatedOn: "",
        DateReceivedOn: "",
        YearEnd: "",
        TotalPreparationTime: "",
        ReviewTime: "",
        FeedbackIncorporationTime: "",
        TotalTime: "",
        EngagementModel: "",
        ExpectedDeliveryDate: "",
        DueOn: "",
        SubmissionDeadline: "",
        CustomerDeadlineDate: "",
        SLADeadlineDate: "",
        InternalDeadlineDate: "",
        FilingWithCompaniesHouseRequired: "",
        CompaniesHouseFilingDate: "",
        FilingWithHMRCRequired: "",
        HMRCFilingDate: "",
        OpeningBalanceAdjustmentRequired: "",
        OpeningBalanceAdjustmentDate: "",
        NumberOfTransactions: "",
        NumberOfTrialBalanceItems: "",
        Turnover: "",
        NoOfEmployees: "",
        VATReconciliation: "",
        Bookkeeping: "",
        ProcessingType: "",
        Invoiced: "",
        Currency: "",
        InvoiceValue: "",
        InvoiceDate: "",
        InvoiceTime: "",
        InvoiceRemark: "",

    });


    console.log("JobInformationData", JobInformationData)
    console.log("job_id", job_id)


    const GetJobData = async () => {
        const req = { customer_id: location.state.details.customer_id.id }
        const data = { req: req, authToken: token }
        await dispatch(GetAllJabData(data))
            .unwrap()
            .then(async (response) => {

                if (response.status) {
                    setAllJobData({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setAllJobData({
                        loading: true,
                        data: []
                    })
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });

    }

    useEffect(() => {
        GetJobData()
    }, []);


    // "data": {
    //     "job_id": 18,
    //     "customer_id": 21,
    //     "customer_trading_name": "cppp",
    //     "client_id": 8,
    //     "client_trading_name": "www",
    //     "client_job_code": "sasa",
    //     "outbooks_acount_manager_id": 7,
    //     "outbooks_acount_manager_first_name": "acoount",
    //     "outbooks_acount_manager_last_name": "acoount",
    //     "account_manager_officer_id": 29,
    //     "account_manager_officer_first_name": "Chandra",
    //     "account_manager_officer_last_name": "Prakash",
    //     "service_id": 3,
    //     "service_name": "VAT Return\t",
    //     "job_type_id": 4,
    //     "job_type_name": "SS",
    //     "budgeted_hours": "22:00:00",
    //     "reviewer_id": 9,
    //     "reviewer_first_name": "shk",
    //     "reviewer_last_name": "hu",
    //     "allocated_id": null,
    //     "allocated_first_name": null,
    //     "allocated_last_name": null,
    //     "allocated_on": "2024-08-30",
    //     "date_received_on": "2024-08-30",
    //     "year_end": "",
    //     "total_preparation_time": "00:00:00",
    //     "review_time": "00:00:00",
    //     "feedback_incorporation_time": "00:00:00",
    //     "total_time": "00:00:00",
    //     "engagement_model": "",
    //     "expected_delivery_date": null,
    //     "due_on": null,
    //     "submission_deadline": null,
    //     "customer_deadline_date": null,
    //     "sla_deadline_date": null,
    //     "internal_deadline_date": null,
    //     "filing_Companies_required": "0",
    //     "filing_Companies_date": null,
    //     "filing_hmrc_required": "0",
    //     "filing_hmrc_date": null,
    //     "opening_balance_required": "0",
    //     "opening_balance_date": null,
    //     "number_of_transaction": "0.00",
    //     "number_of_balance_items": 0,
    //     "turnover": "0.00",
    //     "number_of_employees": 0,
    //     "vat_reconciliation": "0",
    //     "bookkeeping": "0",
    //     "processing_type": "",
    //     "invoiced": "1",
    //     "currency_id": null,
    //     "currency": null,
    //     "invoice_value": "77.00",
    //     "invoice_date": "2024-08-31",
    //     "invoice_hours": "10:10:00",
    //     "invoice_remark": "ppp",
    //     "tasks": {
    //         "checklist_id": 21,
    //         "task": [
    //             {
    //                 "task_id": 17,
    //                 "task_name": "U",
    //                 "budgeted_hour": "00:00:04"
    //             },
    //             {
    //                 "task_id": 19,
    //                 "task_name": "sasa",
    //                 "budgeted_hour": "22:22:00"
    //             }
    //         ]
    //     }

    const JobDetails = async () => {
        const req = { action: "getByJobId", job_id: job_id }
        const data = { req: req, authToken: token }
        await dispatch(Get_All_Job_List(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setJobInformationData(prevState => ({
                        ...prevState,
                        AccountManager: `${response.data.outbooks_acount_manager_first_name} ${response.data.outbooks_acount_manager_last_name}`,
                        Customer: response.data.customer_trading_name,
                        Client: response.data.client_trading_name,
                        ClientJobCode: response.data.client_job_code,
                        CustomerAccountManager: response.data.account_manager_officer_id,
                        Service: response.data.service_id,
                        JobType: response.data.job_type_id,
                        // BudgetedHours: response.data.budgeted_hours,
                        // Reviewer: response.data.reviewer_id,
                        // AllocatedTo: response.data.allocated_id,

                        // AllocatedOn: response.data.allocated_on,
                        // DateReceivedOn: response.data.date_received_on,
                        // YearEnd: response.data.year_end,
                        // TotalPreparationTime: response.data.total_preparation_time,
                        // ReviewTime: response.data.review_time,
                        // FeedbackIncorporationTime: response.data.feedback_incorporation_time,
                        // TotalTime: response.data.total_time,
                        // EngagementModel: response.data.engagement_model,
                        // ExpectedDeliveryDate: response.data.expected_delivery_date,
                        // DueOn: response.data.due_on,
                        // SubmissionDeadline: response.data.submission_deadline,
                        // CustomerDeadlineDate: response.data.customer_deadline_date,
                        // SLADeadlineDate: response.data.sla_deadline_date,
                        // InternalDeadlineDate: response.data.internal_deadline_date,
                        // FilingWithCompaniesHouseRequired: response.data.filing_Companies_required,
                        // CompaniesHouseFilingDate: response.data.filing_Companies_date,
                        // FilingWithHMRCRequired: response.data.filing_hmrc_required,
                        // HMRCFilingDate: response.data.filing_hmrc_date,
                        // OpeningBalanceAdjustmentRequired: response.data.opening_balance_required,
                        // OpeningBalanceAdjustmentDate: response.data.opening_balance_date,
                        // NumberOfTransactions: response.data.number_of_transaction,
                        // NumberOfTrialBalanceItems: response.data.number_of_balance_items,
                        // Turnover: response.data.turnover,
                        // NoOfEmployees: response.data.number_of_employees,
                        // VATReconciliation: response.data.vat_reconciliation,
                        // Bookkeeping: response.data.bookkeeping,
                        // ProcessingType: response.data.processing_type,
                        // Invoiced: response.data.invoiced,
                        // Currency: response.data.currency,
                        // InvoiceValue: response.data.invoice_value,
                        // InvoiceDate: response.data.invoice_date,
                        // InvoiceTime: response.data.invoice_hours,
                        // InvoiceRemark: response.data.invoice_remark,


                    }));


                }

            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        JobDetails()
    }, []);



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
                                            placeholder="Enter Account Manager Name"
                                            disabled
                                            name="AccountManager"
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, AccountManager: e.target.value })}
                                            value={JobInformationData.AccountManager}
                                        />
                                    </div>
                                    <div id="invoiceremark" className="mb-3 col-lg-4">
                                        <label className="form-label">Customer<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Customer"
                                            disabled
                                            name="Customer"
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, Customer: e.target.value })}
                                            value={JobInformationData.Customer}
                                        />
                                    </div>
                                    <div className="col-lg-4">
                                        <label className="form-label">Client<span className='text-danger'>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Client Job Code"
                                            name="Client"
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, Client: e.target.value })}
                                            value={JobInformationData.Client}

                                        />
                                    </div>
                                    <div className="mb-3 col-lg-4">
                                        <label className="form-label">Client Job Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Client Job Code"
                                            name="ClientJobCode"
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, ClientJobCode: e.target.value })}
                                            value={JobInformationData.ClientJobCode}
                                        />
                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Customer Account Manager(Officer)</label>
                                        <select className="form-select"
                                            name="CustomerAccountManager"
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, CustomerAccountManager: e.target.value })}
                                            value={JobInformationData.CustomerAccountManager}
                                        >
                                            <option value="">Select Customer Account Manager</option>
                                            {
                                                AllJobData.data && AllJobData.data.customer_account_manager &&
                                                AllJobData.data.customer_account_manager.map((customer_account_manager) => (
                                                    <option value={customer_account_manager.customer_account_manager_officer_id}
                                                        key={customer_account_manager.customer_account_manager_officer_id}>
                                                        {customer_account_manager.customer_account_manager_officer_name}
                                                    </option>
                                                ))
                                            }
                                        </select>


                                    </div>


                                    <div className="col-lg-4">
                                        <label className="form-label">Service</label>
                                        <select className="form-select mb-3"
                                            name="Service"
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, Service: e.target.value })}
                                            value={JobInformationData.Service}
                                        >
                                            <option value="">Select Service</option>
                                            {AllJobData?.data?.services?.length > 0 &&
                                                AllJobData.data.services.map(({ service_id, service_name }) => (
                                                    <option value={service_id} key={service_id}>
                                                        {service_name}
                                                    </option>
                                                ))
                                            }


                                        </select>

                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Job Type</label>
                                        <select className="form-select mb-3 jobtype"
                                            disabled
                                            name="JobType"
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, JobType: e.target.value })}
                                            value={JobInformationData.JobType}
                                        >
                                            <option value="">Select Job Type</option>
                                            {AllJobData.loading &&
                                                AllJobData.data.job_type.map((jobtype) => (
                                                    <option value={jobtype.job_type_id} key={jobtype.job_type_id}>{jobtype.job_type_name}</option>
                                                ))}
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