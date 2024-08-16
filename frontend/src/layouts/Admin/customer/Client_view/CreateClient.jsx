import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { GetClientIndustry, Add_Client } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { GetAllCompany } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { Email_regex } from '../../../../Utils/Common_regex'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { PersonRole } from '../../../../ReduxStore/Slice/Settings/settingSlice'
import Search from 'antd/es/transfer/search';
const CreateClient = () => {
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
    const [searchItem, setSearchItem] = useState('')
    const [errors1, setErrors1] = useState({})
    const [errors2, setErrors2] = useState({})
    const [errors3, setErrors3] = useState({})



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
        residentialAddress: ""
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

    const [contacts, setContacts] = useState([
        { authorised_signatory_status: false, first_name: '', last_name: '', role: '', phone: '', email: '' }
    ]);

    const [contacts1, setContacts1] = useState([
        { authorised_signatory_status: true, first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }, { authorised_signatory_status: true, first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }
    ]);
    const [contactsErrors, setContactsErrors] = useState([
        { first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' },
        { first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }

    ]);


    const [errors, setErrors] = useState([{ first_name: false, last_name: false, role: false, phoneCode: false, phone: false, email: false }
    ]);


    const handleAddContact = () => {
        setContacts([...contacts, { authorised_signatory_status: false, first_name: '', last_name: '', role: '', phone: '', email: '' }]);
        setErrors([...errors, { first_name: '', last_name: '', role: '', phone: '', email: '' }]);
    };

    const handleAddContact1 = () => {

        setContacts1([...contacts1, { authorised_signatory_status: true, first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }])
        setContactsErrors([...contactsErrors, { first_name: '', last_name: '', role: '', phone: '', alternate_phone: '', email: '', alternate_email: '' }]);
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
    useEffect(() => {
        CustomerPersonRoleData();

    }, []);




    const handleSubmit = async () => {
        if (selectClientType == 1 && validate1()) {
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
                client_code: location.state.id
            }
            await dispatch(Add_Client(req))
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
                            navigate('/admin/Clientlist', { state: location.state });
                        }, 1500)

                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: response.msg,
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
                    role: contact.role ? '' : 'Role is required',
                    phone: contact.phone ? '' : 'Phone Number is required',
                    email: contact.email === '' ? 'Email Id is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.role || error.phone || error.email) {
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
                    contactDetails: contacts
                }

                await dispatch(Add_Client(req))
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
                                navigate('/admin/Clientlist', { state: location.state });
                            }, 1500)
                        } else {
                            Swal.fire({
                                icon: 'success',
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
                    role: contact.role ? '' : 'Role is required',
                    phone: contact.phone ? '' : 'Phone Number is required',
                    alternate_phone: contact.alternate_phone ? '' : 'Alternate Phone Number is required',
                    email: contact.email === '' ? 'Email Id is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? '' : 'Valid Email is required',
                    alternate_email: contact.alternate_email === '' ? 'Alternate Email Id is required' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.alternate_email) ? '' : 'Valid Email is required',
                };

                if (error.first_name || error.last_name || error.role || error.phone || error.email) {
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
                    contactDetails: contacts1

                }


                await dispatch(Add_Client(req))
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
                                navigate('/admin/Clientlist', { state: { id: location.state.id } })
                            }, 1500)
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: response.msg,
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

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        if (name === "CompanyNumber" || name === "VATNumber") {
            if (!/^[0-9+]*$/.test(value)) {
                return;
            }
        }
        validate2()
        setCompanyDetails({ ...getCompanyDetails, [name]: value });
    };


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


    const validate1 = () => {
        const newErrors = {};
        for (const key in getSoleTraderDetails) {
            if (!getSoleTraderDetails[key]) {
                if (key == 'IndustryType') newErrors[key] = 'Select Client Industry';
                else if (key == 'tradingName') newErrors[key] = 'Please enter Trading Name';
                else if (key == 'tradingAddress') newErrors[key] = 'Please enter Trading Address';
                else if (key == 'vatRegistered') newErrors[key] = 'Please select VAT Registered';
                else if (key == 'vatNumber') newErrors[key] = 'Please enter VAT Number';
                else if (key == 'website') newErrors[key] = 'Please enter Website';
                else if (key == 'first_name') newErrors[key] = 'Please enter First Name';
                else if (key == 'last_name') newErrors[key] = 'Please enter Last Name';
                else if (key == 'phone') newErrors[key] = 'Please enter Phone';
                else if (key == 'email') newErrors[key] = 'Please enter Email';
                else if (key == 'residentialAddress') newErrors[key] = 'Please enter Residential Address';
            }
            else if (key == 'email' && !Email_regex(getSoleTraderDetails[key])) {
                newErrors[key] = 'Please enter valid Email';
            }
        }
        setErrors1(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
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
                else if (key == 'VATNumber') newErrors[key] = 'Please Enter VAT Number';
                else if (key == 'Website') newErrors[key] = 'Please Enter Website';
                else if (key == 'ClientIndustry') newErrors[key] = 'Please Enter Client Industry';
                else if (key == 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                else if (key == 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
            }
        }
        setErrors2(newErrors)
        return Object.keys(newErrors).length === 0 ? true : false;
    };

    const validate3 = () => {
        const newErrors = {};
        for (const key in getPartnershipDetails) {
            if (!getPartnershipDetails[key]) {
                console.log("key", key)

                if (key === 'ClientIndustry') newErrors[key] = 'Please Select Client Industry';
                else if (key === 'TradingName') newErrors[key] = 'Please Enter Trading Name';
                else if (key === 'TradingAddress') newErrors[key] = 'Please Enter Trading Address';
                else if (key === 'VATRegistered') newErrors[key] = 'Please Enter VAT Registered';
                else if (key === 'VATNumber') newErrors[key] = 'Please Enter VAT Number';
                else if (key === 'Website') newErrors[key] = 'Please Enter Website';
            }
        }

        setErrors3(newErrors);

        return Object.keys(newErrors).length === 0 ? true : false;
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

    useEffect(() => {
        getClientIndustry()
    }, [])

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
            case 'first_name':
                newErrors[index].first_name = value ? '' : 'First Name is required';
                break;
            case 'last_name':
                newErrors[index].last_name = value ? '' : 'Last Name is required';
                break;
            case 'role':
                newErrors[index].role = value ? '' : 'Role is required';
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
                newErrors[index].phone = value ? '' : 'Phone Number is required';
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const validateField1 = (index, field, value) => {
        const newErrors = [...contactsErrors];


        switch (field) {
            case 'first_name':
                newErrors[index].first_name = value ? '' : 'First Name is required';
                break;
            case 'last_name':
                newErrors[index].last_name = value ? '' : 'Last Name is required';
                break;
            case 'role':
                newErrors[index].role = value ? '' : 'Role is required';
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
            case 'alternate_email':
                if (!value) {
                    newErrors[index].alternate_email = 'Alternate Email Id is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors[index].alternate_email = 'Valid Email is required';
                } else {
                    newErrors[index].alternate_email = '';
                }
                break;
            case 'phone':
                newErrors[index].phone = value ? '' : 'Phone Number is required';
                break;
            case 'alternate_phone':
                newErrors[index].alternate_phone = value ? '' : 'Alternate Phone Number is required';
                break;
            default:
                break;
        }
        setContactsErrors(newErrors);
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


    return (
        <div>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header step-header-blue">
                                <h4 className="card-title mb-0 ">Create New Client</h4>
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
                                                                            Client Type{" "}
                                                                            <span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <select
                                                                            className="form-select "
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
                                                                            <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                                                Sole Trader
                                                                            </h4>
                                                                        </div>
                                                                        {/* end card header */}
                                                                        <div className="card-body">
                                                                            <div className="row">
                                                                                <div className="col-lg-4 mb-3">
                                                                                    <div className="">
                                                                                        <label className="form-label">Client Industry<span style={{ color: "red" }}>*</span></label>
                                                                                        <select className="form-select " aria-label="Default select example"
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
                                                                                        {errors1['IndustryType'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['IndustryType']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" name="tradingName" className="form-control" placeholder="Trading Name"
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                            value={getSoleTraderDetails.tradingName}
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
                                                                                        />
                                                                                        {errors1['tradingAddress'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['tradingAddress']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4 mb-3">
                                                                                    <div className="">
                                                                                        <label className="form-label" >VAT Registered</label>
                                                                                        <select className="form-select " aria-label="Default select example"
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
                                                                                        />
                                                                                        {errors1['vatNumber'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['vatNumber']}</div>
                                                                                        )}
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
                                                                                        />
                                                                                        {errors1['website'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['website']}</div>
                                                                                        )}

                                                                                    </div>
                                                                                </div>
                                                                                <h4 className="card-title mb-3 border-bottom flex-grow-1 fs-14 mb-2">
                                                                                    Sole Trader Details
                                                                                </h4>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label"  >First Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control"
                                                                                            placeholder="First Name"
                                                                                            name="first_name"
                                                                                            value={getSoleTraderDetails.first_name}
                                                                                            onChange={(e) => handleChange1(e)}
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
                                                                                        />
                                                                                        {errors1['last_name'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['last_name']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >Phone<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control"
                                                                                            placeholder="Phone Number"
                                                                                            name="phone"
                                                                                            value={getSoleTraderDetails.phone}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        />
                                                                                        {errors1['phone'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['phone']}</div>
                                                                                        )}
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
                                                            </div>
                                                            :
                                                            selectClientType == 2 ?
                                                                <div className="row">
                                                                    <div className="col-lg-12">
                                                                        <div className="card card_shadow ">
                                                                            <div className="card-header card-header-light-blue align-items-center d-flex">
                                                                                <h4 className="card-title mb-0 flex-grow-1 fs-16">Company</h4>
                                                                            </div>
                                                                            {/* end card header */}
                                                                            <div className="card-body">
                                                                                <div className="row">
                                                                                    {/* <h4 className="card-title flex-grow-1 fs-14 mb-2">Contact Information</h4> */}
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
                                                                                                            <div className='dropdown-list'>
                                                                                                                {getAllSearchCompany && getAllSearchCompany.map((company, index) => (
                                                                                                                    <div
                                                                                                                        key={index}
                                                                                                                        onClick={() => { setSearchItem(company.title); setShowDropdown(false); }}
                                                                                                                        style={{ cursor: "pointer", padding: "8px 0" }} // Adjust padding as needed
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
                                                                                                <label className="form-label"  >  Company Status  <span style={{ color: "red" }}>*</span> </label>
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
                                                                                                    name="CompanyNumber" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyNumber}
                                                                                                    disabled
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
                                                                                        
                                                                                        <div className="col-lg-4">
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
                                                                                                <select className="form-select " name="VATRegistered" onChange={(e) => handleChange2(e)} value={getCompanyDetails.VATRegistered}>
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
                                                                                    <div className="col-lg-4">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Client Industry<span style={{ color: "red" }}>*</span></label>
                                                                                            <select className="form-select "
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
                                                                                    <div className="col-lg-4">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Trading Name<span style={{ color: "red" }}>*</span></label>
                                                                                            <input type="text" className="form-control" placeholder="Trading Name"
                                                                                                name="TradingName" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingName}
                                                                                            />
                                                                                            {errors2['TradingName'] && (
                                                                                                <div style={{ 'color': 'red' }}>{errors2['TradingName']}</div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-lg-4">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Trading Address<span style={{ color: "red" }}>*</span> </label>
                                                                                            <input type="text" className="form-control" placeholder="Trading Address"
                                                                                                name="TradingAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.TradingAddress}
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
                                                                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">
                                                                                        Officer Details
                                                                                    </h4>
                                                                                </div>
                                                                                <div className="row" id="form2">
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            {contacts.map((contact, index) => (
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
                                                                                                                    />
                                                                                                                    {errors[index].first_name && <div style={{ color: 'red' }}>{errors[index].first_name}</div>}
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
                                                                                                                    {errors[index].last_name && <div style={{ color: 'red' }}>{errors[index].last_name}</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`role-${index}`} className="form-label">
                                                                                                                        Role<span style={{ color: 'red' }}>*</span>
                                                                                                                    </label>
                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`role-${index}`}
                                                                                                                        value={contact.role}
                                                                                                                        onChange={(e) => handleChange(index, 'role', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll &&
                                                                                                                            personRoleDataAll.data.map((item, i) => (
                                                                                                                                <option value={item.id} key={i}>{item.name}</option>
                                                                                                                            ))}
                                                                                                                    </select>
                                                                                                                    {errors[index].role && <div style={{ color: 'red' }}>{errors[index].role}</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`phone-${index}`} className="form-label">
                                                                                                                        Phone
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="number"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Phone Number"
                                                                                                                        id={`phone-${index}`}
                                                                                                                        value={contact.phone}
                                                                                                                        onChange={(e) => handleChange(index, 'phone', e.target.value)}
                                                                                                                    />
                                                                                                                    {errors[index].phone && <div style={{ color: 'red' }}>{errors[index].phone}</div>}
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
                                                                                                                    {errors[index].email && <div style={{ color: 'red' }}>{errors[index].email}</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                            <div className="card-header d-flex align-items-center">
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
                                                                selectClientType == 3 ?
                                                                    <div className="row " >
                                                                        <div className="col-lg-12">
                                                                            <div className="card card_shadow ">
                                                                                <div className="card-header  card-header-light-blue align-items-center d-flex">
                                                                                    <h4 className="card-title mb-0 flex-grow-1 fs-16">Partnership</h4>
                                                                                </div>
                                                                                {/* end card header */}
                                                                                <div className="card-body">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Client Industry<span style={{ color: "red" }}>*</span></label>
                                                                                                <select className="form-select "
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
                                                                                                />
                                                                                                {errors3['TradingAddress'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors3['TradingAddress']}</div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-4">
                                                                                            <div className="mb-3">
                                                                                                <div className="mb-3">
                                                                                                    <label className="form-label">VAT Registered</label>
                                                                                                    <select className="form-select "
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
                                                                                                                <div className="form-check form-switch form-switch-md mb-3 d-flex justify-content-between" dir="ltr">
                                                                                                                    <div>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            className="form-check-input"
                                                                                                                            id={`customSwitchsizemd-${index}`}
                                                                                                                            checked={contacts1.authorised_signatory_status}
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
                                                                                                                    <input type="text" className="form-control" placeholder="First Name"
                                                                                                                        name="first_name" value={contacts1.first_name} onChange={(e) => handleChange4(index, 'first_name', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index].first_name && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].first_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label"> Last Name<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input type="text" className="form-control" placeholder=" Last Name"
                                                                                                                        name="last_name" value={contacts1.last_name} onChange={(e) => handleChange4(index, 'last_name', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index].last_name && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].last_name}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Role<span style={{ color: "red" }}>*</span></label>

                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`role-${index}`}
                                                                                                                        value={contacts1.role}
                                                                                                                        onChange={(e) => handleChange4(index, 'role', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll &&
                                                                                                                            personRoleDataAll.data.map((item, i) => (
                                                                                                                                <option value={item.id} key={i}>{item.name}</option>
                                                                                                                            ))}
                                                                                                                    </select>
                                                                                                                    {contactsErrors[index].role && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].role}</div>
                                                                                                                    )}

                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Phone<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input type="number" className="form-control" placeholder="Phone"
                                                                                                                        name="phone" value={contacts1.phone} onChange={(e) => handleChange4(index, 'phone', e.target.value)}

                                                                                                                    />
                                                                                                                    {contactsErrors[index].phone && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].phone}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label"> Alternate Phone<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input type="number" className="form-control" placeholder=" Alternate Phone"

                                                                                                                        name="alternate_phone" value={contacts1.alternate_phone} onChange={(e) => handleChange4(index, 'alternate_phone', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index].alternate_phone && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].alternate_phone}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label">Email<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input type="text" className="form-control" placeholder="Enter Email"
                                                                                                                        name="email" value={contacts1.email} onChange={(e) => handleChange4(index, 'email', e.target.value)}

                                                                                                                    />
                                                                                                                    {contactsErrors[index].email && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].email}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-4">
                                                                                                                <div className="mb-3">
                                                                                                                    <label className="form-label"> Alternate Email<span style={{ color: "red" }}>*</span></label>
                                                                                                                    <input type="text" className="form-control" placeholder="Enter Alternate Email"
                                                                                                                        name="alternate_email" value={contacts1.alternate_email} onChange={(e) => handleChange4(index, 'alternate_email', e.target.value)}
                                                                                                                    />
                                                                                                                    {contactsErrors[index].alternate_email && (
                                                                                                                        <div style={{ 'color': 'red' }}>{contactsErrors[index].alternate_email}</div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                            <div className="card-header d-flex align-items-center">
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
                                            </div>
                                            <div className="hstack gap-2 justify-content-end">
                                                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                                <button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>Create Client</button>
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

export default CreateClient;