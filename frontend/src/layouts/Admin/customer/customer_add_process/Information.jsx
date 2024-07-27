import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from 'react-redux';
import { Formik, Field, Form, useFormik } from "formik";
import AddFrom from '../../../../Components/ExtraComponents/Forms/Customer.form'
import { Button } from "antd";
import { Input } from "formik-antd";
import { GetAllCompany, AddCustomer } from '../../../../ReduxStore/Slice/Customer/CustomerSlice'
import { Email_regex, Mobile_regex } from '../../../../Utils/Common_regex'
import MultiStepFormContext from "./MultiStepFormContext";
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';
import { PersonRole } from '../../../../ReduxStore/Slice/Settings/settingSlice'

const Information = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const [getAccountMangerId, setAccountMangerId] = useState("");
    const [CustomerType, setCustomerType] = useState('1');
    const [getNextStatus, setNextStatus] = useState('0');
    const [personRoleDataAll, setPersonRoleDataAll] = useState({ loading: true, data: [] });

    const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);
    const [errors, setErrors] = useState([{ firstName: false, lastName: false, role: false, phoneCode: false, phoneNumber: false, email: false }
    ]);

    const [contacts, setContacts] = useState([
        { authorised_signatory_status: false, firstName: '', lastName: '', role: '', phoneNumber: '', email: '' }
    ]);

    console.log("contacts ", contacts)

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

    const handleAddContact = () => {
        setContacts([...contacts, { authorised_signatory_status: false, firstName: '', lastName: '', role: '', phoneNumber: '', email: '' }]);
        setErrors([...errors, { firstName: false, lastName: false, role: false, email: false }]);
    };

    const handleDeleteContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        const newErrors = errors.filter((_, i) => i !== index);
        setContacts(newContacts);
        setErrors(newErrors);
    };

    const handleChange = (index, field, value) => {
        console.log("index", index)
        console.log("field", field)
        console.log("value", value)

        // Update the contacts state
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);

        const newErrors = [...errors];
        newErrors[index][field] = !value;
        setErrors(newErrors);
    };



    const validateContacts = () => {
        const newErrors = contacts.map(contact => ({
            firstName: !contact.firstName,
            lastName: !contact.lastName,
            role: !contact.role,
            email: !contact.email
        }));
        setErrors(newErrors);
        return newErrors.every(error => !Object.values(error).some(Boolean));
    };

    const AddCustomerFun = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(AddCustomer(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    next(response.data)
                    console.log("response", response)
                } else {

                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }


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
            VAT_Registered: "",
            VAT_Number: "",
            Website: "",
            Trading_Name: "",
            Trading_Address: ""

        },
        validate: (values) => {
            let errors = {};
            if (!values.company_name) {
                errors.company_name = "Please Enter Company Name";
            }
            if (!values.entity_type) {
                errors.entity_type = "Please Enter Entity Type";
            }
            if (!values.company_status) {
                errors.company_status = "Please Enter Company Status";
            }
            if (!values.company_number) {
                errors.company_number = "Please Enter Company Number";
            }
            if (!values.Registered_Office_Addres) {
                errors.Registered_Office_Addres = "Please Enter Registered Office Address";
            }
            if (!values.Incorporation_Date) {
                errors.Incorporation_Date = "Please Enter Incorporation Date";
            }
            if (!values.Incorporation_in) {
                errors.Incorporation_in = "Please Enter Incorporation in";
            }
            if (!values.VAT_Registered) {
                errors.VAT_Registered = "Please Enter VAT Registered";
            }
            if (!values.VAT_Number) {
                errors.VAT_Number = "Please Enter VAT Number";
            }
            if (!values.Website) {
                errors.Website = "Please Enter Website";
            }
            if (!values.Trading_Name) {
                errors.Trading_Name = "Please Enter Trading Name";
            }
            if (!values.Trading_Address) {
                errors.Trading_Address = "Please Enter Trading Address";
            }

            return errors;
        },


        onSubmit: async (values) => {


            if (validateContacts()) {
                let req = {
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
                    staff_id: staffDetails.id
                }
                console.log("req", req)
                await AddCustomerFun(req)


            }

            else {
                //  console.log("contacts", contacts)

            }


        }
    });

    const formik1 = useFormik({
        initialValues: {
            Trading_Name: "",
            Trading_Address: "",
            VAT_Registered: "",
            VAT_Number: "",
            Website: "",
            First_Name: "",
            Last_Name: "",
            Phone: "",
            Email: "",
            Residential_Address: ""
        },
        validate: (values) => {
            let errors = {};
            if (!values.Trading_Name) {
                errors.Trading_Name = "Please Enter Trading Name";
            }
            if (!values.Trading_Address) {
                errors.Trading_Address = "Please Enter Trading Address";
            }
            if (!values.VAT_Registered) {
                errors.VAT_Registered = "Please Enter VAT Registered";
            }
            if (!values.VAT_Number) {
                errors.VAT_Number = "Please Enter VAT Number";
            }
            if (!values.Website) {
                errors.Website = "Please Enter Website";
            }
            if (!values.First_Name) {
                errors.First_Name = "Please Enter First Name";
            }
            if (!values.Last_Name) {
                errors.Last_Name = "Please Enter Last Name";
            }
            if (!values.Phone) {
                errors.Phone = "Please Enter Phone";
            }
            if (!values.Email) {
                errors.Email = "Please Enter Email";
            }
            if (!values.Residential_Address) {
                errors.Residential_Address = "Please Enter Residential Address";
            }

            return errors;

        },


        onSubmit: async (values) => {
            const req = {
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
                staff_id: staffDetails.id

            }
            console.log("req", req)
            await AddCustomerFun(req)
        }
    });

    const formik2 = useFormik({
        initialValues: {
            Trading_Name: "",
            Trading_Address: "",
            VAT_Registered: "",
            VAT_Number: "",
            Website: "",
        },
        validate: (values) => {
            let errors = {};
            if (!values.Trading_Name) {
                errors.Trading_Name = "Please Enter Trading Name";
            }
            if (!values.Trading_Address) {
                errors.Trading_Address = "Please Enter Trading Address";
            }
            if (!values.VAT_Registered) {
                errors.VAT_Registered = "Please Enter VAT Registered";
            }
            if (!values.VAT_Number) {
                errors.VAT_Number = "Please Enter VAT Number";
            }
            if (!values.Website) {
                errors.Website = "Please Enter Website";
            }

            return errors;

        },


        onSubmit: async (values) => {
            if (validateContacts()) {
                const req = {
                    Trading_Name: values.Trading_Name,
                    Trading_Address: values.Trading_Address,
                    VAT_Registered: values.VAT_Registered,
                    VAT_Number: values.VAT_Number,
                    Website: values.Website,
                    PageStatus: "1",
                    contactDetails: contacts,
                    CustomerType: CustomerType,
                    account_manager_id: getAccountMangerId,
                    staff_id: staffDetails.id
                }
                console.log("req", req)
                await AddCustomerFun(req)
            }
            else {

            }


        }
    });


    let filteredCompanies = [];
    if (getAllSearchCompany.items !== undefined) {

        filteredCompanies = getAllSearchCompany && getAllSearchCompany.items.filter(company =>
            company.title.toLowerCase().includes(formik.values.search_company_name.toLowerCase())
        );
    }

    let getCompanyDetails = []
    if (getAllSearchCompany.items !== undefined) {
        getCompanyDetails = getAllSearchCompany && getAllSearchCompany.items.filter(company => company.title == formik.values.search_company_name)
    }

    useEffect(() => {
        formik.setFieldValue("company_name", getCompanyDetails[0]?.title)
        formik.setFieldValue("entity_type", getCompanyDetails[0]?.company_type)
        formik.setFieldValue("company_status", getCompanyDetails[0]?.company_status)
        formik.setFieldValue("company_number", getCompanyDetails[0]?.company_number)
        formik.setFieldValue("Registered_Office_Addres", getCompanyDetails[0]?.address_snippet)
        formik.setFieldValue("Incorporation_Date", getCompanyDetails[0]?.date_of_creation)
        formik.setFieldValue("Incorporation_in", getCompanyDetails[0]?.description)

    }, [formik.values.search_company_name])

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
            type: "select",
            options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }],
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "VAT_Number",
            label: "VAT Number",
            type: "number",
            label_size: 12,
            col_size: 3,
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
        }, {

            name: "Last_Name",
            label: "Last Name",
            type: "text",
            label_size: 12,
            col_size: 4,
            disable: false,
        }, {

            name: "Phone",
            label: "Phone",
            type: "text",
            label_size: 12,
            col_size: 4,
            disable: false,
        }, {

            name: "Email",
            label: "Email",
            type: "text",
            label_size: 12,
            col_size: 4,
            disable: false,
        }, {

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
            type: "text1",
            filteredCompanies: filteredCompanies && filteredCompanies,
            label_size: 12,
            col_size: 3,
            disable: false,
        },

        {

            name: "company_name",
            label: "Company Name",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "entity_type",
            label: "Entity Type",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "comapany_status",
            label: "Company Status",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "comapany_number",
            label: "Company Number",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "Registered_Office_Addres",
            label: "Registered Office Address",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "Incorporation_Date",
            label: "Incorporation Date",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },

        {

            name: "Incorporation_in",
            label: "Incorporation in",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "VAT_Registered",
            label: "VAT Registered",
            type: "select",
            options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }],
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "VAT_Number",
            label: "VAT Number",
            type: "number",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "Website",
            label: "Website",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "Trading_Name",
            label: "Trading Name",
            type: "text",
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "Trading_Address",
            label: "Trading Address",
            type: "text",
            label_size: 12,
            col_size: 3,
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
            type: "select",
            options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }],
            label_size: 12,
            col_size: 3,
            disable: false,
        },
        {

            name: "VAT_Number",
            label: "VAT Number",
            type: "number",
            label_size: 12,
            col_size: 3,
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
        const data = { search: formik.values.search_company_name }
        await dispatch(GetAllCompany(data))
            .unwrap()
            .then((res) => {
                if (res.status) {
                    setGetAllSearchCompany(res.data)
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
    }, [formik.values.search_company_name])


    const fetchStaffData = async () => {
        try {
            const response = await dispatch(Staff({ req: { action: "getmanager" }, authToken: token })).unwrap();
            if (response.status) {
                setAccountMangerId(response.data[0].id)
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
    }, []);

    const handleChangeValue = (e) => {
        setAccountMangerId(e.target.value)
    };


    useEffect(() => {
        if (CustomerType == 1 || CustomerType == 3) {
            formik.resetForm()
        }
        if (CustomerType == 2 || CustomerType == 3) {
            formik1.resetForm()
        }
        if (CustomerType == 1 || CustomerType == 2) {
            formik2.resetForm()
        }
    }, [CustomerType])


    const ChangeCustomerType = (value) => {
        if (value == 3) {

            setContacts([
                { firstName: '', lastName: '', role: '', phoneNumber: '', email: '' },
                { firstName: '', lastName: '', role: '', phoneNumber: '', email: '' }

            ])
        }
    }

    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                console.log(values)
                setAddress(values);
                next();
            }}
        >
            {({ handleSubmit }) => (
                <div className="details__wrapper">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card card_shadow">
                                <div className="card-header align-items-center d-flex">
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
                                                className="form-select mb-3"
                                                onChange={(e) => { setCustomerType(e.target.value); ChangeCustomerType(e.target.value); }}

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
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        Outbooks Account Manager <span style={{ color: "red" }}>*</span>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Field as="select" name="accountManager" className="form-select mb-3" onChange={(e) => handleChangeValue(e)}>
                                                {staffDataAll.data.map((data) => (
                                                    <option key={data.id} value={data.id}>
                                                        {data.first_name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <section>
                        <div className="row" id="form1">
                            <div className="col-lg-12">

                                <div className="card card_shadow">
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Company Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">

                                            {
                                                CustomerType == 1 ?
                                                    <AddFrom fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik1.values))} formik={formik1} btn_name="Next" />
                                                    :
                                                    CustomerType == 2 ?
                                                        <AddFrom fieldtype={fields1.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Next"
                                                            additional_field={
                                                                <section>
                                                                    <div className="row " id="form2">
                                                                        <div className="row">
                                                                            <div className="col-lg-12">
                                                                                <div className="card card_shadow">
                                                                                    <div className="card-header align-items-center d-flex">
                                                                                        <h4 className="card-title mb-0 flex-grow-1">Contact Details</h4>
                                                                                    </div>
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            {contacts.map((contact, index) => (
                                                                                                <div className="col-xl-12 col-lg-12 mt-3" key={index}>
                                                                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                        <div className="row">
                                                                                                            {index == 0 ? "" :
                                                                                                                <div className="col-lg-12">
                                                                                                                    <div className="form-check mb-3 d-flex justify-content-end">
                                                                                                                        <div>
                                                                                                                            <button
                                                                                                                                className="btn btn-danger"
                                                                                                                                onClick={() => handleDeleteContact(index)}
                                                                                                                                disabled={contacts.length === 1}
                                                                                                                            >
                                                                                                                                Delete
                                                                                                                            </button>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>}
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`firstName-${index}`} className="form-label">
                                                                                                                        First Name<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="First Name"
                                                                                                                        id={`firstName-${index}`}
                                                                                                                        value={contact.firstName}
                                                                                                                        onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.firstName == "" && <div style={{ color: 'red' }}>First Name is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`lastName-${index}`} className="form-label">
                                                                                                                        Last Name<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Last Name"
                                                                                                                        id={`lastName-${index}`}
                                                                                                                        value={contact.lastName}
                                                                                                                        onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.lastName == "" && <div style={{ color: 'red' }}>Last Name is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`role-${index}`} className="form-label">
                                                                                                                        Role<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`role-${index}`}
                                                                                                                        value={contact.role}
                                                                                                                        onChange={(e) => handleChange(index, 'role', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll && personRoleDataAll.data.map((item, index) => {
                                                                                                                            return <option value={item.id}>{item.name}</option>
                                                                                                                        })}


                                                                                                                    </select>
                                                                                                                    {contact.role == "" && <div style={{ color: 'red' }}>Role is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`phone-${index}`} className="form-label">
                                                                                                                        Phone
                                                                                                                    </label>
                                                                                                                    <div className="row">

                                                                                                                        <div className="col-md-12">
                                                                                                                            <input
                                                                                                                                type="number"
                                                                                                                                className="form-control"
                                                                                                                                placeholder="Phone Number"
                                                                                                                                id={`phoneNumber-${index}`}
                                                                                                                                value={contact.phoneNumber}
                                                                                                                                onChange={(e) => handleChange(index, 'phoneNumber', e.target.value)}
                                                                                                                            />
                                                                                                                            {contact.phoneNumber == "" && <div style={{ color: 'red' }}>Phone Number is required</div>}

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`email-${index}`} className="form-label">
                                                                                                                        Email<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Email"
                                                                                                                        id={`email-${index}`}
                                                                                                                        value={contact.email}
                                                                                                                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.email == "" && <div style={{ color: 'red' }}>Email is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}

                                                                                            <div className="card-header d-flex align-items-center">
                                                                                                <h5 className="card-title mb-0 flex-grow-1"></h5>
                                                                                                <div>
                                                                                                    <button className="btn btn-info text-white blue-btn" onClick={handleAddContact}>
                                                                                                        Add Contact
                                                                                                    </button>

                                                                                                </div>
                                                                                            </div>
                                                                                            {/* <div className="d-flex justify-content-end">
                                                                                        <button className="btn btn-success" onClick={handleSave}>Save</button>
                                                                                    </div> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>{" "}
                                                                            {/* end col */}
                                                                        </div>
                                                                    </div>

                                                                </section>
                                                            } />
                                                        :
                                                        CustomerType == 3 ? <AddFrom fieldtype={fields3.filter(field => !field.showWhen || field.showWhen(formik2.values))} formik={formik2} btn_name="Next"
                                                            additional_field={
                                                                <section>
                                                                    <div className="row " id="form2">
                                                                        <div className="row">
                                                                            <div className="col-lg-12">
                                                                                <div className="card card_shadow">
                                                                                    <div className="card-header align-items-center d-flex">
                                                                                        <h4 className="card-title mb-0 flex-grow-1">Contact Details</h4>
                                                                                    </div>
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            {contacts.map((contact, index) => (
                                                                                                <div className="col-xl-12 col-lg-12 mt-3" key={index}>
                                                                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                        <div className="row" >
                                                                                                            <div class="col-lg-12">
                                                                                                                <div class="form-check form-switch form-switch-md mb-3 d-flex justify-content-between"
                                                                                                                    dir="ltr">
                                                                                                                    <div>

                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            className="form-check-input"
                                                                                                                            id="customSwitchsizemd"
                                                                                                                            checked={contact.authorised_signatory_status}
                                                                                                                            onChange={(e) => handleChange(index, 'authorised_signatory_status', e.target.checked)}
                                                                                                                            defaultChecked={index == 0 || index == 1}
                                                                                                                            disabled={contacts.length == 2 ? index == 0 || index == 1 : false}
                                                                                                                           


                                                                                                                        />
                                                                                                                        <label
                                                                                                                            class="form-check-label"
                                                                                                                            for="customSwitchsizemd">Authorised
                                                                                                                            Signatory</label>
                                                                                                                    </div>
                                                                                                                    {index == 0 || index == 1 ? "" :
                                                                                                                        <div>

                                                                                                                            <button
                                                                                                                                className="btn btn-danger"
                                                                                                                                onClick={() => handleDeleteContact(index)}
                                                                                                                                disabled={contacts.length === 1}
                                                                                                                            >
                                                                                                                                Delete
                                                                                                                            </button>

                                                                                                                        </div>}
                                                                                                                </div>

                                                                                                            </div>

                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`firstName-${index}`} className="form-label">
                                                                                                                        First Name<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="First Name"
                                                                                                                        id={`firstName-${index}`}
                                                                                                                        value={contact.firstName}
                                                                                                                        onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.firstName == "" && <div style={{ color: 'red' }}>First Name is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`lastName-${index}`} className="form-label">
                                                                                                                        Last Name<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Last Name"
                                                                                                                        id={`lastName-${index}`}
                                                                                                                        value={contact.lastName}
                                                                                                                        onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.lastName == "" && <div style={{ color: 'red' }}>Last Name is required</div>}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`role-${index}`} className="form-label">
                                                                                                                        Role<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <select
                                                                                                                        className="form-select"
                                                                                                                        id={`role-${index}`}
                                                                                                                        value={contact.role}
                                                                                                                        onChange={(e) => handleChange(index, 'role', e.target.value)}
                                                                                                                    >
                                                                                                                        <option value="">Select Role</option>
                                                                                                                        {personRoleDataAll && personRoleDataAll.data.map((item, index) => {
                                                                                                                            return <option value={item.id}>{item.name}</option>
                                                                                                                        })}
                                                                                                                    </select>
                                                                                                                    {contact.role == "" && <div style={{ color: 'red' }}>Role is required</div>}

                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`phone-${index}`} className="form-label">
                                                                                                                        Phone
                                                                                                                    </label>


                                                                                                                    <div className="col-md-12">
                                                                                                                        <input
                                                                                                                            type="number"
                                                                                                                            className="form-control"
                                                                                                                            placeholder="Phone Number"
                                                                                                                            id={`phoneNumber-${index}`}
                                                                                                                            value={contact.phoneNumber}
                                                                                                                            onChange={(e) => handleChange(index, 'phoneNumber', e.target.value)}
                                                                                                                        />
                                                                                                                        {contact.phoneNumber == "" && <div style={{ color: 'red' }}>Phone Number is required</div>}
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                            <div className="col-lg-3">
                                                                                                                <div className="mb-3">
                                                                                                                    <label htmlFor={`email-${index}`} className="form-label">
                                                                                                                        Email<span style={{ color: "red" }}>*</span>
                                                                                                                    </label>
                                                                                                                    <input
                                                                                                                        type="text"
                                                                                                                        className="form-control"
                                                                                                                        placeholder="Email"
                                                                                                                        id={`email-${index}`}
                                                                                                                        value={contact.email}
                                                                                                                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                                                                                    />
                                                                                                                    {contact.email == "" && <div style={{ color: 'red' }}>Email is required</div>}
                                                                                                                </div>
                                                                                                            </div>

                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}


                                                                                            <div className="card-header d-flex align-items-center">
                                                                                                <h5 className="card-title mb-0 flex-grow-1"></h5>
                                                                                                <div>
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

                                                                </section>
                                                            } />
                                                            :

                                                            <>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Search Company
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Outbooks Quality & Certainty"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Company Name
                                                                            <span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="Outbooks Quality & Certainty LTD"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Entity Type<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="LTD"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Company Status<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="Active"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Company Number<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="06465146"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Registered Office Address
                                                                            <span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Incorporation Date
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control input_bg"
                                                                            placeholder="07-01-2023"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Incorporation in<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <select
                                                                            className="form-select mb-3"
                                                                            aria-label="Default select example"
                                                                            style={{ color: "#8a8c8e !important" }}
                                                                        >
                                                                            <option selected="">England and Wales(EW)</option>
                                                                            <option value={1}>England and Wales(EW)</option>
                                                                            <option value={2}>England and Wales(EW)</option>
                                                                            <option value={3}>England and Wales(EW)</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            VAT Registered
                                                                        </label>
                                                                        <select
                                                                            id="VAT_dropdown1"
                                                                            className="form-select mb-3"
                                                                            aria-label="Default select example"
                                                                            style={{ color: "#8a8c8e !important" }}
                                                                        >
                                                                            <option selected="">Yes</option>
                                                                            <option value={1}>No</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="col-lg-3"
                                                                    style={{ display: "block" }}
                                                                    id="VATinput1"
                                                                >
                                                                    <div className="mb-3">
                                                                        <div className="mb-3">
                                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                                VAT Number
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control "
                                                                                placeholder="VAT
                                                                                 Number"
                                                                                id="firstNameinput"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Website
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control "
                                                                            placeholder="URL"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Trading Name<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Trading Name"
                                                                            id="firstNameinput"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="firstNameinput" className="form-label">
                                                                            Trading Address<span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <input
                                                                            type=""
                                                                            className="form-control"
                                                                            data-provider="flatpickr"
                                                                            id="EndleaveDate"
                                                                            placeholder="Trading Address"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


                    {/* <div className="form__item button__items d-flex justify-content-between">
                        <Button className="white-btn" type="default" onClick={prev}>
                            Back
                        </Button>
                        <Button className="btn btn-info text-white blue-btn" type="submit" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div> */}
                </div>
            )}
        </Formik>
    );
};

export default Information;