import React, { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { JobType } from '../../../../ReduxStore/Slice/Settings/settingSlice'
import { useDispatch } from 'react-redux';
import { Edit_Customer } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';



const Engagement = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [errors1, setErrors1] = useState({});
    const [errors2, setErrors2] = useState({});
    const [errors3, setErrors3] = useState({});
    const [errors4, setErrors4] = useState([]);


    const [formValues1, setFormValues1] = useState({
        accountants: '',
        feePerAccountant: '',
        bookkeepers: '',
        feePerBookkeeper: '',
        payrollExperts: '',
        feePerPayrollExpert: '',
        taxExperts: '',
        feePerTaxExpert: '',
        numberOfAdmin: '',
        feePerAdmin: '',
    });
    const [formValues2, setFormValues2] = useState({
        total_outsourcing: '',
        accountants: '',
        bookkeepers: '',
        bookkeepers: '',
        payroll_experts: '',
        tax_experts: '',
        admin_staff: ''
    });
    const [formValues3, setFormValues3] = useState({
        adhoc_accountants: "",
        adhoc_bookkeepers: "",
        adhoc_payroll_experts: "",
        adhoc_tax_experts: "",
        adhoc_admin_staff: "",
    });
    const [jobEntries, setJobEntries] = useState([
        { minimum_number_of_jobs: '', job_type_id: '', cost_per_job: '' }
    ]);

    const [jobType, setJobType] = useState([])

    const checkboxOptions = [
        { id: 'formCheck1', label: 'FTE/Dedicated Staffing' },
        { id: 'formCheck2', label: 'Percentage Model' },
        { id: 'formCheck3', label: 'Adhoc/PAYG/Hourly' },
        { id: 'formCheck4', label: 'Customised Pricing' },
    ];

    const [checkboxStates, setCheckboxStates] = useState(Array(checkboxOptions.length).fill(0));

    const handleCheckboxChange = (index) => {


        setCheckboxStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = newStates[index] === 1 ? 0 : 1;
            return newStates;
        });
    };



    const handleChange1 = (e) => {
        const { name, value } = e.target;
        if (!/^[0-9+]*$/.test(value)) {
            return;
        }

        validate1()

        setFormValues1({ ...formValues1, [name]: value });
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        if (value === '' || (/^[0-9]*$/.test(value) && value <= 100)) {
            validate2()
            setFormValues2({ ...formValues2, [name]: value });
        }
    };

    const handleChange3 = (e) => {
        const { name, value } = e.target;
        if (value === '' || (/^[0-9]*$/.test(value) && value <= 100)) {

            validate3()
            setFormValues3({ ...formValues3, [name]: value });
        }

    };

    const handleAddJob = () => {
        setJobEntries([...jobEntries, { minimum_number_of_jobs: '', job_type_id: '', cost_per_job: '' }]);
    };

    const handleRemoveJob = (id) => {

        if (jobEntries.length === 1) {
            return;
        }
        const newJobEntries = jobEntries.filter((entry, index) => index !== id);
        setJobEntries(newJobEntries);
    };



    const handleChange4 = (index, e) => {
        const { name, value } = e.target;

        if (!/^[0-9+]*$/.test(value)) {
            return;
        }
     

        const newJobEntries = [...jobEntries];
        newJobEntries[index][name] = value;
        validate4()
        setJobEntries(newJobEntries);
    };



    const validate1 = () => {
        const newErrors = {};
        for (const key in formValues1) {
            if (!formValues1[key]) {
                if (key == 'accountants') newErrors[key] = "Please Enter Number of Accountants";
                else if (key == 'feePerAccountant') newErrors[key] = "Please Enter Fee Per Accountant";
                else if (key == 'bookkeepers') newErrors[key] = "Please Enter Number of Bookkeepers";
                else if (key == 'feePerBookkeeper') newErrors[key] = "Please Enter Fee Per Bookkeeper";
                else if (key == 'payrollExperts') newErrors[key] = "Please Enter Number of Payroll Experts";
                else if (key == 'feePerPayrollExpert') newErrors[key] = "Please Enter Fee Per Payroll Expert";
                else if (key == 'taxExperts') newErrors[key] = "Please Enter Number of Tax Experts";
                else if (key == 'feePerTaxExpert') newErrors[key] = "Please Enter Fee Per Tax Expert";
                else if (key == 'numberOfAdmin') newErrors[key] = "Please Enter Number of Admin/Other Staff";
                else if (key == 'feePerAdmin') newErrors[key] = "Please Enter Fee Per Admin/Other Staff";
            }
        }
        setErrors1(newErrors)

        return Object.keys(newErrors).length === 0 ? true : false;;
    };

    const validate2 = () => {
        const newErrors = {};
        for (const key in formValues2) {
            const value = parseFloat(formValues2[key]);

            if (!formValues2[key]) {
                if (key == 'total_outsourcing') newErrors[key] = "Please Enter Total Outsourcing";
                else if (key == 'accountants') newErrors[key] = "Please Enter Accountants";
                else if (key == 'bookkeepers') newErrors[key] = "Please Enter Bookkeepers";
                else if (key == 'payroll_experts') newErrors[key] = "Please Enter Payroll Experts";
                else if (key == 'tax_experts') newErrors[key] = "Please Enter Tax Experts";
                else if (key == 'admin_staff') newErrors[key] = "Please Enter Admin/Other Staff";
            } else if (isNaN(value) || value < 7 || value > 25) {
                newErrors[key] = `${key.replace('_', ' ')} must be between 7 and 25, including decimal values`;
            }
        }

        setErrors2(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const validate3 = () => {
        const newErrors = {};
        for (const key in formValues3) {
            const value = parseFloat(formValues3[key]);


            if (!formValues3[key]) {
                if (key == 'adhoc_accountants') newErrors[key] = "Please Enter Accountants Fee Per Hour";
                else if (key == 'adhoc_bookkeepers') newErrors[key] = 'Please Enter Bookkeepers Fee Per Hour';
                else if (key == 'adhoc_payroll_experts') newErrors[key] = "Please Enter Payroll Experts Fee Per Hour";
                else if (key == 'adhoc_tax_experts') newErrors[key] = "Please Enter Tax Experts Fee Per Hour";
                else if (key == 'adhoc_admin_staff') newErrors[key] = "Please Enter Admin/Other Staff Fee Per Hour";
            } else if (isNaN(value) || value < 0 || value > 100) {
                newErrors[key] = `${key.replace('_', ' ')} must be between 0 and 100, including decimal values`;
            }
        }
        setErrors3(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
    };


    const validate4 = () => {
        const newErrors = [];

        jobEntries.forEach((entry, index) => {
            const entryErrors = {};

            if (!entry.minimum_number_of_jobs) {
                entryErrors.minimum_number_of_jobs = 'Please Enter Minimum number of Jobs';
            } else if (entry.minimum_number_of_jobs < 1 || entry.minimum_number_of_jobs > 100) {
                entryErrors.minimum_number_of_jobs = 'Minimum number of Jobs must be between 1 and 100';
            }

            if (!entry.job_type_id) {
                entryErrors.job_type_id = 'Please select a job type';
            }

            if (!entry.cost_per_job) {
                entryErrors.cost_per_job = 'Please Enter Cost Per Job';
            } else if (entry.cost_per_job < 20 || entry.cost_per_job > 500) {
                entryErrors.cost_per_job = 'Cost Per Job must be between 20 and 500';
            }


            if (Object.keys(entryErrors).length !== 0)
                newErrors[index] = entryErrors;
        });

        setErrors4(newErrors);
        return newErrors.length > 0 ? false : true;
    };


    const GetJobTypeApi = async () => {
        const req = { action: "get" };
        const data = { req: req, authToken: token }
        await dispatch(JobType(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setJobType(response.data)
                }

            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const handleSubmit = async () => {

        if (!checkboxStates.some(state => state === 1)) {
            alert("Please select at least one option.");
            return;
        }
        const validations = [validate1, validate3,validate2 , validate4];
        console.log("checkboxStates",checkboxStates)

        for (let i = 0; i < checkboxStates.length; i++) {
          console.log("i",checkboxStates[i])
            if (checkboxStates[i] == 1 && !validations[i]()) {

                return;
            }
        }
 
        let req = {
            "customer_id": address,
            "pageStatus": "3",
            "fte_dedicated_staffing": checkboxStates[0].toString(),
            "percentage_model": checkboxStates[1].toString(),
            "adhoc_payg_hourly": checkboxStates[2].toString(),
            "customised_pricing": checkboxStates[3].toString(),
        };



        if (checkboxStates[0] === 1) {
            req = {
                ...req,
                "number_of_accountants": formValues1.accountants,
                "fee_per_accountant": formValues1.feePerAccountant,
                "number_of_bookkeepers": formValues1.bookkeepers,
                "fee_per_bookkeeper": formValues1.feePerBookkeeper,
                "number_of_payroll_experts": formValues1.payrollExperts,
                "fee_per_payroll_expert": formValues1.feePerPayrollExpert,
                "number_of_tax_experts": formValues1.taxExperts,
                "fee_per_tax_expert": formValues1.feePerTaxExpert,
                "number_of_admin_staff": formValues1.numberOfAdmin,
                "fee_per_admin_staff": formValues1.feePerAdmin,
            };
        }
        if (checkboxStates[1] === 1) {
            req = {
                ...req,
                "total_outsourcing": formValues2.total_outsourcing,
                "accountants": formValues2.accountants,
                "bookkeepers": formValues2.bookkeepers,
                "payroll_experts": formValues2.payroll_experts,
                "tax_experts": formValues2.tax_experts,
                "admin_staff": formValues2.admin_staff,
            };
        }

        if (checkboxStates[2] === 1) {
            req = {
                ...req,
                "adhoc_accountants": formValues3.adhoc_accountants,
                "adhoc_bookkeepers": formValues3.adhoc_bookkeepers,
                "adhoc_payroll_experts": formValues3.adhoc_payroll_experts,
                "adhoc_tax_experts": formValues3.adhoc_tax_experts,
                "adhoc_admin_staff": formValues3.adhoc_admin_staff,
            };
        }
        if (checkboxStates[3] === 1) {
            req = {
                ...req,
                customised_pricing_data: jobEntries
            };
        }


        const data = { req: req, authToken: token }
        await dispatch(Edit_Customer(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    next(response.data)
                } else {

                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };



    useEffect(() => {
        if (checkboxStates[0] === 0)
            setErrors1({})
        if (checkboxStates[1] === 0)
            setErrors2({})
        if (checkboxStates[2] === 0)
            setErrors3({})
        if (checkboxStates[3] === 0)
            setErrors4({}) 
    }, [checkboxStates])


    useEffect(() => {
        GetJobTypeApi()
    }, []);



    return (
        <Formik
            initialValues={address}
            onSubmit={handleSubmit}

        >
            {({ handleSubmit }) => {
                return (

                    <div className={"details__wrapper"}>


                        <div className="card report-data pricing-box p-0">
                            <div className="card-header step-header-blue">
                                <h4
                                    className="card-title mb-0 flex-grow-1"
                                    style={{ marginBottom: "20px !important" }}
                                >
                                    Engagement Model
                                </h4>
                            </div>

                            <div className="card-body">

                                <div className="row">
                                    {checkboxOptions.map((option, index) => (
                                        <div className="col-lg-3" key={option.id}>
                                            <div className="mb-3">
                                                <div className="form-check form-check-outline form-check-dark">
                                                    <input
                                                        className="form-check-input new-checkbox me-1"
                                                        type="checkbox"
                                                        id={option.id}
                                                        checked={checkboxStates[index] === 1}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                    <label
                                                        className="form-check-label new_checkbox pt-1"
                                                        htmlFor={option.id}
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>


                                <div className="" style={{ marginTop: 15 }}>


                                    {checkboxStates && checkboxStates[0] === 1 && (
                                        <div id="myDiv1" className="row">
                                            <div className="col-xl-12 col-md-12 col-lg-12">
                                                <div className="card pricing-box p-0">
                                                    <div className="col-lg-12">
                                                        <div className="card-header">
                                                            <p className="office-name card-title fs-6">FTE/Dedicated</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row align-items-end">
                                                            {[
                                                                { label: 'Accountants', name: 'accountants', feeName: "Number of Accountants" },
                                                                { label: '', name: 'feePerAccountant', feeName: "Fee Per Accountant" },
                                                                { label: 'Bookkeepers', name: 'bookkeepers', feeName: "Number of Bookkeepers" },
                                                                { label: '', name: 'feePerBookkeeper', feeName: "Fee Per Bookkeepers" },
                                                                { label: 'Payroll Experts', name: 'payrollExperts', feeName: "Number of Payroll Experts" },
                                                                { label: '', name: 'feePerPayrollExpert', feeName: "Fee Per Payroll Experts" },
                                                                { label: 'Tax Experts', name: 'taxExperts', feeName: "Number of Tax Experts" },
                                                                { label: '', name: 'feePerTaxExpert', feeName: "Fee Per Tax Experts" },
                                                                { label: 'Number of Admin', name: 'numberOfAdmin', feeName: "Number of Admin/Other Staff" },
                                                                { label: '', name: 'feePerAdmin', feeName: "Fee Per Admin/Other Staff" },
                                                            ].map((field, index) => (

                                                                <div className="col-lg-3" key={index}>


                                                                    <div className="mb-3 cl">
                                                                        <label className="form-label">{field.label}</label>
                                                                        {/* <label className="form-label label_bottom" style={{ color: "#A2A0A0 !important" }}>{field.feeName}</label> */}
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name={field.name}
                                                                            placeholder={field.feeName}
                                                                            value={formValues1[field.name]}
                                                                            onChange={(e) => handleChange1(e)}
                                                                        />
                                                                        {errors1[field.name] && (
                                                                            <div className="text-danger">{errors1[field.name]}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {checkboxStates && checkboxStates[1] === 1 && (
                                        <div id="myDiv3" className="row">
                                            <div style={{ marginBottom: "26px !important" }} className="col-xl-12 col-lg-12">
                                                <div className="card pricing-box p-0">
                                                    <div className="col-lg-12">
                                                        <div className="card-header">
                                                            <p className="office-name card-title fs-6">Percentage Model</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            {[
                                                                { label: 'Accountants', name: 'adhoc_accountants', feeName: 'Fee Per Hour' },
                                                                { label: 'Bookkeepers', name: 'adhoc_bookkeepers', feeName: 'Fee Per Hour' },
                                                                { label: 'Payroll Experts', name: 'adhoc_payroll_experts', feeName: 'Fee Per Hour' },
                                                                { label: 'Tax Experts', name: 'adhoc_tax_experts', feeName: 'Fee Per Hour' },
                                                                { label: 'Admin/Other Staff', name: 'adhoc_admin_staff', feeName: 'Fee Per Hour' },
                                                            ].map((field, index) => (
                                                                <div className="col-lg-4" key={index}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">{field.label}</label><br />

                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name={field.name}
                                                                            value={formValues3[field.name]}
                                                                            placeholder={field.feeName}
                                                                            onChange={handleChange3}
                                                                        />
                                                                        {errors3[field.name] && (
                                                                            <div className="text-danger">{errors3[field.name]}</div>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {checkboxStates && checkboxStates[2] === 1 && (
                                        <div id="myDiv2" className="row">
                                            <div style={{ marginBottom: "26px !important" }} className="col-xl-12 col-lg-12">
                                                <div className="card pricing-box p-0">
                                                    <div className="col-lg-12">
                                                        <div className="card-header">
                                                            <p className="office-name card-title fs-6">Adhoc/PAYG/Hourly</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            {[
                                                                { label: 'Total Outsourcing', name: 'total_outsourcing', feeName: 'Fee Percentage' },
                                                                { label: 'Accountants', name: 'accountants', feeName: 'Fee Percentage' },
                                                                { label: 'Bookkeepers', name: 'bookkeepers', feeName: 'Fee Percentage' },
                                                                { label: 'Payroll Experts', name: 'payroll_experts', feeName: 'Fee Percentage Expert' },
                                                                { label: 'Tax Experts', name: 'tax_experts', feeName: 'Fee Percentage' },
                                                                { label: 'Admin/Other Staff', name: 'admin_staff', feeName: 'Fee Percentage' },

                                                            ].map((field, index) => (
                                                                <div className="col-lg-4" key={index}>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">{field.label}</label> <br />

                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            name={field.name}
                                                                            value={formValues2[field.name]}
                                                                            placeholder={field.feeName}
                                                                            onChange={handleChange2}
                                                                        />
                                                                        {errors2[field.name] && (
                                                                            <div className="text-danger">{errors2[field.name]}</div>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}







                                    {checkboxStates && checkboxStates[3] === 1 && (
                                        <div id="myDiv4" className="row">
                                            <div className="col-xl-12 col-lg-12">
                                                <div className="card pricing-box p-0">
                                                    <div className="col-lg-12">
                                                        <div className="card-header">
                                                            <p className="office-name card-title fs-6">Customised Pricing</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div id="custprize">
                                                            {jobEntries.map((job, index) => (
                                                                <div className="row" key={index}>
                                                                    <div className="col-lg-4">
                                                                        <div className="mb-3">
                                                                            <label htmlFor={`minimumJobs_${index}`} className="form-label">
                                                                                Minimum number of Jobs
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder={"Please Enter Minimum number of Jobs"}
                                                                                name="minimum_number_of_jobs"
                                                                                id={`minimumJobs_${index}`}
                                                                                value={job.minimum_number_of_jobs}
                                                                                onChange={(e) => handleChange4(index, e)}
                                                                            />
                                                                            {errors4[index] && (
                                                                                <div className="text-danger">{errors4[index].minimum_number_of_jobs}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-lg-4">
                                                                        <label htmlFor={`jobType_${index}`} className="form-label">
                                                                            Types Of Job
                                                                        </label>
                                                                        <select
                                                                            id={`jobType_${index}`}
                                                                            className="form-select mb-3"
                                                                            name="job_type_id"
                                                                            value={job.job_type_id}
                                                                            onChange={(e) => handleChange4(index, e)}
                                                                        >
                                                                            <option value="">Select Job Type</option>
                                                                            {jobType && jobType.map((data) => (
                                                                                <option key={data.type} value={data.id}>{data.type}</option>
                                                                            ))}
                                                                        </select>
                                                                        {errors4[index] && (
                                                                            <div className="text-danger">{errors4[index].job_type_id}</div>
                                                                        )}


                                                                    </div>


                                                                    <div className="col-lg-3">
                                                                        <div className="mb-3">
                                                                            <label htmlFor={`costPerJob_${index}`} className="form-label">
                                                                                Cost Per Job
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder={"Please Enter Cost Per Job"}
                                                                                name="cost_per_job"
                                                                                id={`costPerJob_${index}`}
                                                                                value={job.cost_per_job}
                                                                                onChange={(e) => handleChange4(index, e)}
                                                                            />
                                                                            {errors4[index] && (
                                                                                <div className="text-danger">{errors4[index].cost_per_job}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {jobEntries.length > 1 &&
                                                                        <div className="col-lg-1 text-center" style={{ marginTop: 22 }}>
                                                                            <a className="add_icon text-decoration-none" onClick={(e) => handleRemoveJob(index)}>
                                                                                <i
                                                                                    style={{ fontSize: 25, cursor: "pointer", color: "#00AFEF" }}
                                                                                    className="ti-trash"

                                                                                />

                                                                            </a>
                                                                        </div>}

                                                                </div>
                                                            ))}
                                                            <div className="col-lg-12 text-end pe-3" style={{ marginTop: 22 }}>
                                                                <a className="add_icon" onClick={handleAddJob}>
                                                                    <i
                                                                        style={{ fontSize: 28, cursor: "pointer", color: "#00AFEF" }}
                                                                        className="fa-solid fa-circle-plus"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div id="cust_prize"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}



                                </div>
                            </div>
                        </div>

                        <div className="form__item button__items d-flex justify-content-between">
                            <Button className="white-btn" type="default" onClick={prev}>
                                Back
                            </Button>
                            <Button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                                Next
                            </Button>
                        </div>



                    </div>

                );
            }}
        </Formik >
    );
};
export default Engagement;

