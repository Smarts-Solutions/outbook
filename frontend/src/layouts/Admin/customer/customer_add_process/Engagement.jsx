import React, { useContext } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";
const Engagement = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next(); // Move to the next step after form submission
            }}
        >
            {({ handleSubmit }) => {
                return (

                    <div className={"details__wrapper"}>
                        <div className="card pricing-box p-4 m-2 mt-0">
                            <h4
                                className="card-title mb-0 flex-grow-1"
                                style={{ marginBottom: "20px !important" }}
                            >
                                Engagement Model
                            </h4>
                            <div className="card-body">
                                <div className="row">


                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            {/* Base Radios */}
                                            <div className="form-check form-check-outline form-check-dark">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="formCheck1"
                                                    defaultChecked=""
                                                />
                                                <label
                                                    className="form-check-label new_checkbox"
                                                    htmlFor="formCheck1"
                                                >
                                                    FTE/Dedicated Staffing
                                                </label>
                                            </div>
                                            {/* <div class="form-check mb-2">
                                                                              <input class="form-check-input"
                                                                                  type="radio" name="flexRadioDefault"
                                                                                  id="flexRadioDefault1">
                                                                              <label class="form-check-label"
                                                                                  for="flexRadioDefault1">
                                                                                  FTE/Dedicated Staffing
                                                                              </label>
                                                                          </div> */}
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <div className="form-check form-check-outline form-check-dark">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="formCheck2"
                                                />
                                                <label
                                                    className="form-check-label new_checkbox"
                                                    htmlFor="formCheck2"
                                                >
                                                    Percentage Model
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <div className="form-check form-check-outline form-check-dark">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="formCheck3"
                                                    defaultChecked=""
                                                />
                                                <label
                                                    className="form-check-label new_checkbox"
                                                    htmlFor="formCheck3"
                                                >
                                                    Adhoc/PAYG/Hourly
                                                </label>
                                            </div>


                                        </div>


                                    </div>
                                    <div className="col-lg-3">
                                        <div className="mb-3">
                                            <div className="form-check form-check-outline form-check-dark">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="formCheck4"
                                                />
                                                <label
                                                    className="form-check-label new_checkbox"
                                                    htmlFor="formCheck4"
                                                >
                                                    Customised Pricing
                                                </label>
                                            </div>
                                            {/* Base Radios */}
                                            {/* <div class="form-check mb-2">
                                                                              <input class="form-check-input"
                                                                                  type="radio" name="flexRadioDefault"
                                                                                  id="flexRadioDefault1">
                                                                              <label class="form-check-label"
                                                                                  for="flexRadioDefault1">
                                                                                  Customised Pricing
                                                                              </label>
                                                                          </div> */}
                                        </div>
                                    </div>

                                </div>
                                <div className="" style={{ marginTop: 15 }}>
                                    <div id="myDiv1" className="row">
                                        <div className="col-xl-12 col-md-12  col-lg-12">
                                            <div
                                                style={{ marginBottom: "26px !important" }}
                                                className="card pricing-box p-4 m-2 mt-0"
                                            >
                                                <div className="col-lg-6 col-md-6">
                                                    <p className="office-name">FTE/Dedicated</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Accountants
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Number of Accountants
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                &nbsp;
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Accountant
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Bookkeepers
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Number of Bookkeepers
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                &nbsp;
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Bookkeepers
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Payroll Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Number of Payroll Experts
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=""
                                                                    id="firstNameinput"
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                &nbsp;
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Payroll Experts
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Tax Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Number of Tax Experts
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                &nbsp;
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Tax Experts
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Number of Admin
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                          
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Admin/Other Staff
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="myDiv2" className="row">
                                        <div
                                            style={{ marginBottom: "26px !important" }}
                                            className="col-xl-12 col-lg-12"
                                        >
                                            <div className="card pricing-box p-4 m-2 mt-0">
                                                <div className="col-lg-6 col-md-6">
                                                    <p className="office-name">Adhoc/PAYG/Hourly</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Accountants
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Hour
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Bookkeepers
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Hour
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Payroll Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Hour
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Tax Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Hour
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Admin/Other Staff
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Per Hour
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=""
                                                                    id="firstNameinput"
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "none" }} id="myDiv3" className="row">
                                        <div
                                            style={{ marginBottom: "26px !important" }}
                                            className="col-xl-12 col-lg-12"
                                        >
                                            <div className="card pricing-box p-4 m-2 mt-0">
                                                <div className="col-lg-6 col-md-6">
                                                    <p className="office-name">Percentage Model</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Total Outsourcing
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Accountants
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Bookkeepers
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Payroll Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage Expert
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Tax Experts
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder=""
                                                                id="firstNameinput"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="mb-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Admin/Other Staff
                                                            </label>{" "}
                                                            <br />
                                                            <label
                                                                htmlFor="firstNameinput"
                                                                className="form-label label_bottom"
                                                            >
                                                                Fee Percentage
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=""
                                                                    id="firstNameinput"
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "none" }} id="myDiv4" className="row">
                                        <div className="col-xl-12 col-lg-12">
                                            <div className="card pricing-box p-4 m-2 mt-0">
                                                <div className="col-lg-6 col-md-6">
                                                    <p className="office-name">Customised Pricing</p>
                                                </div>
                                                <div id="custprize">
                                                    <div className="row">
                                                        <div className="col-lg-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="firstNameinput" className="form-label">
                                                                    Minimum number of Jobs
                                                                </label>
                                                                {/* <label for="firstNameinput"
                                                                                      class="form-label label_bottom">Fee Per Accountant
                                                                                  </label> */}
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder={1}
                                                                    id="firstNameinput"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div id="invoice_reviewer" className="col-lg-3">
                                                            <label htmlFor="firstNameinput" className="form-label">
                                                                Types Of Job
                                                            </label>
                                                            <select
                                                                id="search-select"
                                                                className="form-select mb-3"
                                                                aria-label="Default select example"
                                                                style={{ color: "#8a8c8e !important" }}
                                                            >
                                                                <option value="" selected="">
                                                                    Select Job Type
                                                                </option>
                                                                <option value="">VAT</option>
                                                                <option value="">Year End</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="mb-3">
                                                                <label htmlFor="firstNameinput" className="form-label">
                                                                    Cost Per Job
                                                                </label>
                                                                {/* <br>
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label label_bottom">Fee
                                                                                       Per Bookkeeper
                                                                                  </label> */}
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=""
                                                                    id="firstNameinput"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-1 " style={{ marginTop: 22 }}>
                                                            <a className="add_icon">
                                                                <i
                                                                    onclick="addcustpricing()"
                                                                    style={{ fontSize: 38, cursor: "pointer" }}
                                                                    className="ri-add-circle-fill "
                                                                />
                                                            </a>
                                                        </div>
                                                        {/* <div class="col-lg-3">
                                                                              <div class="mb-3">
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label">Payroll
                                                                                      Experts
                                                                                  </label> <br>
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label label_bottom">Fee
                                                                                      Per Payroll
                                                                                      Expert
                                                                                  </label>
                                                                                  <input type="text"
                                                                                      class="form-control"
                                                                                      placeholder=""
                                                                                      id="firstNameinput">
                                                                              </div>
                                                                          </div>
                                                                          <div class="col-lg-3">
                                                                              <div class="mb-3">
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label">Tax Experts
                                                                                  </label> <br>
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label label_bottom">Fee
                                                                                      Per Tax Expert
                                                                                  </label>
                                                                                  <input type="text"
                                                                                      class="form-control"
                                                                                      placeholder=""
                                                                                      id="firstNameinput">
                                                                              </div>
                                                                          </div>
                                                                          <div class="col-lg-3">
                                                                              <div class="mb-3">
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label">Admin/Other
                                                                                      Staff
                                                                                  </label> <br>
                                                                                  <label for="firstNameinput"
                                                                                      class="form-label label_bottom">Fee
                                                                                      Per Admin/Other
                                                                                      Staff
                                                                                      <input type="text"
                                                                                          class="form-control"
                                                                                          placeholder=""
                                                                                          id="firstNameinput">
                                                                              </div>
                                                                          </div> */}
                                                    </div>
                                                </div>
                                                <div id="cust_prize"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                      
                        <div className="form__item button__items d-flex justify-content-between">
                            <Button className="white-btn" type="default" onClick={prev}>
                                Back
                            </Button>
                            <Button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                                Next
                            </Button>
                        </div>



                    </div>

                );
            }}
        </Formik>
    );
};
export default Engagement;

