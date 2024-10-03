import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetAllJabData, AddAllJobType, GET_ALL_CHECKLIST } from '../../../ReduxStore/Slice/Customer/CustomerSlice';
import { JobAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from 'sweetalert2';
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";


const JobInformationPage = ({ job_id }) => {
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const location = useLocation();
    const [AllJobData, setAllJobData] = useState([]);
    const dispatch = useDispatch();
    const [budgetedhours, setBudgetedHours] = useState({ hours: "", minutes: "" })
    const [PreparationTimne, setPreparationTimne] = useState({ hours: "", minutes: "" })
    const [ReviewTime, setReviewTime] = useState({ hours: "", minutes: "" })
    const [Totaltime, setTotalTime] = useState({ hours: "", minutes: "" })
    const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({ hours: "", minutes: "" })
    const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" })
    const [statusDataAll, setStatusDataAll] = useState([])
    const [selectStatusIs , setStatusId] = useState('')
 

    const [JobInformationData, setJobInformationData] = useState({
        AccountManager: "",
        Customer: "",
        Customer_id: 0,
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

    useEffect(() => {
        JobDetails()
        GetStatus()
    }, []);

    useEffect(() => {
        GetJobData()
    }, [JobInformationData]);

    const JobDetails = async () => {
        const req = { action: "getByJobId", job_id: location.state.job_id }
        const data = { req: req, authToken: token }
        await dispatch(JobAction(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setBudgetedHours({
                        hours: response.data.budgeted_hours.split(":")[0],
                        minutes: response.data.budgeted_hours.split(":")[1]
                    })
                    setReviewTime({
                        hours: response.data.review_time.split(":")[0],
                        minutes: response.data.review_time.split(":")[1]
                    })
                    setPreparationTimne({
                        hours: response.data.total_preparation_time.split(":")[0],
                        minutes: response.data.total_preparation_time.split(":")[1]
                    })
                    setTotalTime({
                        hours: response.data.total_time.split(":")[0],
                        minutes: response.data.total_time.split(":")[1]
                    })
                    setFeedbackIncorporationTime({
                        hours: response.data.feedback_incorporation_time.split(":")[0],
                        minutes: response.data.feedback_incorporation_time.split(":")[1]
                    })
                    setInvoiceTime({
                        hours: response.data.invoice_hours.split(":")[0],
                        minutes: response.data.invoice_hours.split(":")[1]
                    })
                    setJobInformationData(prevState => ({
                        ...prevState,
                        AccountManager: `${response.data.outbooks_acount_manager_first_name} ${response.data.outbooks_acount_manager_last_name}`,
                        Customer: response.data.customer_trading_name,
                        Customer_id: response.data.customer_id,
                        Client: response.data.client_trading_name,
                        ClientJobCode: response.data.client_job_code,
                        CustomerAccountManager: response.data.account_manager_officer_id,
                        Service: response.data.service_id,
                        JobType: response.data.job_type_id,
                        Reviewer: response.data.reviewer_id,
                        AllocatedTo: response.data.allocated_id,
                        AllocatedOn: response.data.allocated_on,
                        DateReceivedOn: response.data.date_received_on,
                        YearEnd: response.data.year_end,
                        TotalPreparationTime: response.data.total_preparation_time,
                        ReviewTime: response.data.review_time,
                        FeedbackIncorporationTime: response.data.feedback_incorporation_time,
                        TotalTime: response.data.total_time,
                        EngagementModel: response.data.engagement_model,
                        ExpectedDeliveryDate: response.data.expected_delivery_date,
                        DueOn: response.data.due_on,
                        SubmissionDeadline: response.data.submission_deadline,
                        CustomerDeadlineDate: response.data.customer_deadline_date,
                        SLADeadlineDate: response.data.sla_deadline_date,
                        InternalDeadlineDate: response.data.internal_deadline_date,
                        FilingWithCompaniesHouseRequired: response.data.filing_Companies_required,
                        CompaniesHouseFilingDate: response.data.filing_Companies_date,
                        FilingWithHMRCRequired: response.data.filing_hmrc_required,
                        HMRCFilingDate: response.data.filing_hmrc_date,
                        OpeningBalanceAdjustmentRequired: response.data.opening_balance_required,
                        OpeningBalanceAdjustmentDate: response.data.opening_balance_date,
                        NumberOfTransactions: response.data.number_of_transaction,
                        NumberOfTrialBalanceItems: response.data.number_of_balance_items,
                        Turnover: response.data.turnover,
                        NoOfEmployees: response.data.number_of_employees,
                        VATReconciliation: response.data.vat_reconciliation,
                        Bookkeeping: response.data.bookkeeping,
                        ProcessingType: response.data.processing_type,
                        Invoiced: response.data.invoiced,
                        Currency: response.data.currency,
                        InvoiceValue: response.data.invoice_value,
                        InvoiceDate: response.data.invoice_date,
                        InvoiceTime: response.data.invoice_hours,
                        InvoiceRemark: response.data.invoice_remark,
                    }));


                }

            })
            .catch((error) => {
                return;
            });
    }

    const GetStatus = async () => {
        const data = { req: { action: "get" }, authToken: token };
        await dispatch(MasterStatusData(data))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setStatusDataAll(response.data);
                } else {
                    setStatusDataAll([]);
                }
            })
            .catch((error) => {
                return;
            });
    };

    const GetJobData = async () => {
        const req = { customer_id: JobInformationData?.Customer_id }
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
                return;
            });

    }

 
    const filteredData = AllJobData.data?.engagement_model?.[0]
        ? Object.keys(AllJobData.data.engagement_model[0])
            .filter(key => AllJobData.data.engagement_model[0][key] === "1")
            .reduce((obj, key) => {
                obj[key] = AllJobData.data.engagement_model[0][key];
                return obj;
            }, {})
        : {};



    const handleJobEdit = () => {
        navigate('/admin/job/edit', { state: { job_id: location.state.job_id } })
    }

    const handleDelete = async (row, type) => {
        const req = { action: "delete", job_id: location.state.job_id };
        const data = { req: req, authToken: token };

        await dispatch(JobAction(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    sweatalert.fire({
                        title: "Deleted",
                        icon: "success",
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    setTimeout(() => {
                        window.history.back()
                    }, 1500);

                } else {
                    sweatalert.fire({
                        title: "Failed",
                        icon: "error",
                        showCancelButton: false,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            })
            .catch((error) => {
                return;
            });
    };

    return (
        <div>
            <div className='row mb-3'>
                <div className='col-md-8'>
                    <div className='tab-title'>
                        <h3>Job Information </h3>
                    </div>
                </div>
                <div className='col-md-4 '>
                    <div className='d-flex w-100'>
                        <div className='w-75'>
                            <select  className="form-select form-control" onChange={(e)=> setStatusId(e.target.value)} >
                                {
                                    statusDataAll.map((status) => (
                                        <option value={status.id} key={status.id}>{status.name}</option>
                                    ))
                                } 
                            </select>
                        </div>
                        <button className='edit-icon' onClick={handleJobEdit}>  <i className="ti-pencil text-primary" /></button>

                        <button className='delete-icon' onClick={handleDelete}><i className="ti-trash text-danger"></i></button>
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
                                            defaultValue=""
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
                                            defaultValue=""
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
                                            defaultValue=""
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
                                            defaultValue=""
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
                                            defaultValue=""
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, CustomerAccountManager: e.target.value })}
                                            value={JobInformationData.CustomerAccountManager}
                                        >
                                            <option value="">Select Customer Account Manager</option>
                                            {(AllJobData?.data?.customer_account_manager || []).map((customer_account_manager) => (
                                                <option value={customer_account_manager.customer_account_manager_officer_id} key={customer_account_manager.customer_account_manager_officer_id}>{customer_account_manager.customer_account_manager_officer_name}</option>
                                            ))
                                            }
                                        </select>


                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Service</label>
                                        <select className="form-select mb-3"
                                            name="Service"
                                            defaultValue=""
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, Service: e.target.value })}
                                            value={JobInformationData.Service}
                                        >
                                            <option value="">Select Service</option>
                                            {
                                                (AllJobData?.data?.services || []).map((service) => (
                                                    <option value={service.service_id} key={service.service_id}>{service.service_name}</option>
                                                ))
                                            }
                                        </select>

                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Job Type</label>
                                        <select className="form-select mb-3 jobtype"
                                            disabled
                                            name="JobType"
                                            defaultValue=""
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, JobType: e.target.value })}
                                            value={JobInformationData.JobType}
                                        >
                                            <option value="">Select Job Type</option>
                                            {
                                                (AllJobData?.data?.job_type || []).map((jobtype) => (
                                                    <option value={jobtype.job_type_id} key={jobtype.job_type_id}>{jobtype.job_type_name}</option>
                                                ))}
                                        </select>

                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Budgeted Time</label>
                                            <div className="input-group">
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        defaultValue=""
                                                        className="form-control"
                                                        placeholder="Hours"
                                                        name="BudgetedHours"
                                                        disabled
                                                        onChange={(e) => setBudgetedHours({ ...budgetedhours, hours: e.target.value })}
                                                        value={budgetedhours.hours}

                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        H
                                                    </span>
                                                </div>
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Minutes"
                                                        name="BudgetedHours"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setBudgetedHours({ ...budgetedhours, minutes: e.target.value })}
                                                        value={budgetedhours.minutes}

                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        M
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Reviewer</label>
                                        <select className="form-select mb-3"
                                            name="Reviewer"
                                            defaultValue=""
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, Reviewer: e.target.value })}
                                            value={JobInformationData.Reviewer}

                                        >
                                            <option value=""> Select Reviewer</option>
                                            {

                                                (AllJobData?.data?.reviewer || []).map((reviewer) => (
                                                    <option value={reviewer.reviewer_id} key={reviewer.reviewer_id}>{reviewer.reviewer_name}</option>
                                                ))
                                            }
                                        </select>

                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Allocated To</label>
                                        <select className="form-select mb-3"
                                            name="AllocatedTo"
                                            defaultValue=""
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, AllocatedTo: e.target.value })}
                                            value={JobInformationData.AllocatedTo}
                                        >
                                            <option value=""> Select Staff</option>
                                            {
                                                (AllJobData?.data?.allocated || []).map((staff) => (
                                                    <option value={staff.allocated_id} key={staff.allocated_id}>{staff.allocated_name}</option>
                                                ))}
                                        </select>

                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label"> Allocated On </label>
                                        <input
                                            type="date"
                                            className="form-control mb-3"
                                            placeholder="DD-MM-YYYY"
                                            name="AllocatedOn"
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, AllocatedOn: e.target.value })}
                                            value={JobInformationData.AllocatedOn}

                                            max={new Date().toISOString().split("T")[0]}
                                        />

                                    </div>

                                    <div className="col-lg-4">
                                        <label className="form-label">Date Received On</label>
                                        <input
                                            type="date"
                                            className="form-control mb-3"
                                            placeholder="DD-MM-YYYY"
                                            name="DateReceivedOn"
                                            defaultValue=""
                                            disabled
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, DateReceivedOn: e.target.value })

                                            }
                                            value={JobInformationData.DateReceivedOn}

                                            max={new Date().toISOString().split("T")[0]}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, YearEnd: e.target.value })}
                                                value={JobInformationData.YearEnd}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label" >Total Preparation Time</label>
                                            <div className="input-group">
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Hours"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setPreparationTimne({ ...PreparationTimne, hours: e.target.value })}
                                                        value={PreparationTimne.hours}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        H
                                                    </span>
                                                </div>
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Minutes"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setPreparationTimne({ ...PreparationTimne, minutes: e.target.value })}
                                                        value={PreparationTimne.minutes}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        M
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label">Review Time</label>
                                            <div className="input-group">
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Hours"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setReviewTime({ ...ReviewTime, hours: e.target.value })}
                                                        value={ReviewTime.hours}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        H
                                                    </span>
                                                </div>
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Minutes"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setReviewTime({ ...ReviewTime, minutes: e.target.value })}
                                                        value={ReviewTime.minutes}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        M
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label" >Feedback Incorporation Time</label>
                                            <div className="input-group">
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        defaultValue=""
                                                        placeholder="Hours"
                                                        disabled
                                                        onChange={(e) => setFeedbackIncorporationTime({ ...FeedbackIncorporationTime, hours: e.target.value })}
                                                        value={FeedbackIncorporationTime.hours}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        H
                                                    </span>
                                                </div>
                                                <div className='hours-div'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Minutes"
                                                        defaultValue=""
                                                        disabled
                                                        onChange={(e) => setFeedbackIncorporationTime({ ...FeedbackIncorporationTime, minutes: e.target.value })}
                                                        value={FeedbackIncorporationTime.minutes}
                                                    />
                                                    <span className="input-group-text" id="basic-addon2">
                                                        M
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="mb-3">
                                            <label className="form-label"> Total Time</label>
                                            <div className="row">
                                                <div className="col-md-6 pe-0">
                                                    <div className="input-group">
                                                        <div className='hours-div'>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={10}
                                                                aria-label="Recipient's username"
                                                                aria-describedby="basic-addon2"
                                                                disabled
                                                                defaultValue=""
                                                                onChange={(e) => setTotalTime({ ...Totaltime, hours: e.target.value })}
                                                                value={Totaltime.hours}

                                                            />
                                                            <span className="input-group-text" id="basic-addon2">
                                                                H
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 ps-0">
                                                    <div className="input-group">
                                                        <div className='hours-div'>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={10}
                                                                aria-label="Recipient's username"
                                                                aria-describedby="basic-addon2"
                                                                defaultValue=""
                                                                disabled
                                                                onChange={(e) => setTotalTime({ ...Totaltime, minutes: e.target.value })}
                                                                value={Totaltime.minutes}
                                                            />
                                                            <span className="input-group-text" id="basic-addon2">
                                                                M
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                    <div id="invoice_type" className="col-lg-4">
                                        <label htmlFor="firstNameinput" className="form-label">
                                            Engagement Model
                                        </label>
                                        <select className="form-select mb-3 invoice_type_dropdown"
                                            disabled
                                            defaultValue=""
                                            name="EngagementModel"
                                            onChange={(e) => setJobInformationData({ ...JobInformationData, EngagementModel: e.target.value })}
                                            value={JobInformationData.EngagementModel}
                                        >
                                            <option value="">Please Select Engagement Model</option>
                                            {Object.keys(filteredData).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, ExpectedDeliveryDate: e.target.value })}
                                                value={JobInformationData.ExpectedDeliveryDate}

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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, DueOn: e.target.value })}
                                                value={JobInformationData.DueOn}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, SubmissionDeadline: e.target.value })}

                                                value={JobInformationData.SubmissionDeadline}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, CustomerDeadlineDate: e.target.value })}
                                                value={JobInformationData.CustomerDeadlineDate}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, SLADeadlineDate: e.target.value })}
                                                value={JobInformationData.SLADeadlineDate}

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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, InternalDeadlineDate: e.target.value })}
                                                value={JobInformationData.InternalDeadlineDate}
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
                                                <label className="form-label">Filing With Companies House Required?</label>
                                                <select className="form-select mb-3"
                                                    name="FilingWithCompaniesHouseRequired"
                                                    disabled
                                                    defaultValue=""
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, FilingWithCompaniesHouseRequired: e.target.value })}
                                                    value={JobInformationData.FilingWithCompaniesHouseRequired}
                                                >
                                                    <option value="">Please Select Companies House Required</option>
                                                    <option value="1">Yes</option>
                                                    <option value="0">No</option>
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, CompaniesHouseFilingDate: e.target.value })}
                                                    value={JobInformationData.CompaniesHouseFilingDate}

                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="form-label">Filing with HMRC Required?</label>
                                            <select
                                                className="form-select invoice_type_dropdown"
                                                name="FilingWithHMRCRequired"
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, FilingWithHMRCRequired: e.target.value })}
                                                value={JobInformationData.FilingWithHMRCRequired}
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, HMRCFilingDate: e.target.value })}
                                                    value={JobInformationData.HMRCFilingDate}

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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, OpeningBalanceAdjustmentRequired: e.target.value })}
                                                    value={JobInformationData.OpeningBalanceAdjustmentRequired}
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, OpeningBalanceAdjustmentDate: e.target.value })}
                                                    value={JobInformationData.OpeningBalanceAdjustmentDate}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, NumberOfTransactions: e.target.value })}
                                                value={JobInformationData.NumberOfTransactions}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, NumberOfTrialBalanceItems: e.target.value })}
                                                value={JobInformationData.NumberOfTrialBalanceItems}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, Turnover: e.target.value })}
                                                value={JobInformationData.Turnover}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, NoOfEmployees: e.target.value })}
                                                value={JobInformationData.NoOfEmployees}

                                            />
                                        </div>
                                        <div className="col-lg-4">
                                            <label className="form-label">VAT Reconciliation</label>
                                            <select
                                                className="form-select invoice_type_dropdown"
                                                name="VATReconciliation"
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, VATReconciliation: e.target.value })}
                                                value={JobInformationData.VATReconciliation}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, Bookkeeping: e.target.value })}
                                                value={JobInformationData.Bookkeeping}
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
                                                disabled
                                                onChange={(e) => setJobInformationData({ ...JobInformationData, ProcessingType: e.target.value })}
                                                value={JobInformationData.ProcessingType}
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, Invoiced: e.target.value })}
                                                    value={JobInformationData.Invoiced}
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, Currency: e.target.value })}
                                                    value={JobInformationData.Currency}
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
                                                    disabled

                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, InvoiceValue: e.target.value })}
                                                    value={JobInformationData.InvoiceValue}
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
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, InvoiceDate: e.target.value })}
                                                    value={JobInformationData.InvoiceDate}
                                                />
                                            </div>

                                            <div className="col-lg-4">
                                                <div className="mb-3">
                                                    <label className="form-label" >Invoice </label>
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Hours"
                                                            defaultValue=""
                                                            disabled
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || (Number(value) >= 0 && Number(value) <= 23)) {
                                                                    setInvoiceTime({
                                                                        ...invoiceTime,
                                                                        hours: value
                                                                    });
                                                                }
                                                            }}
                                                            value={invoiceTime.hours}
                                                        />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Minutes"
                                                            defaultValue=""
                                                            disabled
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                                                                    setInvoiceTime({
                                                                        ...invoiceTime,
                                                                        minutes: value
                                                                    });
                                                                }
                                                            }}
                                                            value={invoiceTime.minutes}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                            <div id="invoicedremark" className="col-lg-4">
                                                <label className="form-label" >Invoice Remark</label>
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Invoice Remark"
                                                    name="InvoiceRemark"
                                                    defaultValue=""
                                                    disabled
                                                    onChange={(e) => setJobInformationData({ ...JobInformationData, InvoiceRemark: e.target.value })}
                                                    value={JobInformationData.InvoiceRemark}
                                                    maxLength={500}
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