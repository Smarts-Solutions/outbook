import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { GetClientIndustry } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { Email_regex } from '../../../../Utils/Common_regex'


const CreateClient = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [clientIndustry, setClientIndustry] = useState([])
    const [selectClientType, setSelectClientType] = useState(1)
    const [getSoleTraderDetails, setSoleTraderDetails] = useState({
        IndustryType: '',
        tradingName: "",
        tradingAddress: "",
        vatRegistered: "",
        vatNumber: "",
        website: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        residentialAddress: ""
    })

    const [getCompanyDetails, setCompanyDetails] = useState({
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

    const [contacts, setContacts] = useState([
        { authorised_signatory_status: false, firstName: '', lastName: '', role: '', phoneNumber: '', email: '' }
    ]);
    const [errors, setErrors] = useState([{ firstName: false, lastName: false, role: false, phoneCode: false, phoneNumber: false, email: false }
    ]);
    const handleAddContact = () => {
        setContacts([...contacts, { authorised_signatory_status: false, firstName: '', lastName: '', role: '', phoneNumber: '', email: '' }]);
        setErrors([...errors, { firstName: false, lastName: false, role: false, email: false }]);
    };
   

    const [errors1, setErrors1] = useState({});
    const [errors2, setErrors2] = useState({});

     

    const handleSubmit = () => {
        if (selectClientType == 1) validate1()
        if (selectClientType == 2) validate2()
        
         
        if (selectClientType == 1) {
            const data = { getSoleTraderDetails }
            console.log("data :", data)
        }
        else if (selectClientType === 2) {
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
                else if (key == 'firstName') newErrors[key] = 'Please enter First Name';
                else if (key == 'lastName') newErrors[key] = 'Please enter Last Name';
                else if (key == 'phone') newErrors[key] = 'Please enter Phone';
                else if (key == 'email') newErrors[key] = 'Please enter Email';
                else if (key == 'residentialAddress') newErrors[key] = 'Please enter Residential Address';
            }
            else if (key == 'email' && !Email_regex(getSoleTraderDetails[key])) {
                newErrors[key] = 'Please enter valid Email';
            }
        }
        setErrors1(newErrors)
        return newErrors;
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
        return newErrors;
    };

     
 


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



    
    return (
        <div>
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title mb-0">Create New Client</h4>
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
                                                    <div className="col-lg-7">
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
                                                                            className="form-select mb-3"
                                                                            value={selectClientType}
                                                                            onChange={(e) => setSelectClientType(e.target.value)}
                                                                        >
                                                                            <option value={1}>Sole Trader</option>
                                                                            <option value={2}>Company</option>
                                                                            <option value={3}>Partnership</option>
                                                                            <option value={4}>Individual</option>
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
                                                                        <div className="card-header align-items-center d-flex">
                                                                            <h4 className="card-title mb-0 flex-grow-1">
                                                                                Company Information
                                                                            </h4>
                                                                        </div>
                                                                        {/* end card header */}
                                                                        <div className="card-body">
                                                                            <div className="row">
                                                                                <div className="col-lg-3">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label">Client Industry<span style={{ color: "red" }}>*</span></label>
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
                                                                                        {errors1['IndustryType'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['IndustryType']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-3">
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
                                                                                <div className="col-lg-3">
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
                                                                                <div className="col-lg-3">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >VAT Registered</label>
                                                                                        <select className="form-select mb-3" aria-label="Default select example"
                                                                                            name="vatRegistered"
                                                                                            value={getSoleTraderDetails.vatRegistered}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        >
                                                                                            <option selected="">Yes</option>
                                                                                            <option value={1}>No</option>
                                                                                        </select>
                                                                                        {errors1['vatRegistered'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['vatRegistered']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-3">
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
                                                                                <div className="col-lg-3">
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
                                                                                <h4 className="card-title mb-0 flex-grow-1" style={{ marginBottom: "15px !important" }}>
                                                                                    Sole Trader Details
                                                                                </h4>
                                                                                <div className="col-lg-3">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label"  >First Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control"
                                                                                            placeholder="First Name"
                                                                                            name="firstName"
                                                                                            value={getSoleTraderDetails.firstName}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        />
                                                                                        {errors1['firstName'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['firstName']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-3">
                                                                                    <div className="mb-3">
                                                                                        <label className="form-label" >Last Name<span style={{ color: "red" }}>*</span></label>
                                                                                        <input type="text" className="form-control" placeholder="Last Name"
                                                                                            name="lastName"
                                                                                            value={getSoleTraderDetails.lastName}
                                                                                            onChange={(e) => handleChange1(e)}
                                                                                        />
                                                                                        {errors1['lastName'] && (
                                                                                            <div style={{ 'color': 'red' }}>{errors1['lastName']}</div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-3">
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
                                                                                <div className="col-lg-3">
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
                                                                            <div className="card-header align-items-center d-flex">
                                                                                <h4 className="card-title mb-0 flex-grow-1">Company Information</h4>
                                                                            </div>
                                                                            {/* end card header */}
                                                                            <div className="card-body">
                                                                                <div className="row">
                                                                                    <h4 className="card-title mb-0 flex-grow-1">Contact Information</h4>
                                                                                    <div className="row">
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Search Company</label>
                                                                                                <input type="text" className="form-control" placeholder="Outbooks Quality & Certainty" />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label" >Company Name<span style={{ color: "red" }}>*</span>  </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Outbooks Quality & Certainty LTD"
                                                                                                    name="CompanyName" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyName}
                                                                                                />
                                                                                                {errors2['CompanyName'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyName']}</div>
                                                                                                )}

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Entity Type<span style={{ color: "red" }}>*</span>   </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="LTD"
                                                                                                    name="EntityType" onChange={(e) => handleChange2(e)} value={getCompanyDetails.EntityType} />
                                                                                                {errors2['EntityType'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['EntityType']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  >  Company Status  <span style={{ color: "red" }}>*</span> </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Active"
                                                                                                    name="CompanyStatus" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyStatus} />
                                                                                                {errors2['CompanyStatus'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyStatus']}</div>)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Company Number<span style={{ color: "red" }}>*</span></label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Company Number"
                                                                                                    name="CompanyNumber" onChange={(e) => handleChange2(e)} value={getCompanyDetails.CompanyNumber}
                                                                                                />
                                                                                                {errors2['CompanyNumber'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['CompanyNumber']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-6">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Registered Office Address<span style={{ color: "red" }}>*</span>  </label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="Suite Winsor & Netwon Building, White Fridrs Avenue, England,HA3 5RN"
                                                                                                    name="RegisteredOfficeAddress" onChange={(e) => handleChange2(e)} value={getCompanyDetails.RegisteredOfficeAddress}
                                                                                                />
                                                                                                {errors2['RegisteredOfficeAddress'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['RegisteredOfficeAddress']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label">Incorporation Date</label>
                                                                                                <input type="text" className="form-control input_bg" placeholder="07-01-2023"
                                                                                                    name="IncorporationDate" onChange={(e) => handleChange2(e)} value={getCompanyDetails.IncorporationDate}
                                                                                                />
                                                                                                {errors2['IncorporationDate'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['IncorporationDate']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  > Incorporation in  <span style={{ color: "red" }}>*</span> </label>
                                                                                                <select className="form-select mb-3" name="IncorporationIn" onChange={(e) => handleChange2(e)} value={getCompanyDetails.IncorporationIn}>
                                                                                                    <option selected="">England and Wales(EW) </option>
                                                                                                    <option value={1}>England and Wales(EW) </option>
                                                                                                    <option value={2}>England and Wales(EW) </option>
                                                                                                    <option value={3}>England and Wales(EW) </option>
                                                                                                </select>
                                                                                                {errors2['IncorporationIn'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['IncorporationIn']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label className="form-label"  >VAT Registered</label>
                                                                                                <select className="form-select mb-3" name="VATRegistered" onChange={(e) => handleChange2(e)} value={getCompanyDetails.VATRegistered}>
                                                                                                    <option selected="">Yes</option>
                                                                                                    <option value={1}>No</option>
                                                                                                </select>
                                                                                                {errors2['VATRegistered'] && (
                                                                                                    <div style={{ 'color': 'red' }}>{errors2['VATRegistered']}</div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3" >
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
                                                                                        <div className="col-lg-3">
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
                                                                                    <div className="col-lg-6">
                                                                                        <div className="mb-3">
                                                                                            <label className="form-label">Client Industry<span style={{ color: "red" }}>*</span></label>
                                                                                            <select className="form-select mb-3"
                                                                                                name="ClientIndustry" onChange={(e) => handleChange2(e)} value={getCompanyDetails.ClientIndustry}>
                                                                                                <option value={1}>Select Client Industry</option>
                                                                                                <option value={2}>Ltd</option>
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
                                                                                <div className="card-header align-items-center d-flex">
                                                                                    <h4 className="card-title mb-0 flex-grow-1">
                                                                                        Officer Details
                                                                                    </h4>
                                                                                </div>
                                                                                <div className="card-body">
                                                                                    <div className="row">
                                                                                        <div className="col-xxl-12 col-lg-12">
                                                                                            <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                <div className="col-lg-6 col-md-6">
                                                                                                    <p className="office-name">Officer1 </p>
                                                                                                </div>
                                                                                                <div className="row " id="form2">
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
                                                                                                                                        // onChange={(e) => handleChange(index, 'authorised_signatory_status', e.target.checked)}
                                                                                                                                        // defaultChecked={index == 0 || index == 1}
                                                                                                                                        // disabled={contacts.length == 2 ? index == 0 || index == 1 : false}



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
                                                                                                                                            // onClick={() => handleDeleteContact(index)}
                                                                                                                                            // disabled={contacts.length === 1}
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
                                                                                                                                    // value={contact.firstName}
                                                                                                                                    // onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                                                                                                                                />
                                                                                                                                {/* {contact.firstName == "" && <div style={{ color: 'red' }}>First Name is required</div>} */}
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
                                                                                                                                    // value={contact.lastName}
                                                                                                                                    // onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                                                                                                                                />
                                                                                                                                {/* {contact.lastName == "" && <div style={{ color: 'red' }}>Last Name is required</div>} */}
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
                                                                                                                                    // value={contact.role}
                                                                                                                                    // onChange={(e) => handleChange(index, 'role', e.target.value)}
                                                                                                                                >
                                                                                                                                    <option value="">Select Role</option>
                                                                                                                                    {/* {personRoleDataAll && personRoleDataAll.data.map((item, index) => { */}
                                                                                                                                        {/* return <option value={item.id}>{item.name}</option> */}
                                                                                                                                    {/* })} */}
                                                                                                                                </select>
                                                                                                                                {/* {contact.role == "" && <div style={{ color: 'red' }}>Role is required</div>} */}

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
                                                                                                                                        // value={contact.phoneNumber}
                                                                                                                                        // onChange={(e) => handleChange(index, 'phoneNumber', e.target.value)}
                                                                                                                                    />
                                                                                                                                    {/* {contact.phoneNumber == "" && <div style={{ color: 'red' }}>Phone Number is required</div>} */}
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
                                                                                                                                    // value={contact.email}
                                                                                                                                    // onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                                                                                                />
                                                                                                                                {/* {contact.email == "" && <div style={{ color: 'red' }}>Email is required</div>} */}
                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        ))}


                                                                                                        <div className="card-header d-flex align-items-center">
                                                                                                            <h5 className="card-title mb-0 flex-grow-1"></h5>
                                                                                                            <div>
                                                                                                                <button className="btn btn-info text-white blue-btn" 
                                                                                                                onClick={handleAddContact}
                                                                                                                >
                                                                                                                    Add Officer
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
                                                                        </div>{" "}
                                                                        {/* end col */}
                                                                    </div>
                                                                </div>
                                                                :
                                                                selectClientType == 3 ?
                                                                    <div
                                                                        className="row "
                                                                        style={{ display: "none" }}
                                                                        id="form3"
                                                                    >

                                                                        <div className="col-lg-12">
                                                                            <div className="card card_shadow ">
                                                                                {/* end card header */}
                                                                                <div className="card-body">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
                                                                                                    Client Industry
                                                                                                    <span style={{ color: "red" }}>*</span>
                                                                                                </label>
                                                                                                <select
                                                                                                    id="search-select"
                                                                                                    className="form-select mb-3"
                                                                                                    aria-label="Default select example"
                                                                                                    style={{ color: "#8a8c8e !important" }}
                                                                                                >
                                                                                                    {/* <option selected>Company
                                                                                      </option> */}
                                                                                                    <option value={1}>
                                                                                                        Select Client Industry
                                                                                                    </option>
                                                                                                    <option value={2}>Ltd</option>
                                                                                                </select>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
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
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
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
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <div className="mb-3">
                                                                                                    <label
                                                                                                        htmlFor="firstNameinput"
                                                                                                        className="form-label"
                                                                                                    >
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
                                                                                                    <label
                                                                                                        htmlFor="firstNameinput"
                                                                                                        className="form-label"
                                                                                                    >
                                                                                                        VAT Number
                                                                                                    </label>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="form-control "
                                                                                                        placeholder="VAT Number"
                                                                                                        id="firstNameinput"
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
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
                                                                            <div className="col-lg-12">
                                                                                <div className="card card_shadow">
                                                                                    <div className="card-header align-items-center d-flex">
                                                                                        <h4 className="card-title mb-0 flex-grow-1">
                                                                                            Contact Details
                                                                                        </h4>
                                                                                    </div>
                                                                                    <div className="card-body">
                                                                                        <div className="row">
                                                                                            <div className="col-xxl-12 col-lg-12">
                                                                                                <div className="card pricing-box p-4 m-2 mt-0">
                                                                                                    <div className="col-lg-6 col-md-6">
                                                                                                        <p className="office-name">Contact 1 </p>
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

                                                                                                        </div>
                                                                                                        <div className="col-lg-3">
                                                                                                            <div className="mb-3">
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
                                                                                                                    First Name
                                                                                                                    <span style={{ color: "red" }}>
                                                                                                                        *
                                                                                                                    </span>
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
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
                                                                                                                    Last Name
                                                                                                                    <span style={{ color: "red" }}>
                                                                                                                        *
                                                                                                                    </span>
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
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
                                                                                                                    Role
                                                                                                                    <span style={{ color: "red" }}>
                                                                                                                        *
                                                                                                                    </span>
                                                                                                                </label>
                                                                                                                <input
                                                                                                                    type="text"
                                                                                                                    className="form-control"
                                                                                                                    placeholder="Role"
                                                                                                                    id="firstNameinput"
                                                                                                                />
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        <div className="col-lg-4">
                                                                                                            <div className="mb-3">
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
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
                                                                                                                            <option value={1}>+61</option>
                                                                                                                            <option value={2}>+44</option>
                                                                                                                        </select>
                                                                                                                    </div>
                                                                                                                    <div className="col-md-8">
                                                                                                                        <input
                                                                                                                            type="text"
                                                                                                                            className="form-control"
                                                                                                                            placeholder="Phone"
                                                                                                                            id="firstNameinput"
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-lg-4">
                                                                                                            <div className="mb-3">
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
                                                                                                                    Alternate Phone
                                                                                                                </label>
                                                                                                                <div className="row">
                                                                                                                    <div className="col-md-4">
                                                                                                                        <select
                                                                                                                            className="form-select"
                                                                                                                            data-choices=""
                                                                                                                            style={{
                                                                                                                                width: "100% !important"
                                                                                                                            }}
                                                                                                                            data-choices-sorting="true"
                                                                                                                            id="inlineFormSelectPref"
                                                                                                                        >
                                                                                                                            <option selected="">+91</option>
                                                                                                                            <option value={1}>+61</option>
                                                                                                                            <option value={2}>+44</option>
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
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
                                                                                                                    Email
                                                                                                                    <span style={{ color: "red" }}>
                                                                                                                        *
                                                                                                                    </span>
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
                                                                                                                <label
                                                                                                                    htmlFor="firstNameinput"
                                                                                                                    className="form-label"
                                                                                                                >
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

                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="card-header d-flex align-items-center">
                                                                                                <h5 className="card-title mb-0 flex-grow-1"></h5>
                                                                                                <div>
                                                                                                    <button
                                                                                                        id="addRow"
                                                                                                        className="btn btn-primary"
                                                                                                    >
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
                                                                    :
                                                                    <div
                                                                        className="row "
                                                                        style={{ display: "none" }}
                                                                        id="form4"
                                                                    >
                                                                        <div className="col-lg-12">
                                                                            <div className="card card_shadow ">
                                                                                <div className="card-header align-items-center d-flex">
                                                                                    <h4 className="card-title mb-0 flex-grow-1">
                                                                                        Client Information
                                                                                    </h4>
                                                                                </div>
                                                                                {/* end card header */}
                                                                                <div className="card-body">
                                                                                    <div className="row">
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
                                                                                                    First Name
                                                                                                    <span style={{ color: "red" }}>*</span>
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
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
                                                                                                    Last Name
                                                                                                    <span style={{ color: "red" }}>*</span>
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
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
                                                                                                    Phone
                                                                                                </label>
                                                                                                <div className="row">
                                                                                                    <div className="col-md-4">
                                                                                                        <select
                                                                                                            className="form-select"
                                                                                                            data-choices=""
                                                                                                            style={{ width: "121% !important" }}
                                                                                                            data-choices-sorting="true"
                                                                                                            id="inlineFormSelectPref"
                                                                                                        >
                                                                                                            <option selected="">+44</option>
                                                                                                            <option value={1}>+61</option>
                                                                                                            <option value={2}>+91</option>
                                                                                                        </select>
                                                                                                    </div>
                                                                                                    <div className="col-md-8">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className="form-control"
                                                                                                            placeholder="Phone"
                                                                                                            id="firstNameinput"
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-lg-3">
                                                                                            <div className="mb-3">
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
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
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
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
                                                                                                <label
                                                                                                    htmlFor="firstNameinput"
                                                                                                    className="form-label"
                                                                                                >
                                                                                                    Residential Address
                                                                                                    <span style={{ color: "red" }}>*</span>
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
                                                    }



                                                </section>
                                            </div>
                                            <div className="hstack gap-2 justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-light"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Cancel
                                                </button>
                                                <button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                                                    Create Client
                                                </button>
                                            </div>
                                        </div>
                                        {/* end tab pane */}
                                        <div
                                            className="tab-pane fade"
                                            id="pills-info-desc"
                                            role="tabpanel"
                                            aria-labelledby="pills-info-desc-tab"
                                        >
                                            <div>
                                                <div className="card pricing-box p-4 m-2 mt-0">
                                                    <h4
                                                        className="card-title mb-0 flex-grow-1"
                                                        style={{ marginBottom: "20px !important" }}
                                                    >
                                                        Select Services
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-md-7">
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
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
                                                                                YE Accounts/Stat Accounts
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Corporation Tax Return
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Management Accounts
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Bookkeeping
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                VAT Return
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Payroll
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
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
                                                                                Personal Tax Returns
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Admin/Support Tasks
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Onboarding/Setup
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4
                                                        className="card-title mb-0 flex-grow-1"
                                                        style={{ marginBottom: "15px !important" }}
                                                    >
                                                        Select Sub Tasks
                                                    </h4>
                                                    <div className="">
                                                        <div className="row">
                                                            <div className="col-xxl-4 col-lg-12">
                                                                <div
                                                                    style={{ marginBottom: "26px !important" }}
                                                                    className="card pricing-box p-4 m-2 mt-0"
                                                                >
                                                                    <div className="col-lg-6 col-md-6">
                                                                        <p className="office-name">
                                                                            YE Accountsa/ Stat Accounts{" "}
                                                                        </p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
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
                                                                                                Working Paper Prep
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Lead Schedules
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Other Schedules
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Uploading Trial Balance on Accounts
                                                                                                Prep Software
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Generate Draft Accounts
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Send Accounts to
                                                                                                Client/Accountant/Agent
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
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
                                                                                                Send Accounts to Client/Small Business
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Get Submission Approval for the
                                                                                                Accounts
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Submit/File Accounts
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xxl-4 col-lg-12">
                                                                <div className="card pricing-box p-4 m-2 mt-0">
                                                                    <div className="col-lg-6 col-md-6">
                                                                        <p className="office-name">Personal Tax Return</p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
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
                                                                                                UTR Application
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                HMRC Data checking
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Send Return to Client
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Rental Income P&amp;L Prep
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Finalise Tax Return
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Get Submission Approval for the Return
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
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
                                                                                                Sole Trading P&amp;L (Up to 200
                                                                                                tramactions) Prep
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Send Return to Client/Accountant/Agent
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-lg-4">
                                                                                    <div className="mb-3">
                                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="checkbox"
                                                                                                id="formCheck1"
                                                                                            />
                                                                                            <label
                                                                                                className="form-check-label new_checkbox"
                                                                                                htmlFor="formCheck1"
                                                                                            >
                                                                                                Submit/File Return
                                                                                            </label>
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
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-success text-decoration-none  previestab"
                                                    data-previous="pills-gen-info-tab"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-light "
                                                    data-bs-dismiss="modal"
                                                    style={{ marginLeft: "auto" }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-success nexttab nexttab right "
                                                    data-nexttab="pills-engagement-tab"
                                                    id="add-btn"
                                                >
                                                    Next
                                                </button>

                                            </div>
                                            <div className="hstack gap-2 justify-content-end">

                                            </div>
                                        </div>
                                        {/* end tab pane */}
                                        <div
                                            className="tab-pane fade"
                                            id="pills-engagement"
                                            role="tabpanel"
                                            aria-labelledby="pills-engagement-tab"
                                        >
                                            <div>
                                                <div className="card pricing-box p-4 m-2 mt-0">
                                                    <h4
                                                        className="card-title mb-0 flex-grow-1"
                                                        style={{ marginBottom: "20px !important" }}
                                                    >
                                                        Engagement Model
                                                    </h4>
                                                    <div className="row">
                                                        <div className="col-md-7">
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
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
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Percentage Model
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
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
                                                                                Adhoc/PAYG/Hourly
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Customised Pricing
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="" style={{ marginTop: 15 }}>
                                                        <div className="row">
                                                            <div className="col-xxl-4 col-lg-12">
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                    className="form-label"
                                                                                >
                                                                                    Admin/Support Staff
                                                                                </label>{" "}
                                                                                <br />
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label label_bottom"
                                                                                >
                                                                                    Number of Admin/Support Staff
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
                                                                                    className="form-label"
                                                                                >
                                                                                    &nbsp;
                                                                                </label>{" "}
                                                                                <br />
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label label_bottom"
                                                                                >
                                                                                    Fee Per Admin/Support Staff
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
                                                        <div className="row">
                                                            <div className="col-xxl-4 col-lg-12">
                                                                <div className="card pricing-box p-4 m-2 mt-0">
                                                                    <div className="col-lg-6 col-md-6">
                                                                        <p className="office-name">Adhoc/PAYG/Hourly</p>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-lg-3">
                                                                            <div className="mb-3">
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
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
                                                                                <label
                                                                                    htmlFor="firstNameinput"
                                                                                    className="form-label"
                                                                                >
                                                                                    Admin/Support Staff
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
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-success text-decoration-none  previestab"
                                                    data-previous="pills-gen-info-tab"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-light "
                                                    data-bs-dismiss="modal"
                                                    style={{ marginLeft: "auto" }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-success nexttab nexttab right "
                                                    data-nexttab="pills-success-tab"
                                                    id="add-btn"
                                                >
                                                    Next
                                                </button>

                                            </div>
                                        </div>
                                        {/* end tab pane */}
                                        <div
                                            className="tab-pane fade"
                                            id="pills-success"
                                            role="tabpanel"
                                            aria-labelledby="pills-success-tab"
                                        >
                                            <div>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <p className="text-muted">
                                                                    Upload Client Specific Paperwork
                                                                </p>
                                                                <div
                                                                    className="dropzone dz-clickable"
                                                                    style={{ height: 220 }}
                                                                >
                                                                    <div className="dz-message needsclick">
                                                                        <div
                                                                            className="mb-3"
                                                                            style={{
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center"
                                                                            }}
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                id="btn1"
                                                                                className="btn btn-outline-primary"
                                                                                style={{
                                                                                    border: "1px solid #0E6E91",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center"
                                                                                }}
                                                                            >
                                                                                <i className="ri-upload-cloud-fill" />
                                                                                <span style={{ color: "#0E6E91" }}>
                                                                                    Choose File
                                                                                </span>
                                                                            </button>
                                                                            {/* <i class="display-4 text-muted ri-upload-cloud-2-fill"></i> */}
                                                                        </div>
                                                                        <h6>
                                                                            <p>Or Drag File in here</p>
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                                <ul
                                                                    className="list-unstyled mb-0"
                                                                    id="dropzone-preview"
                                                                ></ul>
                                                                {/* end dropzon-preview */}
                                                                <div className="container-fluid page-title-box">
                                                                    <div className="row">
                                                                        <div className="col-lg-12">
                                                                            <div className="card">
                                                                                {/* end card header */}
                                                                                <div className="card-body">
                                                                                    <div id="customerList">
                                                                                        <div className="row g-4 mb-3">

                                                                                            <div className="d-flex justify-content-end">
                                                                                                <div className="pagination-wrap hstack gap-2">
                                                                                                    <button
                                                                                                        className="btn btn-soft-danger"
                                                                                                        onclick="deleteMultiple()"
                                                                                                    >
                                                                                                        <i className="ri-delete-bin-2-line" />
                                                                                                        Delete Select
                                                                                                    </button>
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="btn btn-success add-btn"
                                                                                                        data-bs-toggle="modal"
                                                                                                        id="create-btn"
                                                                                                        data-bs-target="#showModal"
                                                                                                    >
                                                                                                        <i className="ri-upload-cloud-fill" />
                                                                                                        Upload
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="table-responsive table-card mt-3 mb-1">
                                                                                            <table
                                                                                                className="table align-middle table-nowrap"
                                                                                                id="customerTable"
                                                                                            >
                                                                                                <thead className="table-light">
                                                                                                    <tr>
                                                                                                        <th
                                                                                                            scope="col"
                                                                                                            style={{ width: 50 }}
                                                                                                        >
                                                                                                            <div className="form-check">
                                                                                                                <input
                                                                                                                    className="form-check-input new_input"
                                                                                                                    type="checkbox"
                                                                                                                    id="checkAll"
                                                                                                                    defaultValue="option"
                                                                                                                />
                                                                                                            </div>
                                                                                                        </th>
                                                                                                        <th
                                                                                                            className=""
                                                                                                            data-sort="customer_name"
                                                                                                        >
                                                                                                            File Name
                                                                                                        </th>
                                                                                                        <th
                                                                                                            className=""
                                                                                                            data-sort="customer_name"
                                                                                                        >
                                                                                                            File Type
                                                                                                        </th>
                                                                                                        <th
                                                                                                            className=""
                                                                                                            data-sort="customer_name"
                                                                                                        >
                                                                                                            Size
                                                                                                        </th>
                                                                                                        <th
                                                                                                            className=""
                                                                                                            data-sort="action"
                                                                                                        >
                                                                                                            Action
                                                                                                        </th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody className="list form-check-all">
                                                                                                    <tr>
                                                                                                        <th scope="row">
                                                                                                            <div className="form-check">
                                                                                                                <input
                                                                                                                    className="form-check-input new_input"
                                                                                                                    type="checkbox"
                                                                                                                    name="chk_child"
                                                                                                                    defaultValue="option1"
                                                                                                                />
                                                                                                            </div>
                                                                                                        </th>
                                                                                                        <td className="customer_name">
                                                                                                            document1.docs
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            DOCS
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            1.2 MB
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            <div className="d-flex ">
                                                                                                                <div className="remove">
                                                                                                                    <button
                                                                                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                                                                                        data-bs-toggle="modal"
                                                                                                                        data-bs-target="#deleteRecordModal"
                                                                                                                    >
                                                                                                                        <i className="ri-delete-bin-5-fill" />
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <th scope="row">
                                                                                                            <div className="form-check">
                                                                                                                <input
                                                                                                                    className="form-check-input new_input"
                                                                                                                    type="checkbox"
                                                                                                                    name="chk_child"
                                                                                                                    defaultValue="option1"
                                                                                                                />
                                                                                                            </div>
                                                                                                        </th>
                                                                                                        <td className="customer_name">
                                                                                                            Examplefile.png
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            PNG
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            3.2 MB
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            <div className="d-flex ">
                                                                                                                <div className="remove">
                                                                                                                    <button
                                                                                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                                                                                        data-bs-toggle="modal"
                                                                                                                        data-bs-target="#deleteRecordModal"
                                                                                                                    >
                                                                                                                        <i className="ri-delete-bin-5-fill" />
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <th scope="row">
                                                                                                            <div className="form-check">
                                                                                                                <input
                                                                                                                    className="form-check-input new_input"
                                                                                                                    type="checkbox"
                                                                                                                    name="chk_child"
                                                                                                                    defaultValue="option1"
                                                                                                                />
                                                                                                            </div>
                                                                                                        </th>
                                                                                                        <td className="customer_name">
                                                                                                            Share_Certificate.pdf
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            PDF
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            5 MB
                                                                                                        </td>
                                                                                                        <td className="customer_name">
                                                                                                            <div className="d-flex ">
                                                                                                                <div className="remove">
                                                                                                                    <button
                                                                                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                                                                                        data-bs-toggle="modal"
                                                                                                                        data-bs-target="#deleteRecordModal"
                                                                                                                    >
                                                                                                                        <i className="ri-delete-bin-5-fill" />
                                                                                                                    </button>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                            <div
                                                                                                className="noresult"
                                                                                                style={{ display: "none" }}
                                                                                            >
                                                                                                <div className="text-center">
                                                                                                    <lord-icon
                                                                                                        src="https://cdn.lordicon.com/msoeawqm.json"
                                                                                                        trigger="loop"
                                                                                                        colors="primary:#121331,secondary:#08a88a"
                                                                                                        style={{ width: 75, height: 75 }}
                                                                                                    />
                                                                                                    <h5 className="mt-2">
                                                                                                        Sorry! No Result Found
                                                                                                    </h5>
                                                                                                    <p className="text-muted mb-0">
                                                                                                        We've searched more than 150+
                                                                                                        Orders We did not find any orders
                                                                                                        for you search.
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-start gap-3 mt-4">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-success text-decoration-none  previestab"
                                                                                                data-previous="pills-gen-info-tab"
                                                                                            >
                                                                                                Previous
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                className="btn btn-light "
                                                                                                data-bs-dismiss="modal"
                                                                                                style={{ marginLeft: "auto" }}
                                                                                            >
                                                                                                Cancel
                                                                                            </button>

                                                                                            <a
                                                                                                href="index.html"
                                                                                                className="btn btn-success nexttab nexttab right"
                                                                                                style={{
                                                                                                    backgroundColor: "#0E6E91",
                                                                                                    color: "#fff"
                                                                                                }}
                                                                                            >
                                                                                                Submit
                                                                                            </a>

                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                                {/* end card */}
                                                                            </div>
                                                                            {/* end col */}
                                                                        </div>
                                                                        {/* end col */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* end card body */}
                                                        </div>
                                                        {/* end card */}
                                                    </div>{" "}
                                                    {/* end col */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* end tab pane */}
                                    </div>
                                    {/* end tab content */}
                                </div>
                            </div>
                            {/* end card body */}
                        </div>
                        {/* end card */}
                    </div>
                    {/* end col */}
                </div>
                {/* end row */}
            </div>


        </div>
    )
}

export default CreateClient