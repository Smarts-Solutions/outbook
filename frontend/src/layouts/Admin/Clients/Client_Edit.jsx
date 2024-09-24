import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetClientIndustry, Edit_Client, ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { GetAllCompany } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { validate, ScrollToViewFirstErrorContactForm } from '../../../Utils/Comman_function'
import { PersonRole, Country } from "../../../ReduxStore/Slice/Settings/settingSlice";

const ClientEdit = () => {
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
  const [partnershipContacts, setPartnershipContacts] = useState([]);
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const [errors3, setErrors3] = useState({});
  const [errors4, setErrors4] = useState({});
  const [companyContactsErrors, setCompanyContactsErrors] = useState([
    {
      first_name: false,
      last_name: false,
      customer_contact_person_role_id: false,
      phoneCode: false,
      phone: false,
      email: false,
    },
  ]);
  const [PartnershiContactsErrors, setPartnershipContactsErrors] = useState([
    {
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      alternate_phone: "",
      email: "",
      alternate_email: "",
    },
    {
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      alternate_phone: "",
      email: "",
      alternate_email: "",
    },
  ]);
  const [personRoleDataAll, setPersonRoleDataAll] = useState({
    loading: true,
    data: [],
  });
  const [countryDataAll, setCountryDataAll] = useState({
    loading: true,
    data: [],
  });
  const [getClientDetails, setClientDetails] = useState({
    loading: true,
    data: [],
  });
  const [getSoleTraderDetails, setSoleTraderDetails] = useState({
    IndustryType: "",
    TradingName: "",
    TradingAddress: "",
    VATRegistered: "",
    VATNumber: "",
    website: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "",
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
    VATRegistered: "",
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
    VATRegistered: "",
    VATNumber: "",
    Website: "",
  });
  const [CompanyContacts, setCompanyContacts] = useState([
    {
      authorised_signatory_status: 0,
      contact_id: "",
      first_name: "",
      last_name: "",
      customer_contact_person_role_id: "",
      phone: "",
      phone_code: "",
      email: "",
    },
  ]);
  const [getIndivisualDetails, setIndivisualDetails] = useState({
    TradingName: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "+44",
  });

  useEffect(() => {
    setSelectClientType(
      location.state.row.client_type_name == "SoleTrader" ? 1
        : location.state.row.client_type_name == "Company" ? 2
          : location.state.row.client_type_name == "Partnership" ? 3
            : 4
    );
    CountryData();
    CustomerPersonRoleData();
    GetClientDetails();
    getClientIndustry();
  }, []);

  useEffect(() => {
    Get_Company();
  }, [searchItem]);

  useEffect(() => {
    if (location.state.row.client_type_name == "SoleTrader") {
      setSoleTraderDetails((prevState) => ({
        ...prevState,
        IndustryType:
          !getClientDetails.loading &&
          getClientDetails.data.client.client_industry_id,
        TradingName:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_name,
        TradingAddress:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_address,
        VATRegistered:
          !getClientDetails.loading &&
          getClientDetails.data.client.vat_registered,
        VATNumber:
          !getClientDetails.loading && getClientDetails.data.client.vat_number,
        website:
          !getClientDetails.loading && getClientDetails.data.client.website,
        first_name:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].first_name,
        last_name:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].last_name,
        phone:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].phone,
        email:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].email,
        residentialAddress:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].residential_address,
        phone_code:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].phone_code,
      }));
    }
    if (location.state.row.client_type_name == "Company") {
      setCompanyDetails((prevState) => ({
        ...prevState,
        CompanyName:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.company_name,
        EntityType:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.entity_type,
        CompanyStatus:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.company_status,
        CompanyNumber:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.company_number,
        RegisteredOfficeAddress:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.registered_office_address,
        IncorporationDate:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.incorporation_date,
        IncorporationIn:
          !getClientDetails.loading &&
          getClientDetails.data.company_details.incorporation_in,

        VATRegistered:
          !getClientDetails.loading &&
          getClientDetails.data.client.vat_registered,
        VATNumber:
          !getClientDetails.loading && getClientDetails.data.client.vat_number,
        Website:
          !getClientDetails.loading && getClientDetails.data.client.website,
        ClientIndustry:
          !getClientDetails.loading &&
          getClientDetails.data.client.client_industry_id,
        TradingName:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_name,
        TradingAddress:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_address,
      }));
      setCompanyContacts(
        !getClientDetails.loading && getClientDetails.data.contact_details
      );
    }
    if (location.state.row.client_type_name == "Partnership") {
      setPartnershipDetails((prevState) => ({
        ...prevState,
        ClientIndustry:
          !getClientDetails.loading &&
          getClientDetails.data.client.client_industry_id,
        TradingName:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_name,
        TradingAddress:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_address,
        VATRegistered:
          !getClientDetails.loading &&
          getClientDetails.data.client.vat_registered,
        VATNumber:
          !getClientDetails.loading && getClientDetails.data.client.vat_number,
        Website:
          !getClientDetails.loading && getClientDetails.data.client.website,
      }));
      setPartnershipContacts(
        getClientDetails.data && getClientDetails.data.contact_details
      );
    }
    if (location.state.row.client_type_name == "Individual") {
      setIndivisualDetails((prevState) => ({
        ...prevState,

        TradingName:
          !getClientDetails.loading &&
          getClientDetails.data.client.trading_name,

        first_name:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].first_name,
        last_name:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].last_name,
        phone:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].phone,
        email:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].email,
        residentialAddress:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].residential_address,
        phone_code:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].phone_code,
      }));
    }
  }, [getClientDetails]);

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
      }));
    }
  }, [getSearchDetails]);

  useEffect(() => {
    FilterSearchDetails();
  }, [searchItem]);

  const handleAddPartnershipContact = () => {
    setPartnershipContacts([
      ...partnershipContacts,
      {
        authorised_signatory_status: 0,
        contact_id: "",
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        phone_code: "+44",
        alternate_phone: "",
        alternate_phone_code: "+44",
        email: "",
        alternate_email: "",
      },
    ]);
    setPartnershipContactsErrors([
      ...PartnershiContactsErrors,
      {
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        alternate_phone: "",
        email: "",
        alternate_email: "",
      },
    ]);
  };

  const handleDeletePartnershipContact = (index) => {
    const newContacts = partnershipContacts.filter((_, i) => i !== index);
    const newErrors = PartnershiContactsErrors.filter((_, i) => i !== index);
    setPartnershipContacts(newContacts);
    setPartnershipContactsErrors(newErrors);
  };

  const handleAddCompanyContact = () => {
    setCompanyContacts([
      ...CompanyContacts,
      {
        authorised_signatory_status: 0,
        contact_id: "",
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        phone_code: "+44",
        email: "",
      },
    ]);
    setCompanyContactsErrors([
      ...companyContactsErrors,
      {
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
        phone: "",
        email: "",
      },
    ]);
  };

  const handleDeleteCompanyContact = (index) => {
    const newContacts = CompanyContacts.filter((_, i) => i !== index);
    const newErrors = companyContactsErrors.filter((_, i) => i !== index);
    setCompanyContacts(newContacts);
    setCompanyContactsErrors(newErrors);
  };

  const GetClientDetails = async () => {
    const req = { action: "getByid", client_id: location.state.row.id };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientDetails({
            loading: false,
            data: response.data,
          });
        } else {
          setClientDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
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

  const ClientTypeArr = [getSoleTraderDetails, getCompanyDetails, getPartnershipDetails, getIndivisualDetails];
  const errorsArr = [errors1, errors2, errors3, errors4];
  const setErrorsArr = [setErrors1, setErrors2, setErrors3, setErrors4];


  const handleInputsChange = (e, type) => {
    const { name, value } = e.target;
    if (name === "VATNumber" || name === "phone") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }

    validate(name, value, errorsArr[type - 1], setErrorsArr[type - 1]);

    if (type == 1) {
      setSoleTraderDetails({ ...getSoleTraderDetails, [name]: value });
    }
    if (type == 2) {
      setCompanyDetails({ ...getCompanyDetails, [name]: value });
    }
    if (type == 3) {
      setPartnershipDetails({ ...getPartnershipDetails, [name]: value });
    }
    if (type == 4) {
      setIndivisualDetails({ ...getIndivisualDetails, [name]: value });
    }
  };

  const validateAllFields = (type) => {
    let isValid = true;
    for (const key in ClientTypeArr[type - 1]) {
      if (!validate(key, ClientTypeArr[type - 1][key], errorsArr[type - 1], setErrorsArr[type - 1])) {
        isValid = false;
      }
    }
    return isValid;
  };


  const ContactsArr = [CompanyContacts, partnershipContacts,];
  const ErrorsArr = [companyContactsErrors, PartnershiContactsErrors,]
  const setContactErrorsArr = [setCompanyContactsErrors, setPartnershipContactsErrors]

  const handleContactInputChange = (index, field, value, type) => {
    let newValue = value;
    if (field == "authorised_signatory_status") {
      newValue = value ? 1 : 0;
    }

    const newContacts = ContactsArr[type - 1].map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );

    if (type == 1) setCompanyContacts(newContacts);
    if (type == 2) setPartnershipContacts(newContacts);

    validateField(index, field, value, type);
  };

  const validateField = (index, field, value, Type) => {
    const errors = ErrorsArr[Type - 1];
    const newErrors = [...errors];
    switch (field) {
      case "first_name":
      case "last_name":
        if (!value.trim()) {
          newErrors[index] = {
            ...newErrors[index],
            [field]: "This field is required",
          };
        } else {
          delete newErrors[index][field];
        }
        break;
      case "email":
      case "alternate_email":
        if (!value.trim()) {
          newErrors[index] = { ...newErrors[index], [field]: "" };
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors[index] = {
            ...newErrors[index],
            [field]: "Invalid email address",
          };
        } else {
          delete newErrors[index][field];
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
      case "customer_contact_person_role_id":
        if (!value) {
          newErrors[index] = { ...newErrors[index], [field]: "" };
        } else {
          delete newErrors[index][field];
        }
        break;
      default:
        break;
    }

    setContactErrorsArr[Type - 1](newErrors);
  };

  // common submit function for all type of customer
  const EditClientFun = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(Edit_Client(req))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire({
            icon: "success",
            title: "Client Updated Successfully",
            timerProgressBar: true,
            timer: 1500,
          });
          setTimeout(() => {
            window.history.back();
            // navigate("/admin/Clientlist", {
            //   state: { id: location.state.id },
            // });
          }, 1500);
        } else {
          Swal.fire({
            icon: "error",
            title: response.message,
            timerProgressBar: true,
            timer: 1500,
          });
        }
      })
  };

  const handleUpdate = async () => {
    if (selectClientType == 1 && validateAllFields(1)) {
      const req = {
        client_type: "1",
        client_id: location.state.row.id,
        customer_id: location.state.id,
        client_industry_id: getSoleTraderDetails.IndustryType,
        trading_name: getSoleTraderDetails.TradingName,
        trading_address: getSoleTraderDetails.TradingAddress,
        vat_registered: getSoleTraderDetails.VATRegistered,
        vat_number: getSoleTraderDetails.VATNumber,
        website: getSoleTraderDetails.website,
        first_name: getSoleTraderDetails.first_name,
        last_name: getSoleTraderDetails.last_name,
        phone: getSoleTraderDetails.phone,
        email: getSoleTraderDetails.email,
        residential_address: getSoleTraderDetails.residentialAddress,
        client_code: location.state.row.id,
        phone_code: getSoleTraderDetails.phone_code,
      };
      await EditClientFun(req);
    }
    if (selectClientType == 2 && validateAllFields(2)) {
      let formIsValid = true;
      const newErrors = CompanyContacts.map((contact, index) => {
        const error = {
          first_name: contact.first_name ? "" : "First Name is required",
          last_name: contact.last_name ? "" : "Last Name is required",
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
          error.customer_contact_person_role_id ||
          error.phone ||
          error.email
        ) {
          formIsValid = false;
        }
        return error;
      });
      setCompanyContactsErrors(newErrors);
      if (formIsValid) {
        const req = {
          client_type: "2",
          client_id: location.state.row.id,
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
          contactDetails: CompanyContacts,
        };
        await EditClientFun(req);
      }
      else {
        ScrollToViewFirstErrorContactForm(companyContactsErrors);
      }


    }
    if (selectClientType == 3 && validateAllFields(3)) {
      let formIsValid = true;
      const newErrors = partnershipContacts.map((contact, index) => {
        const error = {
          first_name: contact.first_name ? "" : "First Name is required",
          last_name: contact.last_name ? "" : "Last Name is required",
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
                : "Alternate Phone Number must be between 9 to 12 digits",
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
          error.customer_contact_person_role_id ||
          error.phone ||
          error.email
        ) {
          formIsValid = false;
        }
        return error;
      });
      setPartnershipContactsErrors(newErrors);
      if (formIsValid) {
        const req = {
          client_type: "3",
          client_id: location.state.row.id,
          customer_id: location.state.id,
          client_industry_id: getPartnershipDetails.ClientIndustry,
          trading_name: getPartnershipDetails.TradingName,
          trading_address: getPartnershipDetails.TradingAddress,
          vat_registered: getPartnershipDetails.VATRegistered,
          vat_number: getPartnershipDetails.VATNumber,
          website: getPartnershipDetails.Website,
          contactDetails: partnershipContacts,
        };
        await EditClientFun(req);
      }
      else {
        ScrollToViewFirstErrorContactForm(PartnershiContactsErrors);
      }
    }
    if (selectClientType == 4 && validateAllFields(4)) {
      const req = {
        client_type: "4",
        client_id: location.state.row.id,
        customer_id: location.state.id,

        trading_name: getIndivisualDetails.TradingName,

        first_name: getIndivisualDetails.first_name,
        last_name: getIndivisualDetails.last_name,
        phone: getIndivisualDetails.phone,
        email: getIndivisualDetails.email,
        residential_address: getIndivisualDetails.residentialAddress,
        client_code: location.state.row.id,
        phone_code: getIndivisualDetails.phone_code,
      };
      await EditClientFun(req);

    }
  };


  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };


  const HandleCancel = () => { window.history.back()};

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header align-items-center step-header-blue d-flex ">
                <button
                  type="button"
                  className="btn p-0"
                  onClick={HandleCancel}
                >
                  <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
                </button>
                <h4 className="card-title  mb-0">Edit Client</h4>
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
                                      Client Type
                                      <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select
                                      className="form-select mb-3"
                                      value={selectClientType}
                                      disabled={true}
                                      onChange={(e) =>
                                        setSelectClientType(e.target.value)
                                      }
                                    >
                                      <option value={1}>Sole Trader</option>
                                      <option value={2}>Company</option>
                                      <option value={3}>Partnership</option>
                                      <option value={4}>Individual</option>
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
                                    <h4 className="card-title fs-16 mb-0 fs-16">
                                      Sole Trader
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
                                            className="form-select mb-3"
                                            aria-label="Default select example"
                                            name="IndustryType"
                                            id="IndustryType"
                                            value={
                                              getSoleTraderDetails.IndustryType
                                            }
                                            onChange={(e) => handleInputsChange(e, 1)}
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
                                            name="TradingName"
                                            id="TradingName"
                                            className="form-control"
                                            placeholder="Trading Name"
                                            onChange={(e) => handleInputsChange(e, 1)}
                                            value={
                                              getSoleTraderDetails.TradingName
                                            }
                                            maxLength={100}
                                          />
                                          {errors1["TradingName"] && (
                                            <div className="error-text">
                                              {errors1["TradingName"]}
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
                                            className="form-control"
                                            placeholder="Trading Address"
                                            name="TradingAddress"
                                            id="TradingAddress"
                                            onChange={(e) => handleInputsChange(e, 1)}
                                            value={
                                              getSoleTraderDetails.TradingAddress
                                            }
                                            maxLength={200}
                                          />
                                          {errors1["TradingAddress"] && (
                                            <div className="error-text">
                                              {errors1["TradingAddress"]}
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
                                            className="form-select mb-3"
                                            aria-label="Default select example"
                                            name="VATRegistered"
                                            id="VATRegistered"
                                            value={
                                              getSoleTraderDetails.VATRegistered
                                            }
                                            onChange={(e) => handleInputsChange(e, 1)}
                                          >
                                            <option selected="">
                                              Please Select VAT Registered
                                            </option>
                                            <option value={1}>Yes</option>
                                            <option value={0}>No</option>
                                          </select>
                                          {errors1["VATRegistered"] && (
                                            <div className="error-text">
                                              {errors1["VATRegistered"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            VAT Number
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="VAT Number"
                                            name="VATNumber"
                                            id="VATNumber"
                                            value={
                                              getSoleTraderDetails.VATNumber
                                            }
                                            onChange={(e) => handleInputsChange(e, 1)}
                                            maxLength={9}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-lg-4">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Website
                                            <span style={{ color: "red" }}>
                                              *
                                            </span>
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="URL"
                                            name="website"
                                            id="website"
                                            value={getSoleTraderDetails.website}
                                            onChange={(e) => handleInputsChange(e, 1)}
                                            maxLength={200}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="card ">
                                  <div className="card-header card-header-light-blue ">
                                    <h4 className="card-title fs-16 mb-0">
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
                                          onChange={(e) => handleInputsChange(e, 1)}
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
                                          onChange={(e) => handleInputsChange(e, 1)}
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
                                        <label className="form-label">
                                          Phone
                                        </label>
                                        <div className="row">
                                          <div className="col-md-4 pe-0">
                                            <select
                                              className="form-select"
                                              onChange={(e) => handleInputsChange(e, 1)}
                                              name="phone_code"
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
                                              onChange={(e) => handleInputsChange(e, 1)}
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
                                          onChange={(e) => handleInputsChange(e, 1)}
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
                                          onChange={(e) => handleInputsChange(e, 1)}
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
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
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
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                              placeholder="LTD"
                                              name="EntityType"
                                              id="EntityType"
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                              Company Status
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>{" "}
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Active"
                                              name="CompanyStatus"
                                              id="CompanyStatus"
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                              Company Number
                                              <span style={{ color: "red" }}>
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              className="form-control input_bg"
                                              placeholder="Company Number"
                                              name="CompanyNumber"
                                              id="CompanyNumber"
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                              placeholder="07-01-2023"
                                              name="IncorporationDate"
                                              id="IncorporationDate"
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                        <div className="col-lg-6">
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
                                              placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                              name="RegisteredOfficeAddress"
                                              id="RegisteredOfficeAddress"
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              value={
                                                getCompanyDetails.RegisteredOfficeAddress
                                              }
                                              // disabled
                                            />
                                            {errors2[
                                              "RegisteredOfficeAddress"
                                            ] && (
                                                <div style={{ color: "red" }}>
                                                  {
                                                    errors2[
                                                    "RegisteredOfficeAddress"
                                                    ]
                                                  }
                                                </div>
                                              )}
                                          </div>
                                        </div>

                                        <div className="col-lg-6">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              {" "}
                                              Incorporation in{" "}
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
                                              onChange={(e) => handleInputsChange(e, 2)}
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
                                              className="form-select mb-3"
                                              name="VATRegistered"
                                              id="VATRegistered"
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              value={
                                                getCompanyDetails.VATRegistered
                                              }
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
                                                onChange={(e) => handleInputsChange(e, 2)}
                                                value={
                                                  getCompanyDetails.VATNumber
                                                }
                                                maxLength={9}
                                              />
                                              {errors2["VATNumber"] && (
                                                <div style={{ color: "red" }}>
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
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              value={getCompanyDetails.Website}
                                              maxLength={200}
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
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                      Trading Details
                                    </h4>
                                  </div>
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-lg-6">
                                        <div className="mb-3">
                                          <label className="form-label">
                                            Client Industry
                                          </label>
                                          <select
                                            className="form-select mb-3"
                                            name="ClientIndustry"
                                            id="ClientIndustry"
                                            onChange={(e) => handleInputsChange(e, 2)}
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
                                      <div className="col-lg-6">
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
                                            onChange={(e) => handleInputsChange(e, 2)}
                                            value={
                                              getCompanyDetails.TradingName
                                            }
                                            maxLength={100}
                                          />
                                          {errors2["TradingName"] && (
                                            <div className="error-text">
                                              {errors2["TradingName"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="col-lg-6">
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
                                            onChange={(e) => handleInputsChange(e, 2)}
                                            value={
                                              getCompanyDetails.TradingAddress
                                            }
                                            maxLength={200}
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
                                      <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                        Officer Details
                                      </h4>
                                    </div>
                                    <div className="row">
                                      <div className="card-body">
                                        <div className="row">
                                          {CompanyContacts.length > 0 &&
                                            CompanyContacts.map((contact, index) => (
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
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                              handleDeleteCompanyContact(
                                                                index
                                                              )
                                                            }
                                                            disabled={
                                                              CompanyContacts.length ===
                                                              1
                                                            }
                                                          >
                                                            <i className="ti-trash  pe-1"></i>{" "}
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
                                                          placeholder="First Name"
                                                          id={`first_name-${index}`}
                                                          value={
                                                            contact.first_name
                                                          }
                                                          onChange={(e) =>
                                                            handleContactInputChange(
                                                              index,
                                                              "first_name",
                                                              e.target.value,
                                                              1
                                                            )
                                                          }
                                                          maxLength={50}
                                                        />
                                                        {companyContactsErrors[index] &&
                                                          companyContactsErrors[index]
                                                            .first_name && (
                                                            <div className="error-text">
                                                              {
                                                                companyContactsErrors[index]
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
                                                            handleContactInputChange(
                                                              index,
                                                              "last_name",
                                                              e.target.value,
                                                              1
                                                            )
                                                          }
                                                          maxLength={50}
                                                        />
                                                        {companyContactsErrors[index] &&
                                                          companyContactsErrors[index]
                                                            .last_name && (
                                                            <div className="error-text">
                                                              {
                                                                companyContactsErrors[index]
                                                                  .last_name
                                                              }
                                                            </div>
                                                          )}
                                                      </div>
                                                    </div>
                                                    <div className="col-lg-4">
                                                      <div className="mb-3">
                                                        <label
                                                          htmlFor={`customer_contact_person_role_id-${index}`}
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
                                                          id={`customer_contact_person_role_id-${index}`}
                                                          value={
                                                            contact.customer_contact_person_role_id
                                                          }
                                                          onChange={(e) =>
                                                            handleContactInputChange(
                                                              index,
                                                              "customer_contact_person_role_id",
                                                              e.target.value,
                                                              1
                                                            )
                                                          }
                                                        >
                                                          <option value="">
                                                            Select Role
                                                          </option>
                                                          {personRoleDataAll &&
                                                            personRoleDataAll.data.map(
                                                              (item, i) => (
                                                                <>
                                                                  <option
                                                                    value={
                                                                      item.id
                                                                    }
                                                                    key={i}
                                                                  >
                                                                    {item.name}
                                                                  </option>
                                                                </>
                                                              )
                                                            )}
                                                        </select>
                                                        {companyContactsErrors[index] &&
                                                          companyContactsErrors[index]
                                                            .customer_contact_person_role_id && (
                                                            <div className="error-text">
                                                              {
                                                                companyContactsErrors[index]
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
                                                          <div className="col-md-4 pe-0">
                                                            <select
                                                              className="form-select"
                                                              onChange={(e) =>
                                                                handleContactInputChange(
                                                                  index,
                                                                  "phone_code",
                                                                  e.target.value,
                                                                  1
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
                                                                handleContactInputChange(
                                                                  index,
                                                                  "phone",
                                                                  e.target.value,
                                                                  1
                                                                )
                                                              }
                                                              maxLength={12}
                                                              minLength={9}
                                                            />
                                                            {companyContactsErrors[index] &&
                                                              companyContactsErrors[index]
                                                                .phone && (
                                                                <div
                                                                  style={{
                                                                    color:
                                                                      "red",
                                                                  }}
                                                                >
                                                                  {
                                                                    companyContactsErrors[
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
                                                            handleContactInputChange(
                                                              index,
                                                              "email",
                                                              e.target.value,
                                                              1
                                                            )
                                                          }
                                                        />
                                                        {companyContactsErrors[index] &&
                                                          companyContactsErrors[index]
                                                            .email && (
                                                            <div className="error-text">
                                                              {
                                                                companyContactsErrors[index]
                                                                  .email
                                                              }
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
                                              onClick={handleAddCompanyContact}
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
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
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
                                            className="form-select mb-3"
                                            name="ClientIndustry"
                                            id="ClientIndustry"
                                            value={
                                              getPartnershipDetails.ClientIndustry
                                            }
                                            onChange={(e) => handleInputsChange(e, 3)}
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
                                            <div className="error-text">
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
                                            onChange={(e) => handleInputsChange(e, 3)}
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
                                            onChange={(e) => handleInputsChange(e, 3)}
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
                                              className="form-select mb-3"
                                              name="VATRegistered"
                                              id="VATRegistered"
                                              value={
                                                getPartnershipDetails.VATRegistered
                                              }
                                              onChange={(e) => handleInputsChange(e, 3)}
                                            >
                                              <option value="">
                                                Select VAT Registered
                                              </option>
                                              <option value={1}>Yes</option>
                                              <option value={0}>No</option>
                                            </select>
                                            {errors3["VATRegistered"] && (
                                              <div style={{ color: "red" }}>
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
                                              value={
                                                getPartnershipDetails.VATNumber
                                              }
                                              onChange={(e) => handleInputsChange(e, 3)}
                                              maxLength={9}
                                            />
                                            {errors3["VATNumber"] && (
                                              <div style={{ color: "red" }}>
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
                                            onChange={(e) => handleInputsChange(e, 3)}
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
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                        Contact Details
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        {partnershipContacts &&
                                          partnershipContacts.map((contact, index) => (
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
                                                        <input
                                                          type="checkbox"
                                                          className="form-check-input"
                                                          id={`customSwitchsizemd-${index}`}
                                                          checked={
                                                            contact.authorised_signatory_status
                                                          }
                                                          onChange={(e) =>
                                                            handleContactInputChange(
                                                              index,
                                                              "authorised_signatory_status",
                                                              e.target.checked,
                                                              2
                                                            )
                                                          }
                                                          defaultChecked={
                                                            index === 0 ||
                                                            index === 1
                                                          }
                                                          disabled={
                                                            partnershipContacts.length ===
                                                              2
                                                              ? index === 0 ||
                                                              index === 1
                                                              : false
                                                          }
                                                        />
                                                        <label className="form-check-label">
                                                          Authorised Signatory
                                                        </label>
                                                      </div>
                                                      {index !== 0 &&
                                                        index !== 1 && (
                                                          <div>
                                                            <button
                                                              className="btn btn-danger"
                                                              type="button"
                                                              onClick={() =>
                                                                handleDeletePartnershipContact(
                                                                  index
                                                                )
                                                              }
                                                              disabled={
                                                                partnershipContacts.length ===
                                                                1
                                                              }
                                                            >
                                                              <i className="ti-trash  pe-1"></i>{" "}
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
                                                        placeholder="First Name"
                                                        name="first_name"
                                                        id={`first_name-${index}`}
                                                        value={
                                                          contact.first_name
                                                        }
                                                        onChange={(e) =>
                                                          handleContactInputChange(
                                                            index,
                                                            "first_name",
                                                            e.target.value,
                                                            2
                                                          )
                                                        }
                                                        maxLength={50}
                                                      />
                                                      {PartnershiContactsErrors[index]
                                                        ?.first_name && (
                                                          <div
                                                            className="error-text"
                                                          >
                                                            {
                                                              PartnershiContactsErrors[
                                                                index
                                                              ].first_name
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
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
                                                        name="last_name"
                                                        id={`last_name-${index}`}

                                                        value={
                                                          contact.last_name
                                                        }
                                                        onChange={(e) =>
                                                          handleContactInputChange(
                                                            index,
                                                            "last_name",
                                                            e.target.value,
                                                            2
                                                          )
                                                        }
                                                        maxLength={50}
                                                      />
                                                      {PartnershiContactsErrors[index]
                                                        ?.last_name && (
                                                          <div
                                                            className="error-text"
                                                          >
                                                            {
                                                              PartnershiContactsErrors[
                                                                index
                                                              ].last_name
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
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
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
                                                          handleContactInputChange(
                                                            index,
                                                            "customer_contact_person_role_id",
                                                            e.target.value,
                                                            2
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
                                                      {PartnershiContactsErrors[index]
                                                        ?.customer_contact_person_role_id && (
                                                          <div
                                                            className="error-text"
                                                          >
                                                            {
                                                              PartnershiContactsErrors[
                                                                index
                                                              ]
                                                                .customer_contact_person_role_id
                                                            }
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
                                                        <div className="col-md-4">
                                                          <select
                                                            className="form-select"
                                                            onChange={(e) =>
                                                              handleContactInputChange(
                                                                index,
                                                                "phone_code",
                                                                e.target.value,
                                                                2
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
                                                        <div className="mb-3 col-md-8 ps-1">
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Phone"
                                                            name="phone"
                                                            id={`phone-${index}`}
                                                            value={
                                                              contact.phone
                                                            }
                                                            onChange={(e) =>
                                                              handleContactInputChange(
                                                                index,
                                                                "phone",
                                                                e.target.value,
                                                                2
                                                              )
                                                            }
                                                            maxLength={12}
                                                          />
                                                          {PartnershiContactsErrors[
                                                            index
                                                          ] &&
                                                            PartnershiContactsErrors[
                                                              index
                                                            ].phone && (
                                                              <div className="error-text">
                                                                {
                                                                  PartnershiContactsErrors[
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
                                                      <label className="form-label">
                                                        Alternate Phone
                                                      </label>
                                                      <div className="row">
                                                        <div className="col-md-4 pe-0">
                                                          <select
                                                            className="form-select"
                                                            onChange={(e) =>
                                                              handleContactInputChange(
                                                                index,
                                                                "alternate_phone_code",
                                                                e.target.value,
                                                                2
                                                              )
                                                            }
                                                            name="alternate_phone_code"
                                                            id={`alternate_phone_code-${index}`}

                                                            value={
                                                              contact.alternate_phone_code
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
                                                            placeholder="Alternate Phone"
                                                            name="alternate_phone"
                                                            id={`alternate_phone-${index}`}
                                                            value={
                                                              contact.alternate_phone
                                                            }
                                                            onChange={(e) =>
                                                              handleContactInputChange(
                                                                index,
                                                                "alternate_phone",
                                                                e.target.value,
                                                                2
                                                              )
                                                            }
                                                            maxLength={12}
                                                          />
                                                          {PartnershiContactsErrors[
                                                            index
                                                          ] &&
                                                            PartnershiContactsErrors[
                                                              index
                                                            ]
                                                              .alternate_phone && (
                                                              <div className="error-text">
                                                                {
                                                                  PartnershiContactsErrors[
                                                                    index
                                                                  ]
                                                                    .alternate_phone
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
                                                        placeholder="Enter Email"
                                                        name="email"
                                                        id={`email-${index}`}
                                                        value={contact.email}
                                                        onChange={(e) =>
                                                          handleContactInputChange(
                                                            index,
                                                            "email",
                                                            e.target.value,
                                                            2
                                                          )
                                                        }
                                                      />
                                                      {PartnershiContactsErrors[index]
                                                        ?.email && (
                                                          <div className="error-text" >
                                                            {
                                                              PartnershiContactsErrors[
                                                                index
                                                              ].email
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Alternate Email
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
                                                        placeholder="Enter Alternate Email"
                                                        name="alternate_email"
                                                        id={`alternate_email-${index}`}
                                                        value={
                                                          contact.alternate_email
                                                        }
                                                        onChange={(e) =>
                                                          handleContactInputChange(
                                                            index,
                                                            "alternate_email",
                                                            e.target.value,
                                                            2
                                                          )
                                                        }
                                                      />
                                                      {PartnershiContactsErrors[index]
                                                        ?.alternate_email && (
                                                          <div className="error-text">
                                                            {
                                                              PartnershiContactsErrors[
                                                                index
                                                              ].alternate_email
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}

                                        <div className="justify-content-end d-flex align-items-center">
                                          <div>
                                            <button
                                              className="btn btn-info text-white blue-btn"
                                              onClick={handleAddPartnershipContact}
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
                          ) : selectClientType == 4 ? (
                            getIndivisualDetails && (
                              <div className="row">
                                <div className="col-lg-12">
                                  <div className="card ">
                                    <div className="card-header card-header-light-blue ">
                                      <h4 className="card-title fs-16 mb-0">
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
                                            name="TradingName"
                                            id="TradingName"
                                            className="form-control"
                                            placeholder="Trading Name"
                                            onChange={(e) => handleInputsChange(e, 4)}
                                            value={
                                              getIndivisualDetails.TradingName
                                            }
                                            maxLength={100}
                                          />
                                          {errors4["TradingName"] && (
                                            <div className="error-text">
                                              {errors4["TradingName"]}
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
                                            onChange={(e) => handleInputsChange(e, 4)}
                                            maxLength={50}
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
                                            value={
                                              getIndivisualDetails.last_name
                                            }
                                            onChange={(e) => handleInputsChange(e, 4)}
                                            maxLength={50}
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
                                                onChange={(e) => handleInputsChange(e, 4)}
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
                                                value={
                                                  getIndivisualDetails.phone
                                                }
                                                onChange={(e) => handleInputsChange(e, 4)}
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
                                            onChange={(e) => handleInputsChange(e, 4)}
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
                                            onChange={(e) => handleInputsChange(e, 4)}
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
                            )
                          ) : (
                            ""
                          )}
                        </section>
                      </div>
                      <div className="hstack gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={HandleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-info text-white blue-btn"
                          onClick={handleUpdate}
                        >
                          Update Client
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

export default ClientEdit;
