import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MultiStepFormContext from "./MultiStepFormContext";
import { EDIT_CUSTOMER } from "../../../../Utils/Common_Message";
import { Email_regex } from "../../../../Utils/Common_regex";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import {
  PersonRole,
  Country,
  IncorporationApi,
} from "../../../../ReduxStore/Slice/Settings/settingSlice";
import {
  GET_CUSTOMER_DATA,
  Edit_Customer,
  GetAllCompany,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";

const Information = ({ id, pageStatus }) => {
  const { address, setAddress, next } = useContext(MultiStepFormContext);
  const refs = useRef({});
  const managerSelectRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [staffDataAll, setStaffDataAll] = useState([]);
  const [countryDataAll, setCountryDataAll] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [customerType, setCustomerType] = useState("");
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
  const [contacts1, setContacts1] = useState([]);
  const [incorporationDataAll, setIncorporationDataAll] = useState([]);
  const [getSoleTraderDetails, setSoleTraderDetails] = useState({
    tradingName: "",
    tradingAddress: "",
    vatRegistered: 0,
    vatNumber: "",
    website: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "",
  });

  const [getPartnershipDetails, setPartnershipDetails] = useState({
    TradingName: "",
    TradingAddress: "",
    VATRegistered: 0,
    VATNumber: "",
    Website: "",
  });

  const [getCompanyDetails, setCompanyDetails] = useState({
    SearchCompany: "",
    CompanyName: "",
    EntityType: "",
    CompanyStatus: "",
    CompanyNumber: "",
    RegisteredOfficeAddress: "",
    IncorporationDate: "",
    IncorporationIn: "",
    VATRegistered: 0,
    VATNumber: "",
    Website: "",
    TradingName: "",
    TradingAddress: "",
  });

  const [contacts, setContacts] = useState([
    {
      authorised_signatory_status: 0,
      contact_id: "",
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      email: "",
      phone_code: "",
    },
  ]);

  const [errors, setErrors] = useState([
    {
      first_name: false,
      last_name: false,
      customer_contact_person_role_id: false,
      phoneCode: false,
      phone: false,
      email: false,
    },
  ]);

  const [contactsErrors, setContactsErrors] = useState([
    {
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      phone_code: "",
      email: "",
    },
    {
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      phone_code: "",
      email: "",
    },
  ]);

  useEffect(() => {
    CountryData();
    fetchStaffData();
    GetCustomerDetails();
    CustomerPersonRoleData();
    incorporationData();
  }, []);
  useEffect(() => {
    Get_Company();
  }, [searchItem]);

  useEffect(() => {
    FilterSearchDetails();
  }, [searchItem]);

  useEffect(() => {
    setCustomerType(id.customer_type);
    setManagerType(id.account_manager_id);

    if (customerDetails && customerDetails) {
      if (id.customer_type == "1") {
        setSoleTraderDetails((prevState) => ({
          ...prevState,
          tradingName:
            customerDetails.customer && customerDetails.customer.trading_name,
          tradingAddress:
            customerDetails.customer &&
            customerDetails.customer.trading_address,
          vatRegistered:
            customerDetails.customer && customerDetails.customer.vat_registered,
          vatNumber:
            customerDetails.customer && customerDetails.customer.vat_number,
          website: customerDetails.customer && customerDetails.customer.website,
          first_name:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].first_name,
          last_name:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].last_name,
          phone:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].phone,
          email:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].email,
          residentialAddress:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].residential_address,
          phone_code:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].phone_code,
          contact_id:
            customerDetails.contact_details &&
            customerDetails.contact_details[0].contact_id,
        }));
      }
      if (id.customer_type == "2") {
        setCompanyDetails((prevState) => ({
          ...prevState,
          CompanyName:
            customerDetails.company_details &&
            customerDetails.company_details.company_name,
          EntityType:
            customerDetails.company_details &&
            customerDetails.company_details.entity_type,
          CompanyStatus:
            customerDetails.company_details &&
            customerDetails.company_details.company_status,
          CompanyNumber:
            customerDetails.company_details &&
            customerDetails.company_details.company_number,
          RegisteredOfficeAddress:
            customerDetails.company_details &&
            customerDetails.company_details.registered_office_address,
          IncorporationDate:
            customerDetails.company_details &&
            customerDetails.company_details.incorporation_date
              ? customerDetails.company_details &&
                customerDetails.company_details.incorporation_date
              : "",
          IncorporationIn:
            customerDetails.company_details &&
            customerDetails.company_details.incorporation_in,

          VATRegistered:
            customerDetails.customer && customerDetails.customer.vat_registered,
          VATNumber:
            customerDetails.customer && customerDetails.customer.vat_number,
          Website: customerDetails.customer && customerDetails.customer.website,

          TradingName:
            customerDetails.customer && customerDetails.customer.trading_name,
          TradingAddress:
            customerDetails.customer &&
            customerDetails.customer.trading_address,
        }));
        setContacts(customerDetails.contact_details);
      }
      if (id.customer_type == "3") {
        setPartnershipDetails((prevState) => ({
          ...prevState,
          TradingName:
            customerDetails.customer && customerDetails.customer.trading_name,
          TradingAddress:
            customerDetails.customer &&
            customerDetails.customer.trading_address,
          VATRegistered:
            customerDetails.customer && customerDetails.customer.vat_registered,
          VATNumber:
            customerDetails.customer && customerDetails.customer.vat_number,
          Website: customerDetails.customer && customerDetails.customer.website,
        }));
        setContacts1(customerDetails && customerDetails.contact_details);

        if (customerDetails && customerDetails.contact_details?.length > 0) {
          const newErrors =
            customerDetails.contact_details &&
            customerDetails.contact_details.map((contact) => ({
              first_name: "",
              last_name: "",
              customer_contact_person_role_id: "",
              phone: "",
              email: "",
            }));
          setContactsErrors(newErrors);
        }
      }
    }
  }, [customerDetails]);

  useEffect(() => {
    if (getSearchDetails && getSearchDetails.length > 0) {
      setCompanyDetails((prevState) => ({
        ...prevState,
        CompanyName: getSearchDetails[0].title,
        EntityType: getSearchDetails[0].company_type,
        CompanyStatus: getSearchDetails[0].company_status,
        CompanyNumber: getSearchDetails[0].company_number,
        RegisteredOfficeAddress: getSearchDetails[0].address_snippet,
        IncorporationDate: getSearchDetails[0].date_of_creation
          ? getSearchDetails[0].date_of_creation
          : "",
        // IncorporationIn: getSearchDetails[0].description,
      }));
    }
  }, [getSearchDetails]);

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        authorised_signatory_status: 0,
        contact_id: "",
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
        phone_code: "+44",
      },
    ]);
    setErrors([
      ...errors,
      {
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setContacts(newContacts);
    setErrors(newErrors);
  };

  const handleAddContact1 = () => {
    setContacts1([
      ...contacts1,
      {
        authorised_signatory_status: 0,
        contact_id: "",
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
        phone_code: "+44",
      },
    ]);
    setContactsErrors([
      ...contactsErrors,
      {
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const handleDeleteContact1 = (index) => {
    const newContacts = contacts1.filter((_, i) => i !== index);
    const newErrors = contactsErrors.filter((_, i) => i !== index);
    setContacts1(newContacts);
    setContactsErrors(newErrors);
  };

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

  const GetCustomerDetails = async () => {
    try {
      const response = await dispatch(
        GET_CUSTOMER_DATA({
          req: { customer_id: id.id, pageStatus: pageStatus },
          authToken: token,
        })
      ).unwrap();
      if (response.status) {
        setCustomerDetails(response.data);
      } else {
        setCustomerDetails([]);
      }
    } catch (error) {
      console.log("Error fetching customer data", error);
    }
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
          setPersonRoleDataAll(response.data);
        } else {
          setPersonRoleDataAll([]);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

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
        console.log("Error", error);
      });
  };

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

  const validate1 = (field, value) => {
    const newErrors = { ...errors1 };
    if (!value) {
      if (field === "IndustryType")
        newErrors[field] = EDIT_CUSTOMER.SELECT_CLIENT_INDUSTRIES;
      else if (field === "tradingName")
        newErrors[field] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
      else if (field === "first_name")
        newErrors[field] = EDIT_CUSTOMER.ENTER_FIRST_NAME;
      else if (field === "last_name")
        newErrors[field] = EDIT_CUSTOMER.LAST_NAME;
      else if (field === "email") newErrors[field] = EDIT_CUSTOMER.EMAIL;
      else if (field === "residentialAddress")
        newErrors[field] = EDIT_CUSTOMER.RESIDENTIOAL_ADDRESS;
    } else if (field === "email" && !Email_regex(value)) {
      newErrors[field] = EDIT_CUSTOMER.invalidEmail;
    } else if (field === "phone" && !/^\d{9,12}$/.test(value)) {
      newErrors[field] = EDIT_CUSTOMER.invalidPhone;
    } else {
      delete newErrors[field];
    }

    setErrors1(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (customerType == 1 && ManagerType != "") {
      if (validate1()) {
        const req = {
          customer_id: id.id,
          pageStatus: "1",
          customer_type: "1",
          staff_id: id.staff_id,
          account_manager_id: id.account_manager_id,
          trading_name: getSoleTraderDetails.tradingName,
          customer_code: id.customer_code,
          trading_address: getSoleTraderDetails.tradingAddress,
          vat_registered: getSoleTraderDetails.vatRegistered,
          vat_number: getSoleTraderDetails.vatNumber,
          website: getSoleTraderDetails.website,
          contactDetails: [
            {
              contact_id: getSoleTraderDetails.contact_id,
              customer_contact_person_role_id: null,
              customer_contact_person_role_name: null,
              first_name: getSoleTraderDetails.first_name,
              last_name: getSoleTraderDetails.last_name,
              email: getSoleTraderDetails.email,
              phone: getSoleTraderDetails.phone,
              residential_address: getSoleTraderDetails.residentialAddress,
              phone_code: getSoleTraderDetails.phone_code,
            },
          ],
        };
        await dispatch(Edit_Customer({ req, authToken: token }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              next(id.id);
            } else {
              Swal.fire({
                icon: "error",
                title: response.message,
                timerProgressBar: true,
                timer: 1500,
              });
            }
          });
      } else {
        scrollToFirstError(errors1);
      }
    }
    if (customerType == 2 && ManagerType != "") {
      if (validate2()) {
        let formIsValid = true;
        const newErrors =
          contacts &&
          contacts.map((contact, index) => {
            const error = {
              first_name: contact.first_name
                ? ""
                : EDIT_CUSTOMER.REQUIRED_FIRST_NAME,
              last_name: contact.last_name
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
              error.first_name ||
              error.last_name ||
              error.customer_contact_person_role_id ||
              error.phone ||
              error.email
            ) {
              formIsValid = false;
            }
            return error;
          });
        setErrors(newErrors);
        if (formIsValid) {
          const req = {
            pageStatus: "1",
            customer_type: "2",
            staff_id: id.staff_id,
            account_manager_id: id.account_manager_id,
            customer_id: id.id,
            customer_code: id.customer_code,
            company_name: getCompanyDetails.CompanyName,
            entity_type: getCompanyDetails.EntityType,
            company_status: getCompanyDetails.CompanyStatus,
            company_number: getCompanyDetails.CompanyNumber,
            registered_office_address:
              getCompanyDetails.RegisteredOfficeAddress,
            incorporation_date: getCompanyDetails.IncorporationDate,
            incorporation_in: getCompanyDetails.IncorporationIn,
            vat_registered: getCompanyDetails.VATRegistered,
            vat_number: getCompanyDetails.VATNumber,
            website: getCompanyDetails.Website,
            trading_name: getCompanyDetails.TradingName,
            trading_address: getCompanyDetails.TradingAddress,
            contactDetails: contacts,
          };

          await dispatch(Edit_Customer({ req, authToken: token }))
            .unwrap()
            .then((response) => {
              if (response.status) {
                next(id.id);
              } else {
                Swal.fire({
                  icon: "error",
                  title: response.message,
                  timerProgressBar: true,
                  timer: 1500,
                });
              }
            });
        } else {
          scrollToFirstError1(errors);
        }
      } else {
        scrollToFirstError(errors2);
      }
    }
    if (customerType == 3 && ManagerType != "") {
      if (validate3()) {
        let formIsValid = true;
        const newErrors =
          contacts1 &&
          contacts1.map((contact, index) => {
            const error = {
              first_name: contact.first_name
                ? ""
                : EDIT_CUSTOMER.REQUIRED_FIRST_NAME,
              last_name: contact.last_name
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
              error.first_name ||
              error.last_name ||
              error.customer_contact_person_role_id ||
              error.phone ||
              error.email
            ) {
              formIsValid = false;
            }
            return error;
          });
        setContactsErrors(newErrors);
        if (formIsValid) {
          const req = {
            customer_id: id.id,
            pageStatus: "1",
            customer_type: "3",
            staff_id: id.staff_id,
            account_manager_id: id.account_manager_id,
            trading_name: getPartnershipDetails.TradingName,
            customer_code: id.customer_code,
            trading_address: getPartnershipDetails.TradingAddress,
            vat_registered: getPartnershipDetails.VATRegistered,
            vat_number: getPartnershipDetails.VATNumber,
            website: getPartnershipDetails.Website,
            contactDetails: contacts1,
          };

          await dispatch(Edit_Customer({ req, authToken: token }))
            .unwrap()
            .then((response) => {
              if (response.status) {
                next(id.id);
              } else {
                Swal.fire({
                  icon: "error",
                  title: response.message,
                  timerProgressBar: true,
                  timer: 1500,
                });
              }
            });
        } else {
          scrollToFirstError1(contactsErrors);
        }
      } else {
        scrollToFirstError(errors3);
      }
    }
  };

  const scrollToFirstError = (errors) => {
    const errorField = Object.keys(errors)[0];
    const errorElement = document.getElementById(errorField);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate2(name, value);
    setCompanyDetails({ ...getCompanyDetails, [name]: value });
  };

  const validate2 = (name, value) => {
    const newErrors = { ...errors2 };
    if (!value) {
      if (name === "CompanyName") newErrors[name] = EDIT_CUSTOMER.COMPANY_NAME;
      else if (name === "EntityType")
        newErrors[name] = EDIT_CUSTOMER.ENTITY_TYPE;
      else if (name === "CompanyStatus")
        newErrors[name] = EDIT_CUSTOMER.COMPANY_STATUS;
      else if (name === "CompanyNumber")
        newErrors[name] = EDIT_CUSTOMER.COMPANY_NUMBER;
      else if (name === "RegisteredOfficeAddress")
        newErrors[name] = EDIT_CUSTOMER.REGISTRER_OFFICE_ADDRESS;
      else if (name === "IncorporationDate")
        newErrors[name] = EDIT_CUSTOMER.INCORPORATION_DATE;
      else if (name === "IncorporationIn")
        newErrors[name] = EDIT_CUSTOMER.INCORPORATION_IN;
      else if (name === "TradingName")
        newErrors[name] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
    } else {
      delete newErrors[name];
    }
    setErrors2(newErrors);
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const handleChange = (index, field, value) => {
    const newContacts =
      contacts &&
      contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      );
    setContacts(newContacts);
    validateField(index, field, value);
  };

  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    if (!newErrors[index]) {
      newErrors[index] = {
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
      };
    }
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value
          ? ""
          : EDIT_CUSTOMER.REQUIRED_FIRST_NAME;
        break;
      case "last_name":
        newErrors[index].last_name = value
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
      case "phone":
        errors[index].phone =
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

  const validate3 = (name, value) => {
    const newErrors = { ...errors3 };
    if (!value) {
      if (name === "TradingName")
        newErrors[name] = EDIT_CUSTOMER.ENTER_TRADING_NAME;
      else if (name === "ClientIndustry")
        newErrors[name] = EDIT_CUSTOMER.SELECT_CLIENT_INDUSTRIES;
    } else {
      delete newErrors[name];
    }
    setErrors3(newErrors);
    return Object.keys(newErrors).length === 0 ? true : false;
  };

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

  const validateField1 = (index, field, value) => {
    const errors = [...contactsErrors];

    switch (field) {
      case "first_name":
      case "last_name":
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
      case "phone":
        errors[index].phone =
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

  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };

  const handleChangeValue = (e) => {
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
        console.log("Error", err);
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
        console.log("response", response);
        if (response.status) {
          setIncorporationDataAll(response.data);
        } else {
          setIncorporationDataAll([]);
        }
      })
      .catch((error) => {
        console.log("Error", error);
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
                            className="form-select "
                            onChange={(e) => setCustomerType(e.target.value)}
                            value={customerType}
                            disabled={true}
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
                            onChange={(e) => handleChangeValue(e)}
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
                                name="first_name"
                                id="first_name"
                                value={getSoleTraderDetails.first_name}
                                onChange={(e) => handleChange1(e)}
                                maxLength={50}
                              />
                              {errors1["first_name"] && (
                                <div className="error-text">
                                  {errors1["first_name"]}
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
                                name="last_name"
                                id="last_name"
                                value={getSoleTraderDetails.last_name}
                                onChange={(e) => handleChange1(e)}
                                maxLength={50}
                              />
                              {errors1["last_name"] && (
                                <div className="error-text">
                                  {errors1["last_name"]}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-4">
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
                                <div className="mb-3 col-md-8">
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
                                  value={getCompanyDetails.CompanyName}
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
                                                className="btn btn-danger"
                                                onClick={() =>
                                                  handleDeleteContact(index)
                                                }
                                                disabled={contacts.length === 1}
                                              >
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`first_name-${index}`}
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
                                              id={`first_name-${index}`}
                                              value={contact.first_name}
                                              onChange={(e) =>
                                                handleChange(
                                                  index,
                                                  "first_name",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            {errors[index] &&
                                              errors[index].first_name && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors[index].first_name}
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`last_name-${index}`}
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
                                              id={`last_name-${index}`}
                                              value={contact.last_name}
                                              onChange={(e) =>
                                                handleChange(
                                                  index,
                                                  "last_name",
                                                  e.target.value
                                                )
                                              }
                                            />
                                            {errors[index] &&
                                              errors[index].last_name && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {errors[index].last_name}
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
                                              id={`customer_contact_person_role_id-${index}`}
                                              value={
                                                contact.customer_contact_person_role_id
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  index,
                                                  "customer_contact_person_role_id",
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
                                              errors[index]
                                                .customer_contact_person_role_id && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {
                                                    errors[index]
                                                      .customer_contact_person_role_id
                                                  }
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
                                              <div className="mb-3 col-md-8">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Phone Number"
                                                  name="phone"
                                                  id={`phone-${index}`}
                                                  value={contact.phone}
                                                  onChange={(e) =>
                                                    handleChange(
                                                      index,
                                                      "phone",
                                                      e.target.value
                                                    )
                                                  }
                                                  maxLength={12}
                                                  minLength={9}
                                                />
                                                {errors[index] &&
                                                  errors[index].phone && (
                                                    <div
                                                      style={{ color: "red" }}
                                                    >
                                                      {errors[index].phone}
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
                                 <i className="fa fa-plus pe-1"></i> Add Contact
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
                                          className="form-check form-switch form-switch-md mb-3 d-flex justify-content-between"
                                          dir="ltr"
                                        >
                                          <div>
                                            <label className="form-check-label">
                                              Partner {index + 1}
                                            </label>
                                          </div>
                                          {index !== 0 && index !== 1 && (
                                            <div>
                                              <button
                                                className="btn btn-danger"
                                                type="button"
                                                onClick={() =>
                                                  handleDeleteContact1(index)
                                                }
                                                disabled={
                                                  contacts1.length === 1
                                                }
                                              >
                                                Delete
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
                                            name="first_name"
                                            id={`first_name-${index}`}
                                            value={contact.first_name}
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "first_name",
                                                e.target.value
                                              )
                                            }
                                          />
                                          {contactsErrors[index]
                                            ?.first_name && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].first_name}
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
                                            id={`last_name-${index}`}
                                            value={contact.last_name}
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "last_name",
                                                e.target.value
                                              )
                                            }
                                          />
                                          {contactsErrors[index]?.last_name && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {contactsErrors[index].last_name}
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
                                            id={`customer_contact_person_role_id-${index}`}
                                            value={
                                              contact.customer_contact_person_role_id
                                            }
                                            onChange={(e) =>
                                              handleChange4(
                                                index,
                                                "customer_contact_person_role_id",
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
                                          {contactsErrors[index]
                                            ?.customer_contact_person_role_id && (
                                            <div
                                              className="error-text"
                                              style={{ color: "red" }}
                                            >
                                              {
                                                contactsErrors[index]
                                                  .customer_contact_person_role_id
                                              }
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
                                            <div className="mb-3 col-md-8">
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Phone Number"
                                                name="phone"
                                                id={`phone-${index}`}
                                                value={contact.phone}
                                                onChange={(e) =>
                                                  handleChange4(
                                                    index,
                                                    "phone",
                                                    e.target.value
                                                  )
                                                }
                                                maxLength={12}
                                                minLength={9}
                                              />
                                              {contactsErrors[index]?.phone && (
                                                <div
                                                  className="error-text"
                                                  style={{ color: "red" }}
                                                >
                                                  {contactsErrors[index].phone}
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
                                  Add Partner
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
                className="btn btn-secondary"
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
