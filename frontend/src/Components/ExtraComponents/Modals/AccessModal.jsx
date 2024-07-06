import React from 'react';

const CommonModal = ({ modalId, title, businessOpen, colDetails, onClose, onSave }) => {
    const renderPermissions = (permissions) => {
        return permissions.map((perm, index) => (
            <div key={index} className="mb-3">
                <div className="form-check form-check-outline form-check-dark">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`formCheck${index}`}
                        defaultChecked={perm.checked}
                    />
                    <label
                        className="form-check-label new_checkbox"
                        htmlFor={`formCheck${index}`}
                    >
                        {perm.label}
                    </label>
                </div>
            </div>
        ));
    };

    const sections = [
        { name: 'Customer', permissions: [{ label: 'Can Access', checked: true }, { label: 'Can Update', checked: true }, { label: 'Can Delete', checked: true }, { label: 'Can View', checked: false }] },
        { name: 'Status', permissions: [{ label: 'Can Insert', checked: true }, { label: 'Can Update', checked: true }, { label: 'Can Delete', checked: true }, { label: 'Can View', checked: false }] },
        { name: 'Staff', permissions: [{ label: 'Can Insert', checked: true }, { label: 'Can Update', checked: true }, { label: 'Can Delete', checked: true }, { label: 'Can View', checked: false }] },
        { name: 'Client', permissions: [{ label: 'Can Insert', checked: true }, { label: 'Can Update', checked: false }, { label: 'Can Delete', checked: true }, { label: 'Can View', checked: false }] },
        { name: 'Job', permissions: [{ label: 'Can Insert', checked: true }, { label: 'Can Update', checked: false }, { label: 'Can Delete', checked: false }, { label: 'Can View', checked: false }] },
        { name: 'Setting', permissions: [{ label: 'Can Insert', checked: true }, { label: 'Can Update', checked: true }, { label: 'Can Delete', checked: true }, { label: 'Can View', checked: false }] },
    ];

    return (
        <div className={`modal`} style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
                <div className="modal-content" style={{ padding: '20px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${modalId}Label`}>Set Access</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                    </div>
                    <div className="modal-body row">
                    
                            {sections.map((section, index) => (
                                
                                <div className="col-md-6" key={index} style={{ marginBottom: '20px' }}>
                                    <h4 className="card-title mb-3 flex-grow-1" style={{ marginBottom: '20px' }}>
                                        {section.name}
                                    </h4>
                                    <div className="row">
                                        {renderPermissions(section.permissions)}
                                    </div>
                                </div>

                            ))}
                  
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn btn-info text-white" style={{ borderRadius: '4px' }} onClick={onSave}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonModal;
