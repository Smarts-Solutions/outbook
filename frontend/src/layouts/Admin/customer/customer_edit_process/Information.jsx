import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from 'react-redux';
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { GET_CUSTOMER_DATA, Edit_Customer, GetAllCompany } from '../../../../ReduxStore/Slice/Customer/CustomerSlice'
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';
import { Email_regex } from '../../../../Utils/Common_regex'

import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { PersonRole, Country } from '../../../../ReduxStore/Slice/Settings/settingSlice'

const Information = ({ id, pageStatus }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem("token"));
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const [customerData, setCustomerData] = useState({});
    const [countryDataAll, setCountryDataAll] = useState({ loading: true, data: [] });
    const [customerDetails, setCustomerDetails] = useState({ loading: true, data: [] });
    const [customerType, setCustomerType] = useState("");
    const [ManagerType, setManagerType] = useState("");
    const [searchItem, setSearchItem] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
    const [getSearchDetails, setSearchDetails] = useState('')
    const [showDropdown, setShowDropdown] = useState(true)
    const [errors1, setErrors1] = useState({})
    const [errors2, setErrors2] = useState({})
    const [errors3, setErrors3] = useState({})
    const [getAccountMangerIdErr, setAccountMangerIdErr] = useState("");
    const [personRoleDataAll, setPersonRoleDataAll] = useState({ loading: true, data: [] });
    const [getSoleTraderDetails, setSoleTraderDetails] = useState({
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
    const [getPartnershipDetails, setPartnershipDetails] = useState({
        TradingName: '',
        TradingAddress: '',
        VATRegistered: '',
        VATNumber: '',
        Website: '',
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
        TradingName: '',
        TradingAddress: ''
    })




    // for Company
    const [contacts, setContacts] = useState([
        { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '', phone_code: "" }
    ]);

    const [errors, setErrors] = useState([{ first_name: false, last_name: false, customer_contact_person_role_id: false, phoneCode: false, phone: false, email: false }
    ]);

    const handleAddContact = () => {
        setContacts([...contacts, { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '', phone_code: "+44" }]);
        setErrors([...errors, { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '' }]);
    };
    const handleDeleteContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        const newErrors = errors.filter((_, i) => i !== index);
        setContacts(newContacts);
        setErrors(newErrors);
    };


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


    //  For Partnership
    const [contacts1, setContacts1] = useState([]);
    const [contactsErrors, setContactsErrors] = useState([
        { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', phone_code: "", email: '', },
        { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', phone_code: "", email: '', }
    ]);

    const handleAddContact1 = () => {
        setContacts1([...contacts1, { authorised_signatory_status: 0, contact_id: "", first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '', phone_code: "+44" }])
        setContactsErrors([...contactsErrors, { first_name: '', last_name: '', customer_contact_person_role_id: '', phone: '', email: '', }]);
    };

    const handleDeleteContact1 = (index) => {
        const newContacts = contacts1.filter((_, i) => i !== index);
        const newErrors = contactsErrors.filter((_, i) => i !== index);
        setContacts1(newContacts);
        setContactsErrors(newErrors);
    };


    const fetchStaffData = async () => {
        try {
            const response = await dispatch(Staff({ req: { action: "getmanager" }, authToken: token })).unwrap();
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
    const GetCustomerDetails = async () => {
        try {
            const response = await dispatch(GET_CUSTOMER_DATA({ req: { customer_id: id.id, pageStatus: pageStatus }, authToken: token }))
                .unwrap();
            if (response.status) {
                setCustomerDetails({
                    loading: false,
                    data: response.data
                });
            } else {
                setCustomerDetails({
                    loading: false,
                    data: []
                });
            }
        } catch (error) {
            console.error("Error fetching customer data", error);
        }
    };
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
        fetchStaffData();
        GetCustomerDetails()
        CustomerPersonRoleData()
    }, []);




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
                if (key == 'IndustryType') newErrors[key] = 'Select Client Industry';
                else if (key == 'tradingName') newErrors[key] = 'Please enter Trading Name';

                else if (key == 'vatRegistered') newErrors[key] = 'Please select VAT Registered';
                // else if (key == 'vatNumber') newErrors[key] = 'Please enter VAT Number';
                // else if (key == 'website') newErrors[key] = 'Please enter Website';
                else if (key == 'first_name') newErrors[key] = 'Please enter First Name';
                else if (key == 'last_name') newErrors[key] = 'Please enter Last Name';
                // else if (key == 'phone') newErrors[key] = 'Please enter Phone';


                else if (key == 'email') newErrors[key] = 'Please enter Email';
                else if (key == 'residentialAddress') newErrors[key] = 'Please enter Residential Address';
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




    // Handle Submit
    const handleSubmit = async () => {
        if (customerType == 1 && validate1() && ManagerType != "") {

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
                        phone_code: getSoleTraderDetails.phone_code

                    }
                ]
            }
            await dispatch(Edit_Customer({ req, authToken: token }))
                .unwrap()
                .then((response) => {
                    if (response.status) {
                        next(id.id)
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
        if (customerType == 2 && validate2() && ManagerType != "") {
            let formIsValid = true;
            const newErrors = contacts.map((contact, index) => {
                const error = {
                    first_name: contact.first_name ? '' : 'First Name is required',
                    last_name: contact.last_name ? '' : 'Last Name is required',
                    // customer_contact_person_role_id: contact.customer_contact_person_role_id ? '' : 'Role is required',
                    // phone: contact.phone ? '' : 'Phone Number is required',
                    email: contact.email === '' ? 'Email Id is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.customer_contact_person_role_id || error.phone || error.email) {
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
                    registered_office_address: getCompanyDetails.RegisteredOfficeAddress,
                    incorporation_date: getCompanyDetails.IncorporationDate,
                    incorporation_in: getCompanyDetails.IncorporationIn,
                    vat_registered: getCompanyDetails.VATRegistered,
                    vat_number: getCompanyDetails.VATNumber,
                    website: getCompanyDetails.Website,
                    trading_name: getCompanyDetails.TradingName,
                    trading_address: getCompanyDetails.TradingAddress,
                    contactDetails: contacts
                }

                await dispatch(Edit_Customer({ req, authToken: token }))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {
                            next(id.id)
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
        if (customerType == 3 && validate3() && ManagerType != "") {

            let formIsValid = true;
            const newErrors = contacts1.map((contact, index) => {
                const error = {
                    first_name: contact.first_name ? '' : 'First Name is required',
                    last_name: contact.last_name ? '' : 'Last Name is required',
                    // customer_contact_person_role_id: contact.customer_contact_person_role_id ? '' : 'Role is required',
                    // phone: contact.phone ? '' : 'Phone Number is required',
                    email: contact.email === '' ? 'Email Id is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.customer_contact_person_role_id || error.phone || error.email) {
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
                    contactDetails: contacts1
                }

                await dispatch(Edit_Customer({ req, authToken: token }))
                    .unwrap()
                    .then((response) => {
                        if (response.status) {
                            next(id.id)

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

    }



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
                // else if (key == 'VATNumber') newErrors[key] = 'Please Enter VAT Number';
                // else if (key == 'Website') newErrors[key] = 'Please Enter Website';

                else if (key == 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                // else if (key == 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
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
                    newErrors[index].email = 'Email Id is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors[index].email = 'Valid Email is required';
                } else {
                    newErrors[index].email = '';
                }
                break;
            case 'phone':
                errors[index].phone = value === '' ? '' : /^\d{9,12}$/.test(value) ? '' : 'Phone Number must be between 9 to 12 digits';
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


                if (key === 'ClientIndustry') newErrors[key] = 'Please Select Client Industry';
                else if (key === 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                // else if (key === 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
                else if (key === 'VATRegistered') newErrors[key] = 'Please Enter VAT Registered';
                // else if (key === 'VATNumber') newErrors[key] = 'Please Enter VAT Number';
                // else if (key === 'Website') newErrors[key] = 'Please Enter Website';
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
                if (!value.trim()) {
                    errors[index] = { ...errors[index], [field]: 'This field is required' };
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errors[index] = { ...errors[index], [field]: 'Invalid email address' };
                } else {
                    delete errors[index][field];
                }
                break;
            case 'phone':
                errors[index].phone = value === '' ? '' : /^\d{9,12}$/.test(value) ? '' : 'Phone Number must be between 9 to 12 digits';
                break;

            default:
                break;
        }

        setContactsErrors(errors);
    };


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


    const handleChangeValue = (e) => {
        setManagerType(e.target.value);
        if (e.target.value == "") {
            setAccountMangerIdErr("Please Select Manager")
        }
        else {
            setAccountMangerIdErr("")
        }

    };

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

    useEffect(() => {
        Get_Company()
    }, [searchItem])




    useEffect(() => {
        setCustomerType(id.customer_type)
        setManagerType(id.account_manager_id)

        if (id.customer_type == '1') {
            setSoleTraderDetails(prevState => ({
                ...prevState,
                tradingName: !customerDetails.loading && customerDetails.data.customer.trading_name,
                tradingAddress: !customerDetails.loading && customerDetails.data.customer.trading_address,
                vatRegistered: !customerDetails.loading && customerDetails.data.customer.vat_registered,
                vatNumber: !customerDetails.loading && customerDetails.data.customer.vat_number,
                website: !customerDetails.loading && customerDetails.data.customer.website,
                first_name: !customerDetails.loading && customerDetails.data.contact_details[0].first_name,
                last_name: !customerDetails.loading && customerDetails.data.contact_details[0].last_name,
                phone: !customerDetails.loading && customerDetails.data.contact_details[0].phone,
                email: !customerDetails.loading && customerDetails.data.contact_details[0].email,
                residentialAddress: !customerDetails.loading && customerDetails.data.contact_details[0].residential_address,
                phone_code: !customerDetails.loading && customerDetails.data.contact_details[0].phone_code,
                contact_id: !customerDetails.loading && customerDetails.data.contact_details[0].contact_id
            }))

        }
        if (id.customer_type == '2') {
            setCompanyDetails(prevState => ({
                ...prevState,
                CompanyName: !customerDetails.loading && customerDetails.data.company_details.company_name,
                EntityType: !customerDetails.loading && customerDetails.data.company_details.entity_type,
                CompanyStatus: !customerDetails.loading && customerDetails.data.company_details.company_status,
                CompanyNumber: !customerDetails.loading && customerDetails.data.company_details.company_number,
                RegisteredOfficeAddress: !customerDetails.loading && customerDetails.data.company_details.registered_office_address,
                IncorporationDate: !customerDetails.loading && customerDetails.data.company_details.incorporation_date,
                IncorporationIn: !customerDetails.loading && customerDetails.data.company_details.incorporation_in,


                VATRegistered: !customerDetails.loading && customerDetails.data.customer.vat_registered,
                VATNumber: !customerDetails.loading && customerDetails.data.customer.vat_number,
                Website: !customerDetails.loading && customerDetails.data.customer.website,

                TradingName: !customerDetails.loading && customerDetails.data.customer.trading_name,
                TradingAddress: !customerDetails.loading && customerDetails.data.customer.trading_address,
            }))
            setContacts(!customerDetails.loading && customerDetails.data.contact_details)
        }
        if (id.customer_type == '3') {

            setPartnershipDetails(prevState => ({
                ...prevState,
                TradingName: !customerDetails.loading && customerDetails.data.customer.trading_name,
                TradingAddress: !customerDetails.loading && customerDetails.data.customer.trading_address,
                VATRegistered: !customerDetails.loading && customerDetails.data.customer.vat_registered,
                VATNumber: !customerDetails.loading && customerDetails.data.customer.vat_number,
                Website: !customerDetails.loading && customerDetails.data.customer.website,
            }))
            setContacts1(customerDetails.data && customerDetails.data.contact_details)

        }

    }, [customerDetails])



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
                                                Outbooks Account Manager <span style={{ color: "red" }}>*</span>
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <Field as="select" name="accountManager" className="form-select "
                                                        onChange={(e) => handleChangeValue(e)} value={ManagerType}>
                                                        <option value="">Select Manager </option>
                                                        {staffDataAll.data.map((data) => (
                                                            <option key={data.id} value={data.id}>
                                                                {data.first_name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    {getAccountMangerIdErr && (
                                                        <div style={{ color: "red" }}>{getAccountMangerIdErr && getAccountMangerIdErr}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <section>
                            {
                                customerType == 1 ?
                                    <div className="row mt-3"  >

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
                                                                <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                <input
                                                                    type="text"
                                                                    name="tradingName"
                                                                    className="form-control"
                                                                    placeholder="Trading Name"
                                                                    onChange={(e) => handleChange1(e)}
                                                                    value={getSoleTraderDetails.tradingName}
                                                                    maxLength={100}
                                                                />

                                                                {errors1['tradingName'] && (
                                                                    <div className="error-text">{errors1['tradingName']}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">Trading Address</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Trading Address"
                                                                    name="tradingAddress"
                                                                    onChange={(e) => handleChange1(e)}
                                                                    value={getSoleTraderDetails.tradingAddress}
                                                                    maxLength={200}
                                                                />

                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">VAT Registered<span style={{ color: "red" }}>*</span></label>
                                                                <select className="form-select " aria-label="Default select example"
                                                                    name="vatRegistered"
                                                                    value={getSoleTraderDetails.vatRegistered}
                                                                    onChange={(e) => handleChange1(e)}
                                                                >

                                                                    <option value="">Please Select VAT Registered</option>

                                                                    <option value={1}>Yes</option>
                                                                    <option value={0}>No</option>


                                                                </select>
                                                                {errors1['vatRegistered'] && (
                                                                    <div className="error-text">{errors1['vatRegistered']}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label">VAT Number</label>
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
                                                                <label className="form-label">Website</label>
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
                                            <div className="card">
                                                <div className="card-header card-header-light-blue step-card-header mb-3 ">
                                                    <h4 className="card-title mb-0 flex-grow-1" style={{ marginBottom: "15px !important" }}>
                                                        Sole Trader Details
                                                    </h4>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
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
                                                                    <div className="error-text">{errors1['first_name']}</div>
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
                                                                    <div className="error-text">{errors1['last_name']}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-4">
                                                            <div class="mb-3">

                                                                <label for="firstNameinput" class="form-label">Phone</label>
                                                                <div class="row">
                                                                    <div class="col-md-4">
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
                                                                    <div className="mb-3 col-md-8">
                                                                        <input type="text" className="form-control"
                                                                            placeholder="Phone Number"
                                                                            name="phone"
                                                                            value={getSoleTraderDetails.phone}
                                                                            onChange={(e) => handleChange1(e)}
                                                                            maxLength={12}
                                                                        />
                                                                        {errors1['phone'] && (
                                                                            <div className="error-text">{errors1['phone']}</div>
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
                                                                    <div className="error-text">{errors1['email']}</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-4">
                                                            <div className="mb-3">
                                                                <label className="form-label" >Residential Address<span style={{ color: "red" }}>*</span></label>
                                                                <input type="text" className="form-control" placeholder="Residential Address"
                                                                    name="residentialAddress"
                                                                    value={getSoleTraderDetails.residentialAddress}
                                                                    onChange={(e) => handleChange1(e)}
                                                                />
                                                                {errors1['residentialAddress'] && (
                                                                    <div className="error-text">{errors1['residentialAddress']}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    customerType == 2 ?
                                        <div className="row mt-3">
                                            <div className="col-lg-12">
                                                <div className="card card_shadow ">
                                                    <div className="card-header card-header-light-blue  step-card-header align-items-center d-flex">
                                                        <h4 className="card-title mb-0 flex-grow-1">Company</h4>
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
                                                                            <div className="error-text">{errors2['CompanyName']}</div>
                                                                        )}

                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Entity Type<span style={{ color: "red" }}>*</span>   </label>
                                                                        <input type="text" className="form-control input_bg" placeholder="LTD"
                                                                            name="EntityType" onChange={(e) => handleChange2(e)} value={getCompanyDetails.EntityType} disabled />
                                                                        {errors2['EntityType'] && (
                                                                            <div className="error-text">{errors2['EntityType']}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label"  >Company Status<span style={{ color: "red" }}>*</span> </label>
                                                                        <input type="text" className="form-control input_bg" placeholder="Active"
                                                                            name="CompanyStatus" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyStatus} disabled />
                                                                        {errors2['CompanyStatus'] && (
                                                                            <div className="error-text">{errors2['CompanyStatus']}</div>)}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Company Number<span style={{ color: "red" }}>*</span></label>
                                                                        <input type="text" className="form-control input_bg" placeholder="Company Number"
                                                                            name="CompanyNumber" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyNumber} disabled
                                                                        />
                                                                        {errors2['CompanyNumber'] && (
                                                                            <div className="error-text">{errors2['CompanyNumber']}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Registered Office Address<span style={{ color: "red" }}>*</span>  </label>
                                                                        <input type="text" className="form-control input_bg" placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                                                            name="RegisteredOfficeAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.RegisteredOfficeAddress} disabled
                                                                        />
                                                                        {errors2['RegisteredOfficeAddress'] && (
                                                                            <div className="error-text">{errors2['RegisteredOfficeAddress']}</div>
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
                                                                            <div className="error-text">{errors2['IncorporationDate']}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label"  > Incorporation in  <span style={{ color: "red" }}>*</span> </label>
                                                                        <input type="text" className="form-control input_bg" placeholder="Please Enter Incorporation In"
                                                                            name="IncorporationIn" onChange={(e) => handleChange2(e)} value={getCompanyDetails.IncorporationIn} disabled
                                                                        />

                                                                        {errors2['IncorporationIn'] && (
                                                                            <div className="error-text">{errors2['IncorporationIn']}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label"  >VAT Registered</label>
                                                                        <select className="form-select " name="VATRegistered" onChange={(e) => handleChange2(e)} value={getCompanyDetails.VATRegistered}>
                                                                            <option value=''>Please Select VAT Registered</option>
                                                                            <option value={1}>Yes</option>
                                                                            <option value={0}>No</option>
                                                                        </select>
                                                                        {errors2['VATRegistered'] && (
                                                                            <div className="error-text">{errors2['VATRegistered']}</div>
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
                                                                                <div className="error-text">{errors2['VATNumber']}</div>
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
                                                                    <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                    <input type="text" className="form-control" placeholder="Trading Name"
                                                                        name="TradingName" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingName}
                                                                    />
                                                                    {errors2['TradingName'] && (
                                                                        <div className="error-text">{errors2['TradingName']}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-6">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Trading Address<span style={{ color: "red" }}>*</span> </label>
                                                                    <input type="text" className="form-control" placeholder="Trading Address"
                                                                        name="TradingAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingAddress}
                                                                    />
                                                                    {errors2['TradingAddress'] && (
                                                                        <div className="error-text">{errors2['TradingAddress']}</div>
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
                                                                    {contacts.length > 0 && contacts.map((contact, index) => (
                                                                        <div className="col-xl-12 col-lg-12 mt-3" key={index}>
                                                                            <div className=" pricing-box px-2 m-2 mt-0">
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
                                                                                                <div class="col-md-4">
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
                                                                                                <div className="mb-3 col-md-8">
                                                                                                    <input type="text" className="form-control"
                                                                                                        placeholder="Phone Number"
                                                                                                        name="phone"
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
                                                                    <div className="px-4 d-flex align-items-center">
                                                                        <h5 className="card-title mb-0 flex-grow-1"></h5>
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
                                        customerType == 3 ?
                                            <div className="row mt-3" >
                                                <div className="col-lg-12">
                                                    <div className="card card_shadow ">
                                                        <div className=" card-header card-header-light-blue step-card-header align-items-center d-flex">
                                                            <h4 className="card-title mb-0 flex-grow-1">Partnership</h4>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="row">

                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                        <input type="text" className="form-control" placeholder="Trading Name"
                                                                            name="TradingName" value={getPartnershipDetails.TradingName} onChange={(e) => handleChange3(e)}
                                                                            maxLength={100}
                                                                        />
                                                                        {errors3['TradingName'] && (
                                                                            <div className="error-text">{errors3['TradingName']}</div>)}
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
                                                                            <div className="error-text">{errors3['TradingAddress']}</div>)}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="mb-3">
                                                                            <label className="form-label">VAT Registered<span style={{ color: "red" }}>*</span></label>
                                                                            <select className="form-select "
                                                                                name="VATRegistered" value={getPartnershipDetails.VATRegistered} onChange={(e) => handleChange3(e)}
                                                                            >
                                                                                <option value="">Select VAT Registered</option>
                                                                                <option value={1}>Yes</option>
                                                                                <option value={0}>No</option>
                                                                            </select>
                                                                            {errors3['VATRegistered'] && (
                                                                                <div className="error-text">{errors3['VATRegistered']}</div>)}

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
                                                                                <div className="error-text">{errors3['VATNumber']}</div>)}
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
                                                                            <div className="error-text">{errors3['Website']}</div>)}
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
                                                                                                    <input type="text" className="form-control"
                                                                                                        placeholder="Phone Number"
                                                                                                        name="phone"
                                                                                                        id={`phone-${index}`}
                                                                                                        value={contact.phone}
                                                                                                        onChange={(e) => handleChange4(index, 'phone', e.target.value)}
                                                                                                        maxLength={12}
                                                                                                        minLength={9}
                                                                                                    />
                                                                                                    {contactsErrors[index]?.phone && (
                                                                                                        <div style={{ color: 'red' }}>{contactsErrors[index].phone}</div>
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

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    <div className="px-4 d-flex align-items-center">
                                                                        <h5 className="card-title mb-0 flex-grow-1"></h5>
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
                        <div className="form__item button__items d-flex justify-content-between">
                            <Button className="white-btn" type="default" onClick={prev}>
                                Back
                            </Button>
                            <Button className="btn btn-info text-white blue-btn" type="submit" onClick={handleSubmit}>
                                Next
                            </Button>
                        </div>

                    </Form>

                )}
            </Formik>
        </>
    );
};

export default Information;