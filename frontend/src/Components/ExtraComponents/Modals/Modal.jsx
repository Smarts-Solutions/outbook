import React from 'react';

const CommonModal = ({ modalId, title, fields, onClose, onSave, onChange, buttonName }) => {

  const columnClass = fields && fields.length === 1 ? 'col-12' : 'col-md-12';

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
          <div className="modal-body pb-4">
            {fields.map((field, index) => (
              <div className={`data-table-extensions-filter ${columnClass}`} key={index}>
                <label htmlFor={field.name} className="icon mb-1 mt-2">{field.label}</label>
                {field.type === 'text' ? (
                  <input
                    type="text"
                    name={field.name}
                    className="filter-text form-control"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => onChange(e, index)}
                  />
                ) : field.type === 'email' ? (
                  <input
                    type="text"
                    name={field.name}
                    className="filter-text form-control"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => onChange(e, index)}
                  />
                ) : field.type === 'password' ? (
                  <input
                    type="text"
                    name={field.name}
                    className="filter-text form-control"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => onChange(e, index)}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    className="filter-select form-select"
                    value={field.value}
                    onChange={(e) => onChange(e, index)}
                  >
                    {field.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}


          </div>
          <div className="modal-footer ">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className='fa fa-times pe-1 '></i>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
              
              onClick={onSave}
            >
              {/* <i className='far fa-save pe-1'></i> */}
              {buttonName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
