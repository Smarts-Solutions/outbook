import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import MultiStepFormContext from "./MultiStepFormContext";
import { EDIT_CUSTOMER } from "../../../../Utils/Common_Message";
import { Email_regex } from "../../../../Utils/Common_regex";
import axios from "axios";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import { PersonRole, Country, IncorporationApi } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import { AddCustomer, GetAllCompany, } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import { ScrollToViewFirstError, ScrollToViewFirstErrorContactForm } from '../../../../Utils/Comman_function'

const Information = ({ id, pageStatus }) => {
  const { address, setAddress, next } = useContext(MultiStepFormContext);
  const refs = useRef({});
  const managerSelectRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const customer_id = localStorage.getItem("coustomerId");
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [staffDataAll, setStaffDataAll] = useState([]);
  const [location, setLocation] = useState("");
  const [countryDataAll, setCountryDataAll] = useState([]);
  const [customerType, setCustomerType] = useState("1");
  const [ManagerType, setManagerType] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
  const [getSearchDetails, setSearchDetails] = useState("");
  const [showDropdown, setShowDropdown] = useState(true);
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const [errors3, setErrors3] = useState({});
  const [getAccountMangerIdErr, setAccountMangerIdErr] = useState("");
  const [personRoleDataAll, setPersonRoleDataAll] = useState([]);
  const [incorporationDataAll, setIncorporationDataAll] = useState([]);

  // state for sole trader
  const [getSoleTraderDetails, setSoleTraderDetails] = useState({
    tradingName: "",
    tradingAddress: "",
    vatRegistered: "0",
    vatNumber: "",
    website: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "+44",
  });

  // state for partnership
  const [getPartnershipDetails, setPartnershipDetails] = useState({
    TradingName: "",
    TradingAddress: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
  });

  // state for company
  const [getCompanyDetails, setCompanyDetails] = useState({
    SearchCompany: "",
    CompanyName: "",
    EntityType: "",
    CompanyStatus: "",
    CompanyNumber: "",
    RegisteredOfficeAddress: "",
    IncorporationDate: "",
    IncorporationIn: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
    TradingName: "",
    TradingAddress: "",
  });

  // state for company contact
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

  // state for partnership contact
  const [contacts1, setContacts1] = useState([
    {
      authorised_signatory_status: false,
      firstName: "",
      lastName: "",
      role: "",
      phoneNumber: "",
      email: "",
      phone_code: "+44",
    },
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

  // state for company contact errors
  const [errors, setErrors] = useState([
    {
      firstName: "",
      lastName: "",
      role: "",
      phoneNumber: "",
      email: "",
    },
  ]);

  // state for partnership contact errors
  const [contactsErrors, setContactsErrors] = useState([
    {
      authorised_signatory_status: false,
      firstName: "",
      lastName: "",
      role: "",
      phoneNumber: "",
      email: "",
      phone_code: "+44",
    },
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

  // use effect
  useEffect(() => {
    incorporationData();
    CountryData();
    fetchStaffData();
    CustomerPersonRoleData();
  }, []);

  useEffect(() => {
    Get_Company();
    FilterSearchDetails();
  }, [searchItem]);

  useEffect(() => {
    if (getSearchDetails && getSearchDetails.length > 0) {
      // Update company details
      setCompanyDetails((prevState) => ({
        ...prevState,
        CompanyName: getSearchDetails[0].title || prevState.CompanyName,
        EntityType: getSearchDetails[0].company_type || prevState.EntityType,
        CompanyStatus:
          getSearchDetails[0].company_status || prevState.CompanyStatus,
        CompanyNumber:
          getSearchDetails[0].company_number || prevState.CompanyNumber,
        RegisteredOfficeAddress:
          getSearchDetails[0].address_snippet ||
          prevState.RegisteredOfficeAddress,
        IncorporationDate: getSearchDetails[0].date_of_creation
          ? getSearchDetails[0].date_of_creation
          : "",
        // IncorporationIn: getSearchDetails[0].description,
        TradingName: getSearchDetails[0].title,
        TradingAddress: getSearchDetails[0].address_snippet,
      }));

      const newErrors = { ...errors2 };
      if (getSearchDetails[0].title) delete newErrors["CompanyName"];
      if (getSearchDetails[0].company_type) delete newErrors["EntityType"];
      if (getSearchDetails[0].company_status) delete newErrors["CompanyStatus"];
      if (getSearchDetails[0].company_number) delete newErrors["CompanyNumber"];
      if (getSearchDetails[0].address_snippet)
        delete newErrors["RegisteredOfficeAddress"];
      if (getSearchDetails[0].date_of_creation)
        delete newErrors["IncorporationDate"];
      if (getSearchDetails[0].description) delete newErrors["IncorporationIn"];
      if (getSearchDetails[0].title) delete newErrors["TradingName"];
      if (getSearchDetails[0].address_snippet)
        delete newErrors["TradingAddress"];

      setErrors2(newErrors);
    }
  }, [getSearchDetails]);

  //  Add company contact
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
      {
        firstName: "",
        lastName: "",
        role: "",
        phoneNumber: "",
        email: "",
      },
    ]);
  };

  // delete company contact
  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setContacts(newContacts);
    setErrors(newErrors);
  };

  // add partnership contact
  const handleAddContact1 = () => {
    setContacts1([
      ...contacts1,
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
    setContactsErrors([
      ...contactsErrors,
      {
        firstName: "",
        lastName: "",
        role: "",
        phoneNumber: "",
        email: "",
      },
    ]);
  };

  // delete partnership contact
  const handleDeleteContact1 = (index) => {
    const newContacts = contacts1.filter((_, i) => i !== index);
    const newErrors = contactsErrors.filter((_, i) => i !== index);
    setContacts1(newContacts);
    setContactsErrors(newErrors);
  };

  // fetch staff data
  const fetchStaffData = async () => {
    try {
      const response = await dispatch(
        Staff({ req: { action: "getmanager" }, authToken: token })
      ).unwrap();
      if (response.status) {
        setStaffDataAll(response.data);
      } else {
        setStaffDataAll([]);
      }
    } catch (error) {
      setStaffDataAll([]);
    }
  };

  // fetch person role data
  const CustomerPersonRoleData = async () => {
    const req = {
      action: "get",
    };
    const data = { req: req, authToken: token };
    await dispatch(PersonRole(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setPersonRoleDataAll(response.data);
        } else {
          setPersonRoleDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  // fetch country code data
  const CountryData = async (req) => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(Country(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCountryDataAll(response.data);
        } else {
          setCountryDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  // handle change solo trader
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    if (name === "vatNumber" || name === "phone") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate1(name, value);
    setSoleTraderDetails({ ...getSoleTraderDetails, [name]: value });
  };

  // handle change company
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate2(name, value, 1);
    setCompanyDetails({ ...getCompanyDetails, [name]: value });
  };

  // handle change partnership
  const handleChange3 = (e) => {
    const { name, value } = e.target;

    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate3(name, value);
    setPartnershipDetails({ ...getPartnershipDetails, [name]: value });
  };

  // handle change COMPANY contact
  const handleChange4 = (index, field, value) => {
    let newValue = value;
    if (field == EDIT_CUSTOMER.AUTHORISED) {
      newValue = value ? 1 : 0;
    }

    const newContacts =
      contacts1 &&
      contacts1.map((contact, i) =>
        i === index ? { ...contact, [field]: newValue } : contact
      );

    setContacts1(newContacts);
    validateField1(index, field, newValue);
  };

  // handle change partnership contact
  const handleChange = (index, field, value) => {
    const newContacts =
      contacts &&
      contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      );
    setContacts(newContacts);
    validateField(index, field, value);
  };

  //  validate function sole trader
  const validate1 = (field, value) => {
    const newErrors = { ...errors1 };
    if (!value) {
      switch (field) {
        case "IndustryType":
          newErrors[field] = EDIT_CUSTOMER.SELECT_CLIENT_INDUSTRIES;
          break;
        case "tradingName":
          newErrors[field] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
          break;
        case "firstName":
          newErrors[field] = EDIT_CUSTOMER.ENTER_FIRST_NAME;
          break;
        case "lastName":
          newErrors[field] = EDIT_CUSTOMER.LAST_NAME;
          break;
        case "email":
          newErrors[field] = EDIT_CUSTOMER.EMAIL;
          break;
        case "residentialAddress":
          newErrors[field] = EDIT_CUSTOMER.RESIDENTIOAL_ADDRESS;
          break;
        default:
          break;
      }
    } else {
      if (field === "email" && !Email_regex(value)) {
        newErrors[field] = EDIT_CUSTOMER.invalidEmail;
      } else if (field === "phone" && !/^\d{9,12}$/.test(value)) {
        newErrors[field] = EDIT_CUSTOMER.invalidPhone;
      } else {
        delete newErrors[field];
        setErrors1((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[field];
          return updatedErrors;
        });
      }
    }


    ScrollToViewFirstError(newErrors);
    // Update state only if there are errors
    if (Object.keys(newErrors).length !== 0) {
      setErrors1((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }

    return Object.keys(newErrors).length === 0;
  };

  // validate function company
  const validate2 = (name, value) => {
    const newErrors = { ...errors2 };
    if (!value) {
      switch (name) {
        case "CompanyName":
          newErrors[name] = EDIT_CUSTOMER.COMPANY_NAME;
          break;
        case "EntityType":
          newErrors[name] = EDIT_CUSTOMER.ENTITY_TYPE;
          break;
        case "CompanyStatus":
          newErrors[name] = EDIT_CUSTOMER.COMPANY_STATUS;
          break;
        case "CompanyNumber":
          newErrors[name] = EDIT_CUSTOMER.COMPANY_NUMBER;
          break;
        case "RegisteredOfficeAddress":
          newErrors[name] = EDIT_CUSTOMER.REGISTRER_OFFICE_ADDRESS;
          break;
        case "IncorporationDate":
          newErrors[name] = EDIT_CUSTOMER.INCORPORATION_DATE;
          break;
        case "IncorporationIn":
          newErrors[name] = EDIT_CUSTOMER.INCORPORATION_IN;
          break;
        case "TradingName":
          newErrors[name] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
          break;
        default:
          break;
      }
    } else {
      delete newErrors[name];
      setErrors2((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    ScrollToViewFirstError(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      setErrors2((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }

    return Object.keys(newErrors).length === 0;
  };

  // validate function partnership
  const validate3 = (name, value) => {
    const newErrors = { ...errors3 };
    if (!value) {
      switch (name) {
        case "TradingName":
          newErrors[name] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
          break;
        case "ClientIndustry":
          newErrors[name] = EDIT_CUSTOMER.SELECT_CLIENT_INDUSTRIES;
          break;
        default:
          break;
      }
    } else {
      delete newErrors[name];
      setErrors3((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors3((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0;
  };

  // validate all fields when submit
  const validateAllFields = (type) => {
    const customer_type = [
      getSoleTraderDetails,
      getCompanyDetails,
      getPartnershipDetails,
    ];
    const validate = [validate1, validate2, validate3];
    let isValid = true;
    for (const key in customer_type[type - 1]) {
      if (!validate[type - 1](key, customer_type[type - 1][key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  // validate company contact fields when submit
  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    if (!newErrors[index]) {
      newErrors[index] = {
        firstName: "",
        lastName: "",
        role: "",
        phoneNumber: "",
        email: "",
      };
    }
    switch (field) {
      case "firstName":
        newErrors[index].firstName = value
          ? ""
          : EDIT_CUSTOMER.REQUIRED_FIRST_NAME;
        break;
      case "lastName":
        newErrors[index].lastName = value
          ? ""
          : EDIT_CUSTOMER.REQUIRES_LAST_NAME;
        break;
      case "email":
        if (!value) {
          newErrors[index].email = EDIT_CUSTOMER.REQUIRE_EMAIL;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = EDIT_CUSTOMER.VALID_EMAIL;
        } else {
          newErrors[index].email = "";
        }
        break;
      case "phoneNumber":
        errors[index].phoneNumber =
          value === ""
            ? ""
            : /^\d{9,12}$/.test(value)
              ? ""
              : EDIT_CUSTOMER.PHONE_VALIDATION;
        break;

      default:
        break;
    }
    setErrors(newErrors);
  };

  // validate partnership contact fields when submit
  const validateField1 = (index, field, value) => {
    const errors = [...contactsErrors];

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          errors[index] = {
            ...errors[index],
            [field]: EDIT_CUSTOMER.REQUIRED_FEILD,
          };
        } else {
          delete errors[index][field];
        }
        break;

      case "email":
        if (!value.trim()) {
          errors[index] = {
            ...errors[index],
            [field]: EDIT_CUSTOMER.REQUIRED_FEILD,
          };
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors[index] = {
            ...errors[index],
            [field]: EDIT_CUSTOMER.INVALID_EMAIL_ERROR,
          };
        } else {
          delete errors[index][field];
        }
        break;
      case "phoneNumber":
        errors[index].phoneNumber =
          value === ""
            ? ""
            : /^\d{9,12}$/.test(value)
              ? ""
              : EDIT_CUSTOMER.PHONE_VALIDATION;
        break;

      default:
        break;
    }

    setContactsErrors(errors);
  };

  // common submit function for all type of customer
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
        return;
      });
  };

  // submit function
  const handleSubmit = async () => {
    if (ManagerType == "") {
      setAccountMangerIdErr("Please Select Manager"); 
      const errorElement = document.getElementById("accountManager");
      if (errorElement) {
          const elementPosition = errorElement.getBoundingClientRect().top;  
          const offsetPosition = elementPosition + window.pageYOffset - 50;
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      }
      return;
    }
    if (customerType == 1 && ManagerType != "") {
      if (validateAllFields(1)) {
        const req = {
          customer_id: Number(customer_id),
          Trading_Name: getSoleTraderDetails.tradingName,
          Trading_Address: getSoleTraderDetails.tradingAddress,
          VAT_Registered: getSoleTraderDetails.vatRegistered,
          VAT_Number: getSoleTraderDetails.vatNumber,
          Website: getSoleTraderDetails.website,
          First_Name: getSoleTraderDetails.firstName,
          Last_Name: getSoleTraderDetails.lastName,
          Email: getSoleTraderDetails.email,
          Phone: getSoleTraderDetails.phone,
          Residential_Address: getSoleTraderDetails.residentialAddress,
          phone_code: getSoleTraderDetails.phone_code,
          PageStatus: "1",
          account_manager_id: ManagerType,
          CustomerType: customerType,
          staff_id: staffDetails.id,
        };
        await AddCustomerFun(req);
      }  
    }
    if (customerType == 2 && ManagerType != "") {
      if (validateAllFields(2)) {
        let formIsValid = true;
        const newErrors =
          contacts &&
          contacts.map((contact, index) => {
            const error = {
              firstName: contact.firstName
                ? ""
                : EDIT_CUSTOMER.REQUIRED_FIRST_NAME,
              lastName: contact.lastName
                ? ""
                : EDIT_CUSTOMER.REQUIRES_LAST_NAME,
              email:
                contact.email === ""
                  ? EDIT_CUSTOMER.REQUIRE_EMAIL
                  : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                    ? ""
                    : EDIT_CUSTOMER.VALID_EMAIL,
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
          const req = {
            PageStatus: "1",
            CustomerType: "2",
            staff_id: staffDetails.id,
            account_manager_id: ManagerType,
            customer_id: Number(customer_id),
            Trading_Name: getCompanyDetails.TradingName,
            Trading_Address: getCompanyDetails.TradingAddress,
            VAT_Registered: getCompanyDetails.VATRegistered,
            VAT_Number: getCompanyDetails.VATNumber,
            Website: getCompanyDetails.Website,
            contactDetails: contacts,
            company_name: getCompanyDetails.CompanyName,
            entity_type: getCompanyDetails.EntityType,
            company_status: getCompanyDetails.CompanyStatus,
            company_number: getCompanyDetails.CompanyNumber,
            Registered_Office_Addres: getCompanyDetails.RegisteredOfficeAddress,
            Incorporation_Date: getCompanyDetails.IncorporationDate,
            Incorporation_in: getCompanyDetails.IncorporationIn,
          };

          await AddCustomerFun(req);
        } else {
          scrollToFirstError1(errors);
        }
      } else {
        scrollToFirstError(errors2);
      }
    }
    if (customerType == 3 && ManagerType != "") {
      if (validateAllFields(3)) {
        let formIsValid = true;
        const newErrors =
          contacts1 &&
          contacts1.map((contact, index) => {
            const error = {
              firstName: contact.firstName
                ? ""
                : EDIT_CUSTOMER.REQUIRED_FIRST_NAME,
              lastName: contact.lastName
                ? ""
                : EDIT_CUSTOMER.REQUIRES_LAST_NAME,

              email:
                contact.email === ""
                  ? EDIT_CUSTOMER.REQUIRE_EMAIL
                  : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                    ? ""
                    : EDIT_CUSTOMER.VALID_EMAIL,
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
        setContactsErrors(newErrors);
        if (formIsValid) {
          const req = {
            customer_id: Number(customer_id),
            PageStatus: "1",
            CustomerType: "3",
            staff_id: staffDetails.id,
            account_manager_id: ManagerType,
            Trading_Name: getPartnershipDetails.TradingName,
            Trading_Address: getPartnershipDetails.TradingAddress,
            VAT_Registered: getPartnershipDetails.VATRegistered,
            VAT_Number: getPartnershipDetails.VATNumber,
            Website: getPartnershipDetails.Website,
            contactDetails: contacts1,
          };

          await AddCustomerFun(req);
        } else {
          scrollToFirstError1(contactsErrors);
        }
      } else {
        scrollToFirstError(errors3);
      }
    }
  };

  // scorll to first error
  const scrollToFirstError = (errors) => {
    const errorField = Object.keys(errors)[0];
    const errorElement = document.getElementById(errorField);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // scroll to first error for contact
  const scrollToFirstError1 = (errors) => {
    errors.forEach((errorObj, index) => {
      for (const field in errorObj) {
        if (errorObj[field]) {
          const fieldId = `${field}-${index}`;
          const errorElement = document.getElementById(fieldId);

          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }
      }
    });
  };

  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };

  const handleChangeManager = (e) => {
    setManagerType(e.target.value);
    if (e.target.value == "") {
      setAccountMangerIdErr("Please Select Manager");
    } else {
      setAccountMangerIdErr("");
    }
  };

  const Get_Company = async () => {
    const data = { search: searchItem };
    await dispatch(GetAllCompany(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setGetAllSearchCompany(res.data.items);
        } else {
          setGetAllSearchCompany([]);
        }
      })
      .catch((err) => {
        return;
      });
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const incorporationData = async (req) => {
    const data = { req: { action: "getAll" }, authToken: token };
    await dispatch(IncorporationApi(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setIncorporationDataAll(response.data);
        } else {
          setIncorporationDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };



  useEffect(() => {
    const initializeAutocomplete = () => {
      const input = document.getElementById("location");
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ["geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
          setLocation(place.formatted_address);
          sendPlaceDetailsToApi(place);
        }
      });
    };

    initializeAutocomplete();
  }, []);

  const sendPlaceDetailsToApi = (place) => {
    const apiUrl = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=AIzaSyAwLuK1P6GQk2WpYZCm0fnp9HmVhNTEeq4";

    const placeDetails = {
      address: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };

    axios
      .post(apiUrl, placeDetails)
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error sending data to API:", error);
      });
  };

  return (
    <>
      <Formik
        initialValues={address}
        onSubmit={(values) => {
          setAddress(values);
          handleSubmit(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form className="details__wrapper">
            <div className="bg-blue-light pt-3 px-3 rounded">
              <div className="row">
                <div className="col-lg-6">
                  <div className="card card_shadow">
                    <div className="card-header step-header-blue align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Customer Type <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <Field
                            as="select"
                            name="customerType"
                            id="customerType"
                            className="form-select "
                            onChange={(e) => setCustomerType(e.target.value)}
                            value={customerType}
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
                        Outbooks Account Manager{" "}
                        <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-12">
                          <Field
                            as="select"
                            name="accountManager"
                            className="form-select"
                            id="accountManager"
                            onChange={(e) => handleChangeManager(e)}
                            value={ManagerType}
                            innerRef={managerSelectRef}
                          >
                            <option value="">Select Manager</option>
                            {staffDataAll &&
                              staffDataAll.map((data) => (
                                <option key={data.id} value={data.id}>
                                  {capitalizeFirstLetter(data.first_name) +
                                    " " +
                                    capitalizeFirstLetter(data.last_name)}
                                </option>
                              ))}
                          </Field>
                          {getAccountMangerIdErr && (
                            <div
                              className="error-text"
                              style={{ color: "red" }}
                            >
                              {getAccountMangerIdErr}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section>
              {customerType == 1 ? (
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <div className="card card_shadow ">
                      <div className="card-header card-header-light-blue step-card-header  align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">
                          Sole Trader
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Name
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                name="tradingName"
                                id="tradingName"
                                className="form-control"
                                placeholder="Trading Name"
                                onChange={(e) => handleChange1(e)}
                                value={getSoleTraderDetails.tradingName}
                                maxLength={100}
                              />

                              {errors1["tradingName"] && (
                                <div className="error-text">
                                  {errors1["tradingName"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Address
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Trading Address"
                                name="tradingAddress"
                                id="tradingAddress"
                                onChange={(e) => handleChange1(e)}
                                value={getSoleTraderDetails.tradingAddress}
                                maxLength={200}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                VAT Registered
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <select
                                className="form-select "
                                aria-label="Default select example"
                                name="vatRegistered"
                                id="vatRegistered"
                                value={getSoleTraderDetails.vatRegistered}
                                onChange={(e) => handleChange1(e)}
                              >
                                <option value="">
                                  Please Select VAT Registered
                                </option>

                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                              </select>
                              {errors1["vatRegistered"] && (
                                <div className="error-text">
                                  {errors1["vatRegistered"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">VAT Number</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="VAT Number"
                                name="vatNumber"
                                id="vatNumber"
                                value={getSoleTraderDetails.vatNumber}
                                onChange={(e) => handleChange1(e)}
                                maxLength={9}
                              />
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Website</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="URL"
                                name="website"
                                id="website"
                                value={getSoleTraderDetails.website}
                                onChange={(e) => handleChange1(e)}
                                maxLength={200}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header card-header-light-blue step-card-header mb-3 ">
                        <h4
                          className="card-title mb-0 flex-grow-1"
                          style={{ marginBottom: "15px !important" }}
                        >
                          Sole Trader Details
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                name="firstName"
                                id="firstName"
                                value={getSoleTraderDetails.firstName}
                                onChange={(e) => handleChange1(e)}
                                maxLength={50}
                              />
                              {errors1["firstName"] && (
                                <div className="error-text">
                                  {errors1["firstName"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name<span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                name="lastName"
                                id="lastName"
                                value={getSoleTraderDetails.lastName}
                                onChange={(e) => handleChange1(e)}
                                maxLength={50}
                              />
                              {errors1["lastName"] && (
                                <div className="error-text">
                                  {errors1["lastName"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4 pe-0">
                            <div className="mb-3">
                              <label className="form-label">Phone</label>
                              <div className="row">
                                <div className="col-md-4">
                                  <select
                                    className="form-select"
                                    onChange={(e) => handleChange1(e)}
                                    name="phone_code"
                                    id="phone_code"
                                    value={getSoleTraderDetails.phone_code}
                                  >
                                    {countryDataAll &&
                                      countryDataAll.map((data) => (
                                        <option
                                          key={data.code}
                                          value={data.code}
                                        >
                                          {data.code}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                                <div className=" col-md-8 ps-1">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Phone Number"
                                    name="phone"
                                    id="phone"
                                    value={getSoleTraderDetails.phone}
                                    onChange={(e) => handleChange1(e)}
                                    maxLength={12}
                                  />
                                  {errors1["phone"] && (
                                    <div className="error-text">
                                      {errors1["phone"]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Email<span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Email ID"
                                name="email"
                                id="email"
                                value={getSoleTraderDetails.email}
                                onChange={(e) => handleChange1(e)}
                              />
                              {errors1["email"] && (
                                <div className="error-text">
                                  {errors1["email"]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Residential Address
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Residential Address"
                                name="residentialAddress"
                                id="residentialAddress"
                                value={getSoleTraderDetails.residentialAddress}
                                onChange={(e) => handleChange1(e)}
                              />
                              {errors1["residentialAddress"] && (
                                <div className="error-text">
                                  {errors1["residentialAddress"]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="location">Enter Location:</label>
                            <input
                              type="text"
                              id="location"
                              className="form-control"
                              placeholder="Type a location"
                              value={location} // Use value prop to bind state
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : customerType == 2 ? (
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <div className="card card_shadow ">
                      <div className="card-header card-header-light-blue  step-card-header align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">
                          Company Information
                        </h4>
                      </div>
                      {/* end card header */}
                      <div className="card-body">
                        <div className="row">
                          <div className="row">
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <div className="position-relative">
                                  <label className="form-label">
                                    Search Company
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder=" Search Company"
                                    name="SearchCompany"
                                    onChange={(e) =>
                                      setSearchItem(e.target.value)
                                    }
                                    value={searchItem}
                                    onClick={() => setShowDropdown(true)}
                                    style={{ cursor: "pointer" }}
                                  />
                                  {getAllSearchCompany.length > 0 &&
                                    showDropdown ? (
                                    <div className="dropdown-list">
                                      {getAllSearchCompany &&
                                        getAllSearchCompany.map(
                                          (company, index) => (
                                            <div
                                              key={index}
                                              onClick={() => {
                                                setSearchItem(company.title);
                                                setShowDropdown(false);
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                padding: "8px 0",
                                              }}
                                            >
                                              {company.title}
                                            </div>
                                          )
                                        )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  Company Name
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder="Enter Company Name"
                                  name="CompanyName"
                                  id="CompanyName"
                                  onChange={(e) => handleChange2(e)}
                                  defaultValue={getCompanyDetails.CompanyName}
                                />
                                {errors2["CompanyName"] && (
                                  <div className="error-text">
                                    {errors2["CompanyName"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  Entity Type
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder="Enter Entity Type"
                                  name="EntityType"
                                  id="EntityType"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.EntityType}
                                />
                                {errors2["EntityType"] && (
                                  <div className="error-text">
                                    {errors2["EntityType"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  Company Status
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder="Enter Company Status"
                                  name="CompanyStatus"
                                  id="CompanyStatus"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.CompanyStatus}
                                />
                                {errors2["CompanyStatus"] && (
                                  <div className="error-text">
                                    {errors2["CompanyStatus"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  Company Number
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type="text"
                                  id="CompanyNumber"
                                  className="form-control input_bg"
                                  placeholder="Enter Company Number"
                                  name="CompanyNumber"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.CompanyNumber}
                                />
                                {errors2["CompanyNumber"] && (
                                  <div className="error-text">
                                    {errors2["CompanyNumber"]}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  Incorporation Date
                                </label>

                                <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder="Enter Incorporation Date"
                                  name="IncorporationDate"
                                  id="IncorporationDate"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.IncorporationDate}
                                />
                                {errors2["IncorporationDate"] && (
                                  <div className="error-text">
                                    {errors2["IncorporationDate"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  {" "}
                                  Incorporation in{" "}
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                {/* <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder={EDIT_CUSTOMER.INCORPORATION_IN}
                                  name="IncorporationIn"
                                  id="IncorporationIn"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.IncorporationIn}
                                /> */}

                                <select
                                  className="form-select"
                                  name="IncorporationIn"
                                  id="IncorporationIn"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.IncorporationIn}
                                >
                                  <option value="">
                                    Please Select Incorporation In
                                  </option>
                                  {incorporationDataAll &&
                                    incorporationDataAll.map((data) => (
                                      <option key={data.id} value={data.id}>
                                        {data.name}
                                      </option>
                                    ))}
                                </select>

                                {errors2["IncorporationIn"] && (
                                  <div className="error-text">
                                    {errors2["IncorporationIn"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-8">
                              <div className="mb-3">
                                <label className="form-label">
                                  Registered Office Address
                                  <span style={{ color: "red" }}>*</span>{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control input_bg"
                                  placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                  name="RegisteredOfficeAddress"
                                  id="RegisteredOfficeAddress"
                                  onChange={(e) => handleChange2(e)}
                                  value={
                                    getCompanyDetails.RegisteredOfficeAddress
                                  }
                                />
                                {errors2["RegisteredOfficeAddress"] && (
                                  <div className="error-text">
                                    {errors2["RegisteredOfficeAddress"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">
                                  VAT Registered
                                </label>
                                <select
                                  className="form-select "
                                  name="VATRegistered"
                                  id="VATRegistered"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.VATRegistered}
                                >
                                  <option value="">
                                    Please Select VAT Registered
                                  </option>
                                  <option value={1}>Yes</option>
                                  <option value={0}>No</option>
                                </select>
                                {errors2["VATRegistered"] && (
                                  <div className="error-text">
                                    {errors2["VATRegistered"]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <div className="mb-3">
                                  <label className="form-label">
                                    VAT Number
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control "
                                    placeholder="VAT Number"
                                    name="VATNumber"
                                    id="VATNumber"
                                    onChange={(e) => handleChange2(e)}
                                    value={getCompanyDetails.VATNumber}
                                    maxLength={9}
                                  />
                                  {errors2["VATNumber"] && (
                                    <div className="error-text">
                                      {errors2["VATNumber"]}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="mb-3">
                                <label className="form-label">Website</label>
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder="URL"
                                  name="Website"
                                  id="Website"
                                  onChange={(e) => handleChange2(e)}
                                  value={getCompanyDetails.Website}
                                  maxLength={200}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="card card_shadow ">
                      <div className="card-header step-card-header card-header-light-blue ">
                        <h4 className="card-title">Trading Details</h4>
                      </div>
                      {/* end card header */}
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-5">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Name
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Trading Name"
                                name="TradingName"
                                id="TradingName"
                                onChange={(e) => handleChange2(e)}
                                value={getCompanyDetails.TradingName}
                              />
                              {errors2["TradingName"] && (
                                <div className="error-text">
                                  {errors2["TradingName"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-7">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Address
                                <span style={{ color: "red" }}>*</span>{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Trading Address"
                                name="TradingAddress"
                                id="TradingAddress"
                                onChange={(e) => handleChange2(e)}
                                value={getCompanyDetails.TradingAddress}
                              />
                              {errors2["TradingAddress"] && (
                                <div className="error-text">
                                  {errors2["TradingAddress"]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card card_shadow">
                        <div className="card-header step-card-header card-header-light-blue   align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">
                            Officer Details
                          </h4>
                        </div>
                        <div className="row">
                          <div className="card-body">
                            <div className="row">
                              {contacts &&
                                contacts.length > 0 &&
                                contacts.map((contact, index) => (
                                  <div
                                    className="col-xl-12 col-lg-12 mt-3"
                                    key={index}
                                  >
                                    <div className=" pricing-box px-2 m-2 mt-0">
                                      <div className="row">
                                        {index !== 0 && (
                                          <div className="col-lg-12">
                                            <div className="form-check mb-3 d-flex justify-content-end">
                                              <button
                                                className="delete-icon "
                                                onClick={() =>
                                                  handleDeleteContact(index)
                                                }
                                                disabled={contacts.length === 1}
                                              >
                                                <i className="ti-trash text-danger "></i>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`firstName-${index}`}
                                              className="form-label"
                                            >
                                              First Name
                                              <span style={{ color: "red" }}>
                                                *
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
                                            {errors[index] &&
                                              errors[index].firstName && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
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
                                              <span style={{ color: "red" }}>
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
                                            {errors[index] &&
                                              errors[index].lastName && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors[index].lastName}
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Role
                                              <span style={{ color: "red" }}>
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
                                                personRoleDataAll.map(
                                                  (item) => (
                                                    <option
                                                      value={item.id}
                                                      key={item.id}
                                                    >
                                                      {item.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                            {errors[index] &&
                                              errors[index].role && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors[index].role}
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        <div className="col-lg-4 pe-0">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Phone
                                            </label>
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
                                                  {countryDataAll &&
                                                    countryDataAll.map(
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
                                                  name="phoneNumber"
                                                  id={`phoneNumber-${index}`}
                                                  value={contact.phoneNumber}
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
                                                {errors[index] &&
                                                  errors[index].phoneNumber && (
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
                                              <span style={{ color: "red" }}>
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
                                            {errors[index] &&
                                              errors[index].email && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors[index].email}
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              <div className="px-4 d-flex align-items-center">
                                <h5 className="card-title mb-0 flex-grow-1"></h5>
                                <button
                                  className="btn btn-info text-white blue-btn"
                                  onClick={handleAddContact}
                                >
                                  <i className="fa fa-plus pe-1"></i> Add
                                  Contact
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end col */}
                  </div>
                </div>
              ) : customerType == 3 ? (
                <div className="row mt-3">
                  <div className="col-lg-12">
                    <div className="card card_shadow ">
                      <div className=" card-header card-header-light-blue step-card-header align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">
                          Partnership
                        </h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Name
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Trading Name"
                                name="TradingName"
                                id="TradingName"
                                value={getPartnershipDetails.TradingName}
                                onChange={(e) => handleChange3(e)}
                                maxLength={100}
                                ref={(el) => (refs.current["TradingName"] = el)}
                              />
                              {errors3["TradingName"] && (
                                <div className="error-text">
                                  {errors3["TradingName"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Trading Address
                                <span style={{ color: "red" }}>*</span>{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Trading Address"
                                name="TradingAddress"
                                id="TradingAddress"
                                value={getPartnershipDetails.TradingAddress}
                                onChange={(e) => handleChange3(e)}
                                maxLength={200}
                              />
                              {errors3["TradingAddress"] && (
                                <div className="error-text">
                                  {errors3["TradingAddress"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <div className="mb-3">
                                <label className="form-label">
                                  VAT Registered
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                  className="form-select "
                                  name="VATRegistered"
                                  id="VATRegistered"
                                  value={getPartnershipDetails.VATRegistered}
                                  onChange={(e) => handleChange3(e)}
                                >
                                  <option value="">
                                    Select VAT Registered
                                  </option>
                                  <option value={1}>Yes</option>
                                  <option value={0}>No</option>
                                </select>
                                {errors3["VATRegistered"] && (
                                  <div className="error-text">
                                    {errors3["VATRegistered"]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <div className="mb-3">
                                <label className="form-label">
                                  {" "}
                                  VAT Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control "
                                  placeholder="VAT Number"
                                  name="VATNumber"
                                  id="VATNumber"
                                  value={getPartnershipDetails.VATNumber}
                                  onChange={(e) => handleChange3(e)}
                                  maxLength={9}
                                />
                                {errors3["VATNumber"] && (
                                  <div className="error-text">
                                    {errors3["VATNumber"]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Website</label>
                              <input
                                type="text"
                                className="form-control "
                                placeholder="URL"
                                name="Website"
                                id="Website"
                                value={getPartnershipDetails.Website}
                                onChange={(e) => handleChange3(e)}
                                maxLength={200}
                              />

                              {errors3["Website"] && (
                                <div className="error-text">
                                  {errors3["Website"]}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card card_shadow">
                        <div className=" card-header card-header-light-blue step-card-header align-items-center d-flex">
                          <h4 className="card-title mb-0 flex-grow-1">
                            Contact Details
                          </h4>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {contacts1 &&
                              contacts1.map((contact, index) => (
                                <div
                                  className="col-xxl-12 col-lg-12"
                                  key={contact.contact_id}
                                >
                                  <div className="card pricing-box p-4 m-2 mt-0">
                                    <div className="row">
                                      <div className="col-lg-12">
                                        <div
                                          className=" form-switch-md mb-3 d-flex justify-content-between"
                                          dir="ltr"
                                        >
                                          <div>
                                            <label className="form-check-label fw-bold fs-16">
                                              Partner {index + 1}
                                            </label>
                                          </div>
                                          {index !== 0 && index !== 1 && (
                                            <div>
                                              <button
                                                className="delete-icon "
                                                type="button"
                                                onClick={() =>
                                                  handleDeleteContact1(index)
                                                }
                                                disabled={
                                                  contacts1.length === 1
                                                }
                                              >
                                                <i className="ti-trash text-danger"></i>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            First Name
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            name="firstName"
                                            id={`firstName-${index}`}
                                            value={contact.firstName}
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "firstName",
                                                e.target.value
                                              )
                                            }
                                          />
                                          {contactsErrors[index]?.firstName && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].firstName}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Last Name
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Last Name"
                                            name="last_name"
                                            id={`lastName-${index}`}
                                            value={contact.lastName}
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "lastName",
                                                e.target.value
                                              )
                                            }
                                          />
                                          {contactsErrors[index]?.lastName && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].lastName}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Role
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <select
                                            className="form-select"
                                            id={`role-${index}`}
                                            value={contact.role}
                                            onChange={(e) =>
                                              handleChange4(
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
                                              personRoleDataAll.map(
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
                                          {contactsErrors[index]?.role && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].role}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="col-lg-4 pe-1">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Phone
                                          </label>
                                          <div className="row">
                                            <div className="col-md-4">
                                              <select
                                                className="form-select"
                                                onChange={(e) =>
                                                  handleChange4(
                                                    index,
                                                    "phone_code",
                                                    e.target.value
                                                  )
                                                }
                                                name="phone_code"
                                                id={`phone_code-${index}`}
                                                value={contact.phone_code}
                                              >
                                                {countryDataAll &&
                                                  countryDataAll.map((data) => (
                                                    <option
                                                      key={data.code}
                                                      value={data.code}
                                                    >
                                                      {data.code}
                                                    </option>
                                                  ))}
                                              </select>
                                            </div>
                                            <div className="mb-3 col-md-8 ps-0">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone Number"
                                                name="phoneNumber"
                                                id={`phoneNumber-${index}`}
                                                value={contact.phoneNumber}
                                                onChange={(e) =>
                                                  handleChange4(
                                                    index,
                                                    "phoneNumber",
                                                    e.target.value
                                                  )
                                                }
                                                maxLength={12}
                                                minLength={9}
                                              />
                                              {contactsErrors[index]
                                                ?.phoneNumber && (
                                                  <div
                                                    className="error-text"
                                                    style={{ color: "red" }}
                                                  >
                                                    {
                                                      contactsErrors[index]
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
                                          <label className="form-label">
                                            Email
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            name="email"
                                            id={`email-${index}`}
                                            value={contact.email}
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "email",
                                                e.target.value
                                              )
                                            }
                                          />
                                          {contactsErrors[index]?.email && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].email}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            <div className="px-4 d-flex align-items-center">
                              <h5 className="card-title mb-0 flex-grow-1"></h5>
                              <div>
                                <button
                                  className="btn btn-info text-white blue-btn"
                                  onClick={handleAddContact1}
                                >
                                  <i className="fa fa-plus pe-2"></i>Add Partner
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </section>
            <div className="form__item button__items d-flex justify-content-between">
              <Button
                className="btn btn-info"
                type="default"
                onClick={(e) => navigate("/admin/customer")}
              >
                <i className="pe-2 fa-regular fa-arrow-left-long"></i>Back
              </Button>
              <Button
                className="btn btn-info text-white blue-btn"
                type="submit"
                onClick={handleSubmit}
              >
                Next<i className="ps-2 fa-regular fa-arrow-right-long"></i>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Information;
