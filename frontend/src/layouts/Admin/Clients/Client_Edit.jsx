import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetClientIndustry, Edit_Client, ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { GetAllCompany, GetOfficerDetails } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { validate, ScrollToViewFirstErrorContactForm, convertDate, ScrollToViewFirstError } from '../../../Utils/Comman_function'
import { PersonRole, Country, IncorporationApi } from "../../../ReduxStore/Slice/Settings/settingSlice";

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
  const [incorporationDataAll, setIncorporationDataAll] = useState([]);
  const [personRoleDataAll, setPersonRoleDataAll] = useState({ loading: true, data: [], });
  const [countryDataAll, setCountryDataAll] = useState({ loading: true, data: [], });
  const [getClientDetails, setClientDetails] = useState({ loading: true, data: [] });
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

  const [getAssociationDetails, setAssociationDetails] = useState({
    AssociationName: "",
    AssociationAddress: "",
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

  const [errorMemberDetails, setErrorMemberDetails] = useState([
    {
      authorised_signatory_status: true,
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

  const [errorTrusteeDetails, setErrorTrusteeDetails] = useState([
    {
      authorised_signatory_status: true,
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

  const [errorMemberTrustDetails, setErrorMemberTrustDetails] = useState([
    {
      authorised_signatory_status: true,
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

  const [errorTrustTrusteeDetails, setErrorTrustTrusteeDetails] = useState([
    {
      authorised_signatory_status: true,
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
    VATRegistered: "",
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
    VATRegistered: "",
    VATNumber: "",
    Website: "",
    notes: "",
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

  const [contactsMembers, setContactsMembers] = useState([
    {
      authorised_signatory_status: true,
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

  const [contactsTrustee, setContactsTrustee] = useState([
    {
      authorised_signatory_status: true,
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

  const [getIndivisualDetails, setIndivisualDetails] = useState({
    TradingName: "",
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    residentialAddress: "",
    phone_code: "+44",
    notes: "",
  });

  const [contactsMembersUnincorporated, setContactsMembersUnincorporated] = useState([
    {
      authorised_signatory_status: true,
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

  const [contactsTrustTrustee, setContactsTrustTrustee] = useState([
    {
      authorised_signatory_status: true,
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

  const [errorMemberDetailsUnincorporated, setErrorMemberDetailsUnincorporated] = useState([
    {
      authorised_signatory_status: true,
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

  useEffect(() => {
    setSelectClientType(
      location.state.row.client_type_name == "SoleTrader" ? 1
        : location.state.row.client_type_name == "Company" ? 2
          : location.state.row.client_type_name == "Partnership" ? 3
            : location.state.row.client_type_name == "Individual" ? 4
              : location.state.row.client_type_name == "Charity Incorporated Organisation" ? 5
                : location.state.row.client_type_name == "Charity Unincorporated Association" ? 6
                  : 7
    );
    CountryData();
    CustomerPersonRoleData();
    GetClientDetails();
    getClientIndustry();
    incorporationData();
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
        notes:
          !getClientDetails.loading && getClientDetails.data.client.notes,
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
        notes:
          !getClientDetails.loading && getClientDetails.data.client.notes,
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


      if (getClientDetails?.data?.contact_details) {
        const newErrors = [...companyContactsErrors];
        for (let i = 1; i < getClientDetails.data.contact_details.length; i++) {
          newErrors.push({

            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",

          });
        }

        setPartnershipContactsErrors(newErrors);
      }



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
        notes:
          !getClientDetails.loading && getClientDetails.data.client.notes,
      }));
      setPartnershipContacts(
        getClientDetails.data && getClientDetails.data.contact_details
      );

      if (getClientDetails?.data?.contact_details) {
        const newErrors = [...PartnershiContactsErrors];
        for (let i = 2; i < getClientDetails.data.contact_details.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            email: "",
          });
        }

        setPartnershipContactsErrors(newErrors);
      }
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
          getClientDetails.data.contact_details[0]?.email,
        residentialAddress:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].residential_address,
        phone_code:
          !getClientDetails.loading &&
          getClientDetails.data.contact_details[0].phone_code,
        notes:
          !getClientDetails.loading && getClientDetails.data.client.notes,
      }));
    }
    if (location.state.row.client_type_name == "Charity Incorporated Organisation") {
      setCharityIncorporatedOrganisation((prevState) => ({
        ...prevState,
        charity_name: !getClientDetails.loading && getClientDetails.data.client.trading_name,
        TradingName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
        charity_commission_number: !getClientDetails.loading && getClientDetails.data.client.charity_commission_number,
        principal_office_address: !getClientDetails.loading && getClientDetails.data.client.trading_address,
        service_address: !getClientDetails.loading && getClientDetails.data.client.service_address,
        VATRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
        VATNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
        Website: !getClientDetails.loading && getClientDetails.data.client.website,
        notes: !getClientDetails.loading && getClientDetails.data.client.notes,
      }));
      if (getClientDetails?.data?.member_details) {

        setContactsMembers(getClientDetails?.data?.member_details)

        const newErrors = [...errorMemberDetails];
        for (let i = 1; i < getClientDetails?.data?.member_details?.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",
          });
        }
        setErrorMemberDetails(newErrors);
      }

      if (getClientDetails?.data?.trustee_details) {
        setContactsTrustee(getClientDetails?.data?.trustee_details)
        const newErrors = [...errorTrusteeDetails];
        for (let i = 1; i < getClientDetails?.data?.trustee_details?.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",
          });
        }
        setErrorTrusteeDetails(newErrors);
      }

    }
    if (location?.state?.row?.client_type_name == "Charity Unincorporated Association") {
      setAssociationDetails((prevState) => ({
        ...prevState,
        AssociationName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
        AssociationAddress: !getClientDetails.loading && getClientDetails.data.client.trading_address,
        VATRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
        VATNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
        Website: !getClientDetails.loading && getClientDetails.data.client.website,

        notes: !getClientDetails.loading && getClientDetails.data.client.notes,
      }));
      if (getClientDetails?.data?.member_details) {
        setContactsMembersUnincorporated(getClientDetails?.data?.member_details)
        const newErrors = [...errorMemberDetailsUnincorporated];
        for (let i = 1; i < getClientDetails?.data?.member_details?.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",
          });
        }
        setErrorMemberDetailsUnincorporated(newErrors);
      }
    }
    if (location?.state?.row?.client_type_name == "Trust") {

      
      setTrust((prevState) => ({
        ...prevState,
        TrustName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
        TrustAddress: !getClientDetails.loading && getClientDetails.data.client.trading_address,
        VATRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
        VATNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
        Website: !getClientDetails.loading && getClientDetails.data.client.website,
        notes: !getClientDetails.loading && getClientDetails.data.client.notes,
      }));
      if (getClientDetails?.data?.beneficiaries_details) {

        setContactsMembersTrust(getClientDetails?.data?.beneficiaries_details)
        const newErrors = [...errorMemberTrustDetails];
        for (let i = 1; i < getClientDetails?.data?.beneficiaries_details?.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",
          });
        }
        setErrorMemberTrustDetails(newErrors);
      }

      if (getClientDetails?.data?.trustee_details) {
        setContactsTrustTrustee(getClientDetails?.data?.trustee_details)
        const newErrors = [...errorTrustTrusteeDetails];
        for (let i = 1; i < getClientDetails?.data?.trustee_details?.length; i++) {
          newErrors.push({
            first_name: "",
            last_name: "",
            customer_contact_person_role_id: "",
            phone: "",
            alternate_phone: "",
            email: "",
            alternate_email: "",
          });
        }
        setErrorTrustTrusteeDetails(newErrors);
      }
    }
  }, [getClientDetails?.data]);


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

  const handleAddContactMemberDetails = () => {
    setContactsMembers([
      ...contactsMembers,
      {
        authorised_signatory_status: true,
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
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

  const handleAddContactTrusteeDetails = () => {
    setContactsTrustee([
      ...contactsTrustee,
      {
        authorised_signatory_status: true,
        first_name: "",
        last_name: "",
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
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
        customer_contact_person_role_id: "",
        phone: "",
        alternate_phone: "",
        email: "",
        alternate_email: "",
      },
    ]);
  };

  const handleDeleteCompanyContact = (index) => {
    const newContacts = CompanyContacts.filter((_, i) => i !== index);
    const newErrors = companyContactsErrors.filter((_, i) => i !== index);
    setCompanyContacts(newContacts);
    setCompanyContactsErrors(newErrors);
  };

  const handleDeleteContactMemberDetails = (index) => {
    const newContacts = contactsMembers?.filter((_, i) => i !== index);
    const newErrors = errorMemberDetails?.filter((_, i) => i !== index);
    setContactsMembers(newContacts);
    setErrorMemberDetails(newErrors);
  };

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


  const Get_Officer_Details = async (company_number) => {
    const data = { company_number: company_number };
    await dispatch(GetOfficerDetails(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          if (res.data.length > 0) {
            const officer_name = res.data[0].name.split(", ").map(part => part?.trim());
            let first_name = officer_name[1]
            let last_name = officer_name[0]
            if (officer_name[1] == undefined) {
              first_name = officer_name[0]
              last_name = ""
            }

            setCompanyContacts((prevContacts) => {
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
            setCompanyContacts((prevContacts) => {
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

  const handleChangeMember = (index, field, value) => {
    setContactsMembers((prevContacts) =>
      prevContacts.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
    validateContactMemberField(index, field, value);
  };

  const handleChangeTrustee = (index, field, value) => {
    setContactsTrustee((prevContacts) =>
      prevContacts.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
    validateContactTrusteeField(index, field, value);

  };

  const handleChangeTrust = (index, field, value) => {
    setContactsMembersTrust((prevContacts) =>
      prevContacts.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
    validateContactMemberTrust(index, field, value);
  };

  const handleChangeTrustTrustee = (index, field, value) => {
    setContactsTrustTrustee((prevContacts) =>
      prevContacts.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
    validateContactTrustTrustee(index, field, value);
  };

  const handleChangeMemberUnincorporated = (index, field, value) => {
    setContactsMembersUnincorporated((prevContacts) =>
      prevContacts.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
    validateContactMemberFieldUnincorporated(index, field, value);

  };

  const validate5 = (name, value) => {
    const newErrors = { ...errors5 }

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

  const validateField = (index, field, value, Type) => {
    const errors = ErrorsArr[Type - 1];
    const newErrors = [...errors];
    
    
    switch (field) {
      case "first_name":
      case "last_name":
        if (!value?.trim()) {
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
        if (!value?.trim()) {
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

  const handleDeleteContactMemberDetailsUnincorporated = (index) => {
    const newContacts = contactsMembersUnincorporated.filter((_, i) => i !== index);
    const newErrors = errorMemberDetailsUnincorporated.filter((_, i) => i !== index);
    setContactsMembersUnincorporated(newContacts);
    setErrorMemberDetailsUnincorporated(newErrors);
  }

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
      })
  };

  const handleUpdate = async () => {
    

    console.log("selectClientType", selectClientType)
    console.log("validateAllFields(1)", validateAllFields(1))



    if (selectClientType == 1 && validateAllFields(1)) {
      const req = {
        client_type: "1",
        client_id: location.state.row.id,
        customer_id: location.state.id,
        client_industry_id: getSoleTraderDetails.IndustryType,
        trading_name: (getSoleTraderDetails.TradingName).trim(),
        trading_address: getSoleTraderDetails.TradingAddress,
        vat_registered: getSoleTraderDetails.VATRegistered,
        vat_number: getSoleTraderDetails.VATNumber,
        website: getSoleTraderDetails.website,
        notes: getSoleTraderDetails.notes,
        first_name: getSoleTraderDetails.first_name,
        last_name: getSoleTraderDetails.last_name,
        phone: getSoleTraderDetails.phone,
        email: getSoleTraderDetails?.email,
        residential_address: getSoleTraderDetails.residentialAddress,
        client_code: location.state.row.id,
        phone_code: getSoleTraderDetails.phone_code,
      };
      await EditClientFun(req);
    }
    else if (selectClientType == 2 && validateAllFields(2)) {
      let formIsValid = true;
      const newErrors = CompanyContacts.map((contact, index) => {
        const error = {
          first_name: contact.first_name?.trim() ? "" : "First Name is required",
          last_name: contact.last_name?.trim() ? "" : "Last Name is required",
          phone:
            contact.phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          email:
            contact?.email?.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.email)
                ? ""
                : "Valid Email is required",
        };
        if (
          error.first_name ||
          error.last_name ||
          error.customer_contact_person_role_id ||
          error.phone ||
          error?.email
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
          notes: getCompanyDetails.notes,
          client_industry_id: Number(getCompanyDetails.ClientIndustry),
          trading_name: (getCompanyDetails.TradingName).trim(),
          trading_address: getCompanyDetails.TradingAddress,
          contactDetails: CompanyContacts,
        };
        await EditClientFun(req);
      }
      else {
        ScrollToViewFirstErrorContactForm(companyContactsErrors);
      }
    }
    else if (selectClientType == 3 && validateAllFields(3)) {
      let formIsValid = true;
      const newErrors = partnershipContacts.map((contact, index) => {
        const error = {
          first_name: contact.first_name?.trim() ? "" : "First Name is required",
          last_name: contact.last_name?.trim() ? "" : "Last Name is required",
          phone:
            contact.phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact.phone)
                ? ""
                : "Phone Number must be between 9 to 12 digits",
          alternate_phone:
            contact?.alternate_phone?.trim() === ""
              ? ""
              : /^\d{9,12}$/.test(contact?.alternate_phone)
                ? ""
                : "Alternate Phone Number must be between 9 to 12 digits",
          email:
            contact?.email?.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.email)
                ? ""
                : "Valid Email is required",
          alternate_email:
            contact?.alternate_email?.trim() === ""
              ? ""
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact?.alternate_email)
                ? ""
                : "Valid Email is required",
        };

        if (
          error.first_name ||
          error.last_name ||
          error.customer_contact_person_role_id ||
          error.phone ||
          error?.email
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
          trading_name: (getPartnershipDetails.TradingName).trim(),
          trading_address: getPartnershipDetails.TradingAddress,
          vat_registered: getPartnershipDetails.VATRegistered,
          vat_number: getPartnershipDetails.VATNumber,
          website: getPartnershipDetails.Website,
          notes: getPartnershipDetails.notes,
          contactDetails: partnershipContacts,
        };
        await EditClientFun(req);
      }
      else {
        ScrollToViewFirstErrorContactForm(PartnershiContactsErrors);
      }
    }
    else if (selectClientType == 4 && validateAllFields(4)) {
      const req = {
        client_type: "4",
        client_id: location.state.row.id,
        customer_id: location.state.id,
        trading_name: (getIndivisualDetails.TradingName).trim(),
        first_name: getIndivisualDetails.first_name,
        last_name: getIndivisualDetails.last_name,
        phone: getIndivisualDetails.phone,
        email: getIndivisualDetails?.email,
        residential_address: getIndivisualDetails.residentialAddress,
        client_code: location.state.row.id,
        phone_code: getIndivisualDetails.phone_code,
        notes: getIndivisualDetails.notes,
      };
      await EditClientFun(req);

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
          client_id: location.state.row.id,
          trading_name: (getCharityIncorporatedOrganisation.charity_name).trim(),
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
        await EditClientFun(req);

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
          client_id: location.state.row.id,
          customer_id: location.state.id,
          trading_name: (getAssociationDetails.AssociationName).trim(),
          trading_address: getAssociationDetails.AssociationAddress,
          vat_registered: getAssociationDetails.VATRegistered,
          vat_number: getAssociationDetails.VATNumber,
          website: getAssociationDetails.Website,
          notes: getAssociationDetails.notes,
          member_details: contactsMembersUnincorporated,
        };
        await EditClientFun(req);

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
          client_id: location.state.row.id,
          customer_id: location.state.id,
          trading_name: (getTrust.TrustName).trim(),
          trading_address: getTrust.TrustAddress,
          vat_registered: getTrust.VATRegistered,
          vat_number: getTrust.VATNumber,
          website: getTrust.Website,
          notes: getTrust.notes,
          trustee_details: contactsTrustTrustee,
          beneficiaries_details: contactsMembersTrust,
        };
        await EditClientFun(req);

      }
     
    }





  };

  const FilterSearchDetails = () => {
    const filterData = getAllSearchCompany.filter(
      (data) => data.title === searchItem
    );
    setSearchDetails(filterData);
  };



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
                  onClick={() => {
                    sessionStorage.setItem('activeTab', location.state.activeTab);
                    window.history.back()
                  }}
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
                                      <option value={5}>Charity Incorporated Organisation</option>
                                      <option value={6}>Charity Unincorporated Association</option>
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
                                    <h4 className="card-title fs-16 mb-0 fs-16">
                                      Sole Trader Information
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
                                            className={errors1["IndustryType"] ? "error-field form-select mb-3" : "form-select mb-3"}
                                            autoFocus
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
                                            className={errors1["TradingName"] ? "error-field form-control" : "form-control"}

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
                                            className={errors1["TradingAddress"] ? "error-field form-control" : "form-control"}
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
                                            className={errors1["VATRegistered"] ? "error-field form-select " : "form-select "}
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
                                          className={errors1["first_name"] ? "error-field form-control" : "form-control"}
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
                                          className={errors1["last_name"] ? "error-field form-control" : "form-control"}
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
                                              className={errors1["phone"] ? "error-field form-control" : "form-control"}

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

                                        </label>
                                        <input
                                          type="text"
                                          className={errors1["email"] ? "error-field form-control" : "form-control"}
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
                                <div className="card ">
                                  <div className="card-header card-header-light-blue ">
                                    <h4 className="card-title fs-16 mb-0">
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
                                          onChange={(e) => handleInputsChange(e, 1)}
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
                                                autoFocus
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
                                              className={errors2["CompanyName"] ? "error-field form-control" : "form-control"}
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
                                              className={errors2["EntityType"] ? "error-field form-control" : "form-control"}
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
                                              className={errors2["CompanyStatus"] ? "error-field form-control" : "form-control"}
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
                                              className={errors2["CompanyNumber"] ? "error-field form-control" : "form-control"}

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
                                              <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input
                                              type="date"
                                              className={errors2["IncorporationDate"] ? "error-field form-control" : "form-control"}
                                              placeholder="07-01-2023"
                                              name="IncorporationDate"
                                              id="IncorporationDate"
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              // value={
                                              //   convertDate(getCompanyDetails.IncorporationDate)
                                              // }
                                              value={getCompanyDetails?.IncorporationDate}
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
                                              className={errors2["RegisteredOfficeAddress"] ? "error-field form-control" : "form-control"}
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
                                            {/* <input
                                              type="text"
                                              className={errors2["IncorporationIn"] ? "error-field form-control" : "form-control"}
                                              placeholder="Please Enter Incorporation In"
                                              name="IncorporationIn"
                                              id="IncorporationIn"
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              value={
                                                getCompanyDetails.IncorporationIn
                                              }
                                            /> */}

                                            <select
                                              className={errors2["IncorporationIn"] ? "error-field form-select" : "form-select"}

                                              name="IncorporationIn"
                                              id="IncorporationIn"
                                              onChange={(e) => handleInputsChange(e, 2)}
                                              value={getCompanyDetails?.IncorporationIn}
                                            >
                                              {/* <option value="">
                                                Please Select Incorporation In
                                              </option> */}
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
                                              className={errors2["VATRegistered"] ? "error-field form-select" : "form-select"}

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
                                            className={errors2["ClientIndustry"] ? "error-field form-select mb-3" : "form-select mb-3"}

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
                                            className={errors2["TradingName"] ? "error-field form-control" : "form-control"}

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
                                            className={errors2["TradingAddress"] ? "error-field form-control" : "form-control"}

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
                                              <div className="card pricing-box p-3 m-2 mt-0">
                                                <div className="row">
                                                  {index !== 0 && (
                                                    <div className="col-lg-12">
                                                      <div className="form-check mb-3 d-flex justify-content-end">
                                                        <button
                                                          className="delete-icon"
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
                                                          <i className="ti-trash text-danger"></i>{" "}

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
                                                        className={companyContactsErrors[index]?.first_name ? "error-field form-control" : "form-control"}

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
                                                              companyContactsErrors[index]?.first_name
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
                                                        className={companyContactsErrors[index]?.last_name ? "error-field form-control" : "form-control"}

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
                                                              companyContactsErrors[index]?.last_name
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

                                                      </label>
                                                      <select
                                                        className="form-select"
                                                        id={`customer_contact_person_role_id-${index}`}
                                                        value={contact.customer_contact_person_role_id}
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
                                                              companyContactsErrors[index]?.customer_contact_person_role_id
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
                                                              contact?.phone
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
                                                                  companyContactsErrors[index]?.phone
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
                                                        className={companyContactsErrors[index]?.email ? "error-field form-control" : "form-control"}

                                                        placeholder="Email"
                                                        id={`email-${index}`}
                                                        value={contact?.email}
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
                                                          ?.email && (
                                                          <div className="error-text">
                                                            {
                                                              companyContactsErrors[index]?.email
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
                                            onChange={(e) => handleInputsChange(e, 2)}
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

                          ) : selectClientType == 3 ? (
                            <div className="row ">
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
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
                                            className="form-select mb-3"
                                            name="ClientIndustry"
                                            autoFocus
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
                                            className={errors3["TradingName"] ? "error-field form-control" : "form-control"}

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
                                            className={errors3["TradingAddress"] ? "error-field form-control" : "form-control"}

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
                                              className={errors3["VATRegistered"] ? "error-field form-select" : "form-select"}

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

                              <div className="col-lg-12">
                                <div className="card card_shadow">
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
                                      Partner Details
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
                                            <div className="card pricing-box p-3 m-2 mt-0">
                                              <div className="row">
                                                <div className="col-lg-12">
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Partner {index + 1}</h4>
                                                  <div className="form-check form-switch form-switch-md mb-3 d-flex justify-content-end" dir="ltr"  >

                                                    {index !== 0 &&
                                                      index !== 1 && (
                                                        <div>
                                                          <button
                                                            className="delete-icon"
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
                                                            <i className="ti-trash text-danger"></i>{" "}

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
                                                      className={PartnershiContactsErrors[index]?.first_name ? "error-field form-control" : "form-control"}

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
                                                      className={PartnershiContactsErrors[index]?.last_name ? "error-field form-control" : "form-control"}

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
                                                      Alternate Phone Number
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
                                                          placeholder="Alternate Phone Number"
                                                          name="alternate_phone"
                                                          id={`alternate_phone-${index}`}
                                                          value={
                                                            contact?.alternate_phone
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
                                                            ?.alternate_phone && (
                                                            <div className="error-text">
                                                              {
                                                                PartnershiContactsErrors[
                                                                  index
                                                                ]
                                                                  ?.alternate_phone
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
                                                      value={contact?.email}
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
                                                            ]?.email
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label className="form-label">
                                                      Alternate Email

                                                    </label>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Enter Alternate Email"
                                                      name="alternate_email"
                                                      id={`alternate_email-${index}`}
                                                      value={
                                                        contact?.alternate_email
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
                                                            ]?.alternate_email
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
                                            <i className="fa fa-plus pe-1"></i>
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
                                  <div className="card-header card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">
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
                                            onChange={(e) => handleInputsChange(e, 3)}
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
                                            autoFocus
                                            className={errors4["TradingName"] ? "error-field form-control" : "form-control"}

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
                                            className={errors4["first_name"] ? "error-field form-control" : "form-control"}

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
                                            className={errors4["last_name"] ? "error-field form-control" : "form-control"}

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
                                            Phone Number
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
                                                className={errors4["phone"] ? "error-field form-control" : "form-control"}

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

                                          </label>
                                          <input
                                            type="text"
                                            className={errors4["email"] ? "error-field form-control" : "form-control"}

                                            placeholder="Enter Email ID"
                                            name="email"
                                            id="email"
                                            value={getIndivisualDetails?.email}
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

                                <div className="col-lg-12">
                                  <div className="card ">
                                    <div className="card-header card-header-light-blue ">
                                      <h4 className="card-title fs-16 mb-0">
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
                                            autoFocus
                                            className={errors4["notes"] ? "error-field form-control" : "form-control"}

                                            placeholder="Enter Notes"
                                            onChange={(e) => handleInputsChange(e, 4)}
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
                            )
                          ) : selectClientType == 5 ? (
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

                                      {(contactsMembers || [])?.map((contact, index) => (
                                        <div className="col-xxl-12 col-lg-12">
                                          <div className="card pricing-box p-3 m-2 mt-0">
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div>
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Members {index + 1}</h4>
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
                                                            contact.length ===
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
                                                      contact?.first_name
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
                                                      contact?.last_name
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
                                                    id={`customer_contact_person_role_id-${index}`}
                                                    value={contact?.customer_contact_person_role_id}
                                                    onChange={(e) =>
                                                      handleChangeMember(
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
                                                  {errorMemberDetails[index]?.customer_contact_person_role_id && (
                                                    <div className="error-text">
                                                      {
                                                        errorMemberDetails[index]?.customer_contact_person_role_id
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
                                                          contact?.phone
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
                                                      {errorMemberDetails[index]?.phone && (
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
                                                          contact?.alternate_phone_code
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
                                                          contact?.alternate_phone
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
                                                        ?.alternate_phone && (
                                                          <div className="error-text">
                                                            {
                                                              errorMemberDetails[
                                                                index
                                                              ]?.alternate_phone
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
                                                    value={contact?.email}
                                                    onChange={(e) =>
                                                      handleChangeMember(
                                                        index,
                                                        "email",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  {errorMemberDetails[index]
                                                    ?.email && (
                                                      <div className="error-text">
                                                        {
                                                          errorMemberDetails[index]
                                                            ?.email
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
                                                      contact?.alternate_email
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
                                                    ?.alternate_email && (
                                                      <div className="error-text">
                                                        {
                                                          errorMemberDetails[index]
                                                            ?.alternate_email
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
                                            Add Member
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

                                      {contactsTrustee.map((contact, index) => (
                                        <div className="col-xxl-12 col-lg-12">
                                          <div className="card pricing-box p-3 m-2 mt-0">
                                            <div className="row">
                                              <div className="col-lg-12">
                                                <div>
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Trustee {index + 1}</h4>
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
                                                            contact.length ===
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
                                                      contact?.first_name
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
                                                      contact?.last_name
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
                                                    id={`customer_contact_person_role_id-${index}`}
                                                    value={contact?.customer_contact_person_role_id}
                                                    onChange={(e) =>
                                                      handleChangeTrustee(
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
                                                  {errorTrusteeDetails[index]?.customer_contact_person_role_id && (
                                                    <div className="error-text">
                                                      {
                                                        errorTrusteeDetails[index]?.customer_contact_person_role_id
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
                                                          contact.phone
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
                                                          contact?.alternate_phone_code
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
                                                          contact?.alternate_phone
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
                                                        ?.alternate_phone && (
                                                          <div className="error-text">
                                                            {
                                                              errorTrusteeDetails[
                                                                index
                                                              ]?.alternate_phone
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
                                                    value={contact?.email}
                                                    onChange={(e) =>
                                                      handleChangeTrustee(
                                                        index,
                                                        "email",
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                  {errorTrusteeDetails[index]
                                                    ?.email && (
                                                      <div className="error-text">
                                                        {
                                                          errorTrusteeDetails[index]
                                                            ?.email
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
                                                      contact?.alternate_email
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
                                                    ?.alternate_email && (
                                                      <div className="error-text">
                                                        {
                                                          errorTrusteeDetails[index]
                                                            ?.alternate_email
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
                                            Add Trustee
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
                                              getCharityIncorporatedOrganisation.notes

                                            }
                                            onChange={(e) => handleChange5(e)}
                                          />
                                          {errors5["notes"] && (
                                            <div className="error-text">
                                              {errors5["notes"]}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>



                            </div>

                          ) : selectClientType == 6 ? (
                            <div className="row ">
                              <div className="col-lg-12">
                                <div className="card card_shadow ">
                                  <div className="card-header  card-header-light-blue align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                      Charity Unincorporated Association Information
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
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Members {index + 1}</h4>
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
                                                            contact.length ===
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
                                                      contact?.first_name
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
                                                      contact?.last_name
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
                                                    id={`customer_contact_person_role_id-${index}`}
                                                    value={contact?.customer_contact_person_role_id}
                                                    onChange={(e) =>
                                                      handleChangeMemberUnincorporated(
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
                                                  {errorMemberDetailsUnincorporated[index]?.customer_contact_person_role_id && (
                                                    <div className="error-text">
                                                      {
                                                        errorMemberDetailsUnincorporated[index]?.customer_contact_person_role_id
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
                                                          contact.phone
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
                                                          contact.alternate_phone
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
                                                    value={contact.email}
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
                                                      contact.alternate_email
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
                                            Add Member
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

                          ) : selectClientType == 7 ? (
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
                                              getTrust.TrustName
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
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Beneficiaries {index + 1}</h4>
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
                                                          contactsMembersTrust.length ===
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
                                                      contact?.first_name
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
                                                      contact?.last_name
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
                                                    id={`customer_contact_person_role_id-${index}`}
                                                    value={contact?.customer_contact_person_role_id}
                                                    onChange={(e) =>
                                                      handleChangeTrust(
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
                                                  {errorMemberTrustDetails[index]?.customer_contact_person_role_id && (
                                                    <div className="error-text">
                                                      {
                                                        errorMemberTrustDetails[index]?.customer_contact_person_role_id
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
                                                          contact.phone
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
                                                          contact.alternate_phone
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
                                                    value={contact.email}
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
                                                      contact.alternate_email
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
                                            Add Beneficiary
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
                                                  <h4 className="flex-grow-1 fs-16" style={{ fontWeight: '600' }}>Trustees {index + 1}</h4>
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
                                                          contactsTrustTrustee.length ===
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
                                                      contact?.first_name
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
                                                      contact?.last_name
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
                                                    id={`customer_contact_person_role_id-${index}`}
                                                    value={contact?.customer_contact_person_role_id}
                                                    onChange={(e) =>
                                                      handleChangeTrustTrustee(
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
                                                  {errorTrustTrusteeDetails[index]?.customer_contact_person_role_id && (
                                                    <div className="error-text">
                                                      {
                                                        errorTrustTrusteeDetails[index]?.customer_contact_person_role_id
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
                                                          contact.phone
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
                                                          contact.alternate_phone
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
                                                    value={contact.email}
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
                                                      contact.alternate_email
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
                                            Add Trustee
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
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            sessionStorage.setItem('activeTab', location.state.activeTab);
                            window.history.back()
                          }}
                        >
                          <i className="fa fa-times pe-1"></i>
                          Cancel
                        </button>
                        <button
                          className="btn btn-outline-success"
                          onClick={handleUpdate}
                        >
                          <i className="fa fa-edit pe-1"></i>
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
