import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetClientIndustry, Add_Client, } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { GetAllCompany, GetOfficerDetails } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Email_regex } from "../../../Utils/Common_regex";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PersonRole, Country, IncorporationApi } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { ScrollToViewFirstError, ScrollToViewFirstErrorContactForm, convertDate } from '../../../Utils/Comman_function'

const CreateClient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [clientIndustry, setClientIndustry] = useState([]);
  const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
  const [incorporationDataAll, setIncorporationDataAll] = useState([]);
  const [selectClientType, setSelectClientType] = useState(1);
  const [showDropdown, setShowDropdown] = useState(true);
  const [getSearchDetails, setSearchDetails] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [errors1, setErrors1] = useState({});
  const [errors2, setErrors2] = useState({});
  const [errors3, setErrors3] = useState({});
  const [errors4, setErrors4] = useState({});
  const [errors5, setErrors5] = useState({});
  const [errors6, setErrors6] = useState({});
  const [errors7, setErrors7] = useState({});



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
    notes: "",
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
    notes: "",
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
    notes: "",
  });

  const [getCharityIncorporatedOrganisation, setCharityIncorporatedOrganisation] = useState({
    charity_name: "",
    TradingName: "",
    charity_commission_number: "",
    principal_office_address: "",
    service_address: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
    notes: "",
  });

  const [getTrust, setTrust] = useState({
    TrustName: "",
    TrustAddress: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
    notes: "",
  });

  const [getAssociationDetails, setAssociationDetails] = useState({
    AssociationName: "",
    AssociationAddress: "",
    VATRegistered: "0",
    VATNumber: "",
    Website: "",
    notes: "",
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

  const [errorMemberDetails, setErrorMemberDetails] = useState([
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

  const [errorMemberTrustDetails, setErrorMemberTrustDetails] = useState([
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

  const [errorTrustTrusteeDetails, setErrorTrustTrusteeDetails] = useState([
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

  const [errorMemberDetailsUnincorporated, setErrorMemberDetailsUnincorporated] = useState([
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

  const [errorTrusteeDetails, setErrorTrusteeDetails] = useState([
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

  const [contactsMembers, setContactsMembers] = useState([
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

  const [contactsMembersUnincorporated, setContactsMembersUnincorporated] = useState([
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

  const [contactsMembersTrust, setContactsMembersTrust] = useState([
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

  const [contactsTrustTrustee, setContactsTrustTrustee] = useState([
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


  const [contactsTrustee, setContactsTrustee] = useState([
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
    // {
    //   authorised_signatory_status: true,
    //   first_name: "",
    //   last_name: "",
    //   role: "",
    //   phone: "",
    //   phone_code: "+44",
    //   alternate_phone: "",
    //   alternate_phone_code: "+44",
    //   email: "",
    //   alternate_email: "",
    // },
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
    notes: "",
  });

  useEffect(() => {
    CustomerPersonRoleData();
    CountryData();
    getClientIndustry();
    incorporationData();
  }, []);

  useEffect(() => {
    Get_Company();
    FilterSearchDetails();
  }, [searchItem]);

  useEffect(() => {
    if (getSearchDetails.length > 0) {
      Get_Officer_Details(getSearchDetails[0].company_number);
      setCompanyDetails((prevState) => ({
        ...prevState,
        CompanyName: getSearchDetails[0].title,
        EntityType: getSearchDetails[0].company_type,
        CompanyStatus: getSearchDetails[0].company_status,
        CompanyNumber: getSearchDetails[0].company_number,
        RegisteredOfficeAddress: getSearchDetails[0].address_snippet,
        IncorporationDate: getSearchDetails[0].date_of_creation,
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

  const handleAddContactMemberDetails = () => {
    setContactsMembers([
      ...contactsMembers,
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
    setErrorMemberDetails([
      ...errorMemberDetails,
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

  const handleAddContactMemberDetailsUnincorporated = () => {
    setContactsMembersUnincorporated([
      ...contactsMembersUnincorporated,
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
    setErrorMemberDetailsUnincorporated([
      ...errorMemberDetailsUnincorporated,
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

  const handleAddContactTrusteeDetails = () => {
    setContactsTrustee([
      ...contactsTrustee,
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
    setErrorTrusteeDetails([
      ...errorTrusteeDetails,
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

  const handleAddContactTrustMemberDetails = () => {
    setContactsMembersTrust([
      ...contactsMembersTrust,
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
    setErrorMemberTrustDetails([
      ...errorMemberTrustDetails,
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

  const handleAddContactTrustTrusteeDetails = () => {
    setContactsTrustTrustee([
      ...contactsTrustTrustee,
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
    setErrorTrustTrusteeDetails([
      ...errorTrustTrusteeDetails,
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

  const handleDeleteContactMemberDetails = (index) => {
    const newContacts = contactsMembers.filter((_, i) => i !== index);
    const newErrors = errorMemberDetails.filter((_, i) => i !== index);
    setContactsMembers(newContacts);
    setErrorMemberDetails(newErrors);
  };

  const handleDeleteContactMemberDetailsUnincorporated = (index) => {
    const newContacts = contactsMembersUnincorporated.filter((_, i) => i !== index);
    const newErrors = errorMemberDetailsUnincorporated.filter((_, i) => i !== index);
    setContactsMembersUnincorporated(newContacts);
    setErrorMemberDetailsUnincorporated(newErrors);
  }

  const handleDeleteContactTrusteeDetails = (index) => {
    const newContacts = contactsTrustee.filter((_, i) => i !== index);
    const newErrors = errorTrusteeDetails.filter((_, i) => i !== index);
    setContactsTrustee(newContacts);
    setErrorTrusteeDetails(newErrors);
  };

  const handleDeleteContactTrustmemberDetails = (index) => {
    const newContacts = contactsMembersTrust.filter((_, i) => i !== index);
    const newErrors = errorMemberTrustDetails.filter((_, i) => i !== index);
    setContactsMembersTrust(newContacts);
    setErrorMemberTrustDetails(newErrors);
  };

  const handleDeleteContactTrusTrusteeDetails = (index) => {
    const newContacts = contactsTrustTrustee.filter((_, i) => i !== index);
    const newErrors = errorTrustTrusteeDetails.filter((_, i) => i !== index);
    setContactsTrustTrustee(newContacts);
    setErrorTrustTrusteeDetails(newErrors);
   
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

  const handleChange5 = (e) => {
    const { name, value } = e.target;
    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate5(name, value);
    setCharityIncorporatedOrganisation({ ...getCharityIncorporatedOrganisation, [name]: value });
  };

  const handleChange6 = (e) => {
    const { name, value } = e.target;
    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate6(name, value);
    setAssociationDetails({ ...getAssociationDetails, [name]: value });

  };

  const handleChange7 = (e) => {
    const { name, value } = e.target;
    if (name === "VATNumber") {
      if (!/^[0-9+]*$/.test(value)) {
        return;
      }
    }
    validate7(name, value);
    setTrust({ ...getTrust, [name]: value });

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
    if (!value?.trim()) {
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
          delete newErrors[name];
          setErrors1((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[name];
            return updatedErrors;
          });
          break;
        case "phone":
          delete newErrors[name];
          setErrors1((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[name];
            return updatedErrors;
          });
        default:
          break;
      }
    }
    else {

      if (value && name === "email" && !Email_regex(value)) {
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
    if (!value?.trim()) {
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
    if (!value?.trim()) {
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
    if (!value?.trim()) {
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

  const validate5 = (name, value) => {
    const newErrors = { ...errors5 }

    console.log(name, value)
    if (!value?.trim()) {
      switch (name) {
        case "charity_name":
          newErrors[name] = "Please enter charity_name";
          break;
        case "charity_commission_number":
          newErrors[name] = "Please enter Charity Commission Number";
        case "VATRegistered":
          newErrors[name] = "Please Enter VAT Registered";
          break;
        case "principal_office_address":
          newErrors[name] = "Please Enter Principal Office Address";
          break;
        default:
          break;
      }
    }
    else {
      delete newErrors[name];
      setErrors5((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });

    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors5((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validate6 = (name, value) => {
    const newErrors = { ...errors6 }
    if (!value?.trim()) {
      switch (name) {
        case "AssociationName":
          newErrors[name] = "Please enter Association Name";
          break;
        case "AssociationAddress":
          newErrors[name] = "Please enter Association Address";
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
      setErrors6((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });

    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors6((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validate7 = (name, value) => {
    const newErrors = { ...errors7 }
    if (!value?.trim()) {
      switch (name) {
        case "TrustName":
          newErrors[name] = "Please enter Trust Name";
          break;
        case "TrustAddress":
          newErrors[name] = "Please enter Trust Address";
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
      setErrors7((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });

    }

    ScrollToViewFirstError(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      setErrors7((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0 ? true : false;
  };

  const validateAllFields = (type) => {
    const customer_type = [getSoleTraderDetails, getCompanyDetails, getPartnershipDetails, getIndivisualDetails, getCharityIncorporatedOrganisation, getAssociationDetails, getTrust];
    const validate = [validate1, validate2, validate3, validate4, validate5, validate6, validate7];
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

  const Get_Officer_Details = async (company_number) => {
    const data = { company_number: company_number };
    await dispatch(GetOfficerDetails(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          if (res.data.length > 0) {
            const officer_name = res.data[0].name.split(", ").map(part => part.trim());
            let first_name = officer_name[1]
            let last_name = officer_name[0]
            if (officer_name[1] == undefined) {
              first_name = officer_name[0]
              last_name = ""
            }

            setContacts((prevContacts) => {
              // Clone the current state
              const updatedContacts = [...prevContacts];
              // Update only the first object
              updatedContacts[0] = {
                ...updatedContacts[0],
                first_name: first_name,
                last_name: last_name,
              };
              // Return the updated state
              return updatedContacts;
            });
          } else {
            setContacts((prevContacts) => {
              // Clone the current state
              const updatedContacts = [...prevContacts];
              // Update only the first object
              updatedContacts[0] = {
                ...updatedContacts[0],
                first_name: '',
                last_name: '',
              };
              // Return the updated state
              return updatedContacts;
            });
          }
        } else {
        }
      })
      .catch((err) => {
        return;
      }
      );
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

  const handleChangeMember = (index, field, value) => {
    const newContacts = [...contactsMembers];
    newContacts[index][field] = value;
    setErrorMemberDetails(newContacts);
    validateContactMemberField(index, field, value);
  };

  const handleChangeMemberUnincorporated = (index, field, value) => {
    const newContacts = [...contactsMembersUnincorporated];
    newContacts[index][field] = value;
    setContactsMembersUnincorporated(newContacts);
    validateContactMemberFieldUnincorporated(index, field, value);
  };

  const handleChangeTrust = (index, field, value) => {
    const newContacts = [...contactsMembersTrust];
    newContacts[index][field] = value;
    setErrorMemberTrustDetails(newContacts);
    validateContactMemberTrust(index, field, value);
   
  };


  const handleChangeTrustTrustee = (index, field, value) => {
    const newContacts = [...contactsTrustTrustee];
    newContacts[index][field] = value;
    setContactsTrustTrustee(newContacts);
    validateContactTrustTrustee(index, field, value);
  };

  const handleChangeTrustee = (index, field, value) => {
    const newContacts = [...contactsTrustee];
    newContacts[index][field] = value;
    setErrorTrusteeDetails(newContacts);
    validateContactTrusteeField(index, field, value);
  };

  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      case "email":
        if (!value?.trim()) {
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
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;
        break;
      case "email":
        if (!value?.trim()) {
          newErrors[index].email = "";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = "Valid Email is required";
        } else {
          newErrors[index].email = "";
        }
        break;
      case "alternate_email":
        if (!value?.trim()) {
          newErrors[index].alternate_email = "";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].alternate_email = "Valid Email is required";
        } else {
          newErrors[index].alternate_email = "";
        }
        break;
      case "phone":
        newErrors[index].phone =
          value?.trim() === ""
            ? ""
            : /^\d{9,12}$/.test(value)
              ? ""
              : "Phone Number must be between 9 to 12 digits";
        break;

      case "alternate_phone":
        newErrors[index].alternate_phone =
          value?.trim() === ""
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

  const validateContactMemberField = (index, field, value) => {
    const newErrors = [...errorMemberDetails];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      default:
        break;
    }
    setErrorMemberDetails(newErrors);
  };

  const validateContactMemberFieldUnincorporated = (index, field, value) => {
    const newErrors = [...errorMemberDetailsUnincorporated];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      default:
        break;
    }
    setErrorMemberDetailsUnincorporated(newErrors);
  };

  const validateContactMemberTrust = (index, field, value) => {
    const newErrors = [...errorMemberTrustDetails];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      default:
        break;
    }
    setErrorMemberTrustDetails(newErrors);
    
  };

  const validateContactTrustTrustee = (index, field, value) => {
     const newErrors = [...errorTrustTrusteeDetails];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      default:
        break;

    }
    setErrorTrustTrusteeDetails(newErrors);
  };


  const validateContactTrusteeField = (index, field, value) => {
    const newErrors = [...errorTrusteeDetails];
    switch (field) {
      case "first_name":
        newErrors[index].first_name = value?.trim() ? "" : "First Name is required";
        break;
      case "last_name":
        newErrors[index].last_name = value?.trim() ? "" : "Last Name is required";
        break;

      default:
        break;
    }
    setErrorTrusteeDetails(newErrors);
  };

  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };

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
            sessionStorage.setItem('activeTab', location.state.activeTab);
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
        notes: getSoleTraderDetails.notes,
        first_name: getSoleTraderDetails?.first_name,
        last_name: getSoleTraderDetails?.last_name,
        phone: getSoleTraderDetails.phone,
        email: getSoleTraderDetails.email,
        residential_address: getSoleTraderDetails.residentialAddress,
        client_code: location.state.id,
        phone_code: getSoleTraderDetails.phone_code,
      };

      await AddClientFun(req);
    }
    else if (selectClientType == 2 && validateAllFields(2)) {
      let formIsValid = true;
      const newErrors = contacts.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",
          phone:
            contact.phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          email:
            contact.email?.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
        };

        if (
          error?.first_name ||
          error?.last_name ||
          error?.role ||
          error?.phone ||
          error?.email
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
          notes: getCompanyDetails.notes,
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
    else if (selectClientType == 3 && validateAllFields(3)) {
      let formIsValid = true;
      const newErrors = contacts1.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",
          phone:
            contact.phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          alternate_phone:
            contact.alternate_phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact.alternate_phone)
                ? ""
                : " Alternate Phone Number must be between 9 to 12 digits",
          email:
            contact.email?.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
          alternate_email:
            contact.alternate_email.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.alternate_email)
                ? ""
                : "Valid Email is required",
        };

        if (
          error?.first_name ||
          error?.last_name ||
          error?.role ||
          error?.phone ||
          error?.email
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
          notes: getPartnershipDetails.notes,
          contactDetails: contacts1,
        };
        await AddClientFun(req);

      }
      else {
        ScrollToViewFirstErrorContactForm(contactsErrors);

      }
    }
    else if (selectClientType == 4 && validateAllFields(4)) {
      const req = {
        client_type: "4",
        customer_id: location.state.id,
        trading_name: getIndivisualDetails.tradingName,
        first_name: getIndivisualDetails?.first_name,
        last_name: getIndivisualDetails?.last_name,
        phone: getIndivisualDetails.phone,
        email: getIndivisualDetails.email,
        residential_address: getIndivisualDetails.residentialAddress,
        client_code: location.state.id,
        phone_code: getIndivisualDetails.phone_code,
        notes: getIndivisualDetails.notes,
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
              sessionStorage.setItem('activeTab', location.state.activeTab);
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
    else if (selectClientType == 5 && validateAllFields(5)) {
      let formIsValid = true;
      let newErrors = contactsMembers.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",

        };

        if (
          error?.first_name ||
          error?.last_name
        ) {
          formIsValid = false;
        }
        return error;
      });

      let newErrors1 = contactsTrustee.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",

        };

        if (
          error?.first_name ||
          error?.last_name
        ) {
          formIsValid = false;
        }
        return error;
      });


      setErrorMemberDetails(newErrors);
      setErrorTrusteeDetails(newErrors1);

      if (formIsValid) {
        const req = {
          client_type: "5",
          customer_id: location.state.id,
          trading_name: getCharityIncorporatedOrganisation.charity_name,
          charity_commission_number: getCharityIncorporatedOrganisation.charity_commission_number,
          trading_address: getCharityIncorporatedOrganisation.principal_office_address,
          service_address: getCharityIncorporatedOrganisation.service_address,
          vat_registered: getCharityIncorporatedOrganisation.VATRegistered,
          vat_number: getCharityIncorporatedOrganisation.VATNumber,
          website: getCharityIncorporatedOrganisation.Website,
          notes: getCharityIncorporatedOrganisation.notes,
          member_details: contactsMembers,
          trustee_details: contactsTrustee,
        };
        await AddClientFun(req);

      }
      else {
        ScrollToViewFirstErrorContactForm(contactsErrors);

      }
    }
    else if (selectClientType == 6 && validateAllFields(6)) {
      let formIsValid = true;
      let newErrors = contactsMembersUnincorporated.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",

        };

        if (
          error?.first_name ||
          error?.last_name
        ) {
          formIsValid = false;
        }
        return error;

      });
      setErrorMemberDetailsUnincorporated(newErrors);
      if (formIsValid) {
        const req = {
          client_type: "6",
          customer_id: location.state.id,
          trading_name: getAssociationDetails.AssociationName,
          trading_address: getAssociationDetails.AssociationAddress,
          vat_registered: getAssociationDetails.VATRegistered,
          vat_number: getAssociationDetails.VATNumber,
          website: getAssociationDetails.Website,
          notes: getAssociationDetails.notes,
          member_details: contactsMembersUnincorporated,
        };
        await AddClientFun(req);

      }
      else {
        ScrollToViewFirstErrorContactForm(contactsErrors);

      }
    }
    else if (selectClientType == 7 && validateAllFields(7)) {
      let formIsValid = true;
      let newErrors = contactsMembersTrust.map((contact, index) => {
        const error = {
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",
        };
        if (
          error?.first_name ||
          error?.last_name
        ) {
          formIsValid = false;
        }
        return error;

      });
      let newErrors1 = contactsTrustTrustee.map((contact, index) => {
        const error = { 
          first_name: contact?.first_name?.trim() ? "" : "First Name is required",
          last_name: contact?.last_name?.trim() ? "" : "Last Name is required",
        };
        if (
          error?.first_name ||
          error?.last_name
        ) {
          formIsValid = false;
        }
        return error;
      }
      );

      setErrorMemberTrustDetails(newErrors);
      setErrorTrustTrusteeDetails(newErrors1);

      if (formIsValid) {
        const req = {
          client_type: "7",
          customer_id: location.state.id,
          trading_name: getTrust.TrustName,
          trading_address: getTrust.TrustAddress,
          vat_registered: getTrust.VATRegistered,
          vat_number: getTrust.VATNumber,
          website: getTrust.Website,
          notes: getTrust.notes,
          trustee_details: contactsTrustTrustee,
          beneficiaries_details: contactsMembersTrust,
        };
        await AddClientFun(req);

      }
      else {
        ScrollToViewFirstErrorContactForm(contactsErrors);

      }
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
                  onClick={() => {
                    sessionStorage.setItem('activeTab', location.state.activeTab);
                    window.history.back()
                  }}
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
                                      autoFocus
                                      className="form-select "
                                      value={selectClientType}
                                      onChange={(e) =>
                                        setSelectClientType(e.target.value)
                                      }
                                    >
                                      <option value={1}>Sole Trader</option>
                                      <option value={2}>Company</option>
                                      <option value={3}>Partnership</option>
                                      <option value={4}>Individual</option>
                                      <option value={5}>Charity Incorporated Organisation</option>
                                      <option value={6}>Unincorporated Association</option>
                                      <option value={7}>Trust</option>
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
                                      Sole Trader Information
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
                                            maxLength={200}
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
                                            maxLength={200}
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

                                          className={errors1["first_name"] ? "error-field form-control" : "form-control"}
                                          placeholder="First Name"
                                          name="first_name"
                                          id="first_name"
                                          value={
                                            getSoleTraderDetails?.first_name
                                          }
                                          maxLength={50}
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
                                          className={errors1["last_name"] ? "error-field form-control" : "form-control"}
                                          placeholder="Last Name"
                                          name="last_name"
                                          id="last_name"
                                          value={getSoleTraderDetails?.last_name}
                                          maxLength={50}
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

                                        </label>
                                        <input
                                          type="text"
                                          className={errors1["email"] ? "error-field form-control" : "form-control"}
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



                                <div className="card">
                                  <div className="card-header card-header-light-blue">
                                    <h4 className="card-title mb-0 fs-16 ">
                                      Notes
                                    </h4>
                                  </div>
                                  <div className="card-body row">
                                    <div className="col-lg-12">
                                      <div className="mb-3">
                                        <textarea
                                          type="text"
                                          className={errors1["notes"] ? "error-field form-control" : "form-control"}
                                          placeholder="Enter Notes"
                                          name="notes"
                                          id="notes"
                                          value={
                                            getSoleTraderDetails.notes
                                          }
                                          onChange={(e) => handleChange1(e)}
                                        />
                                        {errors1["notes"] && (
                                          <div className="error-text">
                                            {errors1["notes"]}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          ) :
                            selectClientType == 2 ? (
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
                                                  placeholder="Search Company"
                                                  className="form-select"
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
                                                className={errors2["CompanyName"] ? "error-field form-control" : "form-control"}

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
                                                className={errors2["EntityType"] ? "error-field form-control" : "form-control"}

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
                                                className={errors2["CompanyStatus"] ? "error-field form-control" : "form-control"}

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
                                                Company Number
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              </label>
                                              <input
                                                type="text"

                                                className={errors2["CompanyNumber"] ? "error-field form-control" : "form-control"}

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
                                                <span style={{ color: "red" }}>
                                                  *
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                className={errors2["IncorporationDate"] ? "error-field form-control" : "form-control"}

                                                placeholder="Incorporation Date"
                                                name="IncorporationDate"
                                                id="IncorporationDate"
                                                onChange={(e) => handleChange2(e)}
                                                value={
                                                  convertDate(getCompanyDetails.IncorporationDate)
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
                                                className={errors2["RegisteredOfficeAddress"] ? "error-field form-control" : "form-control"}

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
                                              {/* <input
                                              type="text"
                                              className={errors2["IncorporationIn"] ? "error-field form-control" : "form-control"}
                                              placeholder="Please Enter Incorporation In"
                                              name="IncorporationIn"
                                              id="IncorporationIn"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.IncorporationIn
                                              }
                                            /> */}
                                              <select
                                                className={errors2["IncorporationIn"] ? "error-field form-select" : "form-select"}
                                                name="IncorporationIn"
                                                id="IncorporationIn"
                                                onChange={(e) => handleChange2(e)}
                                                value={getCompanyDetails?.IncorporationIn}
                                              >
                                                <option value="">
                                                  Please Select Incorporation In
                                                </option>
                                                {incorporationDataAll &&
                                                  incorporationDataAll?.map((data) => (
                                                    <option key={data?.id} value={data?.id}>
                                                      {data?.name}
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
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                        Trading Details
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-lg-4">
                                          <div className="mb-3">
                                            <label className="form-label">
                                              Client Industry
                                            </label>
                                            <select

                                              className={errors2["ClientIndustry"] ? "error-field form-select" : "form-select"}
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
                                              className={errors2["TradingName"] ? "error-field form-control" : "form-control"}
                                              maxLength={200}
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
                                              className={errors2["TradingAddress"] ? "error-field form-control" : "form-control"}
                                              maxLength={200}
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
                                              <div className="card pricing-box p-3 m-2 mt-0">
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
                                                        className={errors[index]?.first_name ? "error-field form-control" : "form-control"}

                                                        placeholder="First Name"
                                                        id={`first_name-${index}`}
                                                        value={contact?.first_name}
                                                        maxLength={50}
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "first_name",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {errors[index]
                                                        ?.first_name && (
                                                          <div className="error-text">
                                                            {
                                                              errors[index]
                                                                ?.first_name
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
                                                        className={errors[index]?.last_name ? "error-field form-control" : "form-control"}
                                                        placeholder="Last Name"
                                                        id={`last_name-${index}`}
                                                        value={
                                                          contact?.last_name
                                                        }
                                                        maxLength={50}
                                                        onChange={(e) =>
                                                          handleChange(
                                                            index,
                                                            "last_name",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                      {errors[index]
                                                        ?.last_name && (
                                                          <div className="error-text">
                                                            {
                                                              errors[index]
                                                                ?.last_name
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
                                                        value={contact?.role}
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
                                                      {errors[index]?.role && (
                                                        <div className="error-text">
                                                          {errors[index]?.role}
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


                                <div className="col-lg-12">
                                  <div className="card card_shadow ">
                                    {/* end card header */}
                                    <div className="card-header card-header-light-blue align-items-center d-flex">
                                      <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                        Notes
                                      </h4>
                                    </div>
                                    <div className="card-body">
                                      <div className="row">
                                        <div className="col-lg-12">
                                          <div className="mb-3">

                                            <textarea
                                              type="text"
                                              className={errors2["notes"] ? "error-field form-control" : "form-control"}
                                              placeholder="Enter Notes"
                                              name="notes"
                                              id="notes"
                                              onChange={(e) => handleChange2(e)}
                                              value={
                                                getCompanyDetails.notes
                                              }
                                            />
                                            {errors2["notes"] && (
                                              <div className="error-text">
                                                {errors2["notes"]}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>


                              </div>

                            ) :
                              selectClientType == 3 ? (
                                <div className="row ">
                                  <div className="col-lg-12">
                                    <div className="card card_shadow ">
                                      <div className="card-header  card-header-light-blue align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                          Partnership Information
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
                                                name="ClientIndustry"
                                                className="form-select"
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
                                                className={errors3["TradingName"] ? "error-field form-control" : "form-control"}

                                                placeholder="Trading Name"
                                                name="TradingName"
                                                id="TradingName"
                                                value={
                                                  getPartnershipDetails.TradingName
                                                }
                                                onChange={(e) => handleChange3(e)}
                                                maxLength={200}
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
                                                className={errors3["TradingAddress"] ? "error-field form-control" : "form-control"}
                                                maxLength={200}
                                                placeholder="Trading Address"
                                                name="TradingAddress"
                                                id="TradingAddress"
                                                value={
                                                  getPartnershipDetails.TradingAddress
                                                }
                                                onChange={(e) => handleChange3(e)}

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

                                  <div className="col-lg-12">
                                    <div className="card card_shadow">
                                      <div className="card-header card-header-light-blue align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                          Partner Details
                                        </h4>
                                      </div>
                                      <div className="card-body">
                                        <div className="row">
                                          {contacts1.map((contact, index) => (
                                            <div className="col-xxl-12 col-lg-12">
                                              <div className="card pricing-box p-3 m-2 mt-0">
                                                <div className="row">
                                                  <div className="col-lg-12">
                                                    <div>
                                                      <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                    </div>
                                                    <div
                                                      className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                      dir="ltr"
                                                    >

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

                                                        className={contactsErrors[index]?.first_name ? "error-field form-control" : "form-control"}

                                                        placeholder="First Name"
                                                        name="first_name"
                                                        id={`first_name-${index}`}
                                                        value={
                                                          contacts1?.first_name
                                                        }
                                                        maxLength={50}
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
                                                          <div className="error-text">
                                                            {
                                                              contactsErrors[index]
                                                                ?.first_name
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
                                                        className={contactsErrors[index]?.last_name ? "error-field form-control" : "form-control"}

                                                        placeholder=" Last Name"
                                                        name="last_name"
                                                        id={`last_name-${index}`}
                                                        value={
                                                          contacts1?.last_name
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
                                                        ?.last_name && (
                                                          <div className="error-text">
                                                            {
                                                              contactsErrors[index]
                                                                ?.last_name
                                                            }
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Role

                                                      </label>

                                                      <select
                                                        className="form-select"
                                                        id={`role-${index}`}
                                                        value={contacts1?.role}
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
                                                      {contactsErrors[index]?.role && (
                                                        <div className="error-text">
                                                          {
                                                            contactsErrors[index]?.role
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
                                                            placeholder=" Alternate Phone Number"
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







                                  <div className="col-lg-12">
                                    <div className="card card_shadow ">
                                      <div className="card-header  card-header-light-blue align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                          Notes
                                        </h4>
                                      </div>
                                      {/* end card header */}
                                      <div className="card-body">
                                        <div className="row">
                                          <div className="col-lg-12">
                                            <div className="mb-3">
                                              <textarea
                                                type="text"
                                                className={errors3["notes"] ? "error-field form-control" : "form-control"}

                                                placeholder="Enter Notes"
                                                name="notes"
                                                id="notes"
                                                value={
                                                  getPartnershipDetails.notes
                                                }
                                                onChange={(e) => handleChange3(e)}
                                              />
                                              {errors3["notes"] && (
                                                <div className="error-text">
                                                  {errors3["notes"]}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>



                                </div>

                              ) :
                                selectClientType == 4 ? (
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
                                                className={errors4["tradingName"] ? "error-field form-control" : "form-control"}
                                                maxLength={200}
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
                                                className={errors4["first_name"] ? "error-field form-control" : "form-control"}

                                                placeholder="First Name"
                                                name="first_name"
                                                id="first_name"

                                                value={
                                                  getIndivisualDetails?.first_name
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
                                                className={errors4["last_name"] ? "error-field form-control" : "form-control"}

                                                placeholder="Last Name"
                                                name="last_name"
                                                id="last_name"
                                                value={getIndivisualDetails?.last_name}
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
                                                Phone Number
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

                                    <div className="col-lg-12">
                                      <div className="card card_shadow "></div>
                                      <div className="card">
                                        <div className="card-header card-header-light-blue">
                                          <h4 className="card-title mb-0 fs-16 ">
                                            Notes
                                          </h4>
                                        </div>
                                        <div className="card-body row">
                                          <div className="col-lg-12">
                                            <div className="mb-3">
                                              <textarea
                                                type="text"
                                                name="notes"
                                                id="notes"
                                                className={errors4["notes"] ? "error-field form-control" : "form-control"}
                                                placeholder="Enter Notes"
                                                onChange={(e) => handleChangeIndivisul(e)}
                                                value={
                                                  getIndivisualDetails.notes
                                                }
                                              />
                                              {errors4["notes"] && (
                                                <div className="error-text">
                                                  {errors4["notes"]}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                ) :
                                  selectClientType == 5 ? (
                                    <div className="row ">
                                      <div className="col-lg-12">
                                        <div className="card card_shadow ">
                                          <div className="card-header  card-header-light-blue align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                              Charity Incorporated Organisation Information
                                            </h4>
                                          </div>
                                          {/* end card header */}
                                          <div className="card-body">
                                            <div className="row">

                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <label className="form-label">
                                                    Charity Name
                                                    <span style={{ color: "red" }}>
                                                      *
                                                    </span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className={errors5["charity_name"] ? "error-field form-control" : "form-control"}

                                                    placeholder="Charity Name"
                                                    name="charity_name"
                                                    id="charity_name"
                                                    value={
                                                      getCharityIncorporatedOrganisation.charity_name
                                                    }
                                                    onChange={(e) => handleChange5(e)}
                                                    maxLength={200}
                                                  />
                                                  {errors5["charity_name"] && (
                                                    <div className="error-text">
                                                      {errors5["charity_name"]}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <label className="form-label">
                                                    Charity Commission Registration Number
                                                    <span style={{ color: "red" }}>
                                                      *
                                                    </span>
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className={errors5["charity_commission_number"] ? "error-field form-control" : "form-control"}

                                                    placeholder="Charity Commission Registration Number"
                                                    name="charity_commission_number"
                                                    id="charity_commission_number"
                                                    value={
                                                      getCharityIncorporatedOrganisation.charity_commission_number
                                                    }
                                                    onChange={(e) => handleChange5(e)}
                                                    maxLength={200}
                                                  />
                                                  {errors5["charity_commission_number"] && (
                                                    <div className="error-text">
                                                      {errors5["charity_commission_number"]}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <label className="form-label">
                                                    Principal Office Address
                                                    <span style={{ color: "red" }}>
                                                      *
                                                    </span>{" "}
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className={errors5["principal_office_address"] ? "error-field form-control" : "form-control"}
                                                    maxLength={200}
                                                    placeholder="Principal Office Address"
                                                    name="principal_office_address"
                                                    id="principal_office_address"
                                                    value={
                                                      getCharityIncorporatedOrganisation.principal_office_address
                                                    }
                                                    onChange={(e) => handleChange5(e)}

                                                  />
                                                  {errors5["principal_office_address"] && (
                                                    <div className="error-text">
                                                      {errors5["principal_office_address"]}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="col-lg-4">
                                                <div className="mb-3">
                                                  <label className="form-label">
                                                    Service Address
                                                    <span style={{ color: "red" }}>
                                                      *
                                                    </span>{" "}
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className={errors5["service_address"] ? "error-field form-control" : "form-control"}
                                                    maxLength={200}
                                                    placeholder="Service Address"
                                                    name="service_address"
                                                    id="service_address"
                                                    value={
                                                      getCharityIncorporatedOrganisation.service_address
                                                    }
                                                    onChange={(e) => handleChange5(e)}

                                                  />
                                                  {errors5["service_address"] && (
                                                    <div className="error-text">
                                                      {errors5["service_address"]}
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
                                                      onChange={(e) => handleChange5(e)}
                                                    >
                                                      <option value={1}>Yes</option>
                                                      <option value={0}>No</option>
                                                    </select>
                                                    {errors5["VATRegistered"] && (
                                                      <div className="error-text">
                                                        {errors5["VATRegistered"]}
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
                                                        getCharityIncorporatedOrganisation.VATNumber
                                                      }
                                                      onChange={(e) => handleChange5(e)}
                                                      maxLength={9}
                                                    />
                                                    {errors5["VATNumber"] && (
                                                      <div className="error-text">
                                                        {errors5["VATNumber"]}
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
                                                      getCharityIncorporatedOrganisation.Website
                                                    }
                                                    onChange={(e) => handleChange5(e)}
                                                    maxLength={200}
                                                  />

                                                  {errors5["Website"] && (
                                                    <div style={{ color: "red" }}>
                                                      {errors5["Website"]}
                                                    </div>
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
                                            <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                              Members Details
                                            </h4>
                                          </div>
                                          <div className="card-body">
                                            <div className="row">

                                              {contactsMembers.map((contact, index) => (
                                                <div className="col-xxl-12 col-lg-12">
                                                  <div className="card pricing-box p-3 m-2 mt-0">
                                                    <div className="row">
                                                      <div className="col-lg-12">
                                                        <div>
                                                          <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                        </div>
                                                        <div
                                                          className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                          dir="ltr"
                                                        >

                                                          {index !== 0 &&
                                                            (
                                                              <div>
                                                                <button
                                                                  className="delete-icon"
                                                                  type="button"
                                                                  onClick={() =>
                                                                    handleDeleteContactMemberDetails(
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

                                                            className={errorMemberDetails[index]?.first_name ? "error-field form-control" : "form-control"}

                                                            placeholder="First Name"
                                                            name="first_name"
                                                            id={`first_name-${index}`}
                                                            value={
                                                              contacts1?.first_name
                                                            }
                                                            maxLength={50}
                                                            onChange={(e) =>
                                                              handleChangeMember(
                                                                index,
                                                                "first_name",
                                                                e.target.value
                                                              )
                                                            }

                                                          />
                                                          {errorMemberDetails[index]
                                                            ?.first_name && (
                                                              <div className="error-text">
                                                                {
                                                                  errorMemberDetails[index]
                                                                    ?.first_name
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
                                                            className={errorMemberDetails[index]?.last_name ? "error-field form-control" : "form-control"}

                                                            placeholder=" Last Name"
                                                            name="last_name"
                                                            id={`last_name-${index}`}
                                                            value={
                                                              contacts1?.last_name
                                                            }
                                                            onChange={(e) =>
                                                              handleChangeMember(
                                                                index,
                                                                "last_name",
                                                                e.target.value
                                                              )
                                                            }
                                                            maxLength={50}
                                                          />
                                                          {errorMemberDetails[index]
                                                            ?.last_name && (
                                                              <div className="error-text">
                                                                {
                                                                  errorMemberDetails[index]
                                                                    ?.last_name
                                                                }
                                                              </div>
                                                            )}
                                                        </div>
                                                      </div>
                                                      <div className="col-lg-4">
                                                        <div className="mb-3">
                                                          <label className="form-label">
                                                            Role

                                                          </label>

                                                          <select
                                                            className="form-select"
                                                            id={`role-${index}`}
                                                            value={contacts1?.role}
                                                            onChange={(e) =>
                                                              handleChangeMember(
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
                                                          {errorMemberDetails[index]?.role && (
                                                            <div className="error-text">
                                                              {
                                                                errorMemberDetails[index]?.role
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
                                                                  handleChangeMember(
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
                                                                  handleChangeMember(
                                                                    index,
                                                                    "phone",
                                                                    e.target.value
                                                                  )
                                                                }
                                                                maxLength={12}
                                                              />
                                                              {errorMemberDetails[index]
                                                                .phone && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberDetails[
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
                                                                  handleChangeMember(
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
                                                                placeholder=" Alternate Phone Number"
                                                                name="alternate_phone"
                                                                id={`alternate_phone-${index}`}
                                                                value={
                                                                  contacts1.alternate_phone
                                                                }
                                                                onChange={(e) =>
                                                                  handleChangeMember(
                                                                    index,
                                                                    "alternate_phone",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorMemberDetails[index]
                                                                .alternate_phone && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberDetails[
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

                                                          </label>
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter Email"
                                                            name="email"
                                                            id={`email-${index}`}
                                                            value={contacts1.email}
                                                            onChange={(e) =>
                                                              handleChangeMember(
                                                                index,
                                                                "email",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                          {errorMemberDetails[index]
                                                            .email && (
                                                              <div className="error-text">
                                                                {
                                                                  errorMemberDetails[index]
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
                                                              handleChangeMember(
                                                                index,
                                                                "alternate_email",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                          {errorMemberDetails[index]
                                                            .alternate_email && (
                                                              <div className="error-text">
                                                                {
                                                                  errorMemberDetails[index]
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
                                                    onClick={handleAddContactMemberDetails}
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


                                      <div className="col-lg-12">
                                        <div className="card card_shadow">
                                          <div className="card-header card-header-light-blue align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                              Trustee Details
                                            </h4>
                                          </div>
                                          <div className="card-body">
                                            <div className="row">

                                              {contactsTrustee.map((contact, index) => (
                                                <div className="col-xxl-12 col-lg-12">
                                                  <div className="card pricing-box p-3 m-2 mt-0">
                                                    <div className="row">
                                                      <div className="col-lg-12">
                                                        <div>
                                                          <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                        </div>
                                                        <div
                                                          className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                          dir="ltr"
                                                        >

                                                          {index !== 0 &&
                                                            (
                                                              <div>
                                                                <button
                                                                  className="delete-icon"
                                                                  type="button"
                                                                  onClick={() =>
                                                                    handleDeleteContactTrusteeDetails(
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

                                                            className={errorTrusteeDetails[index]?.first_name ? "error-field form-control" : "form-control"}

                                                            placeholder="First Name"
                                                            name="first_name"
                                                            id={`first_name-${index}`}
                                                            value={
                                                              contacts1?.first_name
                                                            }
                                                            maxLength={50}
                                                            onChange={(e) =>
                                                              handleChangeTrustee(
                                                                index,
                                                                "first_name",
                                                                e.target.value
                                                              )
                                                            }

                                                          />
                                                          {errorTrusteeDetails[index]
                                                            ?.first_name && (
                                                              <div className="error-text">
                                                                {
                                                                  errorTrusteeDetails[index]
                                                                    ?.first_name
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
                                                            className={errorTrusteeDetails[index]?.last_name ? "error-field form-control" : "form-control"}

                                                            placeholder=" Last Name"
                                                            name="last_name"
                                                            id={`last_name-${index}`}
                                                            value={
                                                              contacts1?.last_name
                                                            }
                                                            onChange={(e) =>
                                                              handleChangeTrustee(
                                                                index,
                                                                "last_name",
                                                                e.target.value
                                                              )
                                                            }
                                                            maxLength={50}
                                                          />
                                                          {errorTrusteeDetails[index]
                                                            ?.last_name && (
                                                              <div className="error-text">
                                                                {
                                                                  errorTrusteeDetails[index]
                                                                    ?.last_name
                                                                }
                                                              </div>
                                                            )}
                                                        </div>
                                                      </div>
                                                      <div className="col-lg-4">
                                                        <div className="mb-3">
                                                          <label className="form-label">
                                                            Role

                                                          </label>

                                                          <select
                                                            className="form-select"
                                                            id={`role-${index}`}
                                                            value={contacts1?.role}
                                                            onChange={(e) =>
                                                              handleChangeTrustee(
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
                                                          {errorTrusteeDetails[index]?.role && (
                                                            <div className="error-text">
                                                              {
                                                                errorTrusteeDetails[index]?.role
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
                                                                  handleChangeTrustee(
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
                                                                  handleChangeTrustee(
                                                                    index,
                                                                    "phone",
                                                                    e.target.value
                                                                  )
                                                                }
                                                                maxLength={12}
                                                              />
                                                              {errorTrusteeDetails[index]
                                                                .phone && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrusteeDetails[
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
                                                                  handleChangeTrustee(
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
                                                                placeholder=" Alternate Phone Number"
                                                                name="alternate_phone"
                                                                id={`alternate_phone-${index}`}
                                                                value={
                                                                  contacts1.alternate_phone
                                                                }
                                                                onChange={(e) =>
                                                                  handleChangeTrustee(
                                                                    index,
                                                                    "alternate_phone",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorTrusteeDetails[index]
                                                                .alternate_phone && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrusteeDetails[
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

                                                          </label>
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter Email"
                                                            name="email"
                                                            id={`email-${index}`}
                                                            value={contacts1.email}
                                                            onChange={(e) =>
                                                              handleChangeTrustee(
                                                                index,
                                                                "email",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                          {errorTrusteeDetails[index]
                                                            .email && (
                                                              <div className="error-text">
                                                                {
                                                                  errorTrusteeDetails[index]
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
                                                              handleChangeTrustee(
                                                                index,
                                                                "alternate_email",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                          {errorTrusteeDetails[index]
                                                            .alternate_email && (
                                                              <div className="error-text">
                                                                {
                                                                  errorTrusteeDetails[index]
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
                                                    onClick={handleAddContactTrusteeDetails}
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


                                      <div className="col-lg-12">
                                        <div className="card card_shadow ">
                                          <div className="card-header  card-header-light-blue align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                              Notes
                                            </h4>
                                          </div>
                                          {/* end card header */}
                                          <div className="card-body">
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div className="mb-3">
                                                  <textarea
                                                    type="text"
                                                    className={errors3["notes"] ? "error-field form-control" : "form-control"}

                                                    placeholder="Enter Notes"
                                                    name="notes"
                                                    id="notes"
                                                    value={
                                                      getPartnershipDetails.notes
                                                    }
                                                    onChange={(e) => handleChange3(e)}
                                                  />
                                                  {errors3["notes"] && (
                                                    <div className="error-text">
                                                      {errors3["notes"]}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>



                                    </div>

                                  ) :
                                    selectClientType == 6 ? (
                                      <div className="row ">
                                        <div className="col-lg-12">
                                          <div className="card card_shadow ">
                                            <div className="card-header  card-header-light-blue align-items-center d-flex">
                                              <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                Unincorporated Association Information
                                              </h4>
                                            </div>
                                            {/* end card header */}
                                            <div className="card-body">
                                              <div className="row">
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      Association Name
                                                      <span style={{ color: "red" }}>
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className={errors6["AssociationName"] ? "error-field form-control" : "form-control"}

                                                      placeholder="Association Name"
                                                      name="AssociationName"
                                                      id="AssociationName"
                                                      value={getAssociationDetails.AssociationName}
                                                      onChange={(e) => handleChange6(e)}
                                                      maxLength={200}
                                                    />
                                                    {errors6["AssociationName"] && (
                                                      <div className="error-text">
                                                        {errors6["AssociationName"]}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      Association Address
                                                      <span style={{ color: "red" }}>
                                                        *
                                                      </span>{" "}
                                                    </label>
                                                    <input
                                                      type="text"
                                                      className={errors6["AssociationAddress"] ? "error-field form-control" : "form-control"}
                                                      maxLength={200}
                                                      placeholder="Association Address"
                                                      name="AssociationAddress"
                                                      id="AssociationAddress"
                                                      value={
                                                        getAssociationDetails.AssociationAddress
                                                      }
                                                      onChange={(e) => handleChange6(e)}

                                                    />
                                                    {errors6["AssociationAddress"] && (
                                                      <div className="error-text">
                                                        {errors6["AssociationAddress"]}
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
                                                        onChange={(e) => handleChange6(e)}
                                                      >
                                                        <option value={1}>Yes</option>
                                                        <option value={0}>No</option>
                                                      </select>
                                                      {errors6["VATRegistered"] && (
                                                        <div className="error-text">
                                                          {errors6["VATRegistered"]}
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
                                                          getAssociationDetails.VATNumber
                                                        }
                                                        onChange={(e) => handleChange6(e)}
                                                        maxLength={9}
                                                      />
                                                      {errors6["VATNumber"] && (
                                                        <div className="error-text">
                                                          {errors6["VATNumber"]}
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
                                                        getAssociationDetails.Website
                                                      }
                                                      onChange={(e) => handleChange6(e)}
                                                      maxLength={200}
                                                    />

                                                    {errors6["Website"] && (
                                                      <div style={{ color: "red" }}>
                                                        {errors6["Website"]}
                                                      </div>
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
                                              <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                Members Details
                                              </h4>
                                            </div>
                                            <div className="card-body">
                                              <div className="row">

                                                {contactsMembersUnincorporated.map((contact, index) => (
                                                  <div className="col-xxl-12 col-lg-12">
                                                    <div className="card pricing-box p-3 m-2 mt-0">
                                                      <div className="row">
                                                        <div className="col-lg-12">
                                                          <div>
                                                            <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                          </div>
                                                          <div
                                                            className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                            dir="ltr"
                                                          >

                                                            {index !== 0 &&
                                                              (
                                                                <div>
                                                                  <button
                                                                    className="delete-icon"
                                                                    type="button"
                                                                    onClick={() =>
                                                                      handleDeleteContactMemberDetailsUnincorporated(
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

                                                              className={errorMemberDetailsUnincorporated[index]?.first_name ? "error-field form-control" : "form-control"}

                                                              placeholder="First Name"
                                                              name="first_name"
                                                              id={`first_name-${index}`}
                                                              value={
                                                                contacts1?.first_name
                                                              }
                                                              maxLength={50}
                                                              onChange={(e) =>
                                                                handleChangeMemberUnincorporated(
                                                                  index,
                                                                  "first_name",
                                                                  e.target.value
                                                                )
                                                              }

                                                            />
                                                            {errorMemberDetailsUnincorporated[index]
                                                              ?.first_name && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorMemberDetailsUnincorporated[index]?.first_name
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
                                                              className={errorMemberDetailsUnincorporated[index]?.last_name ? "error-field form-control" : "form-control"}

                                                              placeholder=" Last Name"
                                                              name="last_name"
                                                              id={`last_name-${index}`}
                                                              value={
                                                                contacts1?.last_name
                                                              }
                                                              onChange={(e) =>
                                                                handleChangeMemberUnincorporated(
                                                                  index,
                                                                  "last_name",
                                                                  e.target.value
                                                                )
                                                              }
                                                              maxLength={50}
                                                            />
                                                            {errorMemberDetailsUnincorporated[index]
                                                              ?.last_name && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorMemberDetailsUnincorporated[index]?.last_name
                                                                  }
                                                                </div>
                                                              )}
                                                          </div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                          <div className="mb-3">
                                                            <label className="form-label">
                                                              Role

                                                            </label>

                                                            <select
                                                              className="form-select"
                                                              id={`role-${index}`}
                                                              value={contacts1?.role}
                                                              onChange={(e) =>
                                                                handleChangeMemberUnincorporated(
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
                                                            {errorMemberDetailsUnincorporated[index]?.role && (
                                                              <div className="error-text">
                                                                {
                                                                  errorMemberDetailsUnincorporated[index]?.role
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
                                                                    handleChangeMemberUnincorporated(
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
                                                                    handleChangeMemberUnincorporated(
                                                                      index,
                                                                      "phone",
                                                                      e.target.value
                                                                    )
                                                                  }
                                                                  maxLength={12}
                                                                />
                                                                {errorMemberDetailsUnincorporated[index]
                                                                  .phone && (
                                                                    <div className="error-text">
                                                                      {
                                                                        errorMemberDetailsUnincorporated[
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
                                                                    handleChangeMemberUnincorporated(
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
                                                                  placeholder=" Alternate Phone Number"
                                                                  name="alternate_phone"
                                                                  id={`alternate_phone-${index}`}
                                                                  value={
                                                                    contacts1.alternate_phone
                                                                  }
                                                                  onChange={(e) =>
                                                                    handleChangeMemberUnincorporated(
                                                                      index,
                                                                      "alternate_phone",
                                                                      e.target.value
                                                                    )
                                                                  }
                                                                />
                                                                {errorMemberDetailsUnincorporated[index]
                                                                  .alternate_phone && (
                                                                    <div className="error-text">
                                                                      {
                                                                        errorMemberDetailsUnincorporated[
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

                                                            </label>
                                                            <input
                                                              type="text"
                                                              className="form-control"
                                                              placeholder="Enter Email"
                                                              name="email"
                                                              id={`email-${index}`}
                                                              value={contacts1.email}
                                                              onChange={(e) =>
                                                                handleChangeMemberUnincorporated(
                                                                  index,
                                                                  "email",
                                                                  e.target.value
                                                                )
                                                              }
                                                            />
                                                            {errorMemberDetailsUnincorporated[index]
                                                              .email && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorMemberDetailsUnincorporated[index]
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
                                                                handleChangeMemberUnincorporated(
                                                                  index,
                                                                  "alternate_email",
                                                                  e.target.value
                                                                )
                                                              }
                                                            />
                                                            {errorMemberDetailsUnincorporated[index]
                                                              .alternate_email && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorMemberDetailsUnincorporated[index]
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
                                                      onClick={handleAddContactMemberDetailsUnincorporated}
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


                                        <div className="col-lg-12">
                                          <div className="card card_shadow ">
                                            <div className="card-header  card-header-light-blue align-items-center d-flex">
                                              <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                Notes
                                              </h4>
                                            </div>
                                            {/* end card header */}
                                            <div className="card-body">
                                              <div className="row">
                                                <div className="col-lg-12">
                                                  <div className="mb-3">
                                                    <textarea
                                                      type="text"
                                                      className={errors6["notes"] ? "error-field form-control" : "form-control"}

                                                      placeholder="Enter Notes"
                                                      name="notes"
                                                      id="notes"
                                                      value={
                                                        getAssociationDetails.notes
                                                      }
                                                      onChange={(e) => handleChange6(e)}
                                                    />
                                                    {errors6["notes"] && (
                                                      <div className="error-text">
                                                        {errors6["notes"]}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>



                                      </div>

                                    ) :

                                      selectClientType == 7 ? (
                                        <div className="row ">
                                          <div className="col-lg-12">
                                            <div className="card card_shadow ">
                                              <div className="card-header  card-header-light-blue align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                  Trust Information
                                                </h4>
                                              </div>
                                              {/* end card header */}
                                              <div className="card-body">
                                                <div className="row">
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Trust  Name
                                                        <span style={{ color: "red" }}>
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className={errors7["TrustName"] ? "error-field form-control" : "form-control"}

                                                        placeholder="Trust Name"
                                                        name="TrustName"
                                                        id="TrustName"
                                                        value={
                                                          getTrust.TradingName
                                                        }
                                                        onChange={(e) => handleChange7(e)}
                                                        maxLength={200}
                                                      />
                                                      {errors7["TrustName"] && (
                                                        <div className="error-text">
                                                          {errors7["TrustName"]}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="col-lg-4">
                                                    <div className="mb-3">
                                                      <label className="form-label">
                                                        Trust  Address
                                                        <span style={{ color: "red" }}>
                                                          *
                                                        </span>{" "}
                                                      </label>
                                                      <input
                                                        type="text"
                                                        className={errors7["TrustAddress"] ? "error-field form-control" : "form-control"}
                                                        maxLength={200}
                                                        placeholder="Trust Address"
                                                        name="TrustAddress"
                                                        id="TrustAddress"
                                                        value={
                                                          getTrust.TrustAddress
                                                        }
                                                        onChange={(e) => handleChange7(e)}

                                                      />
                                                      {errors7["TrustAddress"] && (
                                                        <div className="error-text">
                                                          {errors7["TrustAddress"]}
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
                                                          onChange={(e) => handleChange7(e)}
                                                        >
                                                          <option value={1}>Yes</option>
                                                          <option value={0}>No</option>
                                                        </select>
                                                        {errors7["VATRegistered"] && (
                                                          <div className="error-text">
                                                            {errors7["VATRegistered"]}
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
                                                            getTrust.VATNumber
                                                          }
                                                          onChange={(e) => handleChange7(e)}
                                                          maxLength={9}
                                                        />
                                                        {errors7["VATNumber"] && (
                                                          <div className="error-text">
                                                            {errors7["VATNumber"]}
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
                                                          getTrust.Website
                                                        }
                                                        onChange={(e) => handleChange7(e)}
                                                        maxLength={200}
                                                      />

                                                      {errors7["Website"] && (
                                                        <div style={{ color: "red" }}>
                                                          {errors7["Website"]}
                                                        </div>
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
                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                Beneficiaries Details
                                                </h4>
                                              </div>
                                              <div className="card-body">
                                                <div className="row">
                                                  {contactsMembersTrust.map((contact, index) => (
                                                    <div className="col-xxl-12 col-lg-12">
                                                      <div className="card pricing-box p-3 m-2 mt-0">
                                                        <div className="row">
                                                          <div className="col-lg-12">
                                                            <div>
                                                              <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                            </div>
                                                            <div
                                                              className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                              dir="ltr"
                                                            >

                                                              {index !== 0 && (
                                                                  <div>
                                                                    <button
                                                                      className="delete-icon"
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleDeleteContactTrustmemberDetails(
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

                                                                className={errorMemberTrustDetails[index]?.first_name ? "error-field form-control" : "form-control"}

                                                                placeholder="First Name"
                                                                name="first_name"
                                                                id={`first_name-${index}`}
                                                                value={
                                                                  contacts1?.first_name
                                                                }
                                                                maxLength={50}
                                                                onChange={(e) =>
                                                                  handleChangeTrust(
                                                                    index,
                                                                    "first_name",
                                                                    e.target.value
                                                                  )
                                                                }

                                                              />
                                                              {errorMemberTrustDetails[index]
                                                                ?.first_name && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberTrustDetails[index]
                                                                        ?.first_name
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
                                                                className={errorMemberTrustDetails[index]?.last_name ? "error-field form-control" : "form-control"}

                                                                placeholder=" Last Name"
                                                                name="last_name"
                                                                id={`last_name-${index}`}
                                                                value={
                                                                  contacts1?.last_name
                                                                }
                                                                onChange={(e) =>
                                                                  handleChangeTrust(
                                                                    index,
                                                                    "last_name",
                                                                    e.target.value
                                                                  )
                                                                }
                                                                maxLength={50}
                                                              />
                                                              {errorMemberTrustDetails[index]
                                                                ?.last_name && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberTrustDetails[index]
                                                                        ?.last_name
                                                                    }
                                                                  </div>
                                                                )}
                                                            </div>
                                                          </div>
                                                          <div className="col-lg-4">
                                                            <div className="mb-3">
                                                              <label className="form-label">
                                                                Role

                                                              </label>

                                                              <select
                                                                className="form-select"
                                                                id={`role-${index}`}
                                                                value={contacts1?.role}
                                                                onChange={(e) =>
                                                                  handleChangeTrust(
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
                                                              {errorMemberTrustDetails[index]?.role && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorMemberTrustDetails[index]?.role
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
                                                                      handleChangeTrust(
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
                                                                      handleChangeTrust(
                                                                        index,
                                                                        "phone",
                                                                        e.target.value
                                                                      )
                                                                    }
                                                                    maxLength={12}
                                                                  />
                                                                  {errorMemberTrustDetails[index]
                                                                    .phone && (
                                                                      <div className="error-text">
                                                                        {
                                                                          errorMemberTrustDetails[
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
                                                                      handleChangeTrust(
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
                                                                    placeholder=" Alternate Phone Number"
                                                                    name="alternate_phone"
                                                                    id={`alternate_phone-${index}`}
                                                                    value={
                                                                      contacts1.alternate_phone
                                                                    }
                                                                    onChange={(e) =>
                                                                      handleChangeTrust(
                                                                        index,
                                                                        "alternate_phone",
                                                                        e.target.value
                                                                      )
                                                                    }
                                                                  />
                                                                  {errorMemberTrustDetails[index]
                                                                    .alternate_phone && (
                                                                      <div className="error-text">
                                                                        {
                                                                          errorMemberTrustDetails[
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

                                                              </label>
                                                              <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email"
                                                                name="email"
                                                                id={`email-${index}`}
                                                                value={contacts1.email}
                                                                onChange={(e) =>
                                                                  handleChangeTrust(
                                                                    index,
                                                                    "email",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorMemberTrustDetails[index]
                                                                .email && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberTrustDetails[index]
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
                                                                  handleChangeTrust(
                                                                    index,
                                                                    "alternate_email",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorMemberTrustDetails[index]
                                                                .alternate_email && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorMemberTrustDetails[index]
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
                                                        onClick={handleAddContactTrustMemberDetails}
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

                                          <div className="col-lg-12">
                                            <div className="card card_shadow">
                                              <div className="card-header card-header-light-blue align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                Trustees Details
                                                </h4>
                                              </div>
                                              <div className="card-body">
                                                <div className="row">
                                                  {contactsTrustTrustee.map((contact, index) => (
                                                    <div className="col-xxl-12 col-lg-12">
                                                      <div className="card pricing-box p-3 m-2 mt-0">
                                                        <div className="row">
                                                          <div className="col-lg-12">
                                                            <div>
                                                              <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                            </div>
                                                            <div
                                                              className="form-check form-switch form-switch-md d-flex justify-content-end"
                                                              dir="ltr"
                                                            >

                                                              {index !== 0 && (
                                                                  <div>
                                                                    <button
                                                                      className="delete-icon"
                                                                      type="button"
                                                                      onClick={() =>
                                                                        handleDeleteContactTrusTrusteeDetails(
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

                                                                className={errorTrustTrusteeDetails[index]?.first_name ? "error-field form-control" : "form-control"}

                                                                placeholder="First Name"
                                                                name="first_name"
                                                                id={`first_name-${index}`}
                                                                value={
                                                                  contacts1?.first_name
                                                                }
                                                                maxLength={50}
                                                                onChange={(e) =>
                                                                  handleChangeTrustTrustee(
                                                                    index,
                                                                    "first_name",
                                                                    e.target.value
                                                                  )
                                                                }

                                                              />
                                                              {errorTrustTrusteeDetails[index]
                                                                ?.first_name && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrustTrusteeDetails[index]
                                                                        ?.first_name
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
                                                                className={errorTrustTrusteeDetails[index]?.last_name ? "error-field form-control" : "form-control"}

                                                                placeholder=" Last Name"
                                                                name="last_name"
                                                                id={`last_name-${index}`}
                                                                value={
                                                                  contacts1?.last_name
                                                                }
                                                                onChange={(e) =>
                                                                  handleChangeTrustTrustee(
                                                                    index,
                                                                    "last_name",
                                                                    e.target.value
                                                                  )
                                                                }
                                                                maxLength={50}
                                                              />
                                                              {errorTrustTrusteeDetails[index]
                                                                ?.last_name && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrustTrusteeDetails[index]
                                                                        ?.last_name
                                                                    }
                                                                  </div>
                                                                )}
                                                            </div>
                                                          </div>
                                                          <div className="col-lg-4">
                                                            <div className="mb-3">
                                                              <label className="form-label">
                                                                Role

                                                              </label>

                                                              <select
                                                                className="form-select"
                                                                id={`role-${index}`}
                                                                value={contacts1?.role}
                                                                onChange={(e) =>
                                                                  handleChangeTrustTrustee(
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
                                                              {errorTrustTrusteeDetails[index]?.role && (
                                                                <div className="error-text">
                                                                  {
                                                                    errorTrustTrusteeDetails[index]?.role
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
                                                                      handleChangeTrustTrustee(
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
                                                                      handleChangeTrustTrustee(
                                                                        index,
                                                                        "phone",
                                                                        e.target.value
                                                                      )
                                                                    }
                                                                    maxLength={12}
                                                                  />
                                                                  {errorTrustTrusteeDetails[index]
                                                                    .phone && (
                                                                      <div className="error-text">
                                                                        {
                                                                          errorTrustTrusteeDetails[
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
                                                                      handleChangeTrustTrustee(
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
                                                                    placeholder=" Alternate Phone Number"
                                                                    name="alternate_phone"
                                                                    id={`alternate_phone-${index}`}
                                                                    value={
                                                                      contacts1.alternate_phone
                                                                    }
                                                                    onChange={(e) =>
                                                                      handleChangeTrustTrustee(
                                                                        index,
                                                                        "alternate_phone",
                                                                        e.target.value
                                                                      )
                                                                    }
                                                                  />
                                                                  {errorTrustTrusteeDetails[index]
                                                                    .alternate_phone && (
                                                                      <div className="error-text">
                                                                        {
                                                                          errorTrustTrusteeDetails[
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

                                                              </label>
                                                              <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email"
                                                                name="email"
                                                                id={`email-${index}`}
                                                                value={contacts1.email}
                                                                onChange={(e) =>
                                                                  handleChangeTrustTrustee(
                                                                    index,
                                                                    "email",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorTrustTrusteeDetails[index]
                                                                .email && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrustTrusteeDetails[index]
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
                                                                  handleChangeTrustTrustee(
                                                                    index,
                                                                    "alternate_email",
                                                                    e.target.value
                                                                  )
                                                                }
                                                              />
                                                              {errorTrustTrusteeDetails[index]
                                                                .alternate_email && (
                                                                  <div className="error-text">
                                                                    {
                                                                      errorTrustTrusteeDetails[index]
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
                                                        onClick={handleAddContactTrustTrusteeDetails}
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


                                          <div className="col-lg-12">
                                            <div className="card card_shadow ">
                                              <div className="card-header  card-header-light-blue align-items-center d-flex">
                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                  Notes
                                                </h4>
                                              </div>
                                              {/* end card header */}
                                              <div className="card-body">
                                                <div className="row">
                                                  <div className="col-lg-12">
                                                    <div className="mb-3">
                                                      <textarea
                                                        type="text"
                                                        className={errors7["notes"] ? "error-field form-control" : "form-control"}

                                                        placeholder="Enter Notes"
                                                        name="notes"
                                                        id="notes"
                                                        value={
                                                          getTrust.notes
                                                        }
                                                        onChange={(e) => handleChange7(e)}
                                                      />
                                                      {errors7["notes"] && (
                                                        <div className="error-text">
                                                          {errors7["notes"]}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                        </div>

                                      ) :
                                        (
                                          ""
                                        )}
                        </section>
                      </div>
                      <div className="hstack gap-2 justify-content-end">

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
