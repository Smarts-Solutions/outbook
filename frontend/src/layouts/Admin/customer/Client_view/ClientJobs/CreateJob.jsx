import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { GetAllJabData, AddAllJobType, GET_ALL_CHECKLIST } from '../../../../../ReduxStore/Slice/Customer/CustomerSlice';
import sweatalert from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { JobType } from '../../../../../ReduxStore/Slice/Settings/settingSlice'
import { Modal, Button } from 'react-bootstrap';

const CreateJob = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const [AllJobData, setAllJobData] = useState({ loading: false, data: [] });
    const [get_Job_Type, setJob_Type] = useState({ loading: false, data: [] })
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [PreparationTimne, setPreparationTimne] = useState({ hours: "", minutes: "" })
    const [FeedbackIncorporationTime, setFeedbackIncorporationTime] = useState({ hours: "", minutes: "" })
    const [reviewTime, setReviewTime] = useState({ hours: "", minutes: "" })
    const [budgetedHours, setBudgetedHours] = useState({ hours: "", minutes: "" })
    const [invoiceTime, setInvoiceTime] = useState({ hours: "", minutes: "" })
    const [AllChecklist, setAllChecklist] = useState({ loading: false, data: [] })
    const [AllChecklistData, setAllChecklistData] = useState({ loading: false, data: [] })
    const [getChecklistId, setChecklistId] = useState('')
    const [AddTaskArr, setAddTaskArr] = useState([])
    const [showAddJobModal, setShowAddJobModal] = useState(false);
    const [taskName, setTaskName] = useState('')
    const [Budgeted, setBudgeted] = useState('')
    const [taskNameError, setTaskNameError] = useState('')
    const [BudgetedError, setBudgetedError] = useState('')
    const [jobModalStatus, jobModalSetStatus] = useState(false);

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
        ExpectedDeliveryDate: null,
        DueOn: null,
        SubmissionDeadline: null,
        CustomerDeadlineDate: null,
        SLADeadlineDate: null,
        InternalDeadlineDate: null,
        FilingWithCompaniesHouseRequired: "0",
        CompaniesHouseFilingDate: null,
        FilingWithHMRCRequired: "0",
        HMRCFilingDate: null,
        OpeningBalanceAdjustmentRequired: "0",
        OpeningBalanceAdjustmentDate: null,
        NumberOfTransactions: "",
        NumberOfTrialBalanceItems: "",
        Turnover: "",
        NoOfEmployees: "",
        VATReconciliation: "0",
        Bookkeeping: "0",
        ProcessingType: "0",
        Invoiced: "0",
        Currency: "0",
        InvoiceValue: "0",
        InvoiceDate: null,
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


    const getAllChecklist = async () => {
        const req = { action: "getByServiceWithJobType", service_id: jobData.Service, customer_id: location.state.goto == "Customer" ? location.state.details.id : location.state.details.customer_id.id, job_type_id: jobData.JobType }
        const data = { req: req, authToken: token }
        await dispatch(GET_ALL_CHECKLIST(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setAllChecklist({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setAllChecklist({
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
        getAllChecklist()
    }, [jobData.JobType]);

    const GetJobType = async () => {
        const req = { action: "get", service_id: jobData.Service }
        const data = { req: req, authToken: token }
        await dispatch(JobType(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setJob_Type({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setJob_Type({
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
        GetJobType()
    }, [jobData.Service]);



    const getChecklistData = async () => {
        const req = { action: "getById", checklist_id: getChecklistId && getChecklistId }
        const data = { req: req, authToken: token }
        await dispatch(GET_ALL_CHECKLIST(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setAllChecklistData({
                        loading: true,
                        data: response.data.task || []
                    })
                } else {
                    setAllChecklistData({
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
        getChecklistData()
    }, [getChecklistId])


    const HandleChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        if (name == "NumberOfTransactions" || name == "NumberOfTrialBalanceItems" || name == "Turnover") {
            if (!/^[0-9+]*$/.test(value)) {
                return;
            }
        }
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
        'CustomerAccountManager': 'Please Select Customer Account Manager',
        'Service': 'Please Select Service',
        'JobType': 'Please Select Job Type',
        'NumberOfTransactions': 'Please Enter Number Of Transactions less than 1000000',
        'NumberOfTrialBalanceItems': 'Please Enter Number Of Trial Balance Items less than 5000',
        'Turnover': 'Please Enter Turnover less than 200000000',

    };

    const validate = (name, value, isSubmitting = false) => {
        const newErrors = { ...errors };

        if (isSubmitting) {
            for (const key in fieldErrors) {
                if (!jobData[key] && key != "NumberOfTransactions" && key != "NumberOfTrialBalanceItems" && key != "Turnover") {
                    newErrors[key] = fieldErrors[key];
                }
            }
        }
        else {
            if (!value && name != "NumberOfTransactions" && name != "NumberOfTrialBalanceItems" && name != "Turnover") {
                if (fieldErrors[name]) {
                    newErrors[name] = fieldErrors[name];
                }
            }
            else if (name == "NumberOfTransactions" && (value > 1000000)) {
                newErrors[name] = fieldErrors[name];
            }
            else if (name == "NumberOfTrialBalanceItems" && (value > 5000)) {
                newErrors[name] = fieldErrors[name];
            }
            else if (name == "Turnover" && (value > 200000000)) {
                newErrors[name] = fieldErrors[name];
            }



            else {
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

    function formatTime(hours, minutes) {
        const formattedHours = hours != "" || hours != null ? String(hours).padStart(2, '0') : '00';
        const formattedMinutes = minutes != "" || minutes != null ? String(minutes).padStart(2, '0') : '00';
        return `${formattedHours}:${formattedMinutes}`;
    }

    const handleSubmit = async () => {
        const req = {
            account_manager_id: location.state.goto == "Customer" ? location.state.details.account_manager_id : location.state.details.customer_id.account_manager_id,
            customer_id: location.state.goto == "Customer" ? location.state.details.id : location.state.details.customer_id.id,
            client_id: location.state.goto == "Customer" ? jobData.Client : location.state.details.row.id,
            client_job_code: jobData.ClientJobCode,
            customer_contact_details_id: Number(jobData.CustomerAccountManager),
            service_id: Number(jobData.Service),
            job_type_id: Number(jobData.JobType),
            budgeted_hours: formatTime(budgetedHours.hours, budgetedHours.minutes),
            reviewer: Number(jobData.Reviewer),
            allocated_to: Number(jobData.AllocatedTo),
            allocated_on: jobData.AllocatedOn ? jobData.AllocatedOn : new Date().toISOString().split('T')[0],
            date_received_on: jobData.DateReceivedOn ? jobData.DateReceivedOn : new Date().toISOString().split('T')[0],
            year_end: jobData.YearEnd,
            //total_preparation_time: PreparationTimne.hours + ":" + PreparationTimne.minutes,
            total_preparation_time: formatTime(PreparationTimne.hours, PreparationTimne.minutes),
            review_time: formatTime(reviewTime.hours, reviewTime.minutes),
            feedback_incorporation_time: formatTime(FeedbackIncorporationTime.hours, FeedbackIncorporationTime.minutes),
            //  total_time: Math.floor(totalHours / 60) + ":" + totalHours % 60,
            total_time: formatTime(Math.floor(totalHours / 60), totalHours % 60),
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
            invoice_hours: formatTime(invoiceTime.hours, invoiceTime.minutes),
            invoice_remark: jobData.InvoiceRemark,
            tasks: {
                checklist_id: location.state.details.customer_id.id,
                task: AddTaskArr
            }
        }


        const data = { req: req, authToken: token }
        setIsSubmitted(true);
        const isValid = validateAllFields();

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



    const totalHours = Number(PreparationTimne.hours) * 60 + Number(PreparationTimne.minutes) + Number(reviewTime.hours) * 60 + Number(reviewTime.minutes) + Number(FeedbackIncorporationTime.hours) * 60 + Number(FeedbackIncorporationTime.minutes)



    const openJobModal = (e) => {

        if (e.target.value != "") {
            jobModalSetStatus(true)
        }

    }



    const AddTask = (id) => {
        const filterData = AllChecklistData.data.find((data) => data.task_id == id);

        if (!filterData) {
            return;
        }

        setAddTaskArr((prevTasks) => {
            const taskExists = prevTasks.some((task) => task.task_id === filterData.task_id);

            if (taskExists) {
                return prevTasks;
            } else {
                return [...prevTasks, filterData];
            }
        });

    };

    const RemoveTask = (id) => {
        setAddTaskArr((prevTasks) => prevTasks.filter((task) => task.task_id !== id));

    }


    const handleChange1 = (e) => {
        const { name, value } = e.target;

        // Validation for Task Name
        if (name === "taskname") {
            if (value.trim() === "") {
                setTaskNameError("Please Enter Task Name");
            } else {
                setTaskNameError("");
            }
            setTaskName(value);
        }

        // Validation for Budgeted Hour
        if (name === "budgeted_hour") {
            if (value.trim() === "") {
                setBudgetedError("Please Enter Budgeted Hour");
            } else if (isNaN(value) || value <= 0) {
                setBudgetedError("Please enter a valid number for Budgeted Hour");
            } else {
                setBudgetedError("");
            }
            setBudgeted(value);
        }
    };




    const handleAddTask = () => {
        const req = { task_id: "", task_name: taskName, budgeted_hour: Budgeted }
        setAddTaskArr([...AddTaskArr, req])
     
        setShowAddJobModal(false)
    }



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
                                                                            name="JobType" onChange={(e) => { HandleChange(e); openJobModal(e) }} value={jobData.JobType}>
                                                                            <option value="">Select Job Type</option>
                                                                            {get_Job_Type.loading &&
                                                                                get_Job_Type.data.map((jobtype) => (
                                                                                    <option
                                                                                        value={jobtype.id}
                                                                                        key={jobtype.id}
                                                                                    >
                                                                                        {jobtype.type}
                                                                                    </option>
                                                                                ))}
                                                                        </select>

                                                                        {errors['JobType'] && (
                                                                            <div className="error-text">{errors['JobType']}</div>
                                                                        )}
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Budgeted Hours</label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Hours"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || Number(value) >= 0) {
                                                                                            setBudgetedHours({ ...budgetedHours, hours: value });
                                                                                        }
                                                                                    }}
                                                                                    value={budgetedHours.hours}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Minutes"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                                                                                            setBudgetedHours({
                                                                                                ...budgetedHours,
                                                                                                minutes: value
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    value={budgetedHours.minutes}
                                                                                />
                                                                            </div>

                                                                        </div>
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
                                                                            <label className="form-label">Year End</label>
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
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Total Preparation Time</label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    placeholder="Hours"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || Number(value) >= 0) {
                                                                                            setPreparationTimne({ ...PreparationTimne, hours: value });
                                                                                        }
                                                                                    }}
                                                                                    value={PreparationTimne.hours}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Minutes"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                                                                                            setPreparationTimne({
                                                                                                ...PreparationTimne,
                                                                                                minutes: value
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    value={PreparationTimne.minutes}
                                                                                />
                                                                            </div>
                                                                            {errors['TotalPreparationTime'] && (
                                                                                <div className="error-text">{errors['TotalPreparationTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>


                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Review Time</label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Hours"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || Number(value) >= 0) {
                                                                                            setReviewTime({ ...reviewTime, hours: value });
                                                                                        }
                                                                                    }}
                                                                                    value={reviewTime.hours}
                                                                                />

                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Minutes"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                                                                                            setReviewTime({
                                                                                                ...reviewTime,
                                                                                                minutes: value
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    value={reviewTime.minutes}
                                                                                />

                                                                            </div>
                                                                            {errors['TotalPreparationTime'] && (
                                                                                <div className="error-text">{errors['TotalPreparationTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" >Feedback Incorporation Time</label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Hours"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || /^[0-9]*$/.test(value)) {
                                                                                            setFeedbackIncorporationTime({ ...FeedbackIncorporationTime, hours: value });
                                                                                        }
                                                                                    }}
                                                                                    value={FeedbackIncorporationTime.hours}
                                                                                />

                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Minutes"
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value;
                                                                                        if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
                                                                                            setFeedbackIncorporationTime({
                                                                                                ...FeedbackIncorporationTime,
                                                                                                minutes: value
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    value={FeedbackIncorporationTime.minutes}
                                                                                />
                                                                            </div>
                                                                            {errors['TotalPreparationTime'] && (
                                                                                <div className="error-text">{errors['TotalPreparationTime']}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label className="form-label" > Total Time</label>

                                                                            <input type="text"
                                                                                name="TotalTime"
                                                                                className="form-control"
                                                                                value={Math.floor(totalHours / 60) + ":" + totalHours % 60}
                                                                                onChange={HandleChange}
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
                                                                                    <option value="1">Yes</option>
                                                                                    <option value="0">No</option>
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
                                                                                <option value="1">Yes</option>
                                                                                <option value="0">No</option>
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
                                                                            <input type="text" className="form-control" placeholder="Enter Trial Balance Items"
                                                                                name="NumberOfTrialBalanceItems" onChange={HandleChange} value={jobData.NumberOfTrialBalanceItems}

                                                                            />
                                                                            {errors['NumberOfTrialBalanceItems'] && (
                                                                                <div className="error-text">{errors['NumberOfTrialBalanceItems']}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <label className="form-label">Turnover</label>
                                                                            <input type="text" className="form-control" placeholder="Enter Turnover"
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
                                                                                <option value="">Please Select Processing Type</option>
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
                                                                                            <option value={currency.country_id} key={currency.country_id}>{currency.currency_name}</option>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                                {errors['Currency'] && (
                                                                                    <div className="error-text">{errors['Currency']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Invoice Value</label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Value"
                                                                                    name="InvoiceValue" onChange={HandleChange} value={jobData.InvoiceValue}
                                                                                />
                                                                                {errors['InvoiceValue'] && (
                                                                                    <div className="error-text">{errors['InvoiceValue']}</div>
                                                                                )}
                                                                            </div>
                                                                            <div className="col-lg-4">
                                                                                <label className="form-label">Invoice Date</label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control"
                                                                                    placeholder="DD-MM-YYYY"
                                                                                    name="InvoiceDate"
                                                                                    onChange={HandleChange}
                                                                                    value={jobData.InvoiceDate}
                                                                                    max={new Date().toISOString().split("T")[0]}
                                                                                />
                                                                                {errors['InvoiceDate'] && (
                                                                                    <div className="error-text">{errors['InvoiceDate']}</div>
                                                                                )}
                                                                            </div>



                                                                            <div className="col-lg-4">
                                                                                <div className="mb-3">
                                                                                    <label className="form-label" >Invoice </label>
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Hours"
                                                                                            onChange={(e) => {
                                                                                                const value = e.target.value;
                                                                                                if (value === '' || Number(value) >= 0) {
                                                                                                    setInvoiceTime({ ...invoiceTime, hours: value });
                                                                                                }
                                                                                            }}
                                                                                            value={invoiceTime.hours}
                                                                                        />
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            placeholder="Minutes"
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
                                                                                    onChange={HandleChange}
                                                                                    value={jobData.InvoiceRemark}
                                                                                    maxLength={500}
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


                                        {jobModalStatus && (
                                            <Modal show={jobModalStatus} onHide={(e) => jobModalSetStatus(false)} centered size="lg">
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Tasks</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="tablelist-form">
                                                        <div className="modal-body">
                                                            <div className="row">
                                                                <div className="col-md-12" style={{ display: "flex" }}>
                                                                    <div className="col-lg-6">
                                                                        <select
                                                                            id="search-select"
                                                                            className="form-select mb-3"
                                                                            aria-label="Default select example"
                                                                            style={{ color: "#8a8c8e !important" }}
                                                                            onChange={(e) => { setChecklistId(e.target.value) }}
                                                                            value={getChecklistId}

                                                                        >
                                                                            <option value="">Select Checklist Name</option>
                                                                            {
                                                                                AllChecklist && AllChecklist.data.map((checklist) => (
                                                                                    <option value={checklist.checklists_id} key={checklist.checklists_id}>{checklist.check_list_name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-lg-6">
                                                                        <div className="col-sm-auto" style={{ marginLeft: 250 }}>
                                                                            <button className="btn btn-info text-white float-end blue-btn" onClick={() => setShowAddJobModal(true)}>Add Task</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 column" id="column1">
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            <div id="customerList">
                                                                                <div className="table-responsive table-card mt-3 mb-1">
                                                                                    <table
                                                                                        className="table align-middle table-nowrap"
                                                                                        id="customerTable"
                                                                                    >
                                                                                        <thead className="table-light">
                                                                                            <tr>
                                                                                                <th>Task Name</th>
                                                                                                <th>Budgeted Hour</th>
                                                                                                <th>Action</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="list form-check-all">
                                                                                            {
                                                                                                AllChecklistData.data && AllChecklistData.data.map((checklist) => (
                                                                                                    <tr className="">
                                                                                                        <td>{checklist.task_name} </td>
                                                                                                        <td>{checklist.budgeted_hour} hr</td>
                                                                                                        <td>
                                                                                                            <div className="add">
                                                                                                                <button className=" btn-info text-white blue-btn" onClick={() => AddTask(checklist.task_id)}>+</button>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 " id="column2">
                                                                    <div className="card">
                                                                        <div className="card-body">
                                                                            <div id="customerList">
                                                                                <div className="table-responsive table-card mt-3 mb-1">
                                                                                    <table
                                                                                        className="table align-middle table-nowrap"
                                                                                        id="customerTable"
                                                                                    >
                                                                                        <thead className="table-light">
                                                                                            <tr>
                                                                                                <th>Task Name</th>
                                                                                                <th>Budgeted Hour</th>
                                                                                                <th>Action</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="list form-check-all">
                                                                                            {
                                                                                                AddTaskArr && AddTaskArr.map((checklist) => (

                                                                                                    <tr className="">
                                                                                                   
                                                                                                        <td>{checklist.task_name} </td>
                                                                                                        <td>{checklist.budgeted_hour} hr</td>
                                                                                                        <td>
                                                                                                            <div className="add">
                                                                                                                <button className="delete-icon"><i className="ti-trash" onClick={() => RemoveTask(checklist.task_id)}></i></button>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        )}

                                        {showAddJobModal && (
                                            <Modal show={showAddJobModal} onHide={(e) => setShowAddJobModal(false)} centered size="sm">
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Add Task</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className='row'>
                                                        <div className='col-lg-12'>
                                                            <label className="form-label">Task Name</label>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Task name"
                                                                    name='taskname'
                                                                    className='p-1 w-100 mb-2 rounded'
                                                                    onChange={handleChange1}
                                                                    value={taskName}
                                                                />
                                                                {taskNameError && <div className="error-text text-danger">{taskNameError}</div>}
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-12'>
                                                            <label className="form-label">Budgeted Hour</label>
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    placeholder='Enter Budgeted Hour'
                                                                    name='budgeted_hour'
                                                                    className='p-1 mb-2 w-100 rounded'
                                                                    onChange={handleChange1}
                                                                    value={Budgeted}
                                                                />
                                                                {BudgetedError && <div className="error-text text-danger">{BudgetedError}</div>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={(e) => setShowAddJobModal(false)}>Close</Button>
                                                    <Button variant="btn btn-info text-white float-end blue-btn" onClick={handleAddTask}>Add</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        )}




                                        <div className="hstack gap-2 justify-content-end">

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