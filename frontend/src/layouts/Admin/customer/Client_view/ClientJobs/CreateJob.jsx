import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { GetAllJabData, AddAllJobType } from '../../../../../ReduxStore/Slice/Customer/CustomerSlice';
import sweatalert from 'sweetalert2';

const CreateJob = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();

    const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
    const [errors, setErrors] = useState({})

    console.log("location :------", location.state)


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
            AccountManager: location.state.goto == "Customer" ? location.state.details.account_manager_firstname + " " + location.state.details.account_manager_lastname : location.state.details.customer_id.account_manager_firstname + " " + location.state.details.customer_id.account_manager_lastname,
            Customer: location.state.goto == "Customer" ? location.state.details.trading_name : location.state.details.customer_id.trading_name,
            Client: location.state.goto == "Customer" ? "" : location.state.details.row.client_name
        }));
    }, [AllJobData]);


    const GetJobData = async () => {
        const req = { customer_id: location.state.goto == "Customer" ? location.state.details.id : location.state.details.customer_id.id }
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
        validate()
        setJobData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


    const validate = () => {
        const newErrors = {};
        for (const key in jobData) {
            if (!jobData[key]) {
                if (key == 'AccountManager') newErrors[key] = 'Please Enter Account Manager';
                if (key == 'Customer') newErrors[key] = 'Please Enter Customer';
                if (key == 'Client') newErrors[key] = 'Please Select Client';
                if (key == 'ClientJobCode') newErrors[key] = 'Please Enter Client Job Code';
                if (key == 'CustomerAccountManager') newErrors[key] = 'Please Select Customer Account Manager';
                if (key == 'Service') newErrors[key] = 'Please Select Service';
                if (key == 'JobType') newErrors[key] = 'Please Select Job Type';
                if (key == 'BudgetedHours') newErrors[key] = 'Please Enter Budgeted Hours';
                if (key == 'Reviewer') newErrors[key] = 'Please Select Reviewer';
                if (key == 'AllocatedTo') newErrors[key] = 'Please Select Allocated To';
                if (key == 'AllocatedOn') newErrors[key] = 'Please Enter Allocated On';
                if (key == 'DateReceivedOn') newErrors[key] = 'Please Enter Date Received On';
                if (key == 'YearEnd') newErrors[key] = 'Please Enter Year End';
                if (key == 'TotalPreparationTime') newErrors[key] = 'Please Enter Total Preparation Time';
                if (key == 'ReviewTime') newErrors[key] = 'Please Enter Review Time';
                if (key == 'FeedbackIncorporationTime') newErrors[key] = 'Please Enter Feedback Incorporation Time';
                if (key == 'TotalTime') newErrors[key] = 'Please Enter Total Time';
                if (key == 'EngagementModel') newErrors[key] = 'Please Select Engagement Model';
                if (key == 'ExpectedDeliveryDate') newErrors[key] = 'Please Enter Expected Delivery Date';
                if (key == 'DueOn') newErrors[key] = 'Please Enter Due On';
                if (key == 'SubmissionDeadline') newErrors[key] = 'Please Enter Submission Deadline';
                if (key == 'CustomerDeadlineDate') newErrors[key] = 'Please Enter Customer Deadline Date';
                if (key == 'SLADeadlineDate') newErrors[key] = 'Please Enter SLA Deadline Date';
                if (key == 'InternalDeadlineDate') newErrors[key] = 'Please Enter Internal Deadline Date';
                if (key == 'FilingWithCompaniesHouseRequired') newErrors[key] = 'Please Select Filing With Companies House Required';
                if (key == 'CompaniesHouseFilingDate') newErrors[key] = 'Please Enter Companies House Filing Date';
                if (key == 'FilingWithHMRCRequired') newErrors[key] = 'Please Select Filing With HMRC Required';
                if (key == 'HMRCFilingDate') newErrors[key] = 'Please Enter HMRC Filing Date';
                if (key == 'OpeningBalanceAdjustmentRequired') newErrors[key] = 'Please Select Opening Balance Adjustment Required';
                if (key == 'OpeningBalanceAdjustmentDate') newErrors[key] = 'Please Enter Opening Balance Adjustment Date';
                if (key == 'NumberOfTransactions') newErrors[key] = 'Please Enter Number Of Transactions';
                if (key == 'NumberOfTrialBalanceItems') newErrors[key] = 'Please Enter Number Of Trial Balance Items';
                if (key == 'Turnover') newErrors[key] = 'Please Enter Turnover';
                if (key == 'NoOfEmployees') newErrors[key] = 'Please Enter No Of Employees';
                if (key == 'VATReconciliation') newErrors[key] = 'Please Select VAT Reconciliation';
                if (key == 'Bookkeeping') newErrors[key] = 'Please Select Bookkeeping';
                if (key == 'ProcessingType') newErrors[key] = 'Please Select Processing Type';
                if (key == 'Invoiced' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Select Invoiced';
                if (key == 'Currency' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Select Currency';
                if (key == 'InvoiceValue' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Enter Invoice Value';
                if (key == 'InvoiceDate' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Enter Invoice Date';
                if (key == 'InvoiceHours' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Enter Invoice Hours';
                if (key == 'InvoiceRemark' && jobData.EngagementModel != "fte_dedicated_staffing") newErrors[key] = 'Please Enter Invoice Remark';
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
    };




    const handleSubmit = async () => {
        const req = {
            account_manager_id: location.state.goto == "Customer" ? location.state.details.account_manager_id : location.state.details.customer_id.account_manager_id,
            customer_id: location.state.goto == "Customer" ? location.state.details.id : location.state.details.customer_id.id,
            client_id: location.state.goto == "Customer" ? jobData.Client : location.state.details.row.id,
            client_job_code: jobData.ClientJobCode,
            customer_contact_details_id: Number(jobData.CustomerAccountManager),
            service_id: Number(jobData.Service),
            job_type_id: Number(jobData.JobType),
            budgeted_hours: Number(jobData.BudgetedHours),
            reviewer: Number(jobData.Reviewer),
            allocated_to: Number(jobData.AllocatedTo),
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
            number_of_transaction: Number(jobData.NumberOfTransactions),
            number_of_balance_items: Number(jobData.NumberOfTrialBalanceItems),
            turnover: Number(jobData.Turnover),
            number_of_employees: Number(jobData.NoOfEmployees),
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

        if (validate()) {
            await dispatch(AddAllJobType(data))
                .unwrap()
                .then(async (response) => {
                    if (response.status) {
                        sweatalert.fire({
                            icon: 'success',
                            title: response.message,
                            timerProgressBar: true,
                            showConfirmButton: true,
                            timer: 1500
                        })
                        setTimeout(() => {
                            location.state.goto == "Customer" ? navigate('/admin/Clientlist', { state: location.state.details }) : navigate('/admin/client/profile', { state: location.state.details });
                        }, 1500);
                    } else {
                        console.log("response", response)
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        }
    }



    const filteredData = AllJobData.data?.engagement_model?.[0]
        ? Object.keys(AllJobData.data.engagement_model[0])
            .filter(key => AllJobData.data.engagement_model[0][key] === "1")
            .reduce((obj, key) => {
                obj[key] = AllJobData.data.engagement_model[0][key];
                return obj;
            }, {})
        : {};


    const handleClose = () => {
        if (location.state.goto == "Customer")
            navigate('/admin/Clientlist', { state: location.state });
        else {

            navigate('/admin/client/profile', { state: location.state });
        }
    }


    return (
        <div>
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header step-header-blue">
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
                                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Job Information</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className="mb-3 col-lg-4">
                                                                        <label className="form-label"> Outbook Account Manager</label>
                                                                        <input type="text" className="form-control" placeholder="Account Manager" disabled
                                                                            name="AccountManager" onChange={HandleChange} value={jobData.AccountManager} />
                                                                        {errors['AccountManager'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['AccountManager']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div id="invoiceremark" className="mb-3 col-lg-4">
                                                                        <label className="form-label">Customer</label>
                                                                        <input type="text" className="form-control" placeholder="Customer" disabled
                                                                            name="Customer" onChange={HandleChange} value={jobData.Customer} />
                                                                        {errors['Customer'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['Customer']}</div>
                                                                        )}
                                                                    </div>
                                                                    {
                                                                        location.state.goto == "Customer" ?

                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Client</label>
                                                                                <select className="form-select"
                                                                                    name="Client" onChange={HandleChange} value={jobData.Client}>
                                                                                    <option value="">Select Client</option>
                                                                                    {AllJobData.loading &&
                                                                                        AllJobData.data.client.map((client) => (
                                                                                            <option value={client.client_id} key={client.client_id}>{client.client_trading_name}</option>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                                {errors['Client'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['Client']}</div>
                                                                                )}

                                                                            </div>
                                                                            :
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Client</label>
                                                                                <input type="text" className="form-control" placeholder="Client Job Code"
                                                                                    name="Client" onChange={HandleChange} value={jobData.Client} disabled />

                                                                                {errors['Client'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['Client']}</div>
                                                                                )}
                                                                            </div>
                                                                    }

                                                                    <div className="mb-3 col-lg-4">
                                                                        <label className="form-label">Client Job Code</label>
                                                                        <input type="text" className="form-control" placeholder="Client Job Code"
                                                                            name="ClientJobCode" onChange={HandleChange} value={jobData.ClientJobCode} />
                                                                        {errors['ClientJobCode'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['ClientJobCode']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Customer Account Manager(Officer)</label>
                                                                        <select className="form-select"
                                                                            name="CustomerAccountManager" onChange={HandleChange} value={jobData.CustomerAccountManager}>
                                                                            <option value="">Select Customer Account Manager</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.customer_account_manager.map((customer_account_manager) => (
                                                                                    <option value={customer_account_manager.customer_account_manager_officer_id} key={customer_account_manager.customer_account_manager_officer_id}>{customer_account_manager.customer_account_manager_officer_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                        {errors['CustomerAccountManager'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['CustomerAccountManager']}</div>
                                                                        )}

                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Service</label>
                                                                        <select className="form-select"
                                                                            name="Service" onChange={HandleChange} value={jobData.Service}>
                                                                            <option value="">Select Service</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.services.map((service) => (
                                                                                    <option value={service.service_id} key={service.service_id}>{service.service_name}</option>
                                                                                ))

                                                                            }

                                                                        </select>
                                                                        {errors['Service'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['Service']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4 mb-3">
                                                                        <label className="form-label">Job Type</label>
                                                                        <select className="form-select jobtype"
                                                                            name="JobType" onChange={HandleChange} value={jobData.JobType}>
                                                                            <option value="">Select Job Type</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.job_type.map((jobtype) => (
                                                                                    <option value={jobtype.job_type_id} key={jobtype.job_type_id}>{jobtype.job_type_name}</option>
                                                                                ))}
                                                                        </select>
                                                                        {errors['JobType'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['JobType']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Budgeted Hours</label>
                                                                        <div className="input-group">
                                                                            <input type="text" className="form-control" placeholder='Enter Budgeted Hours'
                                                                                name="BudgetedHours" onChange={HandleChange} value={jobData.BudgetedHours}
                                                                            />

                                                                            <span className="input-group-text">Hours</span>
                                                                           
                                                                        </div>
                                                                        {errors['BudgetedHours'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['BudgetedHours']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Reviewer</label>
                                                                        <select className="form-select"
                                                                            name="Reviewer" onChange={HandleChange} value={jobData.Reviewer}>
                                                                            <option value=""> Select Reviewer</option>
                                                                            {
                                                                                AllJobData.loading &&
                                                                                AllJobData.data.reviewer.map((reviewer) => (
                                                                                    <option value={reviewer.reviewer_id} key={reviewer.reviewer_id}>{reviewer.reviewer_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                        {errors['Reviewer'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['Reviewer']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4 mb-3">
                                                                        <label className="form-label">Allocated To</label>
                                                                        <select className="form-select"
                                                                            name="AllocatedTo" onChange={HandleChange} value={jobData.AllocatedTo}>
                                                                            <option value=""> Select Staff</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.allocated.map((staff) => (
                                                                                    <option value={staff.allocated_id} key={staff.allocated_id}>{staff.allocated_name}</option>
                                                                                ))}
                                                                        </select>
                                                                        {errors['AllocatedTo'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['AllocatedTo']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label"> Allocated On </label>
                                                                        <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                            name="AllocatedOn" onChange={HandleChange} value={jobData.AllocatedOn} />
                                                                        {errors['AllocatedOn'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['AllocatedOn']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Date Received On</label>
                                                                        <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                            name="DateReceivedOn" onChange={HandleChange} value={jobData.DateReceivedOn} />
                                                                        {errors['DateReceivedOn'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['DateReceivedOn']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label"  > Year End </label>
                                                                            <input type="text" className="form-control" placeholder="Year End"
                                                                                name="YearEnd" onChange={HandleChange} value={jobData.YearEnd} />
                                                                            {errors['YearEnd'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['YearEnd']}</div>
                                                                            )}

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Total Preparation Time</label>
                                                                            <input type="text" className="form-control" placeholder="Total Preparation Time"
                                                                                name="TotalPreparationTime" onChange={HandleChange} value={jobData.TotalPreparationTime} />
                                                                            {errors['TotalPreparationTime'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['TotalPreparationTime']}</div>
                                                                            )}

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Review Time</label>
                                                                            <input type="text" className="form-control" placeholder="Review Time"
                                                                                name="ReviewTime" onChange={HandleChange} value={jobData.ReviewTime} />
                                                                            {errors['ReviewTime'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['ReviewTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Feedback Incorporation Time</label>
                                                                            <input type="text" className="form-control" placeholder="Feedback Incorporation Time"
                                                                                name="FeedbackIncorporationTime" onChange={HandleChange} value={jobData.FeedbackIncorporationTime} />
                                                                            {errors['FeedbackIncorporationTime'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['FeedbackIncorporationTime']}</div>
                                                                            )}

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" > Total Time</label>
                                                                            <input type="text" className="form-control" placeholder="Total Time"
                                                                                name="TotalTime" onChange={HandleChange} value={jobData.TotalTime}
                                                                            />
                                                                            {errors['TotalTime'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['TotalTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div id="invoice_type" className="col-lg-4">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Engagement Model
                                                                        </label>
                                                                        <select className="form-select invoice_type_dropdown"
                                                                            name="EngagementModel" onChange={HandleChange} value={jobData.EngagementModel}
                                                                        >
                                                                            <option value="">Please Select Engagement Model</option>
                                                                            {Object.keys(filteredData).map(key => (
                                                                                <option key={key} value={key}>{key}</option>
                                                                            ))}
                                                                        </select>
                                                                        {errors['EngagementModel'] && (
                                                                            <div style={{ 'color': 'red' }}>{errors['EngagementModel']}</div>
                                                                        )}

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Deadline</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-4 mb-3">
                                                                            <label className="form-label">Expected Delivery Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="ExpectedDeliveryDate" onChange={HandleChange} value={jobData.ExpectedDeliveryDate} />
                                                                            {errors['ExpectedDeliveryDate'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['ExpectedDeliveryDate']}</div>
                                                                            )}

                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Due On</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="DueOn" onChange={HandleChange} value={jobData.DueOn} />
                                                                            {errors['DueOn'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['DueOn']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Submission Deadline</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="SubmissionDeadline" onChange={HandleChange} value={jobData.SubmissionDeadline} />
                                                                            {errors['SubmissionDeadline'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['SubmissionDeadline']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Customer Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="CustomerDeadlineDate" onChange={HandleChange} value={jobData.CustomerDeadlineDate} />
                                                                            {errors['CustomerDeadlineDate'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['CustomerDeadlineDate']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">SLA Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="SLADeadlineDate" onChange={HandleChange} value={jobData.SLADeadlineDate} />
                                                                            {errors['SLADeadlineDate'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['SLADeadlineDate']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Internal Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="InternalDeadlineDate" onChange={HandleChange} value={jobData.InternalDeadlineDate} />
                                                                            {errors['InternalDeadlineDate'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['InternalDeadlineDate']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-12">
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Other Task</h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Filing With Companies House Required?</label>
                                                                                <select className="form-select"
                                                                                    name="FilingWithCompaniesHouseRequired" onChange={HandleChange} value={jobData.FilingWithCompaniesHouseRequired}>
                                                                                    <option value="">Please Select Companies House Required</option>
                                                                                    <option value="0">No</option>
                                                                                    <option value="1">Yes</option>
                                                                                </select>
                                                                                {errors['FilingWithCompaniesHouseRequired'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['FilingWithCompaniesHouseRequired']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Companies House Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="CompaniesHouseFilingDate" onChange={HandleChange} value={jobData.CompaniesHouseFilingDate} />
                                                                                {errors['CompaniesHouseFilingDate'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['CompaniesHouseFilingDate']}</div>
                                                                                )}

                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Filing with HMRC Required?</label>
                                                                            <select className="form-select invoice_type_dropdown"
                                                                                name="FilingWithHMRCRequired" onChange={HandleChange} value={jobData.FilingWithHMRCRequired}>
                                                                                <option value="">Please Select HMRC Required</option>
                                                                                <option value="0">No</option>
                                                                                <option value="1">Yes</option>
                                                                            </select>
                                                                            {errors['FilingWithHMRCRequired'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['FilingWithHMRCRequired']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">HMRC Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="HMRCFilingDate" onChange={HandleChange} value={jobData.HMRCFilingDate} />
                                                                                {errors['HMRCFilingDate'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['HMRCFilingDate']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Opening Balance Adjustment Required</label>
                                                                                <select className="form-select"
                                                                                    name="OpeningBalanceAdjustmentRequired" onChange={HandleChange} value={jobData.OpeningBalanceAdjustmentRequired}>
                                                                                    <option value="">Please Select Opening Balance Adjustment</option>
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
                                                                                </select>
                                                                                {errors['OpeningBalanceAdjustmentRequired'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['OpeningBalanceAdjustmentRequired']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Opening Balance Adjustment Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="OpeningBalanceAdjustmentDate" onChange={HandleChange} value={jobData.OpeningBalanceAdjustmentDate} />
                                                                                {errors['OpeningBalanceAdjustmentDate'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['OpeningBalanceAdjustmentDate']}</div>
                                                                                )}

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Other Data </h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-4 mb-3">
                                                                            <label className="form-label" >Number of Transactions </label>
                                                                            <input type="text" className="form-control" placeholder="Number of Transactions"
                                                                                name="NumberOfTransactions" onChange={HandleChange} value={jobData.NumberOfTransactions}
                                                                            />
                                                                            {errors['NumberOfTransactions'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['NumberOfTransactions']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Number of Trial Balance Items</label>
                                                                            <input type="text" className="form-control" placeholder="Number of Trial Balance Items"
                                                                                name="NumberOfTrialBalanceItems" onChange={HandleChange} value={jobData.NumberOfTrialBalanceItems}
                                                                            />
                                                                            {errors['NumberOfTrialBalanceItems'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['NumberOfTrialBalanceItems']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Turnover</label>
                                                                            <input type="text" className="form-control" placeholder="Turnover"
                                                                                name="Turnover" onChange={HandleChange} value={jobData.Turnover}
                                                                            />
                                                                            {errors['Turnover'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['Turnover']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4 mb-3">
                                                                            <label className="form-label">No.Of Employees</label>
                                                                            <input type="text" className="form-control" placeholder="No.Of Employees"
                                                                                name="NoOfEmployees" onChange={HandleChange} value={jobData.NoOfEmployees}
                                                                            />
                                                                            {errors['NoOfEmployees'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['NoOfEmployees']}</div>
                                                                            )}

                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >VAT Reconciliation</label>
                                                                            <select className="form-select invoice_type_dropdown"
                                                                                name="VATReconciliation" onChange={HandleChange} value={jobData.VATReconciliation}>

                                                                                <option value="">Please Select VAT Reconciliation</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                            {errors['VATReconciliation'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['VATReconciliation']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label"  >Bookkeeping?</label>
                                                                            <select className="form-select invoice_type_dropdown"
                                                                                name="Bookkeeping" onChange={HandleChange} value={jobData.Bookkeeping}
                                                                            >
                                                                                <option value="">Please Select Bookkeeping</option>
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
                                                                            </select>
                                                                            {errors['Bookkeeping'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['Bookkeeping']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Processing Type</label>
                                                                            <select className="form-select invoice_type_dropdown"
                                                                                name="ProcessingType" onChange={HandleChange} value={jobData.ProcessingType}
                                                                            >
                                                                                <option value="1"> Manual </option>
                                                                                <option value="2">Software</option>
                                                                            </select>
                                                                            {errors['ProcessingType'] && (
                                                                                <div style={{ 'color': 'red' }}>{errors['ProcessingType']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {jobData.EngagementModel != "fte_dedicated_staffing" && <div className="col-lg-12">
                                                        <div className="col-lg-12">
                                                            <div className="card card_shadow">
                                                                <div className="card-header align-items-center d-flex">
                                                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">Invoice</h4>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div style={{ marginTop: 15 }}>
                                                                        <div className="row">
                                                                            <div className="col-lg-4 mb-3">
                                                                                <label className="form-label">Invoiced?</label>
                                                                                <select className="invoiced_dropdown form-select"
                                                                                    name="Invoiced" onChange={HandleChange} value={jobData.Invoiced}
                                                                                >
                                                                                    <option value="">Please Select Invoiced</option>
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
                                                                                </select>
                                                                                {errors['Invoiced'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['Invoiced']}</div>
                                                                                )}

                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Currency</label>
                                                                                <select className="invoiced_dropdown form-select"
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
                                                                                {errors['Currency'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['Currency']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label" > Invoice Value </label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Value"
                                                                                    name="InvoiceValue" onChange={HandleChange} value={jobData.InvoiceValue}
                                                                                />
                                                                                {errors['InvoiceValue'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['InvoiceValue']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label" > Invoice Date </label>
                                                                                <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                    name="InvoiceDate" onChange={HandleChange} value={jobData.InvoiceDate}
                                                                                />
                                                                                {errors['InvoiceDate'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['InvoiceDate']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label" >Invoice Hours </label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control"
                                                                                        name="InvoiceHours" onChange={HandleChange} value={jobData.InvoiceHours}
                                                                                    />
                                                                                    <span className="input-group-text" >Hours</span>
                                                                                  
                                                                                </div>
                                                                                {errors['InvoiceHours'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['InvoiceHours']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div id="invoicedremark" className="col-lg-4">
                                                                                <label className="form-label" >Invoice Remark</label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Remark"
                                                                                    name="InvoiceRemark" onChange={HandleChange} value={jobData.InvoiceRemark}
                                                                                />
                                                                                {errors['InvoiceRemark'] && (
                                                                                    <div style={{ 'color': 'red' }}>{errors['InvoiceRemark']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" onClick={handleClose} >Cancel</button>
                                            <button type="button" className="btn btn-info text-white float-end blue-btn" onClick={handleSubmit}>Add Job</button>
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