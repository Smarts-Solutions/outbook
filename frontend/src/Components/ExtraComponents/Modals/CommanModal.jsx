import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import { Save, X } from 'lucide-react';

const Modal_Component = ({ 
    isOpen, 
    handleClose, 
    setIsOpen,
    Submit_Function, 
    Submit_Function_2, 
    disabled_submit, 
    Submit_Cancel_Function, 
    cancel_btn, 
    title, 
    btn_name, 
    btn_2, 
    btn_name_2, 
    backdrop, 
    size,
    hideBtn, 
    hideFooter,
    ...rest 
}) => {
    const onClose = handleClose || setIsOpen || Submit_Cancel_Function;
    const showFooter = !hideFooter && (cancel_btn || hideBtn !== true || btn_2 === true);

    return (
        <div>
            <Modal show={isOpen} centered size={size} backdrop={backdrop} onHide={onClose}>
                <Modal.Header closeButton className={`${title === "Verify OTP" ? 'border-0 ' : ""}`}  >
                    <Modal.Title className='mb-0 ' >{title}</Modal.Title >
                </Modal.Header>
                <Modal.Body>{rest.children}</Modal.Body>
                {showFooter && (
                    <Modal.Footer className={`${title === "Verify OTP" ? 'border-0' : ""}`}>
                        {cancel_btn ?
                            <button type="button" className="btn btn-secondary " onClick={() => Submit_Cancel_Function ? Submit_Cancel_Function() : (onClose && onClose())}>
                              < X size={16}/> Cancel
                            </button> : ""} 

                        {hideBtn === true ? "" :
                            <Button type="submit" className="btn btn-outline-success " disabled={disabled_submit} onClick={()=> Submit_Function && Submit_Function()}>
                             <Save size={16}/>  {btn_name} 
                            </Button>}

                        {btn_2 === true ?
                            <Button type="submit" className="btn btn-outline-success " disabled={disabled_submit} onClick={() => Submit_Function_2 && Submit_Function_2()}>
                                <Save size={16}/>  {btn_name_2} 
                            </Button> : ""
                        }
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    )
}

export default Modal_Component
