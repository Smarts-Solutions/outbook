import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { GetClientIndustry, Edit_Client, Get_All_Client } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { GetAllCompany } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { Email_regex } from '../../../../Utils/Common_regex'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import { PersonRole, Country } from '../../../../ReduxStore/Slice/Settings/settingSlice'

import Search from 'antd/es/transfer/search';
const ClientEdit = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const [clientIndustry, setClientIndustry] = useState([])
    const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
    const [selectClientType, setSelectClientType] = useState(1)
    const [showDropdown, setShowDropdown] = useState(true)
    const [getSearchDetails, setSearchDetails] = useState('')
    const [personRoleDataAll, setPersonRoleDataAll] = useState({ loading: true, data: [] });
    const [countryDataAll, setCountryDataAll] = useState({ loading: true, data: [] });
    const [searchItem, setSearchItem] = useState('')
    const [errors1, setErrors1] = useState({})
    const [errors2, setErrors2] = useState({})
    const [errors3, setErrors3] = useState({})
    const [getClientDetails, setClientDetails] = useState({ loading: true, data: [] })

    const [getSoleTraderDetails, setSoleTraderDetails] = useState({
        IndustryType: '',
        tradingName: "",
        tradingAddress: "",
        vatRegistered: "",
        vatNumber: "",
        website: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        residentialAddress: "",
        phone_code: ""
    })
    const [getCompanyDetails, setCompanyDetails] = useState({
        SearchCompany: '',
        CompanyName: '',
        EntityType: '',
        CompanyStatus: '',
        CompanyNumber: '',
        RegisteredOfficeAddress: '',
        IncorporationDate: '',
        IncorporationIn: '',
        VATRegistered: '',
        VATNumber: '',
        Website: '',
        ClientIndustry: '',
        TradingName: '',
        TradingAddress: ''
    })
    const [getPartnershipDetails, setPartnershipDetails] = useState({
        ClientIndustry: '',
        TradingName: '',
        TradingAddress: '',
        VATRegistered: '',
        VATNumber: '',
        Website: '',
    })




    //  For Partnership
    const [contacts1, setContacts1] = useState([
    ]);
    const [contactsErrors, setContactsErrors] = useState([
        { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', alternate_phone: '', email: '', alternate_email: '' },
        { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }
    ]);

    const handleAddContact1 = () => {
        setContacts1([...contacts1, { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', phone_code: "+44", alternate_phone: '', alternate_phone_code: "+44", email: '', alternate_email: '' }])
        setContactsErrors([...contactsErrors, { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }]);
    };

    const handleDeleteContact1 = (index) => {
        const newContacts = contacts1.filter((_, i) => i !== index);
        const newErrors = contactsErrors.filter((_, i) => i !== index);
        setContacts1(newContacts);
        setContactsErrors(newErrors);
    };



    // for Company
    const [contacts, setContacts] = useState([
        { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', phone_code: '', email: '' }
    ]);

    const [errors, setErrors] = useState([{ first_name: false, last_name: false, customer_contact_person_role_id: false, phoneCode: false, phone: false, email: false }
    ]);

    const handleAddContact = () => {
        setContacts([...contacts, { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', phone_code: '+44', email: '' }]);
        setErrors([...errors, { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '' }]);
    };


    const handleDeleteContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        const newErrors = errors.filter((_, i) => i !== index);
        setContacts(newContacts);
        setErrors(newErrors);
    };

    const GetClientDetails = async () => {
        const req = { action: "getByid", client_id: location.state.row.id }
        const data = { req: req, authToken: token }
        await dispatch(Get_All_Client(data))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setClientDetails({
                        loading: false,
                        data: response.data
                    })
                } else {
                    setClientDetails({
                        loading: false,
                        data: []
                    })
                }
            })
            .catch((error) => {
                console.log("Error", error);
            })
    }

    const CustomerPersonRoleData = async () => {
        const req = {
            "action": "get"
        }
        const data = { req: req, authToken: token }
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
    }

    const getClientIndustry = async () => {
        const req = { action: "get" }
        const data = { req: req, authToken: token }
        await dispatch(GetClientIndustry(data))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    setClientIndustry(response.data)
                } else {
                    setClientIndustry(response.data)
                }
            })
            .catch((error) => {
                console.log("Error", error);
            })
    }

    const Get_Company = async () => {
        const data = { search: searchItem }
        await dispatch(GetAllCompany(data))
            .unwrap()
            .then((res) => {
                if (res.status) {
                    setGetAllSearchCompany(res.data.items)
                }
                else {
                    setGetAllSearchCompany([])
                }

            })
            .catch((err) => {
                console.log("Error", err)
            })
    }

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
                console.log("Error", error);
            });
    };



    useEffect(() => {
        CountryData()
        CustomerPersonRoleData();
        GetClientDetails()
        getClientIndustry()

    }, []);

    useEffect(() => {
        Get_Company()
    }, [searchItem])


    const handleUpdate = async () => {
        if (selectClientType == 1 && validate1()) {
            const req = {
                client_type: "1",
                client_id: location.state.row.id,
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
                client_code: location.state.row.id,
                phone_code: getSoleTraderDetails.phone_code
            }
            await dispatch(Edit_Client(req))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Client Updated Successfully',
                            timerProgressBar: true,
                            timer: 1500
                        })
                        setTimeout(() => {
                            navigate('/admin/Clientlist', { state: { id: location.state.id } });
                        }, 1500)

                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: response.message,
                            timerProgressBar: true,
                            timer: 1500
                        })
                    }
                })
        }
        if (selectClientType == 2 && validate2()) {

            let formIsValid = true;
            const newErrors = contacts.map((contact, index) => {
                const error = {
                    first_name: contact.first_name ? '' : 'First Name is required',
                    last_name: contact.last_name ? '' : 'Last Name is required',  
                    phone: contact.phone === '' ? '' : /^\d{9,12}$/.test(contact.phone) ? '' : 'Phone Number must be between 9 to 12 digits',
                    email: contact.email === '' ? '' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.customer_contact_person_role_id || error.phone || error.email) {
                    formIsValid = false;
                }
                return error;
            });
            setErrors(newErrors);
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
                    contactDetails: contacts
                }
                await dispatch(Edit_Client(req))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Client Updated Successfully',
                                timerProgressBar: true,
                                timer: 1500
                            })
                            setTimeout(() => {
                                navigate('/admin/Clientlist', { state: { id: location.state.id } });
                            }, 1500)
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: response.message,
                                timerProgressBar: true,
                                timer: 1500
                            })

                        }
                    })
            }
        }
        if (selectClientType == 3 && validate3()) {

            let formIsValid = true;
            const newErrors = contacts1.map((contact, index) => {
                const error = {
                    first_name: contact.first_name ? '' : 'First Name is required',
                    last_name: contact.last_name ? '' : 'Last Name is required', 
                    phone: contact.phone === '' ? '' : /^\d{9,12}$/.test(contact.phone) ? '' : 'Phone Number must be between 9 to 12 digits',
                    alternate_phone: contact.alternate_phone === '' ? '' : /^\d{9,12}$/.test(contact.alternate_phone) ? '' : 'Alternate Phone Number must be between 9 to 12 digits',
                    email: contact.email === '' ? '' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                    alternate_email: contact.alternate_email === '' ? '' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.alternate_email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.customer_contact_person_role_id || error.phone || error.email) {
                    formIsValid = false;
                }
                return error;
            });
            setContactsErrors(newErrors);
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
                    contactDetails: contacts1

                }
                await dispatch(Edit_Client(req))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Client Added Successfully',
                                timerProgressBar: true,
                                timer: 1500
                            })
                            setTimeout(() => {
                                navigate('/admin/Clientlist', { state: { id: location.state.id } });
                            }, 1500)
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: response.message,
                                timerProgressBar: true,
                                timer: 1500
                            })
                        }
                    })
            }
        }
        else {
        }

    }

    //  for sole trader
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        if (name === "vatNumber" || name === "phone") {
            if (!/^[0-9+]*$/.test(value)) {
                return;
            }
        }
        validate1()
        setSoleTraderDetails({ ...getSoleTraderDetails, [name]: value });
    };

    const validate1 = () => {
        const newErrors = {};
        for (const key in getSoleTraderDetails) {
            if (!getSoleTraderDetails[key]) { 
                if (key == 'tradingName') newErrors[key] = 'Please enter Trading Name';
                else if (key == 'tradingAddress') newErrors[key] = 'Please enter Trading Address';
                else if (key == 'vatRegistered') newErrors[key] = 'Please select VAT Registered'; 
                else if (key == 'first_name') newErrors[key] = 'Please enter First Name';
                else if (key == 'last_name') newErrors[key] = 'Please enter Last Name';
                 
            }
            else if (key == 'email' && !Email_regex(getSoleTraderDetails[key])) {
                newErrors[key] = 'Please enter valid Email';
            }
            else if (key == 'phone' && !/^\d{9,12}$/.test(getSoleTraderDetails[key])) {
                newErrors[key] = 'Phone Number must be between 9 to 12 digits';
            }

        }
        setErrors1(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
    };


    // for company
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        if (name === "VATNumber") {
            if (!/^[0-9+]*$/.test(value)) {
                return;
            }
        }
        validate2()
        setCompanyDetails({ ...getCompanyDetails, [name]: value });
    };

    const validate2 = () => {
        const newErrors = {};
        for (const key in getCompanyDetails) {
            if (!getCompanyDetails[key]) {
                if (key == 'CompanyName') newErrors[key] = 'Please Enter Company Name';
                else if (key == 'EntityType') newErrors[key] = 'Please Enter Entity Type';
                else if (key == 'CompanyStatus') newErrors[key] = 'Please Enter Company Status';
                else if (key == 'CompanyNumber') newErrors[key] = 'Please Enter Company Number';
                else if (key == 'RegisteredOfficeAddress') newErrors[key] = 'Please Enter Registered Office Address';
                else if (key == 'IncorporationDate') newErrors[key] = 'Please Enter Incorporation Date';
                else if (key == 'IncorporationIn') newErrors[key] = 'Please Enter Incorporation In';
                else if (key == 'VATRegistered') newErrors[key] = 'Please Enter VAT Registered'; 
                else if (key == 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                else if (key == 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
            }
        }
        setErrors2(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
    };

    const handleChange = (index, field, value) => {


        const newContacts = contacts.map((contact, i) =>
            i === index ? { ...contact, [field]: value } : contact
        );


        setContacts(newContacts);

        validateField(index, field, value);
    };

    const validateField = (index, field, value) => {
        const newErrors = [...errors];
        if (!newErrors[index]) {
            newErrors[index] = { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '' };
        }
        switch (field) {
            case 'first_name':
                newErrors[index].first_name = value ? '' : 'First Name is required';
                break;
            case 'last_name':
                newErrors[index].last_name = value ? '' : 'Last Name is required';
                break; 
            case 'email':
                if (!value) {
                    newErrors[index].email = '';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors[index].email = 'Valid Email is required';
                } else {
                    newErrors[index].email = '';
                }
                break;
            case 'phone':
                newErrors[index].phone = value === '' ? '' : /^\d{9,12}$/.test(value) ? '' : 'Phone Number must be between 9 to 12 digits';

                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    // for partnership
    const handleChange3 = (e) => {
        const { name, value } = e.target;
        if (name === "VATNumber") {
            if (!/^[0-9+]*$/.test(value)) {
                return;
            }
        }
        validate3()
        setPartnershipDetails({ ...getPartnershipDetails, [name]: value });
    };

    const validate3 = () => {
        const newErrors = {};
        for (const key in getPartnershipDetails) {
            if (!getPartnershipDetails[key]) { 
                //  if (key === 'ClientIndustry') newErrors[key] = 'Please Select Client Industry';
                 if (key === 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                else if (key === 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
                else if (key === 'VATRegistered') newErrors[key] = 'Please Enter VAT Registered';  
            }
        }

        setErrors3(newErrors);

        return Object.keys(newErrors).length === 0 ? true : false;
    }

    const handleChange4 = (index, field, value) => {

        let newValue = value;
        if (field == 'authorised_signatory_status') {
            newValue = value ? 1 : 0;
        }

        const newContacts = contacts1.map((contact, i) =>
            i === index ? { ...contact, [field]: newValue } : contact
        );

        setContacts1(newContacts);
        validateField1(index, field, newValue);
    };

    const validateField1 = (index, field, value) => {
        const errors = [...contactsErrors];

        switch (field) {
            case 'first_name':
            case 'last_name':
                if (!value.trim()) {
                    errors[index] = { ...errors[index], [field]: 'This field is required' };
                } else {
                    delete errors[index][field];
                }
                break;
            case 'email':
            case 'alternate_email':
                if (!value.trim()) {
                    errors[index] = { ...errors[index], [field]: '' };
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errors[index] = { ...errors[index], [field]: 'Invalid email address' };
                } else {
                    delete errors[index][field];
                }
                break;
            case 'phone':
                errors[index].phone = value === '' ? '' : /^\d{9,12}$/.test(value) ? '' : 'Phone Number must be between 9 to 12 digits';
                break;

            case 'alternate_phone':
                errors[index].alternate_phone = value === '' ? '' : /^\d{9,12}$/.test(value) ? '' : 'Phone Number must be between 9 to 12 digits';

                break;
            case 'customer_contact_person_role_id':
                if (!value) {
                    errors[index] = { ...errors[index], [field]: '' };
                } else {
                    delete errors[index][field];
                }
                break;
            default:
                break;
        }

        setContactsErrors(errors);
    };




    useEffect(() => {
        setSelectClientType(location.state.row.client_type_name == 'SoleTrader' ? 1 : location.state.row.client_type_name == 'Company' ? 2 : 3)

        if (location.state.row.client_type_name == 'SoleTrader') {
            setSoleTraderDetails(prevState => ({
                ...prevState,

                IndustryType: !getClientDetails.loading && getClientDetails.data.client.client_industry_id,
                tradingName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
                tradingAddress: !getClientDetails.loading && getClientDetails.data.client.trading_address,
                vatRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
                vatNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
                website: !getClientDetails.loading && getClientDetails.data.client.website,
                first_name: !getClientDetails.loading && getClientDetails.data.contact_details[0].first_name,
                last_name: !getClientDetails.loading && getClientDetails.data.contact_details[0].last_name,
                phone: !getClientDetails.loading && getClientDetails.data.contact_details[0].phone,
                email: !getClientDetails.loading && getClientDetails.data.contact_details[0].email,
                residentialAddress: !getClientDetails.loading && getClientDetails.data.contact_details[0].residential_address,
                phone_code: !getClientDetails.loading && getClientDetails.data.contact_details[0].phone_code
            }))
        }
        if (location.state.row.client_type_name == 'Company') {
            setCompanyDetails(prevState => ({
                ...prevState,
                CompanyName: !getClientDetails.loading && getClientDetails.data.company_details.company_name,
                EntityType: !getClientDetails.loading && getClientDetails.data.company_details.entity_type,
                CompanyStatus: !getClientDetails.loading && getClientDetails.data.company_details.company_status,
                CompanyNumber: !getClientDetails.loading && getClientDetails.data.company_details.company_number,
                RegisteredOfficeAddress: !getClientDetails.loading && getClientDetails.data.company_details.registered_office_address,
                IncorporationDate: !getClientDetails.loading && getClientDetails.data.company_details.incorporation_date,
                IncorporationIn: !getClientDetails.loading && getClientDetails.data.company_details.incorporation_in,

                VATRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
                VATNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
                Website: !getClientDetails.loading && getClientDetails.data.client.website,
                ClientIndustry: !getClientDetails.loading && getClientDetails.data.client.client_industry_id,
                TradingName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
                TradingAddress: !getClientDetails.loading && getClientDetails.data.client.trading_address,
            }))
            setContacts(!getClientDetails.loading && getClientDetails.data.contact_details)
        }
        if (location.state.row.client_type_name == 'Partnership') {

            setPartnershipDetails(prevState => ({
                ...prevState,
                ClientIndustry: !getClientDetails.loading && getClientDetails.data.client.client_industry_id,
                TradingName: !getClientDetails.loading && getClientDetails.data.client.trading_name,
                TradingAddress: !getClientDetails.loading && getClientDetails.data.client.trading_address,
                VATRegistered: !getClientDetails.loading && getClientDetails.data.client.vat_registered,
                VATNumber: !getClientDetails.loading && getClientDetails.data.client.vat_number,
                Website: !getClientDetails.loading && getClientDetails.data.client.website,

            }))
            setContacts1(getClientDetails.data && getClientDetails.data.contact_details)

        }

    }, [getClientDetails])


    useEffect(() => {
        if (getSearchDetails.length > 0) {
            setCompanyDetails(prevState => ({
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




    // Filter out selected details
    const FilterSearchDetails = () => {
        const filterData = getAllSearchCompany.filter((data) =>
            data.title === searchItem
        )
        setSearchDetails(filterData)
    }

    useEffect(() => {
        FilterSearchDetails()
    }, [searchItem])


    const HandleCancel = () => {
        navigate('/admin/Clientlist', { state: { id: location.state.id } });
    }



    return (
        <div>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header align-items-center step-header-blue d-flex justify-content-between">
                                <h4 className="card-title  mb-0">Edit Client</h4>
                                <button type="button" className="btn btn-info text-white blue-btn" onClick={HandleCancel}>Back</button>
                            </div>

                            {/* end card header */}
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
                                                                            onChange={(e) => setSelectClientType(e.target.value)}
                                                                        >
                                                                            <option value={1}>Sole Trader</option>
                                                                            <option value={2}>Company</option>
                                                                            <option value={3}>Partnership</option>

                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>{" "}
                                                    {/* end col */}
                                                </div>
                                                <section>
                                                    {
                                                        selectClientType == 1 ?
                                                            <div className="row"  >

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
                                                                                        <label className="form-label">Client Industry</label>
                                                                                        <select className="form-select mb-3" aria-label="Default select example"
                                                                                            name="IndustryType"
                                                                                            value={getSoleTraderDetails.IndustryType}
                                                                                            onChange={(e) => handleChange1(e)}>
                                                                                            <option value={0}>Select Client Industry</option>
                                                                                            {
                                                                                                clientIndustry.map((data, index) => {
                                                                                                    return <option value={data.id} key={data.id}>{data.business_type}</option>
                                                                                                })
                                                                                            }
                                                                                        </select>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" name="tradingName" className="form-control" placeholder="Trading Name"
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            value={getSoleTraderDetails.tradingName}
                                                                                            maxLength={100}
                                                                                        />
                                                                                        {errors1['tradingName'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['tradingName']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">Trading Address<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="Trading Address" name="tradingAddress"
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            value={getSoleTraderDetails.tradingAddress}
                                                                                            maxLength={200}
                                                                                        />
                                                                                        {errors1['tradingAddress'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['tradingAddress']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >VAT Registered</label>
                                                                                        <select className="form-select mb-3" aria-label="Default select example"
                                                                                            name="vatRegistered"
                                                                                            value={getSoleTraderDetails.vatRegistered}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        >
                                                                                            <option selected="">Please Select VAT Registered</option>
                                                                                            <option value={1}>Yes</option>
                                                                                            <option value={0}>No</option>


                                                                                        </select>
                                                                                        {errors1['vatRegistered'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['vatRegistered']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">VAT Number<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="VAT Number"
                                                                                            name="vatNumber"
                                                                                            value={getSoleTraderDetails.vatNumber}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            maxLength={9}
                                                                                        />

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">Website<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control"
                                                                                            placeholder="URL"
                                                                                            name="website"
                                                                                            value={getSoleTraderDetails.website}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            maxLength={200}
                                                                                        />


                                                                                    </div>
                                                                                </div>
                                                                                </div>
                                                                                </div>
                                                                                </div>
                                                                                <div className="card ">
                                                                                    <div className="card-header card-header-light-blue ">
                                                                                        <h4 className="card-title fs-16 mb-0">Sole Trader Details</h4>
                                                                                        </div>
                                                                                <div className="card-body row">
                                                                               
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label"  >First Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control"
                                                                                            placeholder="First Name"
                                                                                            name="first_name"
                                                                                            value={getSoleTraderDetails.first_name}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            maxLength={50}
                                                                                        />
                                                                                        {errors1['first_name'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['first_name']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >Last Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="Last Name"
                                                                                            name="last_name"
                                                                                            value={getSoleTraderDetails.last_name}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            maxLength={50}
                                                                                        />
                                                                                        {errors1['last_name'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['last_name']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>


                                                                                <div class="col-lg-4">
                                                                                    <div class="mb-3">
                                                                                        <label for="firstNameinput" class="form-label">Phone</label>
                                                                                        <div class="row">
                                                                                            <div class="col-md-4 pe-0">
                                                                                                <select class="form-select" onChange={(e) => handleChange1(e)} name="phone_code"
                                                                                                    value={getSoleTraderDetails.phone_code}
                                                                                                >
                                                                                                    {countryDataAll.data.map((data) => (
                                                                                                        <option key={data.code} value={data.code}>
                                                                                                            {data.code}
                                                                                                        </option>
                                                                                                    ))}
                                                                                                </select>
                                                                                            </div>
                                                                                            <div className="mb-3 col-md-8 ps-1">
                                                                                                <input type="text" className="form-control"
                                                                                                    placeholder="Phone Number"
                                                                                                    name="phone"
                                                                                                    value={getSoleTraderDetails.phone}
                                                                                                    onChange={(e) => handleChange1(e)}
                                                                                                    maxLength={12}
                                                                                                    minLength={9}
                                                                                                />
                                                                                                {errors1['phone'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors1['phone']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >Email<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="Enter Email ID"
                                                                                            name="email"
                                                                                            value={getSoleTraderDetails.email}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        />
                                                                                        {errors1['email'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['email']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-lg-6">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >Residential Address<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="Residential Address"
                                                                                            name="residentialAddress"
                                                                                            value={getSoleTraderDetails.residentialAddress}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        />
                                                                                        {errors1['residentialAddress'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['residentialAddress']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            
                                                            :
                                                            selectClientType == 2 ?
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="card card_shadow ">
                                                                            <div className="card-header card-header-light-blue align-items-center d-flex">
                                                                                <h4 className="card-title fs-16 mb-0 flex-grow-1">Company</h4>
                                                                            </div>
                                                                            {/* end card header */}
                                                                            <div className="card-body">
                                                                                <div className="row">

                                                                                    <div className="row">
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <div className='position-relative'>
                                                                                                    <label className="form-label">Search Company</label>
                                                                                                    <input type="text" className="form-control" placeholder="Outbooks Quality & Certainty"
                                                                                                        name="SearchCompany" onChange={(e) => setSearchItem(e.target.value)} value={searchItem}
                                                                                                        onClick={() => setShowDropdown(true)}
                                                                                                        style={{ cursor: "pointer" }}
                                                                                                    />
                                                                                                    {
                                                                                                        getAllSearchCompany.length > 0 && showDropdown ?
                                                                                                            <div className='dropdown-list'  >
                                                                                                                {getAllSearchCompany && getAllSearchCompany.map((company, index) => (
                                                                                                                    <div key={index} onClick={() => { setSearchItem(company.title); setShowDropdown(false) }}
                                                                                                                        style={{ cursor: "pointer", padding: "8px 0" }}
                                                                                                                    >
                                                                                                                        {company.title}

                                                                                                                    </div>
                                                                                                                ))}
                                                                                                            </div> : ""
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label" >Company Name<span style={{ color: "red" }}>*</span>  </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Outbooks Quality & Certainty LTD"
                                                                                                    name="CompanyName" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyName}
                                                                                                    disabled
                                                                                                />
                                                                                                {errors2['CompanyName'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyName']}</div>
                                                                                                )}

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Entity Type<span style={{ color: "red" }}>*</span>   </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="LTD"
                                                                                                    name="EntityType" onChange={(e) => handleChange2(e)} value={getCompanyDetails.EntityType} disabled />
                                                                                                {errors2['EntityType'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['EntityType']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  >Company Status<span style={{ color: "red" }}>*</span> </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Active"
                                                                                                    name="CompanyStatus" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyStatus} disabled />
                                                                                                {errors2['CompanyStatus'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyStatus']}</div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Company Number<span style={{ color: "red" }}>*</span></label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Company Number"
                                                                                                    name="CompanyNumber" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyNumber} disabled
                                                                                                />
                                                                                                {errors2['CompanyNumber'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyNumber']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Incorporation Date</label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="07-01-2023"
                                                                                                    name="IncorporationDate" onChange={(e) => handleChange2(e)} value={getCompanyDetails.IncorporationDate} disabled
                                                                                                />
                                                                                                {errors2['IncorporationDate'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['IncorporationDate']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-6">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Registered Office Address<span style={{ color: "red" }}>*</span>  </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                                                                                    name="RegisteredOfficeAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.RegisteredOfficeAddress} disabled
                                                                                                />
                                                                                                {errors2['RegisteredOfficeAddress'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['RegisteredOfficeAddress']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                      
                                                                                        <div className="col-lg-6">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  > Incorporation in  <span style={{ color: "red" }}>*</span> </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Please Enter Incorporation In"
                                                                                                    name="IncorporationIn" onChange={(e) => handleChange2(e)} value={getCompanyDetails.IncorporationIn} disabled
                                                                                                />

                                                                                                {errors2['IncorporationIn'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['IncorporationIn']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  >VAT Registered</label>
                                                                                                <select className="form-select mb-3" name="VATRegistered" onChange={(e) => handleChange2(e)} value={getCompanyDetails.VATRegistered}>
                                                                                                    <option value=''>Please Select VAT Registered</option>
                                                                                                    <option value={1}>Yes</option>
                                                                                                    <option value={0}>No</option>
                                                                                                </select>
                                                                                                {errors2['VATRegistered'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['VATRegistered']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4" >
                                                                                            <div className="mb-3">
                                                                                                <div className="mb-3">
                                                                                                    <label className="form-label">VAT Number</label>
                                                                                                    <input type="text" className="form-control " placeholder="VAT Number"
                                                                                                        name="VATNumber" onChange={(e) => handleChange2(e)} value={getCompanyDetails.VATNumber}
                                                                                                        maxLength={9}
                                                                                                    />
                                                                                                    {errors2['VATNumber'] && (
                                                                                                        <div style={{ 'color': 'red' }}>{errors2['VATNumber']}</div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Website</label>
                                                                                                <input type="text" className="form-control " placeholder="URL"
                                                                                                    name="Website" onChange={(e) => handleChange2(e)} value={getCompanyDetails.Website}
                                                                                                    maxLength={200}
                                                                                                />
                                                                                                {errors2['Website'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['Website']}</div>
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
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Client Industry</label>
                                                                                            <select className="form-select mb-3"
                                                                                                name="ClientIndustry" onChange={(e) => handleChange2(e)} value={getCompanyDetails.ClientIndustry}>
                                                                                                <option value=''>Select Client Industry</option>
                                                                                                {
                                                                                                    clientIndustry.map((data, index) => {
                                                                                                        return <option value={data.id} key={data.id}>{data.business_type}</option>
                                                                                                    })
                                                                                                }

                                                                                            </select>
                                                                                            {errors2['ClientIndustry'] && (
                                                                                                <div style={{ 'color': 'red' }}>{errors2['ClientIndustry']}</div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                                            <input type="text" className="form-control" placeholder="Trading Name"
                                                                                                name="TradingName" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingName}
                                                                                                maxLength={100}
                                                                                            />
                                                                                            {errors2['TradingName'] && (
                                                                                                <div style={{ 'color': 'red' }}>{errors2['TradingName']}</div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Trading Address<span style={{ color: "red" }}>*</span> </label>
                                                                                            <input type="text" className="form-control" placeholder="Trading Address"
                                                                                                name="TradingAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingAddress}
                                                                                                maxLength={200}
                                                                                            />
                                                                                            {errors2['TradingAddress'] && (
                                                                                                <div style={{ 'color': 'red' }}>{errors2['TradingAddress']}</div>
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
                                                                                            {contacts.length > 0 && contacts.map((contact, index) => (
                                                                                                <div className="col-xl-12 col-lg-12 mt-3" key={index}>
                                                                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                        <div className="row">
                                                                                                            {index !== 0 && (
                                                                                                                <div className="col-lg-12">
                                                                                                                    <div className="form-check mb-3 d-flex justify-content-end">
                                                                                                                        <button
                                                                                                                            className="btn btn-danger"
                                                                                                                            onClick={() => handleDeleteContact(index)}
                                                                                                                            disabled={contacts.length === 1}
                                                                                                                        >
                                                                                                                            Delete
                                                                                                                        </button>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )}
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`first_name-${index}`} className="form-label">
                                                                                                                        First Name<span style={{ color: 'red' }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="First Name"
                                                                                                                        id={`first_name-${index}`}
                                                                                                                        value={contact.first_name}
                                                                                                                        onChange={(e) => handleChange(index, 'first_name', e.target.value)}
                                                                                                                        maxLength={50}
                                                                                                                    />
                                                                                                                    {errors[index] && errors[index].first_name && (
                                                                                                                        <div style={{ color: 'red' }}>{errors[index].first_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`last_name-${index}`} className="form-label">
                                                                                                                        Last Name<span style={{ color: 'red' }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Last Name"
                                                                                                                        id={`last_name-${index}`}
                                                                                                                        value={contact.last_name}
                                                                                                                        onChange={(e) => handleChange(index, 'last_name', e.target.value)}
                                                                                                                        maxLength={50}
                                                                                                                    />
                                                                                                                    {errors[index] && errors[index].last_name && (
                                                                                                                        <div style={{ color: 'red' }}>{errors[index].last_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`customer_contact_person_role_id-${index}`} className="form-label">
                                                                                                                        Role<span style={{ color: 'red' }}>*</span>
                                                                                                                    </label>
                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`customer_contact_person_role_id-${index}`}
                                                                                                                        value={contact.customer_contact_person_role_id}
                                                                                                                        onChange={(e) => handleChange(index, 'customer_contact_person_role_id', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll &&
                                                                                                                            personRoleDataAll.data.map((item, i) => (
                                                                                                                                <>
                                                                                                                                    <option value={item.id} key={i}>{item.name}</option>
                                                                                                                                </>

                                                                                                                            ))}
                                                                                                                    </select>
                                                                                                                    {errors[index] && errors[index].customer_contact_person_role_id && (
                                                                                                                        <div style={{ color: 'red' }}>{errors[index].customer_contact_person_role_id}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div class="col-lg-4">
                                                                                                                <div class="mb-3">
                                                                                                                    <label for="firstNameinput" class="form-label">Phone</label>
                                                                                                                    <div class="row">
                                                                                                                        <div class="col-md-4 pe-0">
                                                                                                                            <select class="form-select"
                                                                                                                                onChange={(e) => handleChange(index, 'phone_code', e.target.value)}
                                                                                                                                name="phone_code"
                                                                                                                                value={contact.phone_code}
                                                                                                                            >
                                                                                                                                {countryDataAll.data.map((data) => (
                                                                                                                                    <option key={data.code} value={data.code}>
                                                                                                                                        {data.code}
                                                                                                                                    </option>
                                                                                                                                ))}
                                                                                                                            </select>
                                                                                                                        </div>
                                                                                                                        <div className="mb-3 col-md-8 ps-1">
                                                                                                                            <input
                                                                                                                                type="number"
                                                                                                                                className="form-control"
                                                                                                                                placeholder="Phone Number"
                                                                                                                                id={`phone-${index}`}
                                                                                                                                value={contact.phone}
                                                                                                                                onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                                                                                                                maxLength={12}
                                                                                                                                minLength={9}
                                                                                                                            />
                                                                                                                            {errors[index] && errors[index].phone && (
                                                                                                                                <div style={{ color: 'red' }}>{errors[index].phone}</div>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>


 
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`email-${index}`} className="form-label">
                                                                                                                        Email<span style={{ color: 'red' }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Email"
                                                                                                                        id={`email-${index}`}
                                                                                                                        value={contact.email}
                                                                                                                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                                                                                    />
                                                                                                                    {errors[index] && errors[index].email && (
                                                                                                                        <div style={{ color: 'red' }}>{errors[index].email}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                            <div className="justify-content-end d-flex align-items-center">
                                                                                               
                                                                                                <button className="btn btn-info text-white blue-btn" onClick={handleAddContact}>
                                                                                                    Add Contact
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
                                                                :
                                                                selectClientType == 3 ?
                                                                    <div className="row " >
                                                                        <div className="col-lg-12">
                                                                            <div className="card card_shadow ">
                                                                                <div className="card-header card-header-light-blue align-items-center d-flex">
                                                                                    <h4 className="card-title fs-16 mb-0 flex-grow-1">Partnership</h4>
                                                                                </div>
                                                                                {/* end card header */}
                                                                                <div className="card-body">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Client Industry</label>
                                                                                                <select className="form-select mb-3"
                                                                                                    name="ClientIndustry" value={getPartnershipDetails.ClientIndustry} onChange={(e) => handleChange3(e)}>
                                                                                                    <option value={0}>Select Client Industry</option>
                                                                                                    {
                                                                                                        clientIndustry.map((data, index) => {
                                                                                                            return <option value={data.id} key={data.id}>{data.business_type}</option>
                                                                                                        })
                                                                                                    }

                                                                                                </select>
                                                                                                {errors3['ClientIndustry'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors3['ClientIndustry']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                                                <input type="text" className="form-control" placeholder="Trading Name"
                                                                                                    name="TradingName" value={getPartnershipDetails.TradingName} onChange={(e) => handleChange3(e)}
                                                                                                    maxLength={100}
                                                                                                />
                                                                                                {errors3['TradingName'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors3['TradingName']}</div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Trading Address<span style={{ color: "red" }}>*</span> </label>
                                                                                                <input type="text" className="form-control" placeholder="Trading Address"
                                                                                                    name="TradingAddress" value={getPartnershipDetails.TradingAddress} onChange={(e) => handleChange3(e)}
                                                                                                    maxLength={200}
                                                                                                />
                                                                                                {errors3['TradingAddress'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors3['TradingAddress']}</div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <div className="mb-3">
                                                                                                    <label className="form-label">VAT Registered</label>
                                                                                                    <select className="form-select mb-3"
                                                                                                        name="VATRegistered" value={getPartnershipDetails.VATRegistered} onChange={(e) => handleChange3(e)}
                                                                                                    >
                                                                                                        <option value="">Select VAT Registered</option>
                                                                                                        <option value={1}>Yes</option>
                                                                                                        <option value={0}>No</option>
                                                                                                    </select>
                                                                                                    {errors3['VATRegistered'] && (
                                                                                                        <div style={{ 'color': 'red' }}>{errors3['VATRegistered']}</div>)}

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <div className="mb-3">
                                                                                                    <label className="form-label"> VAT Number</label>
                                                                                                    <input type="text" className="form-control " placeholder="VAT Number"
                                                                                                        name="VATNumber" value={getPartnershipDetails.VATNumber} onChange={(e) => handleChange3(e)}
                                                                                                        maxLength={9}
                                                                                                    />
                                                                                                    {errors3['VATNumber'] && (
                                                                                                        <div style={{ 'color': 'red' }}>{errors3['VATNumber']}</div>)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">
                                                                                                    Website
                                                                                                </label>
                                                                                                <input type="text" className="form-control " placeholder="URL"
                                                                                                    name="Website" value={getPartnershipDetails.Website} onChange={(e) => handleChange3(e)}
                                                                                                    maxLength={200}
                                                                                                />

                                                                                                {errors3['Website'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors3['Website']}</div>)}
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
                                                                                            {contacts1 && contacts1.map((contact, index) => (
                                                                                                <div className="col-xxl-12 col-lg-12" key={contact.contact_id}>
                                                                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                        <div className="row">
                                                                                                            <div className="col-lg-12">
                                                                                                                <div className="form-check form-switch form-switch-md mb-3 d-flex justify-content-between" dir="ltr">
                                                                                                                    <div>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            className="form-check-input"
                                                                                                                            id={`customSwitchsizemd-${index}`}
                                                                                                                            checked={contact.authorised_signatory_status}
                                                                                                                            onChange={(e) => handleChange4(index, 'authorised_signatory_status', e.target.checked)}
                                                                                                                            defaultChecked={index === 0 || index === 1}
                                                                                                                            disabled={contacts1.length === 2 ? index === 0 || index === 1 : false}
                                                                                                                        />
                                                                                                                        <label className="form-check-label">Authorised Signatory</label>
                                                                                                                    </div>
                                                                                                                    {index !== 0 && index !== 1 && (
                                                                                                                        <div>
                                                                                                                            <button
                                                                                                                                className="btn btn-danger"
                                                                                                                                type="button"
                                                                                                                                onClick={() => handleDeleteContact1(index)}
                                                                                                                                disabled={contacts1.length === 1}
                                                                                                                            >
                                                                                                                                Delete
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">First Name<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="First Name"
                                                                                                                        name="first_name"
                                                                                                                        value={contact.first_name}
                                                                                                                        onChange={(e) => handleChange4(index, 'first_name', e.target.value)}
                                                                                                                        maxLength={50}
                                                                                                                    />
                                                                                                                    {contactsErrors[index]?.first_name && (
                                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].first_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Last Name<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Last Name"
                                                                                                                        name="last_name"
                                                                                                                        value={contact.last_name}
                                                                                                                        onChange={(e) => handleChange4(index, 'last_name', e.target.value)}
                                                                                                                        maxLength={50}
                                                                                                                    />
                                                                                                                    {contactsErrors[index]?.last_name && (
                                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].last_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Role<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`customer_contact_person_role_id-${index}`}
                                                                                                                        value={contact.customer_contact_person_role_id}
                                                                                                                        onChange={(e) => handleChange4(index, 'customer_contact_person_role_id', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll &&
                                                                                                                            personRoleDataAll.data.map((item, i) => (
                                                                                                                                <option value={item.id} key={i}>{item.name}</option>
                                                                                                                            ))}
                                                                                                                    </select>
                                                                                                                    {contactsErrors[index]?.customer_contact_person_role_id && (
                                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].customer_contact_person_role_id}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div class="col-lg-4">
                                                                                                                <div class="mb-3">
                                                                                                                    <label for="firstNameinput" class="form-label">Phone</label>
                                                                                                                    <div class="row">
                                                                                                                        <div class="col-md-4">
                                                                                                                            <select class="form-select"
                                                                                                                                  onChange={(e) => handleChange4(index, 'phone_code', e.target.value)}
                                                                                                                                name="phone_code"
                                                                                                                                value={contact.phone_code}
                                                                                                                            >
                                                                                                                                {countryDataAll.data.map((data) => (
                                                                                                                                    <option key={data.code} value={data.code}>
                                                                                                                                        {data.code}
                                                                                                                                    </option>
                                                                                                                                ))}
                                                                                                                            </select>
                                                                                                                        </div>
                                                                                                                        <div className="mb-3 col-md-8">
                                                                                                                            <input
                                                                                                                                type="number"
                                                                                                                                className="form-control"
                                                                                                                                placeholder="Phone"
                                                                                                                                name="phone"
                                                                                                                                value={contact.phone}
                                                                                                                                onChange={(e) => handleChange4(index, 'phone', e.target.value)}
                                                                                                                                maxLength={12}  
                                                                                                                            />
                                                                                                                            {contactsErrors[index] && contactsErrors[index].phone && (
                                                                                                                                <div style={{ color: 'red' }}>{contactsErrors[index].phone}</div>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                             


<div class="col-lg-4">
                                                                                                                <div class="mb-3">
                                                                                                                    <label for="firstNameinput" class="form-label">Alternate Phone</label>
                                                                                                                    <div class="row">
                                                                                                                        <div class="col-md-4">
                                                                                                                            <select class="form-select"
                                                                                                                                  onChange={(e) => handleChange4(index, 'alternate_phone_code', e.target.value)}
                                                                                                                                name="alternate_phone_code"
                                                                                                                                value={contact.alternate_phone_code}
                                                                                                                            >
                                                                                                                                {countryDataAll.data.map((data) => (
                                                                                                                                    <option key={data.code} value={data.code}>
                                                                                                                                        {data.code}
                                                                                                                                    </option>
                                                                                                                                ))}
                                                                                                                            </select>
                                                                                                                        </div>
                                                                                                                        <div className="mb-3 col-md-8">
                                                                                                                            <input
                                                                                                                                type="number"
                                                                                                                                className="form-control"
                                                                                                                                placeholder="Alternate Phone"
                                                                                                                                name="alternate_phone"
                                                                                                                                value={contact.alternate_phone}
                                                                                                                                onChange={(e) => handleChange4(index, 'alternate_phone', e.target.value)}
                                                                                                                                maxLength={12}  
                                                                                                                            />
                                                                                                                            {contactsErrors[index] && contactsErrors[index].alternate_phone && (
                                                                                                                                <div style={{ color: 'red' }}>{contactsErrors[index].alternate_phone}</div>
                                                                                                                            )}
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div> 
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Email<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Enter Email"
                                                                                                                        name="email"
                                                                                                                        value={contact.email}
                                                                                                                        onChange={(e) => handleChange4(index, 'email', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index]?.email && (
                                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].email}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Alternate Email<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Enter Alternate Email"
                                                                                                                        name="alternate_email"
                                                                                                                        value={contact.alternate_email}
                                                                                                                        onChange={(e) => handleChange4(index, 'alternate_email', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index]?.alternate_email && (
                                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].alternate_email}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}

                                                                                            <div className="justify-content-end d-flex align-items-center">
                                                                                                
                                                                                                <div>
                                                                                                    <button className="btn btn-info text-white blue-btn" onClick={handleAddContact1}>Add Partner</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : ""
                                                    }
                                                </section>
                                            </div>
                                            <div className="hstack gap-2 justify-content-end">
                                                <button type="button" className="btn btn-secondary" onClick={HandleCancel}>Cancel</button>
                                                <button className="btn btn-info text-white blue-btn" onClick={handleUpdate}>Update Client</button>
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
    )
}

export default ClientEdit;