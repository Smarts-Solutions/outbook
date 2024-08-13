import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { GetAllJabData , AddAllJobType } from '../../../../../ReduxStore/Slice/Customer/CustomerSlice';


const CreateJob = () => {
    const location = useLocation()
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();

    const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });

  

    const [jobData, setJobData] = useState({
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
        InvoiceHours: "",
        InvoiceRemark: "",
    });

    useEffect(() => {
        setJobData(prevState => ({
            ...prevState,
            AccountManager: location.state.details.customer_id.account_manager_firstname,
            Customer: location.state.details.customer_id.trading_name,
        }));
    }, [AllJobData]);


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

    const HandleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


   
    const handleSubmit = async () => {
        const req = {
            account_manager_id: location.state.details.customer_id.account_manager_id,
            customer_id: location.state.details.customer_id.id,
            client_id: jobData.Client,
            client_job_code: jobData.ClientJobCode,
            customer_contact_details_id: jobData.CustomerAccountManager,
            service_id: jobData.Service,
            job_type_id: jobData.JobType,
            budgeted_hours: jobData.BudgetedHours,
            reviewer: jobData.Reviewer,
            allocated_to: jobData.AllocatedTo,
            allocated_on: jobData.AllocatedOn,
            date_received_on: jobData.DateReceivedOn,
            year_end: jobData.YearEnd,
            total_preparation_time: jobData.TotalPreparationTime,
            review_time: jobData.ReviewTime,
            feedback_incorporation_time: jobData.FeedbackIncorporationTime,
            total_time: jobData.TotalTime,
            engagement_model: jobData.EngagementModel,
            expected_delivery_date: jobData.ExpectedDeliveryDate,
            due_on: jobData.DueOn,
            submission_deadline: jobData.SubmissionDeadline,
            customer_deadline_date: jobData.CustomerDeadlineDate,
            sla_deadline_date: jobData.SLADeadlineDate,
            internal_deadline_date: jobData.InternalDeadlineDate,
            filing_Companies_required: jobData.FilingWithCompaniesHouseRequired,
            filing_Companies_date: jobData.CompaniesHouseFilingDate,
            filing_hmrc_required: jobData.FilingWithHMRCRequired,
            filing_hmrc_date: jobData.HMRCFilingDate,
            opening_balance_required: jobData.OpeningBalanceAdjustmentRequired,
            opening_balance_date: jobData.OpeningBalanceAdjustmentDate,
            number_of_transaction: jobData.NumberOfTransactions,
            number_of_balance_items: jobData.NumberOfTrialBalanceItems,
            turnover: jobData.Turnover,
            number_of_employees: jobData.NoOfEmployees,
            vat_reconciliation: jobData.VATReconciliation,
            bookkeeping: jobData.Bookkeeping,
            processing_type: jobData.ProcessingType,
            invoiced: jobData.Invoiced,
            currency: jobData.Currency,
            invoice_value: jobData.InvoiceValue,
            invoice_date: jobData.InvoiceDate,
            invoice_hours: jobData.InvoiceHours,
            invoice_remark: jobData.InvoiceRemark
        } 
        const data = { req: req, authToken: token }
        await dispatch(AddAllJobType(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    console.log("response", response)
                } else {
                    console.log("response", response)
                }
            })
            .catch((error) => {
                console.log("Error", error);
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

    








    return (
        <div>
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Create New Job</h4>
                            </div>

                            <div className="card-body form-steps">
                                <div>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
                                            <div>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">Job Information</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="mb-3 col-lg-3">
                                                                        <label className="form-label"> Outbook Account Manager</label>
                                                                        <input type="text" className="form-control" placeholder="Account Manager" disabled
                                                                            name="AccountManager" onChange={HandleChange} value={jobData.AccountManager} />
                                                                    </div>

                                                                    <div id="invoiceremark" className="mb-3 col-lg-3">
                                                                        <label className="form-label">Customer</label>
                                                                        <input type="text" className="form-control" placeholder="Customer" disabled
                                                                            name="Customer" onChange={HandleChange} value={jobData.Customer} />
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Client</label>
                                                                        <select className="form-select mb-3"
                                                                            name="Client" onChange={HandleChange} value={jobData.Client}>
                                                                            <option value="">Select Client</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.client.map((client) => (
                                                                                    <option value={client.client_id} key={client.client_id}>{client.client_trading_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>

                                                                    <div className="mb-3 col-lg-3">
                                                                        <label className="form-label">Client Job Code</label>
                                                                        <input type="text" className="form-control" placeholder="Client Job Code"
                                                                            name="ClientJobCode" onChange={HandleChange} value={jobData.ClientJobCode} />
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Customer Account Manager(Officer)</label>
                                                                        <select className="form-select mb-3"
                                                                            name="CustomerAccountManager" onChange={HandleChange} value={jobData.CustomerAccountManager}>
                                                                            <option value="">Select Customer Account Manager</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.customer_account_manager.map((customer_account_manager) => (
                                                                                    <option value={customer_account_manager.customer_account_manager_officer_id} key={customer_account_manager.customer_account_manager_officer_id}>{customer_account_manager.customer_account_manager_officer_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Service</label>
                                                                        <select className="form-select mb-3"
                                                                            name="Service" onChange={HandleChange} value={jobData.Service}>
                                                                            <option value="">Select Service</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.services.map((service) => (
                                                                                    <option value={service.service_id} key={service.service_id}>{service.service_name}</option>
                                                                                ))

                                                                            }

                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Job Type</label>
                                                                        <select className="form-select mb-3 jobtype"
                                                                            name="JobType" onChange={HandleChange} value={jobData.JobType}>
                                                                            <option value="">Select Job Type</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.job_type.map((jobtype) => (
                                                                                    <option value={jobtype.job_type_id} key={jobtype.job_type_id}>{jobtype.job_type_name}</option>
                                                                                ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Budgeted Hours</label>
                                                                        <div className="input-group">
                                                                            <input type="text" className="form-control" placeholder='Enter Budgeted Hours'
                                                                                name="BudgetedHours" onChange={HandleChange} value={jobData.BudgetedHours}
                                                                            />
                                                                            <span className="input-group-text">Hours</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Reviewer</label>
                                                                        <select className="form-select mb-3"
                                                                            name="Reviewer" onChange={HandleChange} value={jobData.Reviewer}>
                                                                            <option value=""> Select Reviewer</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.reviewer.map((reviewer) => (
                                                                                    <option value={reviewer.reviewer_id} key={reviewer.reviewer_id}>{reviewer.reviewer_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Allocated To</label>
                                                                        <select className="form-select mb-3"
                                                                            name="AllocatedTo" onChange={HandleChange} value={jobData.AllocatedTo}>
                                                                            <option value=""> Select Staff</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.allocated.map((staff) => (
                                                                                    <option value={staff.allocated_id} key={staff.allocated_id}>{staff.allocated_name}</option>
                                                                                ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label"  > Allocated On </label>
                                                                        <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                            name="AllocatedOn" onChange={HandleChange} value={jobData.AllocatedOn} />
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Date Received On</label>
                                                                        <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                            name="DateReceivedOn" onChange={HandleChange} value={jobData.DateReceivedOn} />
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label"  > Year End </label>
                                                                            <input type="text" className="form-control" placeholder="Year End"
                                                                                name="YearEnd" onChange={HandleChange} value={jobData.YearEnd} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Total Preparation Time</label>
                                                                            <input type="text" className="form-control" placeholder="Total Preparation Time"
                                                                                name="TotalPreparationTime" onChange={HandleChange} value={jobData.TotalPreparationTime} />

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Review Time</label>
                                                                            <input type="text" className="form-control" placeholder="Review Time"
                                                                                name="ReviewTime" onChange={HandleChange} value={jobData.ReviewTime} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Feedback Incorporation Time</label>
                                                                            <input type="text" className="form-control" placeholder="Feedback Incorporation Time"
                                                                                name="FeedbackIncorporationTime" onChange={HandleChange} value={jobData.FeedbackIncorporationTime} />

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" > Total Time</label>
                                                                            <input type="text" className="form-control" placeholder="Total Time"
                                                                                name="TotalTime" onChange={HandleChange} value={jobData.TotalTime}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div id="invoice_type" className="col-lg-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Engagement Model
                                                                        </label>
                                                                        <select className="form-select mb-3 invoice_type_dropdown">
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
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">Deadline</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Expected Delivery Date</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="ExpectedDeliveryDate" onChange={HandleChange} value={jobData.ExpectedDeliveryDate} />

                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Due On</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="DueOn" onChange={HandleChange} value={jobData.DueOn} />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Submission Deadline</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="SubmissionDeadline" onChange={HandleChange} value={jobData.SubmissionDeadline} />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Customer Deadline Date</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="CustomerDeadlineDate" onChange={HandleChange} value={jobData.CustomerDeadlineDate} />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">SLA Deadline Date</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="SLADeadlineDate" onChange={HandleChange} value={jobData.SLADeadlineDate} />
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Internal Deadline Date</label>
                                                                            <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                name="InternalDeadlineDate" onChange={HandleChange} value={jobData.InternalDeadlineDate} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">Other Task</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Filing With Companies House Required?</label>
                                                                                <select className="form-select mb-3"
                                                                                    name="FilingWithCompaniesHouseRequired" onChange={HandleChange} value={jobData.FilingWithCompaniesHouseRequired}>
                                                                                    <option value="">Please Select Companies House Required</option>
                                                                                    <option value="0">No</option>
                                                                                    <option value="1">Yes</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Companies House Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="CompaniesHouseFilingDate" onChange={HandleChange} value={jobData.CompaniesHouseFilingDate} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Filing with HMRC Required?</label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"
                                                                                name="FilingWithHMRCRequired" onChange={HandleChange} value={jobData.FilingWithHMRCRequired}>
                                                                                <option value="">Please Select HMRC Required</option>
                                                                                <option value="0">No</option>
                                                                                <option value="1">Yes</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">HMRC Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="HMRCFilingDate" onChange={HandleChange} value={jobData.HMRCFilingDate} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Opening Balance Adjustment Required</label>
                                                                                <select className="form-select mb-3"
                                                                                    name="OpeningBalanceAdjustmentRequired" onChange={HandleChange} value={jobData.OpeningBalanceAdjustmentRequired}>
                                                                                    <option value="">Please Select Opening Balance Adjustment</option>
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Opening Balance Adjustment Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="OpeningBalanceAdjustmentDate" onChange={HandleChange} value={jobData.OpeningBalanceAdjustmentDate} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">  Other Data </h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >Number of Transactions </label>
                                                                            <input type="text" className="form-control" placeholder="Number of Transactions"
                                                                                name="NumberOfTransactions" onChange={HandleChange} value={jobData.NumberOfTransactions}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >Number of Trial Balance Items</label>
                                                                            <input type="text" className="form-control" placeholder="Number of Trial Balance Items"
                                                                                name="NumberOfTrialBalanceItems" onChange={HandleChange} value={jobData.NumberOfTrialBalanceItems}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >Turnover</label>
                                                                            <input type="text" className="form-control" placeholder="Turnover"
                                                                                name="Turnover" onChange={HandleChange} value={jobData.Turnover}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"  >  No.Of Employees  </label>
                                                                            <input type="text" className="form-control" placeholder="No.Of Employees"
                                                                                name="NoOfEmployees" onChange={HandleChange} value={jobData.NoOfEmployees}
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >VAT Reconciliation</label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"
                                                                                name="VATReconciliation" onChange={HandleChange} value={jobData.VATReconciliation}>

                                                                                <option value="">Please Select VAT Reconciliation</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"  >Bookkeeping?</label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"
                                                                                name="Bookkeeping" onChange={HandleChange} value={jobData.Bookkeeping}
                                                                            >
                                                                                <option value="">Please Select Bookkeeping</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >Processing Type</label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"
                                                                                name="ProcessingType" onChange={HandleChange} value={jobData.ProcessingType}
                                                                            >
                                                                                <option value="1"> Manual </option>
                                                                                <option value="2">Software</option>
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
                                                                <div className="card-header align-items-center d-flex">
                                                                    <h4 className="card-title mb-0 flex-grow-1">Invoice</h4>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div style={{ marginTop: 15 }}>
                                                                        <div className="row">
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label">Invoiced?</label>
                                                                                <select className="invoiced_dropdown form-select mb-3"
                                                                                    name="Invoiced" onChange={HandleChange} value={jobData.Invoiced}
                                                                                >
                                                                                    <option value="">Please Select Invoiced</option>
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" >Currency</label>
                                                                                <select className="invoiced_dropdown form-select mb-3"
                                                                                    name="Currency" onChange={HandleChange} value={jobData.Currency}
                                                                                >
                                                                                    <option value="">Please Select Currency</option>
                                                                                    {
                                                                                        AllJobData.loading &&   
                                                                                        AllJobData.data.currency.map((currency) => (
                                                                                            <option value={currency.currency_id} key={currency.currency_id}>{currency.currency_name}</option>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" > Invoice Value </label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Value"
                                                                                    name="InvoiceValue" onChange={HandleChange} value={jobData.InvoiceValue}
                                                                                />
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" > Invoice Date </label>
                                                                                <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY"
                                                                                    name="InvoiceDate" onChange={HandleChange} value={jobData.InvoiceDate}
                                                                                />
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" >Invoice Hours </label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control"
                                                                                        name="InvoiceHours" onChange={HandleChange} value={jobData.InvoiceHours}
                                                                                    />
                                                                                    <span className="input-group-text" >Hours</span>
                                                                                </div>
                                                                            </div>
                                                                            <div id="invoicedremark" className="col-lg-3">
                                                                                <label className="form-label" >Invoice Remark</label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Remark"
                                                                                    name="InvoiceRemark" onChange={HandleChange} value={jobData.InvoiceRemark}
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
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" >Cancel</button>
                                            <button type="button" className="btn btn-success nexttab nexttab" onClick={handleSubmit}>Add Job</button>
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

export default CreateJob