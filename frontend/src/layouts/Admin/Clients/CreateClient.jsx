import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetClientIndustry, Add_Client, } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { GetAllCompany } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Email_regex } from "../../../Utils/Common_regex";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PersonRole, Country } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { ScrollToViewFirstError, ScrollToViewFirstErrorContactForm } from '../../../Utils/Comman_function'

const CreateClient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [clientIndustry, setClientIndustry] = useState([]);
  const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
  const [selectClientType, setSelectClientType] = useState(1);
  const [showDropdown, setShowDropdown] = useState(true);
  const [getSearchDetails, setSearchDetails] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const [errors3, setErrors3] = useState({});
  const [errors4, setErrors4] = useState({});

  const [personRoleDataAll, setPersonRoleDataAll] = useState({
    loading: true,
    data: [],
  });

  const [countryDataAll, setCountryDataAll] = useState({
    loading: true,
    data: [],
  });

  const [getSoleTraderDetails, setSoleTraderDetails] = useState({
    IndustryType: "",
    tradingName: "",
    tradingAddress: "",
    vatRegistered: "0",
    vatNumber: "",
    website: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "+44",
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
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
    ClientIndustry: "",
    TradingName: "",
    TradingAddress: "",
  });

  const [getPartnershipDetails, setPartnershipDetails] = useState({
    ClientIndustry: "",
    TradingName: "",
    TradingAddress: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
  });

  const [contacts, setContacts] = useState([
    {
      authorised_signatory_status: false,
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
      phone_code: "+44",
      email: "",
    },
  ]);

  const [contacts1, setContacts1] = useState([
    {
      authorised_signatory_status: true,
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
      phone_code: "+44",
      alternate_phone: "",
      alternate_phone_code: "+44",
      email: "",
      alternate_email: "",
    },
    {
      authorised_signatory_status: true,
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
      phone_code: "+44",
      alternate_phone: "",
      alternate_phone_code: "+44",
      email: "",
      alternate_email: "",
    },
  ]);

  const [contactsErrors, setContactsErrors] = useState([
    {
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
      alternate_phone: "",
      email: "",
      alternate_email: "",
    },
    {
      first_name: "",
      last_name: "",
      role: "",
      phone: "",
      alternate_phone: "",
      email: "",
      alternate_email: "",
    },
  ]);

  const [errors, setErrors] = useState([
    {
      first_name: false,
      last_name: false,
      role: false,
      phoneCode: false,
      phone: false,
      email: false,
    },
  ]);

  const [getIndivisualDetails, setIndivisualDetails] = useState({
    tradingName: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "+44",
  });

  useEffect(() => {
    CustomerPersonRoleData();
    CountryData();
    getClientIndustry();
  }, []);

  useEffect(() => {
    Get_Company();
    FilterSearchDetails();
  }, [searchItem]);

  useEffect(() => {
    if (getSearchDetails.length > 0) {
      setCompanyDetails((prevState) => ({
        ...prevState,
        CompanyName: getSearchDetails[0].title,
        EntityType: getSearchDetails[0].company_type,
        CompanyStatus: getSearchDetails[0].company_status,
        CompanyNumber: getSearchDetails[0].company_number,
        RegisteredOfficeAddress: getSearchDetails[0].address_snippet,
        IncorporationDate: getSearchDetails[0].date_of_creation,
        IncorporationIn: getSearchDetails[0].description,
        TradingName: getSearchDetails[0].title,
        TradingAddress: getSearchDetails[0].address_snippet,
      }));

      const newErrors = { ...errors2 };
      if (getSearchDetails[0].title) delete newErrors["CompanyName"];
      if (getSearchDetails[0].company_type) delete newErrors["EntityType"];
      if (getSearchDetails[0].company_status) delete newErrors["CompanyStatus"];
      if (getSearchDetails[0].company_number) delete newErrors["CompanyNumber"];
      if (getSearchDetails[0].address_snippet) delete newErrors["RegisteredOfficeAddress"];
      if (getSearchDetails[0].date_of_creation) delete newErrors["IncorporationDate"];
      if (getSearchDetails[0].description) delete newErrors["IncorporationIn"];
      if (getSearchDetails[0].title) delete newErrors["TradingName"];
      if (getSearchDetails[0].address_snippet) delete newErrors["TradingAddress"];
      setErrors2(newErrors);
    }
  }, [getSearchDetails]);


  const handleAddContact = () => {
    setContacts([
      ...contacts,
      {
        authorised_signatory_status: false,
        first_name: "",
        last_name: "",
        role: "",
        phone: "",
        phone_code: "+44",
        email: "",
      },
    ]);
    setErrors([
      ...errors,
      { first_name: "", last_name: "", role: "", phone: "", email: "" },
    ]);
  };

  const handleAddContact1 = () => {
    setContacts1([
      ...contacts1,
      {
        authorised_signatory_status: true,
        first_name: "",
        last_name: "",
        role: "",
        phone: "",
        alternate_phone: "",
        phone_code: "+44",
        alternate_phone_code: "+44",
        email: "",
        alternate_email: "",
      },
    ]);
    setContactsErrors([
      ...contactsErrors,
      {
        first_name: "",
        last_name: "",
        role: "",
        phone: "",
        alternate_phone: "",
        email: "",
        alternate_email: "",
      },
    ]);
  };

  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const newErrors = contactsErrors.filter((_, i) => i !== index);
    setContacts(newContacts);
    setErrors(newErrors);
  };

  const handleDeleteContact1 = (index) => {
    const newContacts = contacts1.filter((_, i) => i !== index);
    const newErrors = contactsErrors.filter((_, i) => i !== index);
    setContacts1(newContacts);
    setContactsErrors(newErrors);
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
        return;
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

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    if (name === "CompanyNumber" || name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate2(name, value);
    setCompanyDetails({ ...getCompanyDetails, [name]: value });
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

  const handleChangeIndivisul = (e) => {
    const { name, value } = e.target;
    if (name === "vatNumber" || name === "phone") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate4(name, value);
    setIndivisualDetails({ ...getIndivisualDetails, [name]: value });
  };

  const validate1 = (name, value) => {
    const newErrors = { ...errors1 };
    if (!value) {
      switch (name) {
        case "tradingName":
          newErrors[name] = "Please enter Trading Name";
          break;
        case "tradingAddress":
          newErrors[name] = "Please enter Trading Address";
          break;
        case "vatRegistered":
          newErrors[name] = "Please select VAT Registered";
          break;
        case "first_name":
          newErrors[name] = "Please enter First Name";
          break;
        case "last_name":
          newErrors[name] = "Please enter Last Name";
          break;
        case "email":
          newErrors[name] = "Please enter Email";
          break;
        default:
          break;
      }
    }
    else {
      if (name === "email" && !Email_regex(value)) {
        newErrors[name] = "Please enter valid Email";
      } else if (name === "phone" && !/^\d{9,12}$/.test(value)) {
        newErrors[name] = "Phone Number must be between 9 to 12 digits";
      } else {
        delete newErrors[name];
        setErrors1((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors1((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }

    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validate2 = (name, value) => {
    const newErrors = { ...errors2 };
    if (!value) {
      switch (name) {
        case "CompanyName":
          newErrors[name] = "Please Enter Company Name";
          break;
        case "EntityType":
          newErrors[name] = "Please Enter Entity Type";
          break;
        case "CompanyStatus":
          newErrors[name] = "Please Enter Company Status";
          break;
        case "CompanyNumber":
          newErrors[name] = "Please Enter Company Number";
          break;
        case "RegisteredOfficeAddress":
          newErrors[name] = "Please Enter Registered Office Address";
          break;
        case "IncorporationDate":
          newErrors[name] = "Please Enter Incorporation Date";
          break;
        case "IncorporationIn":
          newErrors[name] = "Please Enter Incorporation In";
          break;
        case "VATRegistered":
          newErrors[name] = "Please Enter VAT Registered";
          break;
        case "TradingName":
          newErrors[name] = "Please Enter Trading Name";
          break;
        case "TradingAddress":
          newErrors[name] = "Please Enter Trading Address";
          break;
        default:
          break;
      }
    }
    else {
      if (name === "VATNumber" && !/^[0-9+]*$/.test(value)) {
        newErrors[name] = "Please enter valid VAT Number";
      }
      else {
        delete newErrors[name];
        setErrors2((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors2((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validate3 = (name, value) => {
    const newErrors = { ...errors3 };
    if (!value) {
      switch (name) {
        case "TradingName":
          newErrors[name] = "Please Enter Trading Name";
          break;
        case "TradingAddress":
          newErrors[name] = "Please Enter Trading Address";
          break;
        case "VATRegistered":
          newErrors[name] = "Please Enter VAT Registered";
          break;
        default:
          break;
      }
    }
    else {

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
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validate4 = (name, value) => {
    const newErrors = { ...errors4 }
    if (!value) {
      switch (name) {
        case "tradingName":
          newErrors[name] = "Please enter Trading Name";
          break;
        case "first_name":
          newErrors[name] = "Please enter First Name";
          break;
        case "last_name":
          newErrors[name] = "Please enter Last Name";
          break;
        default:
          break;
      }
    }
    else {
      if (name === "email" && !Email_regex(value)) {
        newErrors[name] = "Please enter valid Email";
      } else if (name === "phone" && !/^\d{9,12}$/.test(value)) {
        newErrors[name] = "Phone Number must be between 9 to 12 digits";
      } else {
        delete newErrors[name];
        setErrors4((prevErrors) => {

          const updatedErrors = { ...prevErrors };
          delete updatedErrors[name];
          return updatedErrors;
        });
      }
    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors4((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  // validate all fields when submit
  const validateAllFields = (type) => {
    const customer_type = [getSoleTraderDetails, getCompanyDetails, getPartnershipDetails, getIndivisualDetails];
    const validate = [validate1, validate2, validate3, validate4];

    let isValid = true;
    for (const key in customer_type[type - 1]) {
      if (!validate[type - 1](key, customer_type[type - 1][key])) {
        isValid = false;
      }
    }
    return isValid;
  };

  const getClientIndustry = async () => {
    const req = { action: "get" };
    const data = { req: req, authToken: token };
    await dispatch(GetClientIndustry(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientIndustry(response.data);
        } else {
          setClientIndustry(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const CountryData = async (req) => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(Country(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCountryDataAll({ loading: false, data: response.data });
        } else {
          setCountryDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
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

  const handleChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
    validateField(index, field, value);
  };

  const handleChange4 = (index, field, value) => {
    const newContacts = [...contacts1];
    newContacts[index][field] = value;
    setContacts1(newContacts);
    validateField1(index, field, value);
  };

  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value ? "" : "Last Name is required";
        break;

      case "email":
        if (!value) {
          newErrors[index].email = "";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = "Valid Email is required";
        } else {
          newErrors[index].email = "";
        }
        break;
      case "phone":
        newErrors[index].phone =
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

  const validateField1 = (index, field, value) => {
    const newErrors = [...contactsErrors];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value ? "" : "Last Name is required";
        break;
      case "role":
        // newErrors[index].role = value ? '' : 'Role is required';
        break;
      case "email":
        if (!value) {
          newErrors[index].email = "";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = "Valid Email is required";
        } else {
          newErrors[index].email = "";
        }
        break;
      case "alternate_email":
        if (!value) {
          newErrors[index].alternate_email = "";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].alternate_email = "Valid Email is required";
        } else {
          newErrors[index].alternate_email = "";
        }
        break;
      case "phone":
        newErrors[index].phone =
          value === ""
            ? ""
            : /^\d{9,12}$/.test(value)
              ? ""
              : "Phone Number must be between 9 to 12 digits";
        break;

      case "alternate_phone":
        newErrors[index].alternate_phone =
          value === ""
            ? ""
            : /^\d{9,12}$/.test(value)
              ? ""
              : "Phone Number must be between 9 to 12 digits";

        break;
      default:
        break;
    }
    setContactsErrors(newErrors);
  };

  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };

  const HandleCancel = () => {
   // navigate("/admin/Clientlist", { state: { id: location.state.id } });
   window.history.back()
  };


  // common submit function for all type of customer
  const AddClientFun = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(Add_Client(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Client Added Successfully",
            timerProgressBar: true,
            timer: 1500,
          });
          setTimeout(() => {
            //navigate("/admin/Clientlist", { state: location.state });
            window.history.back();
          }, 1500);
        } else {
          Swal.fire({
            icon: "error",
            title: response.message,
            timerProgressBar: true,
            timer: 1500,
          });
        }
      });
  };

  const handleSubmit = async () => {
    if (selectClientType == 1 && validateAllFields(1)) {
      const req = {
        client_type: "1",
        customer_id: location.state.id,
        client_industry_id: getSoleTraderDetails.IndustryType,
        trading_name: getSoleTraderDetails.tradingName,
        trading_address: getSoleTraderDetails.tradingAddress,
        vat_registered: getSoleTraderDetails.vatRegistered,
        vat_number: getSoleTraderDetails.vatNumber,
        website: getSoleTraderDetails.website,
        first_name: getSoleTraderDetails.first_name,
        last_name: getSoleTraderDetails.last_name,
        phone: getSoleTraderDetails.phone,
        email: getSoleTraderDetails.email,
        residential_address: getSoleTraderDetails.residentialAddress,
        client_code: location.state.id,
        phone_code: getSoleTraderDetails.phone_code,
      };
      await AddClientFun(req);
    }
    if (selectClientType == 2 && validateAllFields(2)) {
      let formIsValid = true;
      const newErrors = contacts.map((contact, index) => {
        const error = {
          first_name: contact.first_name ? "" : "First Name is required",
          last_name: contact.last_name ? "" : "Last Name is required",
          // role: contact.role ? '' : 'Role is required',
          phone:
            contact.phone === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          email:
            contact.email === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
        };

        if (
          error.first_name ||
          error.last_name ||
          error.role ||
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
          client_type: "2",
          customer_id: location.state.id,
          company_name: getCompanyDetails.CompanyName,
          entity_type: getCompanyDetails.EntityType,
          company_status: getCompanyDetails.CompanyStatus,
          company_number: getCompanyDetails.CompanyNumber,
          registered_office_address: getCompanyDetails.RegisteredOfficeAddress,
          incorporation_date: getCompanyDetails.IncorporationDate,
          incorporation_in: getCompanyDetails.IncorporationIn,
          vat_registered: getCompanyDetails.VATRegistered,
          vat_number: getCompanyDetails.VATNumber,
          website: getCompanyDetails.Website,
          client_industry_id: Number(getCompanyDetails.ClientIndustry),
          trading_name: getCompanyDetails.TradingName,
          trading_address: getCompanyDetails.TradingAddress,
          contactDetails: contacts,
        };
        await AddClientFun(req);
      }
      else {
        ScrollToViewFirstErrorContactForm(errors);  
      }
    }
    if (selectClientType == 3 && validateAllFields(3)) {
      let formIsValid = true;
      const newErrors = contacts1.map((contact, index) => {
        const error = {
          first_name: contact.first_name ? "" : "First Name is required",
          last_name: contact.last_name ? "" : "Last Name is required",
          // role: contact.role ? '' : 'Role is required',
          phone:
            contact.phone === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          alternate_phone:
            contact.alternate_phone === ""
              ? ""
              : /^\d{9,12}$/.test(contact.alternate_phone)
                ? ""
                : " Alternate Phone Number must be between 9 to 12 digits",
          email:
            contact.email === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
          alternate_email:
            contact.alternate_email === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.alternate_email)
                ? ""
                : "Valid Email is required",
        };

        if (
          error.first_name ||
          error.last_name ||
          error.role ||
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
          client_type: "3",
          customer_id: location.state.id,
          client_industry_id: getPartnershipDetails.ClientIndustry,
          trading_name: getPartnershipDetails.TradingName,
          trading_address: getPartnershipDetails.TradingAddress,
          vat_registered: getPartnershipDetails.VATRegistered,
          vat_number: getPartnershipDetails.VATNumber,
          website: getPartnershipDetails.Website,
          contactDetails: contacts1,
        };

        await AddClientFun(req);

      }
      else {
        ScrollToViewFirstErrorContactForm(contactsErrors);
        
      }
    }
    if (selectClientType == 4 && validateAllFields(4)) {
      const req = {
        client_type: "4",
        customer_id: location.state.id,
        trading_name: getIndivisualDetails.tradingName,
        first_name: getIndivisualDetails.first_name,
        last_name: getIndivisualDetails.last_name,
        phone: getIndivisualDetails.phone,
        email: getIndivisualDetails.email,
        residential_address: getIndivisualDetails.residentialAddress,
        client_code: location.state.id,
        phone_code: getIndivisualDetails.phone_code,
      };
      await dispatch(Add_Client(req))
        .unwrap()
        .then((response) => {
          if (response.status) {
            Swal.fire({
              icon: "success",
              title: "Client Added Successfully",
              timerProgressBar: true,
              timer: 1500,
            });
            setTimeout(() => {
              // navigate("/admin/Clientlist", { state: location.state });
              window.history.back();
            }, 1500);
          } else {
            Swal.fire({
              icon: "error",
              title: response.message,
              timerProgressBar: true,
              timer: 1500,
            });
          }
        });
    }
  };
  
  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header step-header-blue d-flex align-items-center">
                <button
                  type="button"
                  className="btn p-0"
                  onClick={HandleCancel}
                >
                  <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
                </button>
                <h4 className="card-title mb-0">Create New Client</h4>
              </div>

              <div className="card-body form-steps">
                <div>
                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="pills-gen-info"
                      role="tabpanel"
                      aria-labelledby="pills-gen-info-tab"
                    >
                      <div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card card_shadow">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label
                                      htmlFor="firstNameinput"
                                      className="form-label"
                                    >
                                      Client Type{" "}
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                      className="form-select "
                                      value={selectClientType}
                                      onChange={(e) =>
                                        setSelectClientType(e.target.value)
                                      }
                                    >
                                      <option value={1}>Sole Trader</option>
                                      <option value={2}>Company</option>
                                      <option value={3}>Partnership</option>
                                      <option value={4}>individual</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>{" "}
                          {/* end col */}
                        </div>
                        <section>
                          {selectClientType == 1 ? (
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                      Sole Trader
                                    </h4>
                                  </div>
                                  {/* end card header */}
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-lg-4 mb-3">
                                        <div className="">
                                          <label className="form-label">
                                            Client Industry
                                          </label>
                                          <select
                                            
                                            className={errors1["IndustryType"] ? "error-field form-select" : "form-select"}
                                            aria-label="Default select example"
                                            name="IndustryType"
                                            id="IndustryType"
                                            value={
                                              getSoleTraderDetails.IndustryType
                                            }
                                            onChange={(e) => handleChange1(e)}
                                          >
                                            <option value={0}>
                                              Select Client Industry
                                            </option>
                                            {clientIndustry.map(
                                              (data, index) => {
                                                return (
                                                  <option
                                                    value={data.id}
                                                    key={data.id}
                                                  >
                                                    {data.business_type}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                          {errors1["IndustryType"] && (
                                            <div className="error-text">
                                              {errors1["IndustryType"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Trading Name
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            name="tradingName"
                                            id="tradingName"
                                            
                                            className={errors1["tradingName"] ? "error-field form-control" : "form-control"}
                                            placeholder="Trading Name"
                                            onChange={(e) => handleChange1(e)}
                                            value={
                                              getSoleTraderDetails.tradingName
                                            }
                                          />
                                          {errors1["tradingName"] && (
                                            <div className="error-text">
                                              {errors1["tradingName"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Trading Address
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            
                                            className={errors1["tradingAddress"] ? "error-field form-control" : "form-control"}
                                            placeholder="Trading Address"
                                            name="tradingAddress"
                                            id="tradingAddress"
                                            onChange={(e) => handleChange1(e)}
                                            value={
                                              getSoleTraderDetails.tradingAddress
                                            }
                                          />
                                          {errors1["tradingAddress"] && (
                                            <div className="error-text">
                                              {errors1["tradingAddress"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 mb-3">
                                        <div className="">
                                          <label className="form-label">
                                            VAT Registered
                                          </label>
                                          <select
                                           
                                            className={errors1["vatRegistered"] ? "error-field form-select" : "form-select"}
                                            aria-label="Default select example"
                                            name="vatRegistered"
                                            id="vatRegistered"
                                            defaultValue={0}
                                            onChange={(e) => handleChange1(e)}
                                          >
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
                                          <label className="form-label">
                                            VAT Number
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="VAT Number"
                                            name="vatNumber"
                                            id="vatNumber"
                                            value={
                                              getSoleTraderDetails.vatNumber
                                            }
                                            onChange={(e) => handleChange1(e)}
                                          />
                                          {errors1["vatNumber"] && (
                                            <div className="error-text">
                                              {errors1["vatNumber"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Website
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="URL"
                                            name="website"
                                            id="website"
                                            value={getSoleTraderDetails.website}
                                            onChange={(e) => handleChange1(e)}
                                          />
                                          {errors1["website"] && (
                                            <div className="error-text">
                                              {errors1["website"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card">
                                  <div className="card-header card-header-light-blue">
                                    <h4 className="card-title mb-0 fs-16 ">
                                      Sole Trader Details
                                    </h4>
                                  </div>
                                  <div className="card-body row">
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
                                          id="first_name"
                                          value={
                                            getSoleTraderDetails.first_name
                                          }
                                          onChange={(e) => handleChange1(e)}
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
                                          id="last_name"
                                          value={getSoleTraderDetails.last_name}
                                          onChange={(e) => handleChange1(e)}
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
                                        <label className="form-label">
                                          Phone
                                        </label>
                                        <div className="row">
                                          <div className="col-md-4 pe-0">
                                            <select
                                              className="form-select"
                                              onChange={(e) => handleChange1(e)}
                                              name="phone_code"
                                              id="phone_code"
                                              value={
                                                getSoleTraderDetails.phone_code
                                              }
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
                                              id="phone"
                                              value={getSoleTraderDetails.phone}
                                              onChange={(e) => handleChange1(e)}
                                              maxLength={12}
                                              minLength={9}
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
                                          Email
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
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
                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Residential Address
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Residential Address"
                                          name="residentialAddress"
                                          id="residentialAddress"
                                          value={
                                            getSoleTraderDetails.residentialAddress
                                          }
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
                          ) : selectClientType == 2 ? (
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                      Company Information
                                    </h4>
                                  </div>
                                  {/* end card header */}
                                  <div className="card-body">
                                    <div className="row">
                                      {/* <h4 className="card-title flex-grow-1 fs-14 mb-2">Contact Information</h4> */}
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
                                                placeholder="Search Company"
                                                name="SearchCompany"
                                                id="SearchCompany"
                                                onChange={(e) =>
                                                  setSearchItem(e.target.value)
                                                }
                                                value={searchItem}
                                                onClick={() =>
                                                  setShowDropdown(true)
                                                }
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
                                                            setSearchItem(
                                                              company.title
                                                            );
                                                            setShowDropdown(
                                                              false
                                                            );
                                                          }}
                                                          style={{
                                                            cursor: "pointer",
                                                            padding: "8px 0",
                                                          }} // Adjust padding as needed
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
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Enter Company Name"
                                              name="CompanyName"
                                              id="CompanyName"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.CompanyName
                                              }
                                              // disabled
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
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Enter Entity Type"
                                              name="EntityType"
                                              id="EntityType"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.EntityType
                                              }
                                              // disabled
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
                                              {" "}
                                              Company Status{" "}
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Company Status"
                                              name="CompanyStatus"
                                              id="CompanyStatus"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.CompanyStatus
                                              }
                                              // disabled
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
                                              Company Status
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Enter Company Number"
                                              name="CompanyNumber"
                                              id="CompanyNumber"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.CompanyNumber
                                              }
                                              // disabled
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
                                              placeholder="Incorporation Date"
                                              name="IncorporationDate"
                                              id="IncorporationDate"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.IncorporationDate
                                              }
                                              // disabled
                                            />
                                            {errors2["IncorporationDate"] && (
                                              <div className="error-text">
                                                {errors2["IncorporationDate"]}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="col-lg-7">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Registered Office Address
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Registered Office Address"
                                              name="RegisteredOfficeAddress"
                                              id="RegisteredOfficeAddress"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.RegisteredOfficeAddress
                                              }
                                              // disabled
                                            />
                                            {errors2[
                                              "RegisteredOfficeAddress"
                                            ] && (
                                                <div className="error-text">
                                                  {
                                                    errors2[
                                                    "RegisteredOfficeAddress"
                                                    ]
                                                  }
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        <div className="col-lg-5">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              {" "}
                                              Incorporation In{" "}
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Please Enter Incorporation In"
                                              name="IncorporationIn"
                                              id="IncorporationIn"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.IncorporationIn
                                              }
                                              // disabled
                                            />

                                            {errors2["IncorporationIn"] && (
                                              <div className="error-text">
                                                {errors2["IncorporationIn"]}
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
                                              defaultValue={0}
                                            >
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
                                                onChange={(e) =>
                                                  handleChange2(e)
                                                }
                                                value={
                                                  getCompanyDetails.VATNumber
                                                }
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
                                            <label className="form-label">
                                              Website
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control "
                                              placeholder="URL"
                                              name="Website"
                                              id="Website"
                                              onChange={(e) => handleChange2(e)}
                                              value={getCompanyDetails.Website}
                                            />
                                            {errors2["Website"] && (
                                              <div className="error-text">
                                                {errors2["Website"]}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  {/* end card header */}
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Client Industry
                                          </label>
                                          <select
                                            className="form-select "
                                            name="ClientIndustry"
                                            id="ClientIndustry"
                                            onChange={(e) => handleChange2(e)}
                                            value={
                                              getCompanyDetails.ClientIndustry
                                            }
                                          >
                                            <option value="">
                                              Select Client Industry
                                            </option>
                                            {clientIndustry.map(
                                              (data, index) => {
                                                return (
                                                  <option
                                                    value={data.id}
                                                    key={data.id}
                                                  >
                                                    {data.business_type}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                          {errors2["ClientIndustry"] && (
                                            <div className="error-text">
                                              {errors2["ClientIndustry"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Trading Name
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Trading Name"
                                            name="TradingName"
                                            id="TradingName"
                                            onChange={(e) => handleChange2(e)}
                                            value={
                                              getCompanyDetails.TradingName
                                            }
                                          />
                                          {errors2["TradingName"] && (
                                            <div className="error-text">
                                              {errors2["TradingName"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Trading Address
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>{" "}
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Trading Address"
                                            name="TradingAddress"
                                            id="TradingAddress"
                                            onChange={(e) => handleChange2(e)}
                                            value={
                                              getCompanyDetails.TradingAddress
                                            }
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
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                        Officer Details
                                      </h4>
                                    </div>
                                    <div className="row" id="form2">
                                      <div className="card-body">
                                        <div className="row">
                                          {contacts.map((contact, index) => (
                                            <div
                                              className="col-xl-12 col-lg-12 mt-3"
                                              key={index}
                                            >
                                              <div className="card pricing-box p-4 m-2 mt-0">
                                                <div className="row">
                                                  {index !== 0 && (
                                                    <div className="col-lg-12">
                                                      <div className="form-check mb-3 d-flex justify-content-end">
                                                        <button
                                                          className="delete-icon"
                                                          onClick={() => handleDeleteContact(index)}
                                                          disabled={contacts.length === 1}
                                                        >
                                                          <i className="ti-trash text-danger"></i>{" "}</button>
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
                                                        <span style={{ color: "red", }} >*</span>
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
                                                      {errors[index]
                                                        .first_name && (
                                                          <div className="error-text">
                                                            {
                                                              errors[index]
                                                                .first_name
                                                            }
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
                                                        id={`last_name-${index}`}
                                                        value={
                                                          contact.last_name
                                                        }
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "last_name",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {errors[index]
                                                        .last_name && (
                                                          <div className="error-text">
                                                            {
                                                              errors[index]
                                                                .last_name
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
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Phone
                                                      </label>
                                                      <div className="row">
                                                        <div className="col-md-4 pe-0">
                                                          <select
                                                            className="form-select"
                                                            onChange={(e) =>
                                                              handleChange(e)
                                                            }
                                                            name="phone_code"
                                                            value={
                                                              getSoleTraderDetails.phone_code
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
                                                        <div className="mb-3 col-md-8 ps-1">
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Phone Number"
                                                            id={`phone-${index}`}
                                                            value={
                                                              contact.phone
                                                            }
                                                            onChange={(e) =>
                                                              handleChange(
                                                                index,
                                                                "phone",
                                                                e.target.value
                                                              )
                                                            }
                                                            maxLength={12}
                                                          />
                                                          {errors[index]
                                                            .phone && (
                                                              <div className="error-text">
                                                                {
                                                                  errors[index]
                                                                    .phone
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
                                          <div className="justify-content-end d-flex align-items-center">
                                            <button
                                              className="btn btn-info text-white blue-btn"
                                              onClick={handleAddContact}
                                            >
                                              <i className="fa fa-plus pe-1"></i>
                                              Add Officer
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
                          ) : selectClientType == 3 ? (
                            <div className="row ">
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  <div className="card-header  card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                      Partnership
                                    </h4>
                                  </div>
                                  {/* end card header */}
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Client Industry
                                          </label>
                                          <select
                                            className="form-select "
                                            name="ClientIndustry"
                                            id="ClientIndustry"
                                            value={
                                              getPartnershipDetails.ClientIndustry
                                            }
                                            onChange={(e) => handleChange3(e)}
                                          >
                                            <option value={0}>
                                              Select Client Industry
                                            </option>
                                            {clientIndustry.map(
                                              (data, index) => {
                                                return (
                                                  <option
                                                    value={data.id}
                                                    key={data.id}
                                                  >
                                                    {data.business_type}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                          {errors3["ClientIndustry"] && (
                                            <div style={{ color: "red" }}>
                                              {errors3["ClientIndustry"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Trading Name
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Trading Name"
                                            name="TradingName"
                                            id="TradingName"
                                            value={
                                              getPartnershipDetails.TradingName
                                            }
                                            onChange={(e) => handleChange3(e)}
                                            maxLength={100}
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
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>{" "}
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Trading Address"
                                            name="TradingAddress"
                                            id="TradingAddress"
                                            value={
                                              getPartnershipDetails.TradingAddress
                                            }
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
                                            </label>
                                            <select
                                              className="form-select "
                                              name="VATRegistered"
                                              id="VATRegistered"
                                              defaultValue={0}
                                              onChange={(e) => handleChange3(e)}
                                            >
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
                                              VAT Number
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control "
                                              placeholder="VAT Number"
                                              name="VATNumber"
                                              id="VATNumber"
                                              value={
                                                getPartnershipDetails.VATNumber
                                              }
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
                                          <label className="form-label">
                                            Website
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control "
                                            placeholder="URL"
                                            name="Website"
                                            id="Website"
                                            value={
                                              getPartnershipDetails.Website
                                            }
                                            onChange={(e) => handleChange3(e)}
                                            maxLength={200}
                                          />

                                          {errors3["Website"] && (
                                            <div style={{ color: "red" }}>
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
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                        Contact Details
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        {contacts1.map((contact, index) => (
                                          <div className="col-xxl-12 col-lg-12">
                                            <div className="card pricing-box p-4 m-2 mt-0">
                                              <div className="row">
                                                <div className="col-lg-12">
                                                  <div
                                                    className="form-check form-switch form-switch-md mb-3 d-flex justify-content-end"
                                                    dir="ltr"
                                                  >
                                                    {/* <div>
                                                      <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`customSwitchsizemd-${index}`}
                                                        checked={
                                                          contacts1.authorised_signatory_status
                                                        }
                                                        onChange={(e) =>
                                                          handleChange4(
                                                            index,
                                                            "authorised_signatory_status",
                                                            e.target.checked
                                                          )
                                                        }
                                                        defaultChecked={
                                                          index === 0 ||
                                                          index === 1
                                                        }
                                                        disabled={
                                                          contacts1.length === 2
                                                            ? index === 0 ||
                                                            index === 1
                                                            : false
                                                        }
                                                      />
                                                      <label className="form-check-label">
                                                        Authorised Signatory
                                                      </label>
                                                    </div> */}
                                                    {index !== 0 &&
                                                      index !== 1 && (
                                                        <div>
                                                          <button
                                                            className="delete-icon"
                                                            type="button"
                                                            onClick={() =>
                                                              handleDeleteContact1(
                                                                index
                                                              )
                                                            }
                                                            disabled={
                                                              contacts1.length ===
                                                              1
                                                            }
                                                          >
                                                            <i className="ti-trash  text-danger"></i>{" "}
                                                         
                                                          </button>
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      First Name
                                                      <span
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="First Name"
                                                      name="first_name"
                                                      id={`first_name-${index}`}
                                                      value={
                                                        contacts1.first_name
                                                      }
                                                      onChange={(e) =>
                                                        handleChange4(
                                                          index,
                                                          "first_name",
                                                          e.target.value
                                                        )
                                                      }
                                                      maxLength={50}
                                                    />
                                                    {contactsErrors[index]
                                                      .first_name && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]
                                                              .first_name
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      {" "}
                                                      Last Name
                                                      <span
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder=" Last Name"
                                                      name="last_name"
                                                      id={`last_name-${index}`}
                                                      value={
                                                        contacts1.last_name
                                                      }
                                                      onChange={(e) =>
                                                        handleChange4(
                                                          index,
                                                          "last_name",
                                                          e.target.value
                                                        )
                                                      }
                                                      maxLength={50}
                                                    />
                                                    {contactsErrors[index]
                                                      .last_name && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]
                                                              .last_name
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      Role
                                                      <span
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </span>
                                                    </label>

                                                    <select
                                                      className="form-select"
                                                      id={`role-${index}`}
                                                      value={contacts1.role}
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
                                                    {contactsErrors[index]
                                                      .role && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]
                                                              .role
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>

                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label classNameName="form-label">
                                                      Phone
                                                    </label>
                                                    <div className="row">
                                                      <div className="col-md-4 pe-0">
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
                                                          value={
                                                            contact.phone_code
                                                          }
                                                        >
                                                          {countryDataAll.data.map(
                                                            (data) => (
                                                              <option
                                                                key={data.code}
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
                                                      <div className="mb-3 col-md-8 ps-1">
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Phone Number"
                                                          name="phone"
                                                          id={`phone-${index}`}
                                                          value={
                                                            contacts1.phone
                                                          }
                                                          onChange={(e) =>
                                                            handleChange4(
                                                              index,
                                                              "phone",
                                                              e.target.value
                                                            )
                                                          }
                                                          maxLength={12}
                                                        />
                                                        {contactsErrors[index]
                                                          .phone && (
                                                            <div className="error-text">
                                                              {
                                                                contactsErrors[
                                                                  index
                                                                ].phone
                                                              }
                                                            </div>
                                                          )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label classNameName="form-label">
                                                      Alternate Phone Number
                                                    </label>
                                                    <div className="row">
                                                      <div className="col-md-4 pe-0">
                                                        <select
                                                          className="form-select"
                                                          onChange={(e) =>
                                                            handleChange4(
                                                              index,
                                                              "alternate_phone_code",
                                                              e.target.value
                                                            )
                                                          }
                                                          name="alternate_phone_code"
                                                          value={
                                                            contact.alternate_phone_code
                                                          }
                                                        >
                                                          {countryDataAll.data.map(
                                                            (data) => (
                                                              <option
                                                                key={data.code}
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
                                                      <div className="mb-3 col-md-8 ps-1">
                                                        <input
                                                          type="number"
                                                          className="form-control"
                                                          placeholder=" Alternate Phone"
                                                          name="alternate_phone"
                                                          id={`alternate_phone-${index}`}
                                                          value={
                                                            contacts1.alternate_phone
                                                          }
                                                          onChange={(e) =>
                                                            handleChange4(
                                                              index,
                                                              "alternate_phone",
                                                              e.target.value
                                                            )
                                                          }
                                                        />
                                                        {contactsErrors[index]
                                                          .alternate_phone && (
                                                            <div className="error-text">
                                                              {
                                                                contactsErrors[
                                                                  index
                                                                ].alternate_phone
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
                                                      <span
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      name="email"
                                                      id={`email-${index}`}
                                                      value={contacts1.email}
                                                      onChange={(e) =>
                                                        handleChange4(
                                                          index,
                                                          "email",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {contactsErrors[index]
                                                      .email && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]
                                                              .email
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      {" "}
                                                      Alternate Email
                                                      <span
                                                        style={{ color: "red" }}
                                                      >
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Enter Alternate Email"
                                                      name="alternate_email"
                                                      id={`alternate_email-${index}`}
                                                      value={
                                                        contacts1.alternate_email
                                                      }
                                                      onChange={(e) =>
                                                        handleChange4(
                                                          index,
                                                          "alternate_email",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {contactsErrors[index]
                                                      .alternate_email && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]
                                                              .alternate_email
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        <div className=" d-flex align-items-center justify-content-end">
                                          <div>
                                            <button
                                              className="btn btn-info text-white blue-btn"
                                              onClick={handleAddContact1}
                                            >
                                              {" "}
                                              <i className="fa fa-plus pe-1">
                                                {" "}
                                              </i>
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
                          ) : selectClientType == 4 ? (
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="card card_shadow "></div>
                                <div className="card">
                                  <div className="card-header card-header-light-blue">
                                    <h4 className="card-title mb-0 fs-16 ">
                                      Individual Details
                                    </h4>
                                  </div>
                                  <div className="card-body row">
                                    <div className="col-lg-4">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Trading Name
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </label>
                                        <input
                                          type="text"
                                          name="tradingName"
                                          id="tradingName"
                                          className="form-control"
                                          placeholder="Trading Name"
                                          onChange={(e) => handleChangeIndivisul(e)}
                                          value={
                                            getIndivisualDetails.tradingName
                                          }
                                        />
                                        {errors4["tradingName"] && (
                                          <div className="error-text">
                                            {errors4["tradingName"]}
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
                                          id="first_name"

                                          value={
                                            getIndivisualDetails.first_name
                                          }
                                          onChange={(e) => handleChangeIndivisul(e)}
                                        />
                                        {errors4["first_name"] && (
                                          <div className="error-text">
                                            {errors4["first_name"]}
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
                                          id="last_name"
                                          value={getIndivisualDetails.last_name}
                                          onChange={(e) => handleChangeIndivisul(e)}
                                        />
                                        {errors4["last_name"] && (
                                          <div className="error-text">
                                            {errors4["last_name"]}
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
                                          <div className="col-md-4 pe-0">
                                            <select
                                              className="form-select"
                                              onChange={(e) => handleChangeIndivisul(e)}
                                              name="phone_code"
                                              id="phone_code"
                                              value={
                                                getIndivisualDetails.phone_code
                                              }
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
                                              id="phone"
                                              value={getIndivisualDetails.phone}
                                              onChange={(e) => handleChangeIndivisul(e)}
                                              maxLength={12}
                                              minLength={9}
                                            />
                                            {errors4["phone"] && (
                                              <div className="error-text">
                                                {errors4["phone"]}
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
                                          placeholder="Enter Email ID"
                                          name="email"
                                          id="email"
                                          value={getIndivisualDetails.email}
                                          onChange={(e) => handleChangeIndivisul(e)}
                                        />
                                        {errors4["email"] && (
                                          <div className="error-text">
                                            {errors4["email"]}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="col-lg-6">
                                      <div className="mb-3">
                                        <label className="form-label">
                                          Residential Address
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Residential Address"
                                          name="residentialAddress"
                                          id="residentialAddress"
                                          value={
                                            getIndivisualDetails.residentialAddress
                                          }
                                          onChange={(e) => handleChangeIndivisul(e)}
                                        />
                                        {errors4["residentialAddress"] && (
                                          <div className="error-text">
                                            {errors4["residentialAddress"]}
                                          </div>
                                        )}
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
                      </div>
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          <i className=" fa fa-times pe-1"></i>
                          Cancel
                        </button>
                        <button
                          className="btn btn-info text-white blue-btn"
                          onClick={handleSubmit}
                        >
                          <i className="fa fa-plus pe-1"></i>Create Client
                        </button>
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
  );
};

export default CreateClient;
