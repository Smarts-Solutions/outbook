import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { Email_regex, Mobile_regex } from '../../../Utils/Common_regex'

const ReusableForm = ({ initialValues, validationSchema, onSubmit, fromDate, isSelected, fieldtype, formik, btn_name, forlogin, title, label_size, col_size, disable, check_box_true, row_size, additional_field, showImagePreview, placeholderdata, disabled, closeBtn }) => {


    const location = useLocation()
    const [passwordVisible, setPasswordVisible] = useState({});
    const [selectSearchItem, setSelectSearchItem] = useState('')


    useEffect(() => {
        formik.setFieldValue("search_company_name", selectSearchItem)
    }, [selectSearchItem])

    useEffect(() => {
        setSelectSearchItem((pre) => formik.values.search_company_name == "" ? "" : pre)
    }, [formik.values.search_company_name])

    return (

        <form onSubmit={formik.handleSubmit}>
            <div className='row' style={{ height: `${title === "addgroup" ? '65vh' : ""}`, overflowY: `${title === "addgroup" ? 'scroll' : ""}` }}>
                <div className={`row`}>
                    {fieldtype.map((field, index) => (
                        <>
                            {field.type === 'select' ? <>
                                <div className={`col-lg-${title === "update_theme" ? 12 : field.col_size}`}>
                                    <div className=" row">
                                        <label
                                            className={`col-lg-${field.label_size}`}
                                            htmlFor={field.name}
                                        >
                                            {field.label}
                                            <span className="text-danger">*</span>
                                        </label>
                                        <div className={`col-lg-${title === "addgroup" ? 12 : 12}`}>
                                            <select
                                                className="default-select wide form-control"
                                                id={field.name}
                                                style={{ background: field.disable ? '#eeeeee' : "" }}
                                                {...formik.getFieldProps(field.name)}
                                                disabled={field.disable}
                                            >
                                                <option value="" selected disable={field.disable}>
                                                    Please Select {field.label}
                                                </option>
                                                {field.options.map((option) => (
                                                    <option key={option.value} value={option.value}  >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {formik.touched[field.name] && formik.errors[field.name] &&
                                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                        </div>
                                    </div>
                                </div>
                            </> :
                                field.type === "checkbox" ? <>
                                    {field.options && field.options.length > 0 ? <>
                                        {field.options && field.options.map((option, index) => (
                                            <>
                                                <div className={`col-lg-${field.col_size}`} key={option.id}>
                                                    <div className="row d-flex">
                                                        <div className={`col-lg-${field.col_size}`}>
                                                            <div className="form-check custom-checkbox mb-3">
                                                                <input type={field.type} className="form-check-input" id={option.label}   {...formik.getFieldProps(option.name)}
                                                                />
                                                                <label className="form-check-label" for={option.label} >{option.label}</label>
                                                            </div>
                                                            {formik.touched[field.name] && formik.errors[field.name] &&
                                                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    </> :
                                        <>
                                            <div className={`col-lg-${field.col_size}`} >
                                                <div className="row d-flex">
                                                    <div
                                                    //  className={`col-lg-${field.col_size}`}
                                                    >
                                                        <div className="form-check custom-checkbox mb-3">
                                                            <input type={field.type} className="form-check-input" id={field.label}   {...formik.getFieldProps(field.name)}
                                                                checked={field.check_box_true}
                                                            />
                                                            <label className="form-check-label" for={field.label} >{field.label}</label>
                                                        </div>
                                                        {formik.touched[field.name] && formik.errors[field.name] &&
                                                            <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }


                                </> :
                                    field.type === "radio" ? <>

                                        <label
                                            className={`col-lg-${field.label_size} col-form-label fw-bold text-decoration-underline`}
                                            htmlFor={field.parent_label}

                                        >
                                            {field.parent_label}
                                        </label>

                                        <div className={`d-flex`}>
                                            <div className={`col-lg-${field.col_size} form-check custom-checkbox my-3`} >
                                                <input type={field.type} name={field.name} value={field.value1} className="form-check-input" id={field.title1}
                                                    {...formik.getFieldProps(field.name)}
                                                />
                                                <label className={`col-lg-${field.label_size} col-form-label mx-2`} for={field.title1}>{field.title1}</label>
                                            </div>
                                            <div className={`col-lg-${field.col_size} form-check custom-checkbox my-3`}>
                                                <input type={field.type} name={field.name} value={field.value2} className="form-check-input" id={field.title2}
                                                    {...formik.getFieldProps(field.name)}
                                                />
                                                <label className={`col-lg-${field.label_size} col-form-label  mx-2`} for={field.name}>{field.title2}</label>
                                            </div>

                                        </div>



                                    </> :
                                        field.type === "password" ? <>
                                            <div className={`col-lg-${field.col_size}`}>
                                                <div className="mb-3 row">
                                                    <label
                                                        className={`col-lg-${field.label_size}`}
                                                        htmlFor={field.name}
                                                    >
                                                        {field.label}
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            id={field.name}
                                                            type={passwordVisible[field.name] ? 'text' : field.type}
                                                            placeholder={field.label}
                                                            {...formik.getFieldProps(field.name)}
                                                            className={`form-control`}
                                                            autoComplete="off"
                                                        />
                                                        <i className={`fa-solid ${passwordVisible[field.name] ? 'fa-eye-slash' : 'fa-eye'}`}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '1.5px',
                                                                right: '20px',
                                                                padding: '12.4px 6.6px',
                                                                borderRadius: '3px'
                                                            }}
                                                            onClick={() => setPasswordVisible((prevState) => ({
                                                                ...prevState,
                                                                [field.name]: !prevState[field.name],
                                                            }))}
                                                        ></i>
                                                        {formik.touched[field.name] && formik.errors[field.name] && (
                                                            <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        </> :
                                            field.type === "date" ? <>
                                                <div className="col-lg-3">

                                                    <div className="row d-flex">
                                                        <div className="col-lg-12 ">
                                                            <div className="form-check custom-checkbox mb-3">
                                                                <label className="col-lg-6 " for={field.name}>{field.label}</label>
                                                                <input type={field.type} name={field.name} className="form-control" id={field.name}
                                                                    {...formik.getFieldProps(field.name)}
                                                                    readOnly={field.disable}

                                                                />
                                                            </div>
                                                            {formik.touched[field.name] && formik.errors[field.name] &&
                                                                <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </> :
                                                field.type === "email" ? <>
                                                    <div className={`col-lg-${field.col_size}`}>
                                                        <div className="mb-3 row flex-column">
                                                            <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                {field.label}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <div>
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    style={{ background: field.disable ? '#eeeeee' : "" }}
                                                                    id={field.name}
                                                                    placeholder={`Enter ${field.label}`}
                                                                    {...formik.getFieldProps(field.name)}
                                                                    defaultValue=""
                                                                    readOnly={field.disable}
                                                                    autoComplete="new-email"
                                                                />
                                                                <div className="invalid-feedback">
                                                                    Please enter {field.label}
                                                                </div>
                                                                {formik.touched[field.name] && formik.errors[field.name] && <div style={{ color: 'red' }}>{formik.errors[field.name]}</div>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </> :
                                                    field.type === "text" ? <>
                                                        <div className={`col-lg-${field.col_size}`}>
                                                            <div className="mb-3 row flex-column">
                                                                <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                    {field.label}
                                                                    <span className="text-danger">*</span>
                                                                </label>
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        style={{ background: field.disable ? '#eeeeee' : "" }}
                                                                        id={field.name}
                                                                        placeholder={`Enter ${field.label}`}
                                                                        {...formik.getFieldProps(field.name)}

                                                                        defaultValue=""
                                                                        readOnly={field.disable}
                                                                        autoComplete="new-email"
                                                                    />
                                                                    <div className="invalid-feedback">
                                                                        Please enter {field.label}
                                                                    </div>
                                                                    {formik.touched[field.name] && formik.errors[field.name] && <div style={{ color: 'red' }}>{formik.errors[field.name]}
                                                                    </div>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </> :
                                                        field.type === "number" ? <>
                                                            <div className={`col-lg-${field.col_size}`}>
                                                                <div className="mb-3 row flex-column">
                                                                    <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                        {field.label}
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                    <div>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            style={{ background: field.disable ? '#eeeeee' : "" }}
                                                                            id={field.name}
                                                                            placeholder={`Enter ${field.label}`}
                                                                            {...formik.getFieldProps(field.name)}

                                                                            defaultValue=""
                                                                            readOnly={field.disable}
                                                                            autoComplete="new-email"
                                                                        />
                                                                        <div className="invalid-feedback">
                                                                            Please enter {field.label}
                                                                        </div>
                                                                        {formik.touched[field.name] && formik.errors[field.name] && <div style={{ color: 'red' }}>{formik.errors[field.name]}
                                                                        </div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </> :
                                                            field.type === "text1" ?
                                                                <>
                                                                    <div className={`col-lg-${field.col_size}`}>
                                                                        <div className="mb-3 row flex-column">
                                                                            <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                                {field.label}
                                                                                <span className="text-danger">*</span>
                                                                            </label>
                                                                            <div className='position-relative'>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    style={{ background: field.disable ? '#eeeeee' : "" }}
                                                                                    id={field.name}
                                                                                    value={selectSearchItem}
                                                                                    placeholder={`Enter ${field.label}`}
                                                                                    {...formik.getFieldProps(field.name)}

                                                                                    defaultValue=""
                                                                                    readOnly={field.disable}
                                                                                    autoComplete="new-email"
                                                                                />

                                                                                {
                                                                                    field.filteredCompanies.length > 0 && !selectSearchItem ?
                                                                                        <div className='dropdown-list'  >
                                                                                            {field.filteredCompanies && field.filteredCompanies.map((company, index) => (
                                                                                                <div key={index} onClick={() => setSelectSearchItem(company.title)}>

                                                                                                    {console.log("company", company)}
                                                                                                    {company.title}
                                                                                                </div>

                                                                                            ))}
                                                                                        </div> : ""

                                                                                }

                                                                                <div className="invalid-feedback">
                                                                                    Please enter {field.label}
                                                                                </div>
                                                                                {formik.touched[field.name] && formik.errors[field.name] && <div style={{ color: 'red' }}>{formik.errors[field.name]}
                                                                                </div>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                field.type === "text2" ?
                                                                    <>
                                                                        <div className={`col-lg-${field.col_size}`}>
                                                                            <div className="mb-3 row flex-column">
                                                                                <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                                    {field.label}
                                                                                    <span className="text-danger">*</span>
                                                                                </label>
                                                                                <div className='position-relative'>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        style={{ background: field.disable ? '#eeeeee' : "", cursor: "pointer" }}
                                                                                        id={field.name}
                                                                                        value={selectSearchItem}
                                                                                        placeholder={`Enter ${field.label}`}
                                                                                        {...formik.getFieldProps(field.name)}


                                                                                        defaultValue=""
                                                                                        readOnly={field.disable}
                                                                                        autoComplete="new-email"
                                                                                    />

                                                                                    {
                                                                                        field.filteredCompanies.length > 0 && !selectSearchItem ?
                                                                                            <div className='dropdown-list'  >
                                                                                                {field.filteredCompanies && field.filteredCompanies.map((company, index) => (
                                                                                                    <div key={index} onClick={() => setSelectSearchItem(company.title)}
                                                                                                        style={{ cursor: "pointer", padding: "8px 0" }}
                                                                                                    >


                                                                                                        {company.title}
                                                                                                    </div>

                                                                                                ))}
                                                                                            </div> : ""

                                                                                    }

                                                                                    <div className="invalid-feedback">
                                                                                        Please enter {field.label}
                                                                                    </div>
                                                                                    {formik.touched[field.name] && formik.errors[field.name] && <div style={{ color: 'red' }}>{formik.errors[field.name]}
                                                                                    </div>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    field.type === "heading2" ?
                                                                        <>
                                                                            <div className={`col-lg-${field.col_size}`}>
                                                                                <div className="mb-3  mt-4 row flex-column card">
                                                                                    <div className='card-body'>
                                                                                        <input type="text"/>
                                                                                        <input type="text"/>


                                                                                    </div>
                                                                                    
                                                                                    <div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <div className={`col-lg-${field.col_size}`}>
                                                                                <div className="mb-3  mt-4 row flex-column">
                                                                                    <label className={`col-lg-${field.label_size}`} htmlFor={field.name}>
                                                                                        {field.label}

                                                                                    </label>
                                                                                    <div>


                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>


                            }
                        </>
                    ))}

                </div >
                {additional_field}


                {
                    btn_name == "Next" ?
                        <div className="modal-footer d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondry border m-2"
                                onClick={closeBtn}
                            >
                                Back
                            </button>

                            <button className={`btn btn-info text-white blue-btn`} type="submit" disabled={formik.isSubmitting}>
                                {btn_name}
                            </button>
                        </div>

                        :

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary m-2"
                                onClick={closeBtn}
                            >
                                Cancel
                            </button>

                            <button className={`btn btn-primary ${location.pathname === 'resetpassword' ? 'col-md-11' : ''}`} type="submit" disabled={formik.isSubmitting}>
                                {btn_name}
                            </button>
                        </div>
                }
            </div>

        </form >

    );
};

export default ReusableForm;
