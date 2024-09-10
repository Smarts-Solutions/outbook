import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, useFormik } from "formik";
import AddFrom from "../../../../Components/ExtraComponents/Forms/Customer.form";
import { Email_regex } from "../../../../Utils/Common_regex";
import {
  GetAllCompany,
  AddCustomer,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import MultiStepFormContext from "./MultiStepFormContext";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import {
  PersonRole,
  Country,
} from "../../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import { GET_CUSTOMER_DATA } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { ADD_CUSTOMER } from "../../../../Utils/Common_Message";

const Information = () => {
  
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const customer_id = localStorage.getItem("coustomerId");
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const [getAccountMangerId, setAccountMangerId] = useState("");
  const [getAccountMangerIdErr, setAccountMangerIdErr] = useState("");
  const [CustomerType, setCustomerType] = useState("1");
  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
  });

  const [personRoleDataAll, setPersonRoleDataAll] = useState({
    loading: true,
    data: [],
  });

  const [errors, setErrors] = useState([
    { firstName: "", lastName: "", role: "", phoneNumber: "", email: "" },
  ]);

  const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);

  const [countryDataAll, setCountryDataAll] = useState({
    loading: true,
    data: [],
  });

  const [contacts, setContacts] = useState([
    {
      authorised_signatory_status: false,
      firstName: "",
      lastName: "",
      role: "",
      phoneNumber: "",
      email: "",
      phone_code: "+44",
    },
  ]);


  useEffect(() => {
    if (customer_id != null) {
      GetCustomerData();
    }
  }, []);

  useEffect(() => {
    for (let i = 0; i < contacts.length; i++) {
      if (errors[i]?.firstName) {
        inputRefs.current[i]?.focus();
        break;
      }
    }
  }, [errors, contacts]);


  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        authorised_signatory_status: false,
        firstName: "",
        lastName: "",
        role: "",
        phoneNumber: "",
        email: "",
        phone_code: "+44",
      },
    ]);
    setErrors([
      ...errors,
      { firstName: "", lastName: "", role: "", phoneNumber: "", email: "" },
    ]);
  };

  const CustomerPersonRoleData = async () => {
    const req = {
      action: "get",
    };
    const data = { req: req, authToken: token };
    await dispatch(PersonRole(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setPersonRoleDataAll({ loading: false, data: response.data });
        } else {
          setPersonRoleDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setContacts(newContacts);
    setErrors(newErrors);
  };

  const AddCustomerFun = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(AddCustomer(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          next(response.data, 2);
        } else {
          sweatalert.fire({
            icon: "error",
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const scrollToFirstError = (errors) => { 
    const errorField = Object.keys(errors)[0]; // Get the first error field
    const errorElement = document.getElementById(errorField); // Find the element by its id
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth' }); // Scroll to the error element
    }
  };
  
  const formik = useFormik({
    initialValues: {
      company_name: "",
      search_company_name: "",
      entity_type: "",
      company_status: "",
      company_number: "",
      Registered_Office_Addres: "",
      Incorporation_Date: "",
      Incorporation_in: "",
      VAT_Registered: "0",
      VAT_Number: "",
      Website: "",
      Trading_Name: "",
      Trading_Address: "",
      countryCode: "+44",
    },
    validate: (values) => {
      let errors = {};
  
      if (formik.touched.Trading_Name === true && getAccountMangerId === "") {
        setAccountMangerIdErr(ADD_CUSTOMER.ACCOUNT_MANAGER);
        return;
      } else if (!values.company_name) {
        errors.company_name = ADD_CUSTOMER.COMPANY_NAME;
      } else if (!values.entity_type) {
        errors.entity_type = ADD_CUSTOMER.ENTITY_TYPE;
      } else if (!values.company_status) {
        errors.company_status = ADD_CUSTOMER.COMPANY_STATUS;
      } else if (!values.company_number) {
        errors.company_number = ADD_CUSTOMER.COMPANY_NUMBER;
      } else if (!values.Registered_Office_Addres) {
        errors.Registered_Office_Addres = ADD_CUSTOMER.REG_OFFICE_ADDRESS;
      } else if (!values.Incorporation_Date) {
        errors.Incorporation_Date = ADD_CUSTOMER.INCORPORATION_DATE;
      } else if (!values.Incorporation_in) {
        errors.Incorporation_in = ADD_CUSTOMER.INCORPORATION_IN;
      } else if (values.VAT_Number && values.VAT_Number.length > 9) {
        errors.VAT_Number = ADD_CUSTOMER.VAT_NUMBER_VALIDATION;
      } else if (values.Website && values.Website.length > 200) {
        errors.Website = ADD_CUSTOMER.WEBSITE_VALIDATION;
      } else if (values.Trading_Name && !values.Trading_Name.trim()) {
        errors.Trading_Name = ADD_CUSTOMER.TRADING_NAME;
      }
  
      console.log('errors' , errors);
      scrollToFirstError(errors);
      return errors;
    },
    onSubmit: async (values, { setErrors }) => {
      let formIsValid = true;
      const newErrors = contacts.map((contact) => {
        const error = {
          firstName: contact.firstName ? "" : ADD_CUSTOMER.REQ_FIRST_NAME,
          lastName: contact.lastName ? "" : ADD_CUSTOMER.REQ_LAST_NAME,
          email: contact.email === ""
            ? ADD_CUSTOMER.REQ_EMAIL
            : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
            ? ""
            : ADD_CUSTOMER.VALID_EMAIL,
        };
  
        if (error.firstName || error.lastName || error.email) {
          formIsValid = false;
        }
        return error;
      });
  
      setErrors(newErrors);
      if (!formIsValid) {
        const allErrors = { ...newErrors, ...formik.errors };

        console.log(allErrors);
        scrollToFirstError(allErrors); // Scroll to the first error if form is invalid
      } else {
        if (getAccountMangerId === "") {
          return;
        }
  
        const req = {
          customer_id: Number(customer_id),
          contact_id: customerDetails.data.contact_id,
          company_name: values.company_name,
          entity_type: values.entity_type,
          company_status: values.company_status,
          company_number: values.company_number,
          Registered_Office_Addres: values.Registered_Office_Addres,
          Incorporation_Date: values.Incorporation_Date,
          Incorporation_in: values.Incorporation_in,
          VAT_Registered: values.VAT_Registered,
          VAT_Number: values.VAT_Number,
          Website: values.Website,
          Trading_Name: values.Trading_Name,
          Trading_Address: values.Trading_Address,
          contactDetails: contacts,
          CustomerType: CustomerType,
          PageStatus: "1",
          account_manager_id: getAccountMangerId,
          staff_id: staffDetails.id,
        };
        await AddCustomerFun(req);
      }
    },
  });
  

  // const formik = useFormik({
  //   initialValues: {
  //     company_name: "",
  //     search_company_name: "",
  //     entity_type: "",
  //     company_status: "",
  //     company_number: "",
  //     Registered_Office_Addres: "",
  //     Incorporation_Date: "",
  //     Incorporation_in: "",
  //     VAT_Registered: "0",
  //     VAT_Number: "",
  //     Website: "",
  //     Trading_Name: "",
  //     Trading_Address: "",
  //     countryCode: "+44",

  //   },
  //   validate: (values) => {
  //     let errors = {};

  //     if (formik.touched.Trading_Name == true && getAccountMangerId == "") {
  //       setAccountMangerIdErr(ADD_CUSTOMER.ACCOUNT_MANAGER);
  //       return;
  //     } else if (!values.company_name) {
  //       errors.company_name = ADD_CUSTOMER.COMPANY_NAME;
  //     } else if (!values.entity_type) {
  //       errors.entity_type = ADD_CUSTOMER.ENTITY_TYPE;
  //     } else if (!values.company_status) {
  //       errors.company_status = ADD_CUSTOMER.COMPANY_STATUS;
  //     } else if (!values.company_number) {
  //       errors.company_number = ADD_CUSTOMER.COMPANY_NUMBER;
  //     } else if (!values.Registered_Office_Addres) {
  //       errors.Registered_Office_Addres = ADD_CUSTOMER.REG_OFFICE_ADDRESS;
  //     } else if (!values.Incorporation_Date) {
  //       errors.Incorporation_Date = ADD_CUSTOMER.INCORPORATION_DATE;
  //     } else if (!values.Incorporation_in) {
  //       errors.Incorporation_in = ADD_CUSTOMER.INCORPORATION_IN;
  //     } else if (values.VAT_Number && values.VAT_Number.length > 9) {
  //       errors.VAT_Number = ADD_CUSTOMER.VAT_NUMBER_VALIDATION;
  //     } else if (values.Website && values.Website.length > 200) {
  //       errors.Website = ADD_CUSTOMER.WEBSITE_VALIDATION;
  //     } else if (
  //       values.Trading_Name != undefined &&
  //       !values.Trading_Name.trim()
  //     ) {
  //       errors.Trading_Name = ADD_CUSTOMER.TRADING_NAME;
  //     }

  //     return errors;
  //   },
  //   onSubmit: async (values) => {
  //     let formIsValid = true;
  //     const newErrors = contacts.map((contact, index) => {
  //       const error = {
  //         firstName: contact.firstName ? "" : ADD_CUSTOMER.REQ_FIRST_NAME,
  //         lastName: contact.lastName ? "" : ADD_CUSTOMER.REQ_LAST_NAME,
  //         email:
  //           contact.email == ""
  //             ? ADD_CUSTOMER.REQ_EMAIL
  //             : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
  //             ? ""
  //             : ADD_CUSTOMER.VALID_EMAIL,
  //       };

  //       if (
  //         error.firstName ||
  //         error.lastName ||
  //         error.role ||
  //         error.phoneNumber ||
  //         error.email
  //       ) {
  //         formIsValid = false;
  //       }
  //       return error;
  //     });

  //     setErrors(newErrors);
  //     if (formIsValid) {
  //       if (getAccountMangerId == "") {
  //         return;
  //       }
  //       let req = {
  //         customer_id: Number(customer_id),
  //         contact_id: customerDetails.data.contact_id,
  //         company_name: values.company_name,
  //         entity_type: values.entity_type,
  //         company_status: values.company_status,
  //         company_number: values.company_number,
  //         Registered_Office_Addres: values.Registered_Office_Addres,
  //         Incorporation_Date: values.Incorporation_Date,
  //         Incorporation_in: values.Incorporation_in,
  //         VAT_Registered: values.VAT_Registered,
  //         VAT_Number: values.VAT_Number,
  //         Website: values.Website,
  //         Trading_Name: values.Trading_Name,
  //         Trading_Address: values.Trading_Address,
  //         contactDetails: contacts,
  //         CustomerType: CustomerType,
  //         PageStatus: "1",
  //         account_manager_id: getAccountMangerId,
  //         staff_id: staffDetails.id,
  //       };
  //       await AddCustomerFun(req);
  //     }
  //   },
  // });

  const formik1 = useFormik({
    initialValues: {
      Trading_Name: "",
      Trading_Address: "",
      VAT_Registered: "0",
      VAT_Number: "",
      Website: "",
      First_Name: "",
      Last_Name: "",
      Phone: "",
      Email: "",
      Residential_Address: "",
      countryCode: "+44",
    },
    validate: (values) => {
      let errors = {};

      if (formik1.touched.Trading_Name == true && getAccountMangerId == "") {
        setAccountMangerIdErr(ADD_CUSTOMER.ACCOUNT_MANAGER);
        return;
      } else if (!values.Trading_Name.trim()) {
        errors.Trading_Name = ADD_CUSTOMER.TRADING_NAME;
      }
      if (values.Trading_Name && values.Trading_Name.trim().length > 100) {
        errors.Trading_Name = "Trading Name cannot exceed 100 characters";
      } else if (values.Phone && values.Phone.toString().length > 12) {
        errors.Phone = "Phone Number cannot exceed 12 digits";
      } else if (values.Phone && values.Phone.toString().length < 9) {
        errors.Phone = "Phone Number cannot be less than 9 digits";
      } else if (
        values.Trading_Address &&
        values.Trading_Address.length > 200
      ) {
        errors.Trading_Address = "Trading Address cannot exceed 200 characters";
      }
      else if (values.VAT_Number && values.VAT_Number.length > 9) {
        errors.VAT_Number = ADD_CUSTOMER.VAT_NUMBER_VALIDATION;
      } else if (values.Website && values.Website.length > 200) {
        errors.Website = ADD_CUSTOMER.WEBSITE_VALIDATION;
      } else if (!values.First_Name) {
        errors.First_Name = "Please Enter First Name";
      } else if (values.First_Name && values.First_Name.length > 50) {
        errors.First_Name = "First Name exceed 50 characters";
      } else if (!values.Last_Name) {
        errors.Last_Name = "Please Enter Last Name";
      } else if (values.Last_Name && values.Last_Name.length > 50) {
        errors.Last_Name = "Last Name exceed 50 characters";
      } else if (!values.Email) {
        errors.Email = "Please Enter Email";
      } else if (!Email_regex(values.Email)) {
        errors.Email = "Please Enter Valid Email";
      } else if (!values.Residential_Address) {
        errors.Residential_Address = "Please Enter Residential Address";
      } else if (
        values.Residential_Address &&
        values.Residential_Address.length > 200
      ) {
        errors.Residential_Address =
          "Residential Address cannot exceed 200 characters";
      }

      return errors;
    },

    onSubmit: async (values) => {
      if (getAccountMangerId == "") {
        return;
      }

      const req = {
        customer_id: Number(customer_id),
        Trading_Name: values.Trading_Name,
        Trading_Address: values.Trading_Address,
        VAT_Registered: values.VAT_Registered,
        VAT_Number: values.VAT_Number,
        Website: values.Website,
        First_Name: values.First_Name,
        Last_Name: values.Last_Name,
        Phone: values.Phone,
        Email: values.Email,
        Residential_Address: values.Residential_Address,
        PageStatus: "1",
        CustomerType: CustomerType,
        account_manager_id: getAccountMangerId,
        staff_id: staffDetails.id,
        phone_code: values.countryCode,
      };

      await AddCustomerFun(req);
    },
  });

  const formik2 = useFormik({
    initialValues: {
      Trading_Name: "",
      Trading_Address: "",
      VAT_Registered: "0",
      VAT_Number: "",
      Website: "",
      countryCode: "+44",

    },
    validate: (values) => {
      let errors = {};
      if (formik2.touched.Trading_Name == true && getAccountMangerId == "") {
        setAccountMangerIdErr(ADD_CUSTOMER.ACCOUNT_MANAGER);
        return;
      } else if (!values.Trading_Name.trim()) {
        errors.Trading_Name = ADD_CUSTOMER.TRADING_NAME;
      }

      return errors;
    },

    onSubmit: async (values) => {
      let formIsValid = true;
      const newErrors = contacts.map((contact, index) => {
        const error = {
          firstName: contact.firstName ? "" : "First Name is required",
          lastName: contact.lastName ? "" : "Last Name is required",
          email:
            contact.email === ""
              ? "Email Id is required"
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
              ? ""
              : "Valid Email is required",
        };

        if (
          error.firstName ||
          error.lastName ||
          error.role ||
          error.phoneNumber ||
          error.email
        ) {
          formIsValid = false;
        }
        return error;
      });

      setErrors(newErrors);

      if (formIsValid) {
        if (getAccountMangerId == "") {
          return;
        }
        const req = {
          customer_id: Number(customer_id),
          Trading_Name: values.Trading_Name,
          Trading_Address: values.Trading_Address,
          VAT_Registered: values.VAT_Registered,
          VAT_Number: values.VAT_Number,
          Website: values.Website,
          PageStatus: "1",
          contactDetails: contacts,
          CustomerType: CustomerType,
          account_manager_id: getAccountMangerId,
          staff_id: staffDetails.id,
        };

        await AddCustomerFun(req);
      }
    },
  });

  let filteredCompanies = [];
  if (getAllSearchCompany.items !== undefined) {
    filteredCompanies =
      getAllSearchCompany &&
      getAllSearchCompany.items.filter((company) =>
        company.title
          .toLowerCase()
          .includes(formik.values.search_company_name.toLowerCase())
      );
  }

  let getCompanyDetails = [];
  if (getAllSearchCompany.items !== undefined) {
    getCompanyDetails =
      getAllSearchCompany &&
      getAllSearchCompany.items.filter(
        (company) => company.title == formik.values.search_company_name
      );
  }

  useEffect(() => {
    formik.setFieldValue("company_name", getCompanyDetails[0]?.title);
    formik.setFieldValue("entity_type", getCompanyDetails[0]?.company_type);
    formik.setFieldValue(
      "company_status",
      getCompanyDetails[0]?.company_status
    );
    formik.setFieldValue(
      "company_number",
      getCompanyDetails[0]?.company_number
    );
    formik.setFieldValue(
      "Registered_Office_Addres",
      getCompanyDetails[0]?.address_snippet
    );
    formik.setFieldValue(
      "Incorporation_Date",
      getCompanyDetails[0]?.date_of_creation
    );
    formik.setFieldValue("Incorporation_in", getCompanyDetails[0]?.description);
    formik.setFieldValue("Trading_Name", getCompanyDetails[0]?.title);
    formik.setFieldValue(
      "Trading_Address",
      getCompanyDetails[0]?.address_snippet
    );

    if (formik.values.search_company_name == "") {
      formik.setFieldValue("company_name", "");
      formik.setFieldValue("entity_type", "");
      formik.setFieldValue("company_status", "");
      formik.setFieldValue("company_number", "");
      formik.setFieldValue("Registered_Office_Addres", "");
      formik.setFieldValue("Incorporation_Date", "");
      formik.setFieldValue("Incorporation_in", "");
    }
  }, [formik.values.search_company_name]);

  const fields = [
    {
      name: "Trading_Name",
      label: "Trading Name ",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Trading_Address",
      label: "Trading Address",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Registered",
      label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Website",
      label: "Website",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Sole Trader Detalis",
      label: "Sole Trader Detalis",
      type: "heading",
      label_size: 12,
      col_size: 12,
      disable: false,
    },
    {
      name: "First_Name",
      label: "First Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Last_Name",
      label: "Last Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Phone",
      label: "Phone",
      type: "number1",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Residential_Address",
      label: "Residential Address",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
  ];


  const fields1 = [
    {
      name: "search_company_name",
      label: "Search Company",
      type: "text9",
      filteredCompanies: filteredCompanies && filteredCompanies,
      label_size: 12,
      col_size: 4,
      disable: false,
    },

    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "entity_type",
      label: "Entity Type",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "company_status",
      label: "Company Status",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "company_number",
      label: "Company Number",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: false,
    },

    {
      name: "Incorporation_Date",
      label: "Incorporation Date",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },

    {
      name: "Incorporation_in",
      label: "Incorporation in",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Registered_Office_Addres",
      label: "Registered Office Address",
      type: "text",
      label_size: 12,
      col_size: 8,
      disable: false,
    },
    {
      name: "VAT_Registered",
      label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Website",
      label: "Website",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Website",
      label: "Trading Details",
      type: "TradingDetails",
      label_size: 12,
      col_size: 12,
      disable: false,
    },

    {
      name: "Trading_Name",
      label: "Trading Name",
      type: "text",
      label_size: 12,
      col_size: 5,
      disable: false,
    },
    {
      name: "Trading_Address",
      label: "Trading Address",
      type: "text",
      label_size: 12,
      col_size: 7,
      disable: false,
    },
  ];

  const fields3 = [
    {
      name: "Trading_Name",
      label: "Trading Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Trading_Address",
      label: "Trading Address",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Registered",
      label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Website",
      label: "Website",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
  ];

  const Get_Company = async () => {
    const data = { search: formik.values.search_company_name };
    await dispatch(GetAllCompany(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setGetAllSearchCompany(res.data);
        } else {
          setGetAllSearchCompany([]);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  useEffect(() => {
    Get_Company();
  }, [formik.values.search_company_name]);

  const CountryData = async (req) => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(Country(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCountryDataAll({ loading: false, data: response.data });
          formik.setFieldValue("CountryData", response.data);
          formik1.setFieldValue("CountryData", response.data);
          formik2.setFieldValue("CountryData", response.data);
        } else {
          setCountryDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  const fetchStaffData = async () => {
    try {
      const response = await dispatch(
        Staff({ req: { action: "getmanager" }, authToken: token })
      ).unwrap();
      if (response.status) {
        setStaffDataAll({ loading: false, data: response.data });
      } else {
        setStaffDataAll({ loading: false, data: [] });
      }
    } catch (error) {
      console.error("Error fetching staff data", error);
      setStaffDataAll({ loading: false, data: [] });
    }
  };

  useEffect(() => {
    CustomerPersonRoleData();
    fetchStaffData();
    CountryData();
  }, []);

  const handleChangeValue = (e) => {
    setAccountMangerId(e.target.value);
    setAccountMangerIdErr("");
  };

  useEffect(() => {

    if (CustomerType == 1 || CustomerType == 3) {
      formik.resetForm();
    }
    if (CustomerType == 2 || CustomerType == 3) {
      formik1.resetForm();
    }
    if (CustomerType == 1 || CustomerType == 2) {
      formik2.resetForm();
    }
    CountryData();
  }, [CustomerType]);

  const ChangeCustomerType = (value) => {
    if (value == 3) {
      setContacts([
        {
          authorised_signatory_status: true,
          firstName: "",
          lastName: "",
          role: "",
          phoneNumber: "",
          email: "",
          phone_code: "+44",
        },
        {
          authorised_signatory_status: true,
          firstName: "",
          lastName: "",
          role: "",
          phoneNumber: "",
          email: "",
          phone_code: "+44",
        },
      ]);
      setErrors([
        { firstName: false, lastName: false, role: false, email: false },
        { firstName: false, lastName: false, role: false, email: false },
      ]);
    }
  };

  const handleChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
    validateField(index, field, value);
  };

  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    switch (field) {
      case "firstName":
        newErrors[index].firstName = value ? "" : "First Name is required";
        break;
      case "lastName":
        newErrors[index].lastName = value ? "" : "Last Name is required";
        break;

      case "email":
        if (!value) {
          newErrors[index].email = "Email Id is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = "Valid Email is required";
        } else {
          newErrors[index].email = "";
        }
        break;

      case "phoneNumber":
        newErrors[index].phoneNumber =
          value === ""
            ? ""
            : /^\d{9,12}$/.test(value)
            ? ""
            : "Phone Number must be between 9 to 12 digits";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const GetCustomerData = async () => {
    const req = { customer_id: customer_id, pageStatus: "1" };
    const data = { req: req, authToken: token };
    await dispatch(GET_CUSTOMER_DATA(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const customerDetailsExist = response.data;

          setCustomerType(
            customerDetailsExist && customerDetailsExist.customer.customer_type
          );
          setAccountMangerId(
            customerDetailsExist &&
              customerDetailsExist.customer.account_manager_id
          );

          if (
            customerDetailsExist &&
            customerDetailsExist.customer.customer_type == "1"
          ) {
            formik1.setFieldValue(
              "Trading_Name",
              customerDetailsExist.customer.trading_name
            );
            formik1.setFieldValue(
              "Trading_Address",
              customerDetailsExist.customer.trading_address
            );
            formik1.setFieldValue(
              "VAT_Registered",
              customerDetailsExist.customer.vat_registered
            );
            formik1.setFieldValue(
              "VAT_Number",
              customerDetailsExist.customer.vat_number
            );
            formik1.setFieldValue(
              "Website",
              customerDetailsExist.customer.website
            );
            formik1.setFieldValue(
              "First_Name",
              customerDetailsExist.contact_details[0].first_name
            );
            formik1.setFieldValue(
              "Last_Name",
              customerDetailsExist.contact_details[0].last_name
            );
            formik1.setFieldValue(
              "Phone",
              customerDetailsExist.contact_details[0].phone
            );
            formik1.setFieldValue(
              "Email",
              customerDetailsExist.contact_details[0].email
            );
            formik1.setFieldValue(
              "Residential_Address",
              customerDetailsExist.contact_details[0].residential_address
            );
            formik1.setFieldValue(
              "countryCode",
              customerDetailsExist.contact_details[0].phone_code
            );
          }
          if (
            customerDetailsExist &&
            customerDetailsExist.customer.customer_type == "2"
          ) {
            formik.setFieldValue(
              "company_name",
              customerDetailsExist.customer.company_name
            );
            formik.setFieldValue(
              "entity_type",
              customerDetailsExist.customer.entity_type
            );
            formik.setFieldValue(
              "company_status",
              customerDetailsExist.customer.company_status
            );
            formik.setFieldValue(
              "company_number",
              customerDetailsExist.customer.company_number
            );
            formik.setFieldValue(
              "Registered_Office_Addres",
              customerDetailsExist.customer.registered_office_address
            );
            formik.setFieldValue(
              "Incorporation_Date",
              customerDetailsExist.customer.incorporation_date
            );
            formik.setFieldValue(
              "Incorporation_in",
              customerDetailsExist.customer.incorporation_in
            );
            formik.setFieldValue(
              "VAT_Registered",
              customerDetailsExist.customer.vat_registered
            );
            formik.setFieldValue(
              "VAT_Number",
              customerDetailsExist.customer.vat_number
            );
            formik.setFieldValue(
              "Website",
              customerDetailsExist.customer.website
            );
            formik.setFieldValue(
              "Trading_Name",
              customerDetailsExist.customer.trading_name
            );
            formik.setFieldValue(
              "Trading_Address",
              customerDetailsExist.customer.trading_address
            );
            setContacts(
              customerDetailsExist && customerDetailsExist.contact_details
            );
          }

          if (
            customerDetailsExist &&
            customerDetailsExist.customer.customer_type == "3"
          ) {
            formik2.setFieldValue(
              "Trading_Name",
              customerDetailsExist.customer.trading_name
            );
            formik2.setFieldValue(
              "Trading_Address",
              customerDetailsExist.customer.trading_address
            );
            formik2.setFieldValue(
              "VAT_Registered",
              customerDetailsExist.customer.vat_registered
            );
            formik2.setFieldValue(
              "VAT_Number",
              customerDetailsExist.customer.vat_number
            );
            formik2.setFieldValue(
              "Website",
              customerDetailsExist.customer.website
            );
            setContacts(
              customerDetailsExist && customerDetailsExist.contact_details
            );
          }

          setCustomerDetails({
            loading: false,
            data: response.data,
          });
        } else {
          setCustomerDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error ", error);
      });
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };



  return (
    <Formik
      initialValues={address}
      onSubmit={(values) => {
        setAddress(values);
        next();
      }}
    >
      {({ handleSubmit }) => (
        <div className="details__wrapper">
          <div className="bg-blue-light pt-3 px-3 rounded">
            <div className="row">
              <div className="col-lg-6">
                <div className="card card_shadow">
                  <div className="card-header step-header-blue align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Customer Type
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <Field
                          as="select"
                          name="customerType"
                          className="form-select "
                          onChange={(e) => {
                            setCustomerType(e.target.value);
                            ChangeCustomerType(e.target.value);
                          }}
                          value={CustomerType}
                        >
                          <option value="1">Sole Trader</option>
                          <option value="2">Company</option>
                          <option value="3">Partnership</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card card_shadow">
                  <div className="card-header step-header-blue align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Outbooks Account Manager
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <Field
                          as="select"
                          name="accountManager"
                          className="form-select "
                          onChange={(e) => handleChangeValue(e)}
                        >
                          <option value="" selected>
                            Please select
                          </option>
                          {staffDataAll.data.map((data) => (
                            <option key={data.id} value={data.id}>
                              {capitalizeFirstLetter(data.first_name) +
                                " " +
                                capitalizeFirstLetter(data.last_name)}
                            </option>
                          ))}
                        </Field>

                        {getAccountMangerIdErr && (
                          <div className="error-text" style={{ color: "red" }}>
                            {getAccountMangerIdErr && getAccountMangerIdErr}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="px-3 mt-3">
            <div className="row" id="form1">
              {CustomerType == 1 ? (
                <>
                  <div className="card card_shadow p-0 ">
                    <div className="card-header card-header-light-blue  step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Sole Trader
                      </h4>
                    </div>
                    <div className="card-body">
                      <AddFrom
                        fieldtype={fields.filter(
                          (field) =>
                            !field.showWhen || field.showWhen(formik1.values)
                        )}
                        formik={formik1}
                        btn_name="Next"
                      />
                    </div>
                  </div>
                </>
              ) : CustomerType == 2 ? (
                <>
                  <div className="card card_shadow px-0">
                    <div className="card-header card-header-light-blue  mb-3 step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Company Information
                      </h4>
                    </div>
                    <div className="card-body">
                      <AddFrom
                        fieldtype={fields1.filter(
                          (field) =>
                            !field.showWhen || field.showWhen(formik.values)
                        )}
                        formik={formik}
                        btn_name="Next"
                        additional_field={
                          <section className="w-100">
                            <div className="" id="form2">
                              <div className="row">
                                <div className="col-lg-12 px-0">
                                  <div className="card-header card-header-light-blue step-card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                      Contact Details
                                    </h4>
                                  </div>

                                  <div className="row card-body">
                                    {contacts.map((contact, index) => (
                                      <div
                                        className="col-xl-12 col-lg-12 mt-3"
                                        key={index}
                                      >
                                        <div className=" pricing-box  m-2 mt-0">
                                          <div className="row">
                                            {index !== 0 && (
                                              <div className="col-lg-12">
                                                <div className="form-check mb-3 d-flex justify-content-end">
                                                  <button
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                      handleDeleteContact(index)
                                                    }
                                                    disabled={
                                                      contacts.length === 1
                                                    }
                                                  >
                                                     <i className="ti-trash  pe-1" /> Delete
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                            <div className="col-lg-4 ps-1">
                                              <div className="mb-3">
                                                <label
                                                  htmlFor={`firstName-${index}`}
                                                  className="form-label"
                                                >
                                                  First Name
                                                  <span
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    {" "}
                                                    *{" "}
                                                  </span>
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="First Name"
                                                  id={`firstName-${index}`}
                                                  value={contact.firstName}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      index,
                                                      "firstName",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                {errors[index].firstName && (
                                                  <div className="error-text">
                                                    {errors[index].firstName}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="col-lg-4">
                                              <div className="mb-3">
                                                <label
                                                  htmlFor={`lastName-${index}`}
                                                  className="form-label"
                                                >
                                                  Last Name
                                                  <span
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    *
                                                  </span>
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Last Name"
                                                  id={`lastName-${index}`}
                                                  value={contact.lastName}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      index,
                                                      "lastName",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                {errors[index].lastName && (
                                                  <div className="error-text">
                                                    {errors[index].lastName}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="col-lg-4">
                                              <div className="mb-3">
                                                <label
                                                  htmlFor={`role-${index}`}
                                                  className="form-label"
                                                >
                                                  Role
                                                  <span
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    *
                                                  </span>
                                                </label>
                                                <select
                                                  className="form-select"
                                                  id={`role-${index}`}
                                                  value={contact.role}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      index,
                                                      "role",
                                                      e.target.value
                                                    )
                                                  }
                                                >
                                                  <option value="">
                                                    Select Role
                                                  </option>
                                                  {personRoleDataAll &&
                                                    personRoleDataAll.data.map(
                                                      (item, i) => (
                                                        <option
                                                          value={item.id}
                                                          key={i}
                                                        >
                                                          {item.name}
                                                        </option>
                                                      )
                                                    )}
                                                </select>
                                                {errors[index].role && (
                                                  <div className="error-text">
                                                    {errors[index].role}
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div className="col-lg-4">
                                              <label className="form-label">
                                                Phone
                                              </label>
                                              <div className="mb-3">
                                                <div className="row">
                                                  <div className="col-md-4 pe-0">
                                                    <select
                                                      className="form-select"
                                                      onChange={(e) =>
                                                        handleChange(
                                                          index,
                                                          "phone_code",
                                                          e.target.value
                                                        )
                                                      }
                                                      name="phone_code"
                                                      value={contact.phone_code}
                                                    >
                                                      {countryDataAll.data.map(
                                                        (data) => (
                                                          <option
                                                            key={data.code}
                                                            value={data.code}
                                                          >
                                                            {data.code}
                                                          </option>
                                                        )
                                                      )}
                                                    </select>
                                                  </div>
                                                  <div className="mb-3 col-md-8 ps-1">
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Phone Number"
                                                      name="phone"
                                                      id={`phone-${index}`}
                                                      value={
                                                        contact.phoneNumber
                                                      }
                                                      onChange={(e) =>
                                                        handleChange(
                                                          index,
                                                          "phoneNumber",
                                                          e.target.value
                                                        )
                                                      }
                                                      maxLength={12}
                                                      minLength={9}
                                                    />
                                                    {errors[index]
                                                      .phoneNumber && (
                                                      <div className="error-text">
                                                        {
                                                          errors[index]
                                                            .phoneNumber
                                                        }
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-lg-4 ">
                                              <div className="mb-3">
                                                <label
                                                  htmlFor={`email-${index}`}
                                                  className="form-label"
                                                >
                                                  Email
                                                  <span
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    *
                                                  </span>
                                                </label>
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Email"
                                                  id={`email-${index}`}
                                                  value={contact.email}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      index,
                                                      "email",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                {errors[index].email && (
                                                  <div className="error-text">
                                                    {errors[index].email}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="card-header d-flex align-items-center">
                                      <h5 className="card-title mb-0 flex-grow-1"></h5>
                                      <button
                                        className="btn btn-info text-white blue-btn"
                                        onClick={handleAddContact}
                                      >
                                       <i className="fa fa-plus pe-1"></i> Add Contact
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        }
                      />
                    </div>
                  </div>
                </>
              ) : CustomerType == 3 ? (
                <>
                  <div className="card card-shadow px-0 ">
                    <div className="card-header mb-3 card-header-light-blue step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Partnership Information
                      </h4>
                    </div>
                    <div className="card-body">
                      <AddFrom
                        fieldtype={fields3.filter(
                          (field) =>
                            !field.showWhen || field.showWhen(formik2.values)
                        )}
                        formik={formik2}
                        btn_name="Next"
                        additional_field={
                          <section>
                            <div className="mt-2" id="form2">
                              <div className="row">
                                <div className="col-lg-12 px-0">
                                  <div className="">
                                    <div className="card-header card-header-light-blue step-card-header step-card-header align-items-center d-flex">
                                      <h4 className="card-title mb-0 flex-grow-1">
                                        Contact Details
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <form onSubmit={handleSubmit}>
                                        <div className="row">
                                          {contacts.map((contact, index) => (
                                            <div
                                              className="col-xl-12 col-lg-12 mt-3"
                                              key={index}
                                            >
                                              <div className="card pricing-box p-4 m-2 mt-0">
                                                <div className="row">
                                                  <div className="col-lg-12">
                                                    <div
                                                      className="form-switch-md mb-3 d-flex justify-content-between"
                                                      dir="ltr"
                                                    >
                                                      <div>
                                                        <label
                                                          className="form-check-label fs-16"
                                                          htmlFor={`customSwitchsizemd-${index}`}
                                                        >
                                                          {" "}
                                                          Partner {index + 1}
                                                        </label>
                                                      </div>
                                                      {index !== 0 &&
                                                        index !== 1 && (
                                                          <div>
                                                            <button
                                                              className="btn btn-danger"
                                                              type="button"
                                                              onClick={() =>
                                                                handleDeleteContact(
                                                                  index
                                                                )
                                                              }
                                                              disabled={
                                                                contacts.length ===
                                                                1
                                                              }
                                                            >
                                                              <i className="ti-trash  pe-1" /> Delete
                                                            </button>
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>

                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label
                                                        htmlFor={`firstName-${index}`}
                                                        className="form-label"
                                                      >
                                                        First Name
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          {" "}
                                                          *{" "}
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="First Name"
                                                        id={`firstName-${index}`}
                                                        value={
                                                          contact.firstName
                                                        }
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "firstName",
                                                            e.target.value
                                                          )
                                                        }
                                                        ref={(el) =>
                                                          (inputRefs.current[
                                                            index
                                                          ] = el)
                                                        }
                                                      />
                                                      {errors[index]
                                                        .firstName && (
                                                        <div className="error-text">
                                                          {
                                                            errors[index]
                                                              .firstName
                                                          }{" "}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label
                                                        htmlFor={`lastName-${index}`}
                                                        className="form-label"
                                                      >
                                                        Last Name
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Last Name"
                                                        id={`lastName-${index}`}
                                                        value={contact.lastName}
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "lastName",
                                                            e.target.value
                                                          )
                                                        }
                                                        ref={(el) =>
                                                          (inputRefs.current[
                                                            index
                                                          ] = el)
                                                        }
                                                      />
                                                      {errors[index]
                                                        .lastName && (
                                                        <div className="error-text">
                                                          {
                                                            errors[index]
                                                              .lastName
                                                          }
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label
                                                        htmlFor={`role-${index}`}
                                                        className="form-label"
                                                      >
                                                        Role
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          *
                                                        </span>
                                                      </label>
                                                      <select
                                                        className="form-select"
                                                        id={`role-${index}`}
                                                        value={contact.role}
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "role",
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option value="">
                                                          Select Role
                                                        </option>
                                                        {personRoleDataAll &&
                                                          personRoleDataAll.data.map(
                                                            (item, idx) => (
                                                              <option
                                                                value={item.id}
                                                                key={idx}
                                                              >
                                                                {item.name}
                                                              </option>
                                                            )
                                                          )}
                                                      </select>
                                                      {errors[index].role && (
                                                        <div className="error-text">
                                                          {errors[index].role}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>

                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Phone
                                                      </label>
                                                      <div className="row">
                                                        <div className="col-md-4">
                                                          <select
                                                            className="form-select"
                                                            onChange={(e) =>
                                                              handleChange(
                                                                index,
                                                                "phone_code",
                                                                e.target.value
                                                              )
                                                            }
                                                            name="phone_code"
                                                            value={
                                                              contact.phone_code
                                                            }
                                                          >
                                                            {countryDataAll.data.map(
                                                              (data) => (
                                                                <option
                                                                  key={
                                                                    data.code
                                                                  }
                                                                  value={
                                                                    data.code
                                                                  }
                                                                >
                                                                  {data.code}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                        </div>
                                                        <div className="mb-3 col-md-8">
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                            name="phone"
                                                            id={`phone-${index}`}
                                                            value={
                                                              contact.phoneNumber
                                                            }
                                                            onChange={(e) =>
                                                              handleChange(
                                                                index,
                                                                "phoneNumber",
                                                                e.target.value
                                                              )
                                                            }
                                                            maxLength={12}
                                                            minLength={9}
                                                          />
                                                          {errors[index]
                                                            .phoneNumber && (
                                                            <div className="error-text">
                                                              {
                                                                errors[index]
                                                                  .phoneNumber
                                                              }
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label
                                                        htmlFor={`email-${index}`}
                                                        className="form-label"
                                                      >
                                                        Email
                                                        <span
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        id={`email-${index}`}
                                                        value={contact.email}
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "email",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {errors[index].email && (
                                                        <div className="error-text">
                                                          {errors[index].email}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}

                                          <div className="card-header d-flex align-items-center">
                                            <h5 className="card-title mb-0 flex-grow-1"></h5>
                                            <button
                                              className="btn btn-info text-white blue-btn"
                                              type="button"
                                              onClick={handleAddContact}
                                            >
                                             <i className="fa fa-plus pe-2"></i> Add Contact
                                            </button>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              </div>{" "}
                              {/* end col */}
                            </div>
                          </section>
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h1>NULL</h1>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </Formik>
  );
};

export default Information;
