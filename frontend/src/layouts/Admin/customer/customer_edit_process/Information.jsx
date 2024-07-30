import React, { useState, useEffect, useContext } from "react";
import { useDispatch } from 'react-redux';
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';

const Information = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const [customerData, setCustomerData] = useState({});

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

    useEffect(() => {
        fetchStaffData();
    }, []);

    const handleChangeValue = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;

        setCustomerData(prevData => ({
            ...prevData,
            [fieldName]: fieldValue
        }));
    };

    console.log("customerData=>", customerData)

    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next();
            }}
        >
            {({ handleSubmit }) => (
                <Form className="details__wrapper">


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
                                                onChange={(e) => handleChangeValue(e)}
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>




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
                                                <div className="col-xl-12 col-lg-12">
                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                       
                                                        <div className="row">
                                                            <div class="col-lg-12">
                                                                  <div class="form-check form-switch form-switch-md mb-3"
                                                                      dir="ltr">
                                                                      <input
                                                                          type="checkbox"
                                                                          class="form-check-input"
                                                                          id="customSwitchsizemd" />
                                                                      <label
                                                                          class="form-check-label"
                                                                          for="customSwitchsizemd">Authorised
                                                                          Signatory</label>
                                                                  </div>
                                                              </div>
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        First Name<span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="First Name"
                                                                        id="firstNameinput"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        Last Name<span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <input
                                                                        type=""
                                                                        className="form-control"
                                                                        data-provider="flatpickr"
                                                                        id="EndleaveDate"
                                                                        placeholder="Last Name"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        Role<span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <select
                                                                        className="form-select"
                                                                        data-choices=""
                                                                        data-choices-sorting="true"
                                                                        id="inlineFormSelectPref"
                                                                    >
                                                                        <option selected="">Select Role</option>
                                                                        <option value={1}>Role Name 1</option>
                                                                        <option value={2}>Role Name 2</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            {/* <div class="col-lg-3">
                                                                  <div class="mb-3">
                                                                      <label
                                                                          for="firstNameinput"
                                                                          class="form-label">Appointed
                                                                          On<span
                                                                              style="color: red;">*</span></label>
                                                                      <input type="date"
                                                                          class="form-control"
                                                                          placeholder="Permises"
                                                                          id="firstNameinput">
                                                                  </div>
                                                              </div> */}
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        Phone
                                                                    </label>
                                                                    <div className="row">
                                                                        <div className="col-md-4">
                                                                            <select
                                                                                className="form-select"
                                                                                data-choices=""
                                                                                style={{ marginBottom: 20 }}
                                                                                data-choices-sorting="true"
                                                                                id="inlineFormSelectPref"
                                                                            >
                                                                                <option selected="">+91</option>
                                                                                <option value={1}>+44</option>
                                                                                <option value={2}>+61</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-md-8">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Phone Number"
                                                                                id="firstNameinput"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        Email<span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Email"
                                                                        id="firstNameinput"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <div class="col-lg-6">
                                                                  <div class="mb-3">
                                                                      <label
                                                                          for="firstNameinput"
                                                                          class="form-label">Correspondence
                                                                          Address<span
                                                                              style="color: red;">*</span></label>
                                                                      <input type="text"
                                                                          class="form-control"
                                                                          placeholder="Correspondence Address"
                                                                          id="firstNameinput">
                                                                  </div>
                                                              </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-header d-flex align-items-center">
                                                    <h5 className="card-title mb-0 flex-grow-1"></h5>
                                                    <div>
                                                        <button id="addRow" className="btn btn-primary">
                                                            <i className="ri-add-fill align-bottom me-1" />
                                                            Add Contact{" "}
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
    );
};

export default Information;