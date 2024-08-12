import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Get_All_Client } from '../../../../../ReduxStore/Slice/Client/ClientSlice';
import { useDispatch } from 'react-redux';
import { Get_Service  , GetAllJabData} from '../../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { JobType } from '../../../../../ReduxStore/Slice/Settings/settingSlice';
import { Staff } from '../../../../../ReduxStore/Slice/Staff/staffSlice';
 
const CreateJob = () => {
    const location = useLocation()
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();

    const [ClientData, setClientData] = useState({ loading: false, data: [], });
    const [AllService, setAllService] = useState({ loading: false, data: [] });
    const [JobTypeData, setJobTypeData] = useState({ loading: false, data: [] });
    const [StaffData, setStaffData] = useState({ loading: false, data: [] });
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

    console.log("location", location.state)
    useEffect(() => {
        setJobData(prevState => ({
            ...prevState,
            AccountManager: location.state.details.customer_id.account_manager_firstname,
            Customer: location.state.details.customer_id.trading_name,
        }));
    }, [ClientData]);



    const GetAllClientData = async () => {
        const req = { action: "get", customer_id: location.state.details.customer_id.id };
        const data = { req: req, authToken: token };
        await dispatch(Get_All_Client(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setClientData({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setClientData({
                        loading: true,
                        data: []
                    })

                }
            })
            .catch((error) => {
                console.log("Error", error);

            });
    }

    const GetAllServiceData = async () => {
        const req = { action: "get" };
        const data = { req: req, authToken: token };
        await dispatch(Get_Service(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setAllService({ loading: true, data: response.data });
                } else {
                    setAllService({ loading: true, data: [] });
                }
            })
            .catch((error) => {
                console.log("Error", error);
                setAllService({ loading: true, data: [] });
            });
    }

    const GetJobType = async () => {
        const req = { action: "get" }
        const data = { req: req, authToken: token }
        await dispatch(JobType(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setJobTypeData({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setJobTypeData({
                        loading: true,
                        data: []
                    })
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });

    }

    const GetJobData = async () => {
        const req = { customer_id: 2}
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
    

    const GetStaffDetails = async () => {
        const req = { action: "get" }
        const data = { req: req, authToken: token }
        await dispatch(Staff(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setStaffData({
                        loading: true,
                        data: response.data
                    })
                } else {
                    setStaffData({
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
        GetAllClientData()
        GetAllServiceData()
        GetJobType()
        GetStaffDetails()
        GetJobData()

    }, []);

    const HandleChange = (e) => {
        const { name, value } = e.target;
        setJobData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

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
                                                                            {ClientData.loading &&
                                                                                ClientData.data.map((client) => (
                                                                                    <option value={client.id} key={client.id}>{client.client_name}</option>
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

                                                                            <option value=""> Rajesh Mehta</option>

                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Service</label>
                                                                        <select className="form-select mb-3"
                                                                            name="Service" onChange={HandleChange} value={jobData.Service}>
                                                                            <option value="">Select Service</option>
                                                                            {AllService.loading &&
                                                                                AllService.data.map((service) => (
                                                                                    <option value={service.id} key={service.id}>{service.name}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Job Type</label>
                                                                        <select className="form-select mb-3 jobtype"
                                                                            name="JobType" onChange={HandleChange} value={jobData.JobType}>
                                                                            <option value="">Select Job Type</option>
                                                                            {JobTypeData.loading &&
                                                                                JobTypeData.data.map((jobtype) => (
                                                                                    <option value={jobtype.id} key={jobtype.id}>{jobtype.type}</option>
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
                                                                            <option value="">Reviewer1</option>
                                                                            <option value="">Reviewer2</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Allocated To</label>
                                                                        <select className="form-select mb-3"
                                                                            name="AllocatedTo" onChange={HandleChange} value={jobData.AllocatedTo}>
                                                                            <option value=""> Select Staff</option>
                                                                            {StaffData.loading &&
                                                                                StaffData.data.map((staff) => (
                                                                                    <option value={staff.id} key={staff.id}>{staff.first_name + " " + staff.last_name}</option>
                                                                                ))}
                                                                        </select>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label"  > Allocated On </label>
                                                                        <input type="date" className="form-control mb-3"  placeholder="DD-MM-YYYY"
                                                                            name="AllocatedOn" onChange={HandleChange} value={jobData.AllocatedOn}/>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <label className="form-label">Date Received On</label>
                                                                        <input  type="date" className="form-control mb-3"  placeholder="DD-MM-YYYY"  
                                                                            name="DateReceivedOn" onChange={HandleChange} value={jobData.DateReceivedOn}/>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label  className="form-label"  > Year End </label>
                                                                            <input  type="text" className="form-control"placeholder="Year End"
                                                                                name="YearEnd" onChange={HandleChange} value={jobData.YearEnd} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">Total Preparation Time</label>
                                                                            <input type="text"  className="form-control"  placeholder="Total Preparation Time"
                                                                                name="TotalPreparationTime" onChange={HandleChange} value={jobData.TotalPreparationTime} />
                                                                            
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Review Time
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Review Time"
                                                                                id="firstNameinput"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Feedback Incorporation Time
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Feedback Incorporation Time"
                                                                                id="firstNameinput"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Total Time
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Total Time"
                                                                                id="firstNameinput"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div id="invoice_type" className="col-lg-3">
                                                                        <label
                                                                            htmlFor="firstNameinput"
                                                                            className="form-label"
                                                                        >
                                                                            Engagement Model
                                                                        </label>
                                                                        <select className="form-select mb-3 invoice_type_dropdown">
                                                                            <option value="">FTE/Dedicated</option>
                                                                            <option value="" selected="">
                                                                                Percentage Based Fee Invoices
                                                                            </option>
                                                                            <option value="">
                                                                                Adhoc/PAYG/Hourly Fee Invoices
                                                                            </option>
                                                                            <option value="">
                                                                                Customised Pricing Invoices
                                                                            </option>
                                                                        </select>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        id="Invoice"
                                                        className="col-lg-12"
                                                        style={{ display: "block" }}
                                                    >
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">
                                                                    Deadline
                                                                </h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"
                                                                            >
                                                                                Expected Delivery Date
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY" id="cleave-date"
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"
                                                                            >
                                                                                Due On
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY"
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Submission Deadline
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY" id="cleave-date"
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Customer Deadline Date
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY"

                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" > SLA Deadline Date </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY"
                                                                            />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Internal Deadline Date
                                                                            </label>
                                                                            <input
                                                                                type="date"
                                                                                className="form-control mb-3"
                                                                                placeholder="DD-MM-YYYY"
                                                                                readOnly=""
                                                                                disabled=""
                                                                                id="cleave-date"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="Invoice" className="col-lg-12">
                                                        <div className="card card_shadow">
                                                            <div className="card-header align-items-center d-flex">
                                                                <h4 className="card-title mb-0 flex-grow-1">
                                                                    Other Task
                                                                </h4>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="" style={{ marginTop: 15 }}>
                                                                    <div className="row">
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
                                                                                    Filing With Companies House Required?
                                                                                </label>
                                                                                <select
                                                                                    id="search-select"
                                                                                    className="form-select mb-3"
                                                                                    aria-label="Default select example"
                                                                                    style={{ color: "#8a8c8e !important" }}
                                                                                >
                                                                                    <option value="">Yes</option>
                                                                                    <option value="">No</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
                                                                                    Companies House Filing Date
                                                                                </label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control"
                                                                                    placeholder=""
                                                                                    id="firstNameinput"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label
                                                                                htmlFor="firstNameinput"
                                                                                className="form-label"
                                                                            >
                                                                                Filing with HMRC Required?
                                                                            </label>
                                                                            <select
                                                                                id="search-select"
                                                                                className="form-select mb-3 invoice_type_dropdown"
                                                                                aria-label="Default select example"
                                                                                style={{ color: "#8a8c8e !important" }}
                                                                            >
                                                                                <option value="" selected="">
                                                                                    No
                                                                                </option>
                                                                                <option value="">Yes</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
                                                                                    HMRC Filing Date
                                                                                </label>
                                                                                <input
                                                                                    type="date"
                                                                                    className="form-control"
                                                                                    placeholder=""
                                                                                    id="firstNameinput"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
                                                                                    Opening Balance Adjustment Required
                                                                                </label>
                                                                                <select
                                                                                    id="search-select"
                                                                                    className="form-select mb-3"
                                                                                    aria-label="Default select example"
                                                                                    style={{ color: "#8a8c8e !important" }}
                                                                                >
                                                                                    <option value="">Yes</option>
                                                                                    <option value="">No</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label className="form-label"  >  Opening Balance Adjustment Date  </label>
                                                                                <input type="date" className="form-control" />
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
                                                                            <label className="form-label" >  Number of Transactions </label>
                                                                            <input type="text" className="form-control" placeholder="Number of Transactions" />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" > Number of Trial Balance Items </label>
                                                                            <input type="text" className="form-control" placeholder="Number of Trial Balance Items" />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" > Turnover </label>
                                                                            <input type="text" className="form-control" placeholder="Turnover" />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"  >  No.Of Employees  </label>
                                                                            <input type="text" className="form-control" placeholder="No.Of Employees" />
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" > VAT Reconciliation </label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"  >
                                                                                <option value="">  No  </option>
                                                                                <option value="">Yes</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label"  >  Bookkeeping?  </label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown"  >
                                                                                <option value="" >  No  </option>
                                                                                <option value="">Yes</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-lg-3">
                                                                            <label className="form-label" >  Processing Type </label>
                                                                            <select className="form-select mb-3 invoice_type_dropdown" >
                                                                                <option value=""> Manual </option>
                                                                                <option value="">Software</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div id="Invoice" className="col-lg-12">
                                                        <div id="Invoice" className="col-lg-12">
                                                            <div className="card card_shadow">
                                                                <div className="card-header align-items-center d-flex">
                                                                    <h4 className="card-title mb-0 flex-grow-1">
                                                                        Invoice
                                                                    </h4>
                                                                </div>
                                                                <div className="card-body">
                                                                    <div className="" style={{ marginTop: 15 }}>
                                                                        <div className="row">
                                                                            <div id="invoicedInvoiced" className="col-lg-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                > Invoiced? </label>
                                                                                <select className="invoiced_dropdown form-select mb-3"  >
                                                                                    <option value="Yes" >Yes</option>
                                                                                    <option value="No">No</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" >Currency</label>
                                                                                <select className="invoiced_dropdown form-select mb-3" >
                                                                                    <option value="Yes"> GBP </option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" > Invoice Value </label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Value" />
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" > Invoice Date </label>
                                                                                <input type="date" className="form-control mb-3" placeholder="DD-MM-YYYY" />
                                                                            </div>
                                                                            <div className="col-lg-3">
                                                                                <label className="form-label" >Invoice Hours </label>
                                                                                <div className="input-group">
                                                                                    <input type="text" className="form-control" />
                                                                                    <span className="input-group-text" > Hours </span>
                                                                                </div>
                                                                            </div>
                                                                            <div id="invoicedremark" className="col-lg-3">
                                                                                <label className="form-label" >Invoice Remark</label>
                                                                                <input type="text" className="form-control" placeholder="Invoice Remark" />
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
                                            <button type="button" className="btn btn-light" > Cancel </button>
                                            <button type="button" className="btn btn-success nexttab nexttab" > Save </button>
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