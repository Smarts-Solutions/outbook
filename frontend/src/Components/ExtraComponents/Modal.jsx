import React from 'react';

const CommonModal = ({ modalId, title, fields, onClose, onSave, onChange }) => {
  return (
    <div
      className={`modal ${modalId}`}
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            {fields && fields.map((field, index) => (
              <div className="data-table-extensions-filter" key={index}>
                <label htmlFor={field.name} className="icon mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  className="filter-text form-control"
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => onChange(e, index)}
                />
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-info text-white"
              style={{ borderRadius: '4px' }}
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
