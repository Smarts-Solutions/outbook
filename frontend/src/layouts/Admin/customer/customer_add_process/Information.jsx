import React, { useContext } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";

const Information = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);

    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next(); // Move to the next step after form submission
            }}
        >
            {({ handleSubmit }) => (
                <div className="details__wrapper">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card card_shadow">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        Customer Type
                                        <span style={{ color: "red" }}>*</span>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <select
                                                id="search-select"
                                                className="form-select mb-3"
                                                aria-label="Default select example"
                                                style={{ color: "#8a8c8e !important" }}
                                            >
                                                <option value="" selected="">
                                                    Sole Trader
                                                </option>
                                                <option value="">Company</option>
                                                <option value="">Partnership</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="card card_shadow">
                                <div className="card-header align-items-center d-flex">
                                    <h4 className="card-title mb-0 flex-grow-1">
                                        Outbooks Account Manager
                                        <span style={{ color: "red" }}>*</span>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <select
                                                id="search-select"
                                                className="form-select mb-3"
                                                aria-label="Default select example"
                                                style={{ color: "#8a8c8e !important" }}
                                            >
                                                <option value="" selected="">
                                                    Ajeet Agarwal
                                                </option>
                                                <option value="">Sunil Agarwal</option>
                                                <option value="">Hemant Agarwal</option>
                                            </select>
                                        </div>
                                    </div>
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                    <section>
                        <div className="row " style={{ display: "block" }} id="form1">
                            <div className="col-lg-12">
                                <div className="card card_shadow ">
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Company Information</h4>
                                    </div>
                                    {/* end card header */}
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-3">
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
                                            <div className="col-lg-3">
                                                <div className="mb-3">
                                                    <label htmlFor="firstNameinput" className="form-label">
                                                        Trading Address<span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Trading Address"
                                                        id="firstNameinput"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="mb-3">
                                                    <label htmlFor="firstNameinput" className="form-label">
                                                        VAT Registered
                                                    </label>
                                                    <select
                                                        id="VAT_dropdown2"
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
                                                id="VATinput2"
                                            >
                                                <div className="mb-3">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstNameinput" className="form-label">
                                                            VAT Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control "
                                                            placeholder="VAT  Number"
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
                                            <h4
                                                className="card-title mb-0 flex-grow-1"
                                                style={{ marginBottom: "15px !important" }}
                                            >
                                                Sole Trader Detalis
                                            </h4>
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
                                                                placeholder=" Phone Number"
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
                                            <div className="col-lg-6">
                                                <div className="mb-3">
                                                    <label htmlFor="firstNameinput" className="form-label">
                                                        Residential Address<span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Residential Address"
                                                        id="firstNameinput"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row " style={{ display: "none" }} id="form2">
                            <div className="col-lg-12">
                                <div className="card card_shadow ">
                                    <div className="card-header align-items-center d-flex">
                                        <h4 className="card-title mb-0 flex-grow-1">Company Information</h4>
                                    </div>
                                    {/* end card header */}
                                    <div className="card-body">
                                        <div className="row">
                                            <h4
                                                className="card-title mb-0 flex-grow-1"
                                                style={{ marginBottom: "15px !important" }}
                                            >
                                                Contact Information
                                            </h4>
                                            {/* <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">First
                                                                                  Name<span
                                                                                      style="color: red;">*</span>
                                                                              </label>
                                                                              <input type="text"
                                                                                  class="form-control"
                                                                                  placeholder="First Name"
                                                                                  id="firstNameinput">
                                                                          </div>
                                                                      </div>
                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Last
                                                                                  Name<span
                                                                                      style="color: red;">*</span></label>
                                                                              <input type="" class="form-control"
                                                                                  data-provider="flatpickr"
                                                                                  id="EndleaveDate"
                                                                                  placeholder="Last Name">
                                                                          </div>
                                                                      </div>

                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">

                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Phone</label>
                                                                              <div class="row">
                                                                                  <div class="col-md-4">
                                                                                      <select class="form-select"
                                                                                          data-choices=""
                                                                                          style="width: 110% !important;"
                                                                                          data-choices-sorting="true"
                                                                                          id="inlineFormSelectPref">
                                                                                          <option selected="">
                                                                                              +91</option>
                                                                                          <option value="1">
                                                                                              +44</option>
                                                                                          <option value="2">
                                                                                              +34</option>
                                                                                          <option value="3">
                                                                                              +1
                                                                                          </option>
                                                                                      </select>
                                                                                  </div>
                                                                                  <div class="col-md-8">
                                                                                      <input type="text"
                                                                                          class="form-control"
                                                                                          placeholder=""
                                                                                          id="firstNameinput">
                                                                                  </div>
                                                                              </div>


                                                                          </div>
                                                                      </div>
                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Email<span
                                                                                      style="color: red;">*</span></label>
                                                                              <input type="text"
                                                                                  class="form-control"
                                                                                  placeholder="Email"
                                                                                  id="firstNameinput">
                                                                          </div>
                                                                      </div> */}
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
                                                        <div className="col-lg-6 col-md-6">
                                                            <p className="office-name">Contact Person </p>
                                                        </div>
                                                        <p className="delete">
                                                            <button
                                                                className="btn btn-sm btn-danger remove-item-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteRecordModal"
                                                            >
                                                                <i className="ri-delete-bin-5-fill" />
                                                            </button>
                                                        </p>
                                                        <div className="row">
                                                            {/* <div class="col-lg-12">
                                                                                          <div class="form-check form-switch form-switch-md mb-3"
                                                                                              dir="ltr">
                                                                                              <input
                                                                                                  type="checkbox"
                                                                                                  class="form-check-input"
                                                                                                  id="customSwitchsizemd">
                                                                                              <label
                                                                                                  class="form-check-label"
                                                                                                  for="customSwitchsizemd">Authorised
                                                                                                  Signatory</label>
                                                                                          </div>
                                                                                      </div> */}
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
                        <div className="row " style={{ display: "none" }} id="form3">
                            {/* <div class="col-lg-12">
                                                          <div class="card card_shadow ">
                                                              <div class="card-header align-items-center d-flex">
                                                                  <h4 class="card-title mb-0 flex-grow-1">Company
                                                                      Information</h4>
                                                              </div>
                                                              
                                                              <div class="card-body">

                                                                  <div class="row">
                                                                      <h4 class="card-title mb-0 flex-grow-1"
                                                                          style="margin-bottom: 15px !important;">
                                                                          Contact Information
                                                                      </h4>
                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">First
                                                                                  Name<span
                                                                                      style="color: red;">*</span>
                                                                              </label>
                                                                              <input type="text"
                                                                                  class="form-control"
                                                                                  placeholder="First Name"
                                                                                  id="firstNameinput">
                                                                          </div>
                                                                      </div>
                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Last
                                                                                  Name<span
                                                                                      style="color: red;">*</span></label>
                                                                              <input type="" class="form-control"
                                                                                  data-provider="flatpickr"
                                                                                  id="EndleaveDate"
                                                                                  placeholder="Last Name">
                                                                          </div>
                                                                      </div>

                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">

                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Phone</label>
                                                                              <div class="row">
                                                                                  <div class="col-md-4">
                                                                                      <select class="form-select"
                                                                                          data-choices=""
                                                                                          style="width: 110% !important;"
                                                                                          data-choices-sorting="true"
                                                                                          id="inlineFormSelectPref">
                                                                                          <option selected="">
                                                                                              +91</option>
                                                                                          <option value="1">
                                                                                              +44</option>
                                                                                          <option value="2">
                                                                                              +34</option>
                                                                                          <option value="3">
                                                                                              +1
                                                                                          </option>
                                                                                      </select>
                                                                                  </div>
                                                                                  <div class="col-md-8">
                                                                                      <input type="text"
                                                                                          class="form-control"
                                                                                          placeholder=""
                                                                                          id="firstNameinput">
                                                                                  </div>
                                                                              </div>


                                                                          </div>
                                                                      </div>
                                                                      <div class="col-lg-3">
                                                                          <div class="mb-3">
                                                                              <label for="firstNameinput"
                                                                                  class="form-label">Email<span
                                                                                      style="color: red;">*</span></label>
                                                                              <input type="text"
                                                                                  class="form-control"
                                                                                  placeholder="Email"
                                                                                  id="firstNameinput">
                                                                          </div>
                                                                      </div>




                                                                  </div>
                                                              </div>


                                                          </div>
                                                      </div> */}
                            <div className="col-lg-12">
                                <div className="card card_shadow ">
                                    {/* end card header */}
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-lg-3">
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
                                            <div className="col-lg-3">
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
                                            <div className="col-lg-3">
                                                <div className="mb-3">
                                                    <div className="mb-3">
                                                        <label htmlFor="firstNameinput" className="form-label">
                                                            VAT Registered
                                                        </label>
                                                        <select
                                                            id="VAT_dropdown"
                                                            className="form-select mb-3"
                                                            aria-label="Default select example"
                                                            style={{ color: "#8a8c8e !important" }}
                                                        >
                                                            <option selected="">Yes</option>
                                                            <option value={1}>No</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="col-lg-3"
                                                style={{ display: "block" }}
                                                id="VATinput"
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-12-lg-12">
                                    <div className="card card_shadow">
                                        <div className="card-header align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1">Contact Details</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-xxl-12 col-lg-12">
                                                    <div className="card pricing-box p-4 m-2 mt-0">
                                                        <div className="col-lg-6 col-md-6">
                                                            <p className="office-name">Contact Person </p>
                                                        </div>
                                                        <p className="delete">
                                                            <button
                                                                className="btn btn-sm btn-danger remove-item-btn"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#deleteRecordModal"
                                                            >
                                                                <i className="ri-delete-bin-5-fill" />
                                                            </button>
                                                        </p>
                                                        <div className="row">
                                                            <div className="col-lg-12">
                                                                <div
                                                                    className="form-check form-switch form-switch-md mb-3"
                                                                    dir="ltr"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-check-input"
                                                                        id="customSwitchsizemd"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="customSwitchsizemd"
                                                                    >
                                                                        Authorised Signatory
                                                                    </label>
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
                                                                        Alternate Phone
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
                                                                                placeholder="Alternate Phone"
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
                                                            <div className="col-lg-3">
                                                                <div className="mb-3">
                                                                    <label htmlFor="firstNameinput" className="form-label">
                                                                        Alternate Email
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Alternate Email"
                                                                        id="firstNameinput"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <div class="col-lg-6">
                                                                                          <div class="mb-3">
                                                                                              <label
                                                                                                  for="firstNameinput"
                                                                                                  class="form-label">Residential
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
                                                            Add Partner
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>{" "}
                                {/* end col */}
                            </div>
                            {/* end col */}
                        </div>
                    </section>

                    {/* Input fields */}
                    

                    {/* Navigation buttons */}
                    <div className="form__item button__items d-flex justify-content-between">
                        <Button className="white-btn" type="default" onClick={prev}>
                            Back
                        </Button>
                        <Button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default Information;
