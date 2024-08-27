import React from 'react'
import { Modal, Button } from 'react-bootstrap';



const Modal_Component = ({ isOpen, handleClose, Submit_Function, Submit_Function_2, disabled_submit, Submit_Cancel_Function, cancel_btn, title, btn_name, btn_2, btn_name_2, backdrop, size,hideBtn, ...rest }) => {

    return (
        <div>
            <Modal show={isOpen} centered size={size} backdrop={backdrop} onHide={handleClose}>
                <Modal.Header closeButton className={`${title === "Verify OTP" ? 'border-0 ' : "bg-info"}`}  >
                    <Modal.Title className='mb-0 text-white' >{title}</Modal.Title >
                </Modal.Header>
                <Modal.Body>{rest.children}</Modal.Body>
                <Modal.Footer className={`${title === "Verify OTP" ? 'border-0' : ""}`}>

                    {cancel_btn ?
                        <button type="submit" className="btn btn-secondary " onClick={() => Submit_Cancel_Function()}>
                            Cancel
                        </button> : ""}


                    {hideBtn === true ? "" :
                        <Button type="submit" className="btn btn-info " disabled={disabled_submit} onClick={()=> Submit_Function()}>
                            {btn_name}
                        </Button>}



                    {btn_2 === true ?
                        <Button type="submit" className="btn btn-primary " disabled={disabled_submit} onClick={() => Submit_Function_2()}>
                            {btn_name_2}
                        </Button> : ""
                    }

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Modal_Component





{/* <div className={`modal`} style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
<div className="modal-dialog modal-dialog-centered">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="1">{title}</h5>
      <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
    </div>
    <div className="modal-body row">
      <Formik
        initialValues={{}} // Add your initial form values here if needed
        onSubmit={onSave} // Add your form submission logic here
      >
        <Form>
 
          {fields.map((field, index) => (
            <div key={index} className={columnClass}>
              <label htmlFor={field.name}>{field.label}</label>
              <Field
                type={field.type}
                name={field.name}
                className="form-control"
                onChange={onChange}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </Form>
      </Formik>
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="btn btn-info text-white" style={{ borderRadius: '4px' }}>
        {buttonName}
      </button>
    </div>
  </div>
</div>
</div> */}