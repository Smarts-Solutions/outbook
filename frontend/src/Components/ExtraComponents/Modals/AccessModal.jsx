import React from 'react';

const CommonModal = ({ modalId, title, fields, onClose, onSave, onChange, buttonName }) => {


    return (
        <div className={`modal`} style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${modalId}Label`}>{title}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                    </div>
                    <div className="modal-body row">
                        <div>
                            <div>
                                <h4 style={{ textAlign: "center" }}>Set Access</h4>
                            </div>
                            <div>
                                <div>
                                    <h4>Customer</h4>
                                    <div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Status</h4>
                                    <div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Staff</h4>
                                    <div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" defaultChecked="" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Client</h4>
                                    <div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Job</h4>
                                    <div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4>Setting</h4>
                                    <div>
                                        <div></div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Insert</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Update</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can Delete</label>
                                        </div>
                                        <div>
                                            <input type="checkbox" id="formCheck1" />
                                            <label htmlFor="formCheck1">Can view</label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={onClose}>Close</button>
                                    <button>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-info text-white" style={{ borderRadius: '4px' }} onClick={onSave}>{buttonName}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonModal;
