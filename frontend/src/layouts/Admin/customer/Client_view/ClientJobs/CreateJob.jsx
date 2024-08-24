import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { GetAllJabData, AddAllJobType } from '../../../../../ReduxStore/Slice/Customer/CustomerSlice';
import sweatalert from 'sweetalert2';
import * as bootstrap from 'bootstrap';


const CreateJob = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false);


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


    console.log("location",jobData)

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
        let name = e.target.name
        let value = e.target.value

        if (['BudgetedHours', 'TotalPreparationTime', 'ReviewTime', 'FeedbackIncorporationTime'].includes(name)) {
            value = (value).replace(":", "")
        }
        setJobData(prevState => ({
            ...prevState,
            [name]: value
        }));

        validate(name, value);
    }

    const fieldErrors = {
        'AccountManager': 'Please Enter Account Manager',
        'Customer': 'Please Enter Customer',
        'Client': 'Please Select Client',
        // 'ClientJobCode': 'Please Enter Client Job Code',
        'CustomerAccountManager': 'Please Select Customer Account Manager',
        'Service': 'Please Select Service',
        'JobType': 'Please Select Job Type',
        //'BudgetedHours': 'Please Enter Budgeted Hours',
        // 'Reviewer': 'Please Select Reviewer',
        // 'AllocatedTo': 'Please Select Allocated To',
        // 'AllocatedOn': 'Please Enter Allocated On',
        // 'DateReceivedOn': 'Please Enter Date Received On',
        // 'YearEnd': 'Please Enter Year End',
        // 'TotalPreparationTime': 'Please Enter Total Preparation Time',
        // 'ReviewTime': 'Please Enter Review Time',
        // 'FeedbackIncorporationTime': 'Please Enter Feedback Incorporation Time',
        'TotalTime': 'Please Enter Total Time',
        'EngagementModel': 'Please Select Engagement Model',
        'ExpectedDeliveryDate': 'Please Enter Expected Delivery Date',
        'DueOn': 'Please Enter Due On',
        'SubmissionDeadline': 'Please Enter Submission Deadline',
        'CustomerDeadlineDate': 'Please Enter Customer Deadline Date',
        'SLADeadlineDate': 'Please Enter SLA Deadline Date',
        'InternalDeadlineDate': 'Please Enter Internal Deadline Date',
        'FilingWithCompaniesHouseRequired': 'Please Select Filing With Companies House Required',
        'CompaniesHouseFilingDate': 'Please Enter Companies House Filing Date',
        'FilingWithHMRCRequired': 'Please Select Filing With HMRC Required',
        'HMRCFilingDate': 'Please Enter HMRC Filing Date',
        'OpeningBalanceAdjustmentRequired': 'Please Select Opening Balance Adjustment Required',
        'OpeningBalanceAdjustmentDate': 'Please Enter Opening Balance Adjustment Date',
        'NumberOfTransactions': 'Please Enter Number Of Transactions',
        'NumberOfTrialBalanceItems': 'Please Enter Number Of Trial Balance Items',
        'Turnover': 'Please Enter Turnover',
        'NoOfEmployees': 'Please Enter No Of Employees',
        'VATReconciliation': 'Please Select VAT Reconciliation',
        'Bookkeeping': 'Please Select Bookkeeping',
        'ProcessingType': 'Please Select Processing Type',
        'Invoiced': 'Please Select Invoiced',
        'Currency': 'Please Select Currency',
        'InvoiceValue': 'Please Enter Invoice Value',
        'InvoiceDate': 'Please Enter Invoice Date',
        'InvoiceHours': 'Please Enter Invoice Hours',
        'InvoiceRemark': 'Please Enter Invoice Remark'
    };

    const validate = (name, value, isSubmitting = false) => {
        const newErrors = { ...errors };

        if (isSubmitting) {
            for (const key in fieldErrors) {
                if (!jobData[key]) {
                    newErrors[key] = fieldErrors[key];
                }
            }
        }
        else {
            if (!value) {
                if (fieldErrors[name]) {
                    newErrors[name] = fieldErrors[name];
                }
            } else {
                delete newErrors[name];
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const validateAllFields = () => {
        let isValid = true;
        for (const key in jobData) {
            if (!validate(key, jobData[key], true)) {
                isValid = false;
            }
        }
        return isValid;
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
            allocated_on: jobData.AllocatedOn ? jobData.AllocatedOn : new Date().toISOString().split('T')[0],
            date_received_on: jobData.DateReceivedOn ? jobData.DateReceivedOn : new Date().toISOString().split('T')[0],
            year_end: jobData.YearEnd,
            total_preparation_time: Number(jobData.TotalPreparationTime),
            review_time: Number(jobData.ReviewTime),
            feedback_incorporation_time: Number(jobData.FeedbackIncorporationTime),
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
        setIsSubmitted(true);
        const isValid = validateAllFields();
        console.log("isValid", isValid)
        console.log("req", req)
        return
        if (isValid) {
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




    const [time, setTime] = useState('');
    console.log("time", time)
    const [showDropdown, setShowDropdown] = useState(false);
    const [customHours, setCustomHours] = useState('');
    const [customMinutes, setCustomMinutes] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const openTimePicker = () => { 
        console.log("CPPPPP")
        setShowDropdown(true);
    };

    const setTimeFromDropdown = (selectedTime) => {
        setTime(selectedTime);
        setShowDropdown(false);
    };

    const applyCustomTime = (e) => {
        console.log("e", e.target.value)
        if (customHours !== '' && customMinutes !== '') {
            const customTime = `${customHours.padStart(2, '0')}:${customMinutes.padStart(2, '0')}`;
            setTime(customTime);
            setJobData(prevState => ({
                ...prevState,
                TotalPreparationTime: customTime
            }));
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    let totalTime = Number(jobData.TotalPreparationTime) + Number(jobData.ReviewTime) + Number(jobData.FeedbackIncorporationTime)
    totalTime = totalTime.toString();

    return (
        <div>
            <div className="container-fluid">
                <div className="row mt-4">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header step-header-blue">
                                <h4 className="card-title mb-0 mt-0">Create New Job</h4>
                            </div>

                            <div className="card-body form-steps">
                                <div>
                                    <div className="tab-content">
                                        <div className="tab-pane fade show active">
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
                                                                        <label className="form-label"> Outbook Account Manager</label>
                                                                        <input type="text" className="form-control" placeholder="Account Manager" disabled
                                                                            name="AccountManager" onChange={HandleChange} value={jobData.AccountManager} />
                                                                        {errors['AccountManager'] && (
                                                                            <div className="error-text">{errors['AccountManager']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div id="invoiceremark" className="mb-3 col-lg-4">
                                                                        <label className="form-label">Customer</label>
                                                                        <input type="text" className="form-control" placeholder="Customer" disabled
                                                                            name="Customer" onChange={HandleChange} value={jobData.Customer} />
                                                                        {errors['Customer'] && (
                                                                            <div className="error-text">{errors['Customer']}</div>
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
                                                                                    <div className="error-text">{errors['Client']}</div>
                                                                                )}

                                                                            </div>
                                                                            :
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Client</label>
                                                                                <input type="text" className="form-control" placeholder="Client Job Code"
                                                                                    name="Client" onChange={HandleChange} value={jobData.Client} disabled />

                                                                                {errors['Client'] && (
                                                                                    <div className="error-text">{errors['Client']}</div>
                                                                                )}
                                                                            </div>
                                                                    }

                                                                    <div className="mb-3 col-lg-4">
                                                                        <label className="form-label">Client Job Code</label>
                                                                        <input type="text" className="form-control" placeholder="Client Job Code"
                                                                            name="ClientJobCode" onChange={HandleChange} value={jobData.ClientJobCode} />
                                                                        {errors['ClientJobCode'] && (
                                                                            <div className="error-text">{errors['ClientJobCode']}</div>
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
                                                                            <div className="error-text">{errors['CustomerAccountManager']}</div>
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
                                                                            <div className="error-text">{errors['Service']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4 mb-3">
                                                                        <label className="form-label">Job Type</label>
                                                                        <select className="form-select mb-3 jobtype"
                                                                            name="JobType" onChange={HandleChange} value={jobData.JobType}>
                                                                            <option value="">Select Job Type</option>
                                                                            {AllJobData.loading &&
                                                                                AllJobData.data.job_type.map((jobtype) => (
                                                                                    <option
                                                                                        value={jobtype.job_type_id}
                                                                                        key={jobtype.job_type_id}
                                                                                    >
                                                                                        {jobtype.job_type_name}
                                                                                    </option>
                                                                                ))}
                                                                        </select>

                                                                        {errors['JobType'] && (
                                                                            <div className="error-text">{errors['JobType']}</div>
                                                                        )}
                                                                    </div>


                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Budgeted Hours</label>
                                                                        <div className="input-group">

                                                                            <input type="time"
                                                                                name="BudgetedHours"
                                                                                className="form-control"

                                                                                onChange={HandleChange}

                                                                                defaultValue={jobData.BudgetedHours.substring(0, 2) + ":" + jobData.BudgetedHours.substring(2)}
                                                                            />

                                                                            <span className="input-group-text">Hours</span>

                                                                        </div>
                                                                        {errors['BudgetedHours'] && (
                                                                            <div className="error-text">{errors['BudgetedHours']}</div>
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
                                                                            <div className="error-text">{errors['Reviewer']}</div>
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
                                                                            <div className="error-text">{errors['AllocatedTo']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label"> Allocated On </label>
                                                                        <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                            name="AllocatedOn" onChange={HandleChange} value={jobData.AllocatedOn} />
                                                                        {errors['AllocatedOn'] && (
                                                                            <div className="error-text">{errors['AllocatedOn']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <label className="form-label">Date Received On</label>
                                                                        <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                            name="DateReceivedOn" onChange={HandleChange} value={jobData.DateReceivedOn} />
                                                                        {errors['DateReceivedOn'] && (
                                                                            <div className="error-text">{errors['DateReceivedOn']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label"  > Year End </label>
                                                                            <input
                                                                                type="month"
                                                                                className="form-control"
                                                                                placeholder="MM/YYYY"
                                                                                name="YearEnd"
                                                                                onChange={HandleChange}
                                                                                value={jobData.YearEnd}
                                                                            />
                                                                            {errors['YearEnd'] && (
                                                                                <div className="error-text">{errors['YearEnd']}</div>
                                                                            )}

                                                                        </div>
                                                                    </div>

 


                                                                    <div className="col-lg-4">

                                                                        <div style={{ textAlign: 'left', margin: '10px auto' }} className="dateselecter">
                                                                            <label className="form-label">Total Preparation Time</label>
                                                                            <input
                                                                                type="text"
                                                                                name='TotalPreparationTime'
                                                                                id="customTimePicker"
                                                                                className="form-control"
                                                                                style={{ width: '100%' }}
                                                                                placeholder="HH:MM"
                                                                                value={time}
                                                                                onClick={openTimePicker}
                                                                                readOnly
                                                                                ref={inputRef}
                                                                            />

                                                                            {showDropdown && (
                                                                                <div
                                                                                    ref={dropdownRef}
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: 'white',
                                                                                        border: '1px solid #ccc',
                                                                                        width: '150px',
                                                                                        marginTop: '5px',
                                                                                    }}
                                                                                >
                                                                                    {/* Standard 24-hour format options */}
                                                                                    <div onClick={() => setTimeFromDropdown('00:00')}>00:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('01:00')}>01:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('02:00')}>02:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('03:00')}>03:00</div>
                                                                                    
                                                                                    <div onClick={() => setTimeFromDropdown('23:00')}>23:00</div>
 
                                                                                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="Hours"
                                                                                            style={{ width: '60px', marginRight: '5px' }}
                                                                                            value={customHours}
                                                                                            onChange={(e) => setCustomHours(e.target.value)}
                                                                                        />
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="Minutes"
                                                                                            style={{ width: '60px' }}
                                                                                            value={customMinutes}
                                                                                            onChange={(e) => setCustomMinutes(e.target.value)}
                                                                                        />
                                                                                        <button onClick={(e)=>applyCustomTime(e)}>Set</button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                    </div>

                                                                    {/* <div className="col-lg-4">

                                                                        <div style={{ textAlign: 'left', margin: '10px auto' }} className="dateselecter">
                                                                            <label className="form-label">Review Time</label>
                                                                            <input
                                                                                type="text"
                                                                                name='ReviewTime'
                                                                                id="customTimePicker"
                                                                                className="form-control"
                                                                                style={{ width: '100%' }}
                                                                                placeholder="HH:MM"
                                                                                value={time}
                                                                                onClick={openTimePicker}
                                                                                readOnly
                                                                                ref={inputRef}
                                                                            />

                                                                            {showDropdown && (
                                                                                <div
                                                                                    ref={dropdownRef}
                                                                                    style={{
                                                                                        position: 'absolute',
                                                                                        backgroundColor: 'white',
                                                                                        border: '1px solid #ccc',
                                                                                        width: '150px',
                                                                                        marginTop: '5px',
                                                                                    }}
                                                                                >
                                                                                    
                                                                                    <div onClick={() => setTimeFromDropdown('00:00')}>00:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('01:00')}>01:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('02:00')}>02:00</div>
                                                                                    <div onClick={() => setTimeFromDropdown('03:00')}>03:00</div>
                                                                                     
                                                                                    <div onClick={() => setTimeFromDropdown('23:00')}>23:00</div>

                                                                                    
                                                                                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '5px', paddingBottom: '5px' }}>
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="Hours"
                                                                                            style={{ width: '60px', marginRight: '5px' }}
                                                                                            value={customHours}
                                                                                            onChange={(e) => setCustomHours(e.target.value)}
                                                                                        />
                                                                                        <input
                                                                                            type="number"
                                                                                            placeholder="Minutes"
                                                                                            name='ReviewTime'
                                                                                            style={{ width: '60px' }}
                                                                                            value={customMinutes}
                                                                                            onChange={(e) => setCustomMinutes(e.target.value)}
                                                                                        />
                                                                                        <button onClick={(e)=>applyCustomTime(e)}>Set</button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                    </div> */}


                                                                    
                                                                   <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Review Time</label>
                                                                            <input type="time"
                                                                                name="ReviewTime"
                                                                                className="form-control"

                                                                                onChange={HandleChange}
                                                                                defaultValue={jobData.ReviewTime.substring(0, 2) + ":" + jobData.ReviewTime.substring(2)}
                                                                            />
                                                                            {errors['ReviewTime'] && (
                                                                                <div className="error-text">{errors['ReviewTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div> 

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Feedback Incorporation Time</label>

                                                                            <input type="time"
                                                                                name="FeedbackIncorporationTime"
                                                                                className="form-control"

                                                                                onChange={HandleChange}
                                                                                defaultValue={jobData.FeedbackIncorporationTime.substring(0, 2) + ":" + jobData.FeedbackIncorporationTime.substring(2)}
                                                                            />
                                                                            {errors['FeedbackIncorporationTime'] && (
                                                                                <div className="error-text">{errors['FeedbackIncorporationTime']}</div>
                                                                            )}

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" > Total Time</label>

                                                                            <input type="text"
                                                                                name="TotalTime"
                                                                                className="form-control"
                                                                                value={totalTime.substring(0, 2) + ":" + totalTime.substring(2)}

                                                                                //onChange={HandleChange}
                                                                                disabled
                                                                            />


                                                                            {errors['TotalTime'] && (
                                                                                <div className="error-text">{errors['TotalTime']}</div>
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
                                                                            <div className="error-text">{errors['EngagementModel']}</div>
                                                                        )}

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
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="ExpectedDeliveryDate" onChange={HandleChange} value={jobData.ExpectedDeliveryDate} />
                                                                            {errors['ExpectedDeliveryDate'] && (
                                                                                <div className="error-text">{errors['ExpectedDeliveryDate']}</div>
                                                                            )}

                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Due On</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="DueOn" onChange={HandleChange} value={jobData.DueOn} />
                                                                            {errors['DueOn'] && (
                                                                                <div className="error-text">{errors['DueOn']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Submission Deadline</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="SubmissionDeadline" onChange={HandleChange} value={jobData.SubmissionDeadline} />
                                                                            {errors['SubmissionDeadline'] && (
                                                                                <div className="error-text">{errors['SubmissionDeadline']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Customer Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="CustomerDeadlineDate" onChange={HandleChange} value={jobData.CustomerDeadlineDate} />
                                                                            {errors['CustomerDeadlineDate'] && (
                                                                                <div className="error-text">{errors['CustomerDeadlineDate']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">SLA Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="SLADeadlineDate" onChange={HandleChange} value={jobData.SLADeadlineDate} />
                                                                            {errors['SLADeadlineDate'] && (
                                                                                <div className="error-text">{errors['SLADeadlineDate']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Internal Deadline Date</label>
                                                                            <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                name="InternalDeadlineDate" onChange={HandleChange} value={jobData.InternalDeadlineDate} />
                                                                            {errors['InternalDeadlineDate'] && (
                                                                                <div className="error-text">{errors['InternalDeadlineDate']}</div>
                                                                            )}
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
                                                                                <select className="form-select"
                                                                                    name="FilingWithCompaniesHouseRequired" onChange={HandleChange} value={jobData.FilingWithCompaniesHouseRequired}>
                                                                                    <option value="">Please Select Companies House Required</option>
                                                                                    <option value="0">No</option>
                                                                                    <option value="1">Yes</option>
                                                                                </select>
                                                                                {errors['FilingWithCompaniesHouseRequired'] && (
                                                                                    <div className="error-text">{errors['FilingWithCompaniesHouseRequired']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Companies House Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="CompaniesHouseFilingDate" onChange={HandleChange} value={jobData.CompaniesHouseFilingDate} />
                                                                                {errors['CompaniesHouseFilingDate'] && (
                                                                                    <div className="error-text">{errors['CompaniesHouseFilingDate']}</div>
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
                                                                                <div className="error-text">{errors['FilingWithHMRCRequired']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">HMRC Filing Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="HMRCFilingDate" onChange={HandleChange} value={jobData.HMRCFilingDate} />
                                                                                {errors['HMRCFilingDate'] && (
                                                                                    <div className="error-text">{errors['HMRCFilingDate']}</div>
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
                                                                                    <div className="error-text">{errors['OpeningBalanceAdjustmentRequired']}</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <div className="mb-3">
                                                                                <label className="form-label">Opening Balance Adjustment Date</label>
                                                                                <input type="date" className="form-control"
                                                                                    name="OpeningBalanceAdjustmentDate" onChange={HandleChange} value={jobData.OpeningBalanceAdjustmentDate} />
                                                                                {errors['OpeningBalanceAdjustmentDate'] && (
                                                                                    <div className="error-text">{errors['OpeningBalanceAdjustmentDate']}</div>
                                                                                )}

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
                                                                            <label className="form-label" >Number of Transactions </label>
                                                                            <input type="text" className="form-control" placeholder="Number of Transactions"
                                                                                name="NumberOfTransactions" onChange={HandleChange} value={jobData.NumberOfTransactions}
                                                                            />
                                                                            {errors['NumberOfTransactions'] && (
                                                                                <div className="error-text">{errors['NumberOfTransactions']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label" >Number of Trial Balance Items</label>
                                                                            <input type="text" className="form-control" placeholder="Number of Trial Balance Items"
                                                                                name="NumberOfTrialBalanceItems" onChange={HandleChange} value={jobData.NumberOfTrialBalanceItems}
                                                                            />
                                                                            {errors['NumberOfTrialBalanceItems'] && (
                                                                                <div className="error-text">{errors['NumberOfTrialBalanceItems']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Turnover</label>
                                                                            <input type="text" className="form-control" placeholder="Turnover"
                                                                                name="Turnover" onChange={HandleChange} value={jobData.Turnover}
                                                                            />
                                                                            {errors['Turnover'] && (
                                                                                <div className="error-text">{errors['Turnover']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4 mb-3">
                                                                            <label className="form-label">No.Of Employees</label>
                                                                            <input type="text" className="form-control" placeholder="No.Of Employees"
                                                                                name="NoOfEmployees" onChange={HandleChange} value={jobData.NoOfEmployees}
                                                                            />
                                                                            {errors['NoOfEmployees'] && (
                                                                                <div className="error-text">{errors['NoOfEmployees']}</div>
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
                                                                                <div className="error-text">{errors['VATReconciliation']}</div>
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
                                                                                <div className="error-text">{errors['Bookkeeping']}</div>
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
                                                                                <div className="error-text">{errors['ProcessingType']}</div>
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
                                                                <div className="card-header card-header-light-blue align-items-center d-flex">
                                                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">Invoice</h4>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div style={{ marginTop: 15 }}>
                                                                        <div className="row">
                                                                            <div className="col-lg-4 mb-3">
                                                                                <label className="form-label">Invoiced</label>
                                                                                <select className="invoiced_dropdown form-select"
                                                                                    name="Invoiced" onChange={HandleChange} value={jobData.Invoiced}
                                                                                >
                                                                                    <option value="">Please Select Invoiced</option>
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
                                                                                </select>
                                                                                {errors['Invoiced'] && (
                                                                                    <div className="error-text">{errors['Invoiced']}</div>
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
                                                                                    <div className="error-text">{errors['Currency']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label" > Invoice Value </label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Value"
                                                                                    name="InvoiceValue" onChange={HandleChange} value={jobData.InvoiceValue}
                                                                                />
                                                                                {errors['InvoiceValue'] && (
                                                                                    <div className="error-text">{errors['InvoiceValue']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label" > Invoice Date </label>
                                                                                <input type="date" className="form-control" placeholder="DD-MM-YYYY"
                                                                                    name="InvoiceDate" onChange={HandleChange} value={jobData.InvoiceDate}
                                                                                />
                                                                                {errors['InvoiceDate'] && (
                                                                                    <div className="error-text">{errors['InvoiceDate']}</div>
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
                                                                                    <div className="error-text">{errors['InvoiceHours']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div id="invoicedremark" className="col-lg-4">
                                                                                <label className="form-label" >Invoice Remark</label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Remark"
                                                                                    name="InvoiceRemark" onChange={HandleChange} value={jobData.InvoiceRemark}
                                                                                />
                                                                                {errors['InvoiceRemark'] && (
                                                                                    <div className="error-text">{errors['InvoiceRemark']}</div>
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
                                            {/* <button type="button" className="btn btn-secondary" onClick={handleClose} >Cancel</button> */}
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