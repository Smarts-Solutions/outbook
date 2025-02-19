import React, { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { JobType, customerSourceApi, customerSubSourceApi } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import { useDispatch } from "react-redux";
import { Edit_Customer } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useLocation } from "react-router-dom";
import { GET_CUSTOMER_DATA, Get_Service } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import { FTEDedicatedErrorMessages, PercentageModelErrorMessages, AdhocPAYGHourlyErrorMessages, } from "../../../../Utils/Common_Message";

const checkboxOptions = [
  { id: "formCheck1", label: "FTE/Dedicated Staffing" },
  { id: "formCheck2", label: "Percentage Model" },
  { id: "formCheck3", label: "Adhoc/PAYG/Hourly" },
  { id: "formCheck4", label: "Customised Pricing" },
];

const Engagement = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const [errors3, setErrors3] = useState({});
  const [errors4, setErrors4] = useState([]);
  const [getAllServices, setAllServices] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [coustomerSource, setCoustomerSource] = useState([]);
  const [coustomerSubSource, setCoustomerSubSource] = useState([]);
  const [formState1, setFormState1] = useState({});


  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
  });

  const [formValues1, setFormValues1] = useState({
    accountants: "",
    feePerAccountant: "",
    bookkeepers: "",
    feePerBookkeeper: "",
    payrollExperts: "",
    feePerPayrollExpert: "",
    taxExperts: "",
    feePerTaxExpert: "",
    numberOfAdmin: "",
    feePerAdmin: "",
  });

  const [formValues2, setFormValues2] = useState({
    total_outsourcing: "",
    accountants: "",
    bookkeepers: "",
    bookkeepers: "",
    payroll_experts: "",
    tax_experts: "",
    admin_staff: "",
  });

  const [formValues3, setFormValues3] = useState({
    adhoc_accountants: "",
    adhoc_bookkeepers: "",
    adhoc_payroll_experts: "",
    adhoc_tax_experts: "",
    adhoc_admin_staff: "",
  });

  const [jobEntries, setJobEntries] = useState([
    {
      minimum_number_of_jobs: "",
      job_type_id: "",
      service_id: "",
      cost_per_job: "",
      customised_pricing_id: "",
    },
  ]);

  const [formErrors, setFormErrors] = useState({
    customerJoiningDate: "",
    customerSource: "",
    customerSubSource: "",
  });

  const [checkboxStates, setCheckboxStates] = useState(
    Array(checkboxOptions.length).fill(0)
  );

  const GetCustomerData = async () => {
    const req = { customer_id: location.state.id, pageStatus: "3" };
    const data = { req: req, authToken: token };
    await dispatch(GET_CUSTOMER_DATA(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerDetails({
            loading: false,
            data: response.data,
          });


          setFormState1({
            customerSource: response.data.customer?.customerSource,
            customerSubSource: response.data.customer?.customerSubSource,
            customerJoiningDate: response.data.customer?.customerJoiningDate,
          });
        } else {
          setCustomerDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    GetJobTypeApi();
    GetAllServices();
    customerSourceData();
    GetCustomerData();
  }, []);

  useEffect(() => {
    if (
      !customerDetails.loading &&
      customerDetails.data &&
      customerDetails.data.customer_engagement_model_status
    ) {
      const { customer_engagement_model_status } = customerDetails.data;
      const updatedStates = checkboxOptions.map((option) => {
        switch (option.id) {
          case "formCheck1":
            return customer_engagement_model_status.fte_dedicated_staffing ===
              "1"
              ? 1
              : 0;
          case "formCheck2":
            return customer_engagement_model_status.percentage_model === "1"
              ? 1
              : 0;
          case "formCheck3":
            return customer_engagement_model_status.adhoc_payg_hourly === "1"
              ? 1
              : 0;
          case "formCheck4":
            return customer_engagement_model_status.customised_pricing === "1"
              ? 1
              : 0;
          default:
            return 0;
        }
      });
      setCheckboxStates(updatedStates);

      if (customer_engagement_model_status.fte_dedicated_staffing === "1") {
        setFormValues1({
          accountants: Number(
            customerDetails.data.fte_dedicated_staffing.number_of_accountants
          ),
          feePerAccountant: Number(
            customerDetails.data.fte_dedicated_staffing.fee_per_accountant
          ),
          bookkeepers: Number(
            customerDetails.data.fte_dedicated_staffing.number_of_bookkeepers
          ),
          feePerBookkeeper: Number(
            customerDetails.data.fte_dedicated_staffing.fee_per_bookkeeper
          ),
          payrollExperts: Number(
            customerDetails.data.fte_dedicated_staffing
              .number_of_payroll_experts
          ),
          feePerPayrollExpert: Number(
            customerDetails.data.fte_dedicated_staffing.fee_per_payroll_expert
          ),
          taxExperts: Number(
            customerDetails.data.fte_dedicated_staffing.number_of_tax_experts
          ),
          feePerTaxExpert: Number(
            customerDetails.data.fte_dedicated_staffing.fee_per_tax_expert
          ),
          numberOfAdmin: Number(
            customerDetails.data.fte_dedicated_staffing.number_of_admin_staff
          ),
          feePerAdmin: Number(
            customerDetails.data.fte_dedicated_staffing.fee_per_admin_staff
          ),
        });
      }
      if (customer_engagement_model_status.percentage_model === "1") {
        setFormValues2({
          total_outsourcing: Number(
            customerDetails.data.percentage_model.total_outsourcing
          ),
          accountants: Number(
            customerDetails.data.percentage_model.accountants
          ),
          bookkeepers: Number(
            customerDetails.data.percentage_model.bookkeepers
          ),
          payroll_experts: Number(
            customerDetails.data.percentage_model.payroll_experts
          ),
          tax_experts: Number(
            customerDetails.data.percentage_model.tax_experts
          ),
          admin_staff: Number(
            customerDetails.data.percentage_model.admin_staff
          ),
        });
      }
      if (customer_engagement_model_status.adhoc_payg_hourly === "1") {
        setFormValues3({
          adhoc_accountants: Number(
            customerDetails.data.adhoc_payg_hourly.adhoc_accountants
          ),
          adhoc_bookkeepers: Number(
            customerDetails.data.adhoc_payg_hourly.adhoc_bookkeepers
          ),
          adhoc_payroll_experts: Number(
            customerDetails.data.adhoc_payg_hourly.adhoc_payroll_experts
          ),
          adhoc_tax_experts: Number(
            customerDetails.data.adhoc_payg_hourly.adhoc_tax_experts
          ),
          adhoc_admin_staff: Number(
            customerDetails.data.adhoc_payg_hourly.adhoc_admin_staff
          ),
        });
      }

      if (customer_engagement_model_status.customised_pricing === "1") {
        setJobEntries(customerDetails.data.customised_pricing);
      }
    }
  }, [customerDetails]);

  useEffect(() => {
    if (checkboxStates[0] === 0) setErrors1({});
    if (checkboxStates[1] === 0) setErrors2({});
    if (checkboxStates[2] === 0) setErrors3({});
    if (checkboxStates[3] === 0) setErrors4({});
  }, [checkboxStates]);

  useEffect(() => {

    if (formState1.customerSource) {
      customerSubSourceData();
    }
  }, [formState1]);

  const GetAllServices = async () => {
    dispatch(Get_Service({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllServices(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleCheckboxChange = (index) => {
    setCheckboxStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = newStates[index] === 1 ? 0 : 1;
      return newStates;
    });
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      validate1(name, value);
      setFormValues1({ ...formValues1, [name]: value });
    }
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
      validate2(name, value);
      setFormValues2({ ...formValues2, [name]: value });
    }
  };

  const handleChange3 = (e) => {
    const { name, value } = e.target;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && value <= 100)) {
      validate3(name, value);
      setFormValues3({ ...formValues3, [name]: value });
    }
  };


  const handleChange4 = (index, e) => {
    const { name, value } = e.target;
    if (!/^[0-9+]*$/.test(value)) { return }

    let newJobEntries = [...jobEntries];
    let updatedJobEntry = { ...newJobEntries[index] };
    updatedJobEntry[name] = value;
    newJobEntries[index] = updatedJobEntry;
    validate5(name, value, index)
    setJobEntries(newJobEntries);
  };

  const handleAddJob = () => {
    setJobEntries([
      ...jobEntries,
      {
        minimum_number_of_jobs: "",
        job_type_id: "",
        service_id: "",
        cost_per_job: "",
        customised_pricing_id: "",
      },
    ]);
  };

  const handleRemoveJob = (id) => {
    if (jobEntries.length === 1) {
      return;
    }
    const newJobEntries = jobEntries.filter((entry, index) => index !== id);
    setJobEntries(newJobEntries);
  };

  const validate1 = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors1 };
    if (isSubmitting) {

      for (const key in FTEDedicatedErrorMessages) {
        if (!formValues1[key] || formValues1[key] == 0) {
          newErrors[key] = FTEDedicatedErrorMessages[key];
        }
      }
    } else {
      if (!value) {
        if (FTEDedicatedErrorMessages[name]) {
          newErrors[name] = FTEDedicatedErrorMessages[name];
        }
      } else {
        delete newErrors[name];
      }
    }


    setErrors1(newErrors);
    if (Object.keys(newErrors).length == 10) {
      Swal.fire({
        icon: "warning",
        title: "Please fill at least one field in FTE/Dedicated Staffing.",
        timer: 2000,
        showConfirmButton: true,
      });
      return false
    }
    return true;
  };

  const validate2 = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors2 };
    if (isSubmitting) {
      for (const key in PercentageModelErrorMessages) {
        if (!formValues2[key]) {
          newErrors[key] = PercentageModelErrorMessages[key];
        }
      }
    } else {
      if (!value) {
        if (PercentageModelErrorMessages[name]) {
          newErrors[name] = PercentageModelErrorMessages[name];
        }
      } else {
        delete newErrors[name];
      }
    }
    setErrors2(newErrors);

    if (Object.keys(newErrors).length == 6) {
      Swal.fire({
        icon: "warning",
        title: "Please fill at least one field in Percentage Model between 0% and 100%.",
        timer: 2000,
        showConfirmButton: true,
      });
      return false
    }

    return true;
  };

  const validate3 = (name, value, isSubmitting = false) => {
    const newErrors = { ...errors3 };
    if (isSubmitting) {
      for (const key in AdhocPAYGHourlyErrorMessages) {
        if (!formValues3[key]) {
          newErrors[key] = AdhocPAYGHourlyErrorMessages[key];
        }
      }
    } else {
      if (!value || value < 7 || value > 25) {
        if (AdhocPAYGHourlyErrorMessages[name]) {
          newErrors[name] = AdhocPAYGHourlyErrorMessages[name];
        }
      } else {
        delete newErrors[name];
      }
    }
    setErrors3(newErrors);

    if (Object.keys(newErrors).length == 5) {
      Swal.fire({
        icon: "warning",
        title: "Please fill at least one field in Adhoc/PAYG/Hourly between £7 and £25.",
        timer: 2000,
        showConfirmButton: true,
      });
      return false
    }


    return true;
  };

  const validate5 = (name, value, index) => {
    const newErrors = [];
    const entryErrors = {};

    if (!value) {
      entryErrors[name] = "Please Enter " + name;
    } else if (name === "minimum_number_of_jobs" && (value < 1 || value > 100)) {
      entryErrors[name] = "Minimum number of Jobs must be between 1 and 100";
    } else if (name === "cost_per_job" && (value < 20 || value > 500)) {
      entryErrors[name] = "Cost Per Job must be between £20 and £500";
    }

    if (Object.keys(entryErrors).length !== 0) {
      newErrors[index] = entryErrors;
    }
    setErrors4(newErrors);
    return newErrors.length > 0 ? false : true;
  };

  const validate4 = () => {
    const newErrors = [];

    jobEntries.forEach((entry, index) => {
      const entryErrors = {};

      if (!entry.minimum_number_of_jobs) {
        entryErrors.minimum_number_of_jobs =
          "Please Enter Minimum number of Jobs";
      } else if (
        entry.minimum_number_of_jobs < 1 ||
        entry.minimum_number_of_jobs > 100
      ) {
        entryErrors.minimum_number_of_jobs =
          "Minimum number of Jobs must be between 1 and 100";
      }

      if (!entry.service_id) {
        entryErrors.service_id = "Please select a Services";
      }

      if (!entry.cost_per_job) {
        entryErrors.cost_per_job = "Please Enter Cost Per Job";
      } else if (entry.cost_per_job < 20 || entry.cost_per_job > 500) {
        entryErrors.cost_per_job = "Cost Per Job must be between £20 and £500";
      }

      if (Object.keys(entryErrors).length !== 0) {
        newErrors[index] = entryErrors;
      }
    });

    setErrors4(newErrors);
    return newErrors.length > 0 ? false : true;
  };

  const validateAllFields1 = () => {
    let isValid = true;
    for (const key in formValues1) {
      if (!validate1(key, formValues1[key], true)) {
        isValid = false;
      }
    }

    return isValid;
  };

  const validateAllFields2 = () => {
    let isValid = true;
    for (const key in formValues2) {
      if (!validate2(key, formValues2[key], true)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const validateAllFields3 = () => {
    let isValid = true;
    for (const key in formValues3) {
      if (!validate3(key, formValues3[key], true)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const GetJobTypeApi = async () => {
    const req = { action: "get" };
    const data = { req: req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setJobType(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const customerSourceData = async () => {
    const req = { action: "getAllWithSubSource" };
    const data = { req: req, authToken: token };
    await dispatch(customerSourceApi(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCoustomerSource(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const customerSubSourceData = async () => {
    const req = {
      action: "getAll",
      customer_source_id: formState1.customerSource,
    };
    const data = { req: req, authToken: token };
    await dispatch(customerSubSourceApi(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCoustomerSubSource(response.data);
        } else {
          setCoustomerSubSource([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const scrollToFirstError = (i) => {
    const errors = [errors1, errors2, errors3, errors4];
    const errorField = Object.keys(errors[i])[0];
    const errorElement = document.getElementById(errorField);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth" });
    }
  };



  const handleSubmit = async () => {
    if (!checkboxStates.some((state) => state === 1)) {
      Swal.fire({
        icon: "warning",
        title: "Please select at least one option.",
        timer: 2000,
        showConfirmButton: true,
      });
      return;
    }

    const validations = [
      validateAllFields1,
      validateAllFields2,
      validateAllFields3,
      validate4,
    ];



    for (let i = 0; i < checkboxStates.length; i++) {
      if (checkboxStates[i] == 1 && !validations[i]()) {
          return;
        }
    }

    let req = {
      customer_id: address,
      pageStatus: "3",
      fte_dedicated_staffing: checkboxStates[0].toString() || 0,
      percentage_model: checkboxStates[1].toString() || 0,
      adhoc_payg_hourly: checkboxStates[2].toString() || 0,
      customised_pricing: checkboxStates[3].toString() || 0,
      ...formState1,
    };


    if (checkboxStates[0] === 1) {
      req = {
        ...req,
        number_of_accountants: formValues1.accountants || 0,
        fee_per_accountant: formValues1.feePerAccountant || 0,
        number_of_bookkeepers: formValues1.bookkeepers || 0,
        fee_per_bookkeeper: formValues1.feePerBookkeeper  || 0,
        number_of_payroll_experts: formValues1.payrollExperts || 0,
        fee_per_payroll_expert: formValues1.feePerPayrollExpert || 0,
        number_of_tax_experts: formValues1.taxExperts || 0,
        fee_per_tax_expert: formValues1.feePerTaxExpert || 0,
        number_of_admin_staff: formValues1.numberOfAdmin || 0,
        fee_per_admin_staff: formValues1.feePerAdmin || 0,
      };
    }

    if (checkboxStates[1] === 1) {
      req = {
        ...req,
        total_outsourcing: formValues2.total_outsourcing || 0,
        accountants: formValues2.accountants || 0,
        bookkeepers: formValues2.bookkeepers || 0,
        payroll_experts: formValues2.payroll_experts || 0,
        tax_experts: formValues2.tax_experts || 0,
        admin_staff: formValues2.admin_staff || 0,
      };
    }

    if (checkboxStates[2] === 1) {
      req = {
        ...req,
        adhoc_accountants: formValues3.adhoc_accountants || 0,
        adhoc_bookkeepers: formValues3.adhoc_bookkeepers || 0,
        adhoc_payroll_experts: formValues3.adhoc_payroll_experts || 0,
        adhoc_tax_experts: formValues3.adhoc_tax_experts || 0,
        adhoc_admin_staff: formValues3.adhoc_admin_staff || 0,
      };
    }

    if (checkboxStates[3] === 1) {
      req = {
        ...req,
        customised_pricing_data: jobEntries,
      };
    }


    if (!validateForm()) {
      return;
    }


    const data = { req: req, authToken: token };
    await dispatch(Edit_Customer(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          next(response.data);
        } else {
        }
      })
      .catch((error) => {
        return;
      });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name == 'customerJoiningDate') {
      let date = new Date(value);

      let month = date.getMonth() + 1;
      let day = date.getDate();
      let year = date.getFullYear();
      let newDate = `${year}-${month < 10 ? `0${month}` : `${month}`}-${day < 10 ? `0${day}` : `${day}`
        }`;

      setFormState1({
        ...formState1,
        [name]: newDate,
      })
    }
    else {
      setFormState1({
        ...formState1,
        [name]: value,
      })
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let errors = {};

    if (!formState1.customerJoiningDate) {
      errors.customerJoiningDate = "Joining Date is required.";
    }
    if (!formState1.customerSource) {
      errors.customerSource = "Source is required.";
    }
    if (!formState1.customerSubSource) {
      errors.customerSubSource = "Sub-source is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;  
  };

  return (
    <Formik initialValues={address} onSubmit={handleSubmit}>
      {({ handleSubmit }) => {
        return (
          <div className={"details__wrapper"}>
            <div className="card report-data pricing-box  p-0">
              <div className="card-header step-header-blue">
                <h4
                  className="card-title mb-0 flex-grow-1"
                  style={{ marginBottom: "20px !important" }}
                >
                  Engagement Model
                </h4>
              </div>

              <div className="card-body">
                <div className="row" style={{ marginTop: 15 }}>
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
                            <div className="card-header step-card-header card-header-light-blue">
                              <p className=" card-title fs-6 mb-0">
                                FTE/Dedicated Staffing
                              </p>
                            </div>
                          </div>

                          <div className="row card-body ">
                            {[
                              {
                                label: "Accountants",
                                name: "accountants",
                                feeName: "Number of Accountants",
                              },
                              {
                                label: "",
                                name: "feePerAccountant",
                                feeName: "Fee Per Accountant",
                              },
                              {
                                label: "Bookkeepers",
                                name: "bookkeepers",
                                feeName: "Number of Bookkeepers",
                              },
                              {
                                label: "",
                                name: "feePerBookkeeper",
                                feeName: "Fee Per Bookkeepers",
                              },
                              {
                                label: "Payroll Experts",
                                name: "payrollExperts",
                                feeName: "Number of Payroll Experts",
                              },
                              {
                                label: "",
                                name: "feePerPayrollExpert",
                                feeName: "Fee Per Payroll Experts",
                              },
                              {
                                label: "Tax Experts",
                                name: "taxExperts",
                                feeName: "Number of Tax Experts",
                              },
                              {
                                label: "",
                                name: "feePerTaxExpert",
                                feeName: "Fee Per Tax Experts",
                              },
                              {
                                label: "Number of Admin",
                                name: "numberOfAdmin",
                                feeName: "Number of Admin/Other Staff",
                              },
                              {
                                label: "",
                                name: "feePerAdmin",
                                feeName: "Fee Per Admin/Other Staff",
                              },
                            ].map((field, index) => (
                              <div className="col-lg-6" key={index}>
                                <div className="mb-3">
                                  <label className="form-label label-height">
                                    {field.label}
                                  </label>

                                  {/* <label
                                    className="form-label label_bottom"
                                    style={{ color: "#A2A0A0 !important" }}
                                  >
                                    {field.feeName}
                                  </label> */}
                                  <input
                                    type="text"
                                    // className={errors1[field.name] ? "error-field form-control" : "form-control"}
                                    className={"form-control"}
                                    name={field.name}
                                    id={field.name}
                                    placeholder={field.feeName}
                                    value={formValues1[field.name]}
                                    onChange={(e) => handleChange1(e)}
                                  />
                                  {/* {errors1[field.name] && (
                                    <div className="error-text">
                                      {errors1[field.name]}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkboxStates && checkboxStates[1] === 1 && (
                    <div id="myDiv3" className="row">
                      <div
                        style={{ marginBottom: "26px !important" }}
                        className="col-xl-12 col-lg-12"
                      >
                        <div className="card pricing-box ">
                          <div className="col-lg-12">
                            <div className="card-header step-card-header card-header-light-blue">
                              <p className=" card-title fs-6 mb-0">
                                Percentage Model
                              </p>
                            </div>
                          </div>

                          <div className="row card-body">
                            {[
                              {
                                label: "Total Outsourcing",
                                name: "total_outsourcing",
                                feeName: "Fee Percentage",
                              },
                              {
                                label: "Accountants",
                                name: "accountants",
                                feeName: "Fee Percentage",
                              },
                              {
                                label: "Bookkeepers",
                                name: "bookkeepers",
                                feeName: "Fee Percentage",
                              },
                              {
                                label: "Payroll Experts",
                                name: "payroll_experts",
                                feeName: "Fee Percentage Expert",
                              },
                              {
                                label: "Tax Experts",
                                name: "tax_experts",
                                feeName: "Fee Percentage",
                              },
                              {
                                label: "Admin/Other Staff",
                                name: "admin_staff",
                                feeName: "Fee Percentage",
                              },
                            ].map((field, index) => (
                              <div className="col-lg-4" key={index}>
                                <div className="mb-3">
                                  <label className="form-label">
                                    {field.label}
                                  </label>{" "}

                                  {/* <label
                                    className="form-label label_bottom"
                                    style={{ color: "#A2A0A0 !important" }}
                                  >
                                    {field.feeName}
                                  </label> */}
                                  <input
                                    type="text"

                                    // className={errors2[field.name] ? "error-field form-control" : "form-control"}
                                    className={"form-control"}


                                    name={field.name}
                                    id={field.name}
                                    value={formValues2[field.name]}
                                    placeholder={field.feeName}
                                    onChange={handleChange2}
                                  />
                                  {/* {errors2[field.name] && (
                                    <div className="error-text">
                                      {errors2[field.name]}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkboxStates && checkboxStates[2] === 1 && (
                    <div id="myDiv2" className="row">
                      <div
                        style={{ marginBottom: "26px !important" }}
                        className="col-xl-12 col-lg-12"
                      >
                        <div className="card pricing-box ">
                          <div className="col-lg-12">
                            <div className="card-header step-card-header card-header-light-blue">
                              <p className="office-name card-title fs-6 mb-0">
                                Adhoc/PAYG/Hourly
                              </p>
                            </div>
                          </div>

                          <div className="row card-body">
                            {[
                              {
                                label: "Accountants",
                                name: "adhoc_accountants",
                                feeName: "Fee Per Hour",
                              },
                              {
                                label: "Bookkeepers",
                                name: "adhoc_bookkeepers",
                                feeName: "Fee Per Hour",
                              },
                              {
                                label: "Payroll Experts",
                                name: "adhoc_payroll_experts",
                                feeName: "Fee Per Hour",
                              },
                              {
                                label: "Tax Experts",
                                name: "adhoc_tax_experts",
                                feeName: "Fee Per Hour",
                              },
                              {
                                label: "Admin/Other Staff",
                                name: "adhoc_admin_staff",
                                feeName: "Fee Per Hour",
                              },
                            ].map((field, index) => (
                              <div className="col-lg-4" key={index}>
                                <div className="mb-3">
                                  <label className="form-label">
                                    {field.label}
                                  </label>

                                  {/* <label
                                    className="form-label label_bottom"
                                    style={{ color: "#A2A0A0 !important" }}
                                  >
                                    {field.feeName}
                                  </label> */}
                                  <input
                                    type="text"
                                    // className={errors3[field.name] ? "error-field form-control" : "form-control"}
                                    className={"form-control"}

                                    name={field.name}
                                    id={field.name}
                                    value={formValues3[field.name]}
                                    placeholder={field.feeName}
                                    onChange={handleChange3}
                                  />
                                  {/* {errors3[field.name] && (
                                    <div className="error-text">
                                      {errors3[field.name]}
                                    </div>
                                  )} */}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {checkboxStates && checkboxStates[3] === 1 && (
                    <div id="myDiv4" className="row">
                      <div className="col-xl-12 col-lg-12">
                        <div className="card pricing-box ">
                          <div className="col-lg-12">
                            <div className="card-header step-card-header card-header-light-blue">
                              <p className="office-name card-title fs-6 mb-0">
                                Customised Pricing
                              </p>
                            </div>
                          </div>
                          <div className="card-body">
                            <div id="custprize">
                              {jobEntries.map((job, index) => (
                                <div className="row " key={index}>
                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label
                                        htmlFor={`minimumJobs_${index}`}
                                        className="form-label"
                                      >
                                        Minimum number of Jobs
                                      </label>
                                      <input
                                        type="text"

                                        className={errors4[index]?.minimum_number_of_jobs ? "error-field form-control" : "form-control"}

                                        placeholder={
                                          "Please Enter Minimum number of Jobs"
                                        }
                                        name="minimum_number_of_jobs"
                                        id={`minimumJobs_${index}`}
                                        value={job.minimum_number_of_jobs}
                                        onChange={(e) => handleChange4(index, e)}
                                      />
                                      {errors4[index]?.minimum_number_of_jobs && (
                                        <div className="error-text">
                                          {
                                            errors4[index].minimum_number_of_jobs
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="mb-3">
                                      <label
                                        htmlFor={`service${index}`}
                                        className="form-label"
                                      >
                                        Types Of Services
                                      </label>
                                      <select
                                        id={`service${index}`}
                                        className={errors4[index]?.service_id ? "error-field form-select" : "form-select"}


                                        name="service_id"
                                        value={job.service_id}
                                        onChange={(e) =>
                                          handleChange4(index, e)
                                        }
                                      >

                                        <option value="">
                                          Select Services
                                        </option>

                                        {getAllServices &&
                                          getAllServices.map((data) => (
                                            <option
                                              key={data.id}
                                              value={data.id}
                                            >
                                              {data.name}
                                            </option>
                                          ))}
                                      </select>
                                      {errors4[index]?.service_id && (
                                        <div className="error-text">
                                          {errors4[index].service_id}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-lg-3">
                                    <div className="mb-3">
                                      <label
                                        htmlFor={`costPerJob_${index}`}
                                        className="form-label"
                                      >
                                        Cost Per Job
                                      </label>
                                      <input
                                        type="text"
                                        className={errors4[index]?.cost_per_job ? "error-field form-control" : "form-control"}
                                        name="cost_per_job"
                                        placeholder={
                                          "Please Enter Cost Per Job"
                                        }
                                        id={`costPerJob_${index}`}
                                        value={job.cost_per_job}
                                        onChange={(e) =>
                                          handleChange4(index, e)
                                        }
                                      />
                                      {errors4[index]?.cost_per_job && (
                                        <div className="error-text">
                                          {errors4[index]?.cost_per_job}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {jobEntries.length > 1 && (
                                    <div className="col-lg-1 text-center mt-0 mt-md-4 mb-md-0 mb-5">
                                      <button
                                        className="delete-icon "
                                        onClick={(e) => handleRemoveJob(index)}
                                      >
                                        <i
                                          style={{

                                            cursor: "pointer",
                                          }}
                                          className="ti-trash text-danger"
                                        />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                              <div className="col-lg-12 text-end pe-3">
                                <a className="add_icon" onClick={handleAddJob}>
                                  <i
                                    style={{
                                      fontSize: 28,
                                      cursor: "pointer",
                                      color: "#00AFEF",
                                    }}
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
            <div className="card report-data pricing-box p-0">
              <div className="card-header step-header-blue">
                <h4
                  className="card-title mb-0 flex-grow-1"
                  style={{ marginBottom: "20px !important" }}
                >
                  Additional information
                </h4>
              </div>
              <div className="card-body">

                <div className="row">
                  {/* Customer Joining Date */}
                  <div className="col-lg-4 mb-3">
                    <label className="form-label">
                      Customer Joining Date
                    </label>
                    <input
                      type="date"
                      className={formErrors.customerJoiningDate ? "error-field form-control" : "form-control"}
                      name="customerJoiningDate"
                      defaultValue={
                        customerDetails?.data?.customer
                          ?.customerJoiningDate || ""
                      }
                      onChange={handleInputChange}
                    />
                    {formErrors.customerJoiningDate && (
                      <span className="error-text d-block">
                        {formErrors.customerJoiningDate}
                      </span>
                    )}
                  </div>

                  {/* Select Customer Source */}
                  <div className="col-lg-4 mb-3">
                    <label className="form-label">
                      Select Customer Source
                    </label>
                    <select
                      className={formErrors.customerSource ? "error-field form-select" : "form-select"}
                      name="customerSource"
                      value={formState1.customerSource}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Customer Source</option>
                      {coustomerSource &&
                        coustomerSource.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                    </select>
                    {formErrors.customerSource && (
                      <span className="error-text d-block">
                        {formErrors.customerSource}
                      </span>
                    )}
                  </div>

                  {/* Select Customer Sub-Source */}
                  <div className="col-lg-4 mb-3">
                    <label className="form-label">
                      Select Customer Sub-Source
                    </label>
                    <select
                      className={formErrors.customerSubSource ? "error-field form-select" : "form-select"}
                      name="customerSubSource"
                      value={formState1.customerSubSource}
                      onChange={(e) => handleInputChange(e)}
                    >
                      <option value="">Select Customer Sub-Source</option>
                      {coustomerSubSource &&
                        coustomerSubSource.map((data) => (
                          <option key={data.id} value={data.id}>
                            {data.name}
                          </option>
                        ))}
                    </select>
                    {formErrors.customerSubSource && (
                      <span className="error-text d-block">
                        {formErrors.customerSubSource}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
            <div className="form__item button__items d-flex justify-content-between">
              <Button
                className="btn btn-info"
                type="default"
                onClick={prev}
              >
                <i className="pe-2 fa-regular fa-arrow-left-long"></i> Previous
              </Button>
              <Button
                className="btn btn-info text-white blue-btn"
                onClick={handleSubmit}
              >
                Next <i className="ps-2 fa-regular fa-arrow-right-long"></i>
              </Button>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};
export default Engagement;
