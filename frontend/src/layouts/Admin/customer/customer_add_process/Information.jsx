import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { Formik, Field, Form, useFormik } from "formik";
import AddFrom from "../../../../Components/ExtraComponents/Forms/Customer.form";
import { Email_regex } from "../../../../Utils/Common_regex";
import {
  GetAllCompany,
  AddCustomer,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import MultiStepFormContext from "./MultiStepFormContext";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import { PersonRole } from "../../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import { GET_CUSTOMER_DATA } from '../../../../ReduxStore/Slice/Customer/CustomerSlice'

const Information = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const customer_id = localStorage.getItem("coustomerId");
  console.log("customer_id", customer_id);
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const [getAccountMangerId, setAccountMangerId] = useState("");
  const [CustomerType, setCustomerType] = useState("1");
  const [getNextStatus, setNextStatus] = useState("0");
  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
});

console.log("customerDetails", !customerDetails.loading && customerDetails.data.customer);

  const [personRoleDataAll, setPersonRoleDataAll] = useState({
    loading: true,
    data: [],
  });

  const [getAllSearchCompany, setGetAllSearchCompany] = useState([]);

  const [contacts, setContacts] = useState([
    {
      authorised_signatory_status: false,
      firstName: "",
      lastName: "",
      role: "",
      phoneNumber: "",
      email: "",
    },
  ]);

  const [errors, setErrors] = useState([
    { firstName: "", lastName: "", role: "", phoneNumber: "", email: "" },
  ]);

  const GetCustomerData = async () => {
    const req = { customer_id: customer_id, pageStatus: "1" }
    const data = { req: req, authToken: token }
    await dispatch(GET_CUSTOMER_DATA(data))
        .unwrap()
        .then(async (response) => {
            if (response.status) {
                setCustomerDetails({
                    loading: false,
                    data: response.data
                });
            }
            else {
                setCustomerDetails({
                    loading: false,
                    data: []
                });
            }
        })
        .catch((error) => {
            console.log("Error", error);
        });
}

useEffect(() => {
    GetCustomerData()
}, []);

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
      },
    ]);
    setErrors([
      ...errors,
      { firstName: "", lastName: "", role: "", phoneNumber: "", email: "" },
    ]);
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
        console.log("Error", error);
      });
  };

  const handleDeleteContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setContacts(newContacts);
    setErrors(newErrors);
  };

  const AddCustomerFun = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(AddCustomer(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          next(response.data , 2);
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
        console.log("Error", error);
      });
  };
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
      Trading_Address: "",
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
        errors.Registered_Office_Addres =
          "Please Enter Registered Office Address";
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
      let formIsValid = true;
      const newErrors = contacts.map((contact, index) => {
        const error = {
          firstName: contact.firstName ? "" : "First Name is required",
          lastName: contact.lastName ? "" : "Last Name is required",
          role: contact.role ? "" : "Role is required",
          phoneNumber: contact.phoneNumber ? "" : "Phone Number is required",
          email:
            contact.email === ""
              ? "Email Id is required"
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
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
        let req = {
          customer_id: Number(customer_id),
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
          staff_id: staffDetails.id,
        };
        await AddCustomerFun(req);
      }
    },
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
      Residential_Address: "",
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
      else if (!Email_regex(values.Email)) {
        errors.Email = "Please Enter Valid Email";
      }

      if (!values.Residential_Address) {
        errors.Residential_Address = "Please Enter Residential Address";
      }

      return errors;
    },

    onSubmit: async (values) => {
      const req = {
        customer_id: Number(customer_id),
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
        staff_id: staffDetails.id,
      };
      await AddCustomerFun(req);
    },
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
      let formIsValid = true;
      const newErrors = contacts.map((contact, index) => {
        const error = {
          firstName: contact.firstName ? "" : "First Name is required",
          lastName: contact.lastName ? "" : "Last Name is required",
          role: contact.role ? "" : "Role is required",
          phoneNumber: contact.phoneNumber ? "" : "Phone Number is required",
          email:
            contact.email === ""
              ? "Email Id is required"
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
                ? ""
                : "Valid Email is required",
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
          customer_id: Number(customer_id),
          Trading_Name: values.Trading_Name,
          Trading_Address: values.Trading_Address,
          VAT_Registered: values.VAT_Registered,
          VAT_Number: values.VAT_Number,
          Website: values.Website,
          PageStatus: "1",
          contactDetails: contacts,
          CustomerType: CustomerType,
          account_manager_id: getAccountMangerId,
          staff_id: staffDetails.id,
        };

        await AddCustomerFun(req);
      }
    },
  });

  let filteredCompanies = [];
  if (getAllSearchCompany.items !== undefined) {
    filteredCompanies =
      getAllSearchCompany &&
      getAllSearchCompany.items.filter((company) =>
        company.title
          .toLowerCase()
          .includes(formik.values.search_company_name.toLowerCase())
      );
  }

  let getCompanyDetails = [];
  if (getAllSearchCompany.items !== undefined) {
    getCompanyDetails =
      getAllSearchCompany &&
      getAllSearchCompany.items.filter(
        (company) => company.title == formik.values.search_company_name
      );
  }

  useEffect(() => {
    formik.setFieldValue("company_name", getCompanyDetails[0]?.title);
    formik.setFieldValue("entity_type", getCompanyDetails[0]?.company_type);
    formik.setFieldValue(
      "company_status",
      getCompanyDetails[0]?.company_status
    );
    formik.setFieldValue(
      "company_number",
      getCompanyDetails[0]?.company_number
    );
    formik.setFieldValue(
      "Registered_Office_Addres",
      getCompanyDetails[0]?.address_snippet
    );
    formik.setFieldValue(
      "Incorporation_Date",
      getCompanyDetails[0]?.date_of_creation
    );
    formik.setFieldValue("Incorporation_in", getCompanyDetails[0]?.description);
  }, [formik.values.search_company_name]);

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
      // label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
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
    },
    {
      name: "Last_Name",
      label: "Last Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Phone",
      label: "Phone",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "Email",
      label: "Email",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
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
      type: "text9",
      filteredCompanies: filteredCompanies && filteredCompanies,
      label_size: 12,
      col_size: 4,
      disable: false,
    },

    {
      name: "company_name",
      label: "Company Name",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "entity_type",
      label: "Entity Type",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "company_status",
      label: "Company Status",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "company_number",
      label: "Company Number",
      type: "number",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "Registered_Office_Addres",
      label: "Registered Office Address",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "Incorporation_Date",
      label: "Incorporation Date",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },

    {
      name: "Incorporation_in",
      label: "Incorporation in",
      type: "text",
      label_size: 12,
      col_size: 4,
      disable: true,
    },
    {
      name: "VAT_Registered",
      // label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
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
      name: "Website",
      label: "Trading Details",
      type: "TradingDetails",
      label_size: 12,
      col_size: 12,
      disable: false,
    },

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
      // label: "VAT Registered",
      type: "select3",
      options: [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" },
      ],
      label_size: 12,
      col_size: 4,
      disable: false,
    },
    {
      name: "VAT_Number",
      label: "VAT Number",
      type: "number",
      label_size: 12,
      col_size: 4,
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


  useEffect(() => {
    setCustomerType(!customerDetails.loading && customerDetails.data.customer.customer_type)
    setAccountMangerId(!customerDetails.loading && customerDetails.data.customer.account_manager_id)

    if (!customerDetails.loading && customerDetails.data.customer.customer_type == '2') {
      formik1.setFieldValue("Trading_Name", !customerDetails.loading && customerDetails.data.customer.trading_name)
      formik1.setFieldValue("Trading_Address", !customerDetails.loading && customerDetails.data.customer.trading_address)
      formik1.setFieldValue("VAT_Registered", !customerDetails.loading && customerDetails.data.customer.vat_registered)
      formik1.setFieldValue("VAT_Number", !customerDetails.loading && customerDetails.data.customer.vat_number)
      formik1.setFieldValue("Website", !customerDetails.loading && customerDetails.data.customer.website)
      formik1.setFieldValue("First_Name", !customerDetails.loading && customerDetails.data.contact_details[0].first_name)
      formik1.setFieldValue("Last_Name", !customerDetails.loading && customerDetails.data.contact_details[0].last_name)
      formik1.setFieldValue("Phone", !customerDetails.loading && customerDetails.data.contact_details[0].phone)
      formik1.setFieldValue("Email", !customerDetails.loading && customerDetails.data.contact_details[0].email)
      formik1.setFieldValue("Residential_Address", !customerDetails.loading && customerDetails.data.contact_details[0].residential_address)
    }
    if (!customerDetails.loading && customerDetails.data.customer.customer_type == '1') {
      formik2.setFieldValue("Trading_Name", !customerDetails.loading && customerDetails.data.customer.trading_name)
      formik2.setFieldValue("Trading_Address", !customerDetails.loading && customerDetails.data.customer.trading_address)
      formik2.setFieldValue("VAT_Registered", !customerDetails.loading && customerDetails.data.customer.vat_registered)
      formik2.setFieldValue("VAT_Number", !customerDetails.loading && customerDetails.data.customer.vat_number)
      formik2.setFieldValue("Website", !customerDetails.loading && customerDetails.data.customer.website)
    }
    if (!customerDetails.loading && customerDetails.data.customer.customer_type == '3') {
      formik.setFieldValue("Trading_Name", !customerDetails.loading && customerDetails.data.customer.trading_name)
      formik.setFieldValue("Trading_Address", !customerDetails.loading && customerDetails.data.customer.trading_address)
      formik.setFieldValue("VAT_Registered", !customerDetails.loading && customerDetails.data.customer.vat_registered)
      formik.setFieldValue("VAT_Number", !customerDetails.loading && customerDetails.data.customer.vat_number)
      formik.setFieldValue("Website", !customerDetails.loading && customerDetails.data.customer.website)
      setContacts(!customerDetails.loading && customerDetails.data.contact_details)
    }
        
}, [customerDetails])





  const Get_Company = async () => {
    const data = { search: formik.values.search_company_name };
    await dispatch(GetAllCompany(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setGetAllSearchCompany(res.data);
        } else {
          setGetAllSearchCompany([]);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  useEffect(() => {
    Get_Company();
  }, [formik.values.search_company_name]);

  const fetchStaffData = async () => {
    try {
      const response = await dispatch(
        Staff({ req: { action: "getmanager" }, authToken: token })
      ).unwrap();
      if (response.status) {
        setAccountMangerId(response.data[0].id);
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
    setAccountMangerId(e.target.value);
  };

  useEffect(() => {
    if (CustomerType == 1 || CustomerType == 3) {
      formik.resetForm();
    }
    if (CustomerType == 2 || CustomerType == 3) {
      formik1.resetForm();
    }
    if (CustomerType == 1 || CustomerType == 2) {
      formik2.resetForm();
    }
  }, [CustomerType]);

  const ChangeCustomerType = (value) => {
    if (value == 3) {
      setContacts([
        {
          authorised_signatory_status: true,
          firstName: "",
          lastName: "",
          role: "",
          phoneNumber: "",
          email: "",
        },
        {
          authorised_signatory_status: true,
          firstName: "",
          lastName: "",
          role: "",
          phoneNumber: "",
          email: "",
        },
      ]);
      setErrors([
        { firstName: false, lastName: false, role: false, email: false },
        { firstName: false, lastName: false, role: false, email: false },
      ]);
    }
  };

  const handleChange = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
    validateField(index, field, value);
  };

  const validateField = (index, field, value) => {
    const newErrors = [...errors];
    switch (field) {
      case "firstName":
        newErrors[index].firstName = value ? "" : "First Name is required";
        break;
      case "lastName":
        newErrors[index].lastName = value ? "" : "Last Name is required";
        break;
      case "role":
        newErrors[index].role = value ? "" : "Role is required";
        break;
      case "email":
        if (!value) {
          newErrors[index].email = "Email Id is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[index].email = "Valid Email is required";
        } else {
          newErrors[index].email = "";
        }
        break;

      case "phoneNumber":
        newErrors[index].phoneNumber = value ? "" : "Phone Number is required";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };




  return (
    <Formik
      initialValues={address}
      onSubmit={(values) => {
        setAddress(values);
        next();
      }}
    >
      {({ handleSubmit }) => (
        <div className="details__wrapper">
          <div className="bg-blue-light pt-3 px-3 rounded">
            <div className="row">
              <div className="col-lg-6">
                <div className="card card_shadow">
                  <div className="card-header step-header-blue align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Customer Type
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <Field
                          as="select"
                          name="customerType"
                          className="form-select mb-3"
                          onChange={(e) => {
                            setCustomerType(e.target.value);
                            ChangeCustomerType(e.target.value);
                          }}
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
                  <div className="card-header step-header-blue align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">
                      Outbooks Account Manager
                       
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-lg-12">
                        <Field
                          as="select"
                          name="accountManager"
                          className="form-select mb-3"
                          onChange={(e) => handleChangeValue(e)}
                        >
                          <option value="" disabled selected>
                            Please select
                          </option>
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
          </div>
          <section className="px-3 mt-3">
            <div className="row" id="form1">
              {CustomerType == 1 ? (
                <>
                  <div className="card card_shadow pt-3">
                    <div className="card-header  step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Sole Trader
                      </h4>
                    </div>
                    <div className="card-body">
                      <AddFrom
                        fieldtype={fields.filter(
                          (field) =>
                            !field.showWhen || field.showWhen(formik1.values)
                        )}
                        formik={formik1}
                        btn_name="Next"

                      />
                    </div>
                  </div>
                </>
              ) : CustomerType == 2 ? (
                <>
                  <div className="card card_shadow pt-3 ">
                    <div className="card-header mb-3 step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Company Information
                      </h4>
                    </div>

                    <AddFrom
                      fieldtype={fields1.filter(
                        (field) =>
                          !field.showWhen || field.showWhen(formik.values)
                      )}
                      formik={formik}
                      btn_name="Next"
                      additional_field={
                        <section>
                          <div className="row" id="form2">
                            <div className="row">
                              <div className="col-lg-12">

                                <div className="card-header  step-card-header align-items-center d-flex">
                                  <h4 className="card-title mb-0 flex-grow-1">
                                    Contact Details
                                  </h4>
                                </div>

                                <div className="row mt-3">
                                  {contacts.map((contact, index) => (
                                    <div
                                      className="col-xl-12 col-lg-12 mt-3"
                                      key={index}
                                    >
                                      <div className=" pricing-box  m-2 mt-0">
                                        <div className="row">
                                          {index !== 0 && (
                                            <div className="col-lg-12">
                                              <div className="form-check mb-3 d-flex justify-content-end">
                                                <button
                                                  className="btn btn-danger"
                                                  onClick={() =>
                                                    handleDeleteContact(
                                                      index
                                                    )
                                                  }
                                                  disabled={
                                                    contacts.length === 1
                                                  }
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                          <div className="col-lg-4 ps-1">
                                            <div className="mb-3">
                                              {/* <label
                                                    htmlFor={`firstName-${index}`}
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
                                                  </label> */}
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
                                              {errors[index].firstName && (
                                                <div
                                                  style={{
                                                    color: "red",
                                                  }}
                                                >
                                                  {errors[index].firstName}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="mb-3">
                                              {/* <label
                                                    htmlFor={`lastName-${index}`}
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
                                                  </label> */}
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
                                              {errors[index].lastName && (
                                                <div
                                                  style={{
                                                    color: "red",
                                                  }}
                                                >
                                                  {errors[index].lastName}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="mb-3">
                                              {/* <label
                                                    htmlFor={`role-${index}`}
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
                                                  </label> */}
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
                                                <div
                                                  style={{
                                                    color: "red",
                                                  }}
                                                >
                                                  {errors[index].role}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="col-lg-4 ps-1">
                                            <div className="mb-3">
                                              {/* <label
                                                    htmlFor={`phone-${index}`}
                                                    className="form-label"
                                                  >
                                                    Phone
                                                  </label> */}
                                              <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Phone Number"
                                                id={`phoneNumber-${index}`}
                                                value={contact.phoneNumber}
                                                onChange={(e) =>
                                                  handleChange(
                                                    index,
                                                    "phoneNumber",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              {errors[index]
                                                .phoneNumber && (
                                                  <div
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    {
                                                      errors[index]
                                                        .phoneNumber
                                                    }
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                          <div className="col-lg-4 ">
                                            <div className="mb-3">
                                              {/* <label
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
                                                  </label> */}
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
                                                <div
                                                  style={{
                                                    color: "red",
                                                  }}
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
                                  <div className="card-header d-flex align-items-center">
                                    <h5 className="card-title mb-0 flex-grow-1"></h5>
                                    <button
                                      className="btn btn-info text-white blue-btn"
                                      onClick={handleAddContact}
                                    >
                                      Add Contact
                                    </button>
                                  </div>
                                </div>


                              </div>
                            </div>
                          </div>
                        </section>
                      }
                    />
                  </div>
                </>
              ) : CustomerType == 3 ? (
                <>
                  <div className="card card-shadow pt-3 ">
                    <div className="card-header mb-3 step-card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">
                        Partnership Information
                      </h4>
                    </div>

                    <AddFrom
                      fieldtype={fields3.filter(
                        (field) =>
                          !field.showWhen || field.showWhen(formik2.values)
                      )}
                      formik={formik2}
                      btn_name="Next"
                      additional_field={
                        <section>
                          <div className="row" id="form2">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="">
                                  <div className="card-header step-card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                      Contact Details
                                    </h4>
                                  </div>
                                  <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                      <div className="row">
                                        {contacts.map((contact, index) => (
                                          <div
                                            className="col-xl-12 col-lg-12 mt-3"
                                            key={index}
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
                                                          handleChange(
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
                                                          contacts.length === 2
                                                            ? index === 0 ||
                                                            index === 1
                                                            : false
                                                        }
                                                      />
                                                      <label
                                                        className="form-check-label"
                                                        htmlFor={`customSwitchsizemd-${index}`}
                                                      >
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
                                                              handleDeleteContact(
                                                                index
                                                              )
                                                            }
                                                            disabled={
                                                              contacts.length ===
                                                              1
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
                                                    <label
                                                      htmlFor={`firstName-${index}`}
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
                                                    {errors[index]
                                                      .firstName && (
                                                        <div
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          {
                                                            errors[index]
                                                              .firstName
                                                          }
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
                                                    {errors[index].lastName && (
                                                      <div
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      >
                                                        {errors[index].lastName}
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
                                                          (item, idx) => (
                                                            <option
                                                              value={item.id}
                                                              key={idx}
                                                            >
                                                              {item.name}
                                                            </option>
                                                          )
                                                        )}
                                                    </select>
                                                    {errors[index].role && (
                                                      <div
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      >
                                                        {errors[index].role}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="col-lg-4">
                                                  <div className="mb-3">
                                                    <label
                                                      htmlFor={`phone-${index}`}
                                                      className="form-label"
                                                    >
                                                      Phone
                                                    </label>
                                                    <input
                                                      type="number"
                                                      className="form-control"
                                                      placeholder="Phone Number"
                                                      id={`phoneNumber-${index}`}
                                                      value={
                                                        contact.phoneNumber
                                                      }
                                                      onChange={(e) =>
                                                        handleChange(
                                                          index,
                                                          "phoneNumber",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {errors[index]
                                                      .phoneNumber && (
                                                        <div
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          {
                                                            errors[index]
                                                              .phoneNumber
                                                          }
                                                        </div>
                                                      )}
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
                                                        handleChange(
                                                          index,
                                                          "email",
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                    {errors[index].email && (
                                                      <div
                                                        style={{
                                                          color: "red",
                                                        }}
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

                                        <div className="card-header d-flex align-items-center">
                                          <h5 className="card-title mb-0 flex-grow-1"></h5>
                                          <button
                                            className="btn btn-info text-white blue-btn"
                                            type="button"
                                            onClick={handleAddContact}
                                          >
                                            Add Contact
                                          </button>
                                        </div>
                                        {/* <div className="d-flex justify-content-end">
                                                                                                    <button className="btn btn-success" type="submit">Submit</button>
                                                                                                </div> */}
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div> 
                            {/* end col */}
                          </div>
                        </section>
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-lg-4">
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
                  <div className="col-lg-4">
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
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="firstNameinput" className="form-label">
                        Entity Type
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control input_bg"
                        placeholder="LTD"
                        id="firstNameinput"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="firstNameinput" className="form-label">
                        Company Status
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control input_bg"
                        placeholder="Active"
                        id="firstNameinput"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="firstNameinput" className="form-label">
                        Company Number
                        <span style={{ color: "red" }}>*</span>
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
                  <div className="col-lg-4">
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
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="firstNameinput" className="form-label">
                        Incorporation in
                        <span style={{ color: "red" }}>*</span>
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
                  <div className="col-lg-4">
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
                    className="col-lg-4"
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
                  <div className="col-lg-4">
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
                        Trading Name
                        <span style={{ color: "red" }}>*</span>
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
                        Trading Address
                        <span style={{ color: "red" }}>*</span>
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
              )}
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
