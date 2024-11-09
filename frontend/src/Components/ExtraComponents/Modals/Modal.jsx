import React from "react";

const CommonModal = ({
  modalId,
  title,
  fields,
  onClose,
  onSave,
  onChange,
  buttonName,
}) => {
  const columnClass = fields && fields.length === 1 ? "col-md-12" : "col-md-12";


  console.log("fields", fields);

  return (
    <div
      className={`modal ${modalId}`}
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body pb-4">
            {fields.map((field, index) => (
              <div className="row">
              <div
                className={`data-table-extensions-filter ${columnClass}`}
                key={index}
              >
                <label htmlFor={field.name} className="icon mb-1 mt-2">
                  {field.label}
                </label>
                {field.type === "text" ? (
                  <>
                    <input
                      type="text"
                      name={field.name}
                      className="filter-text form-control"
                      placeholder={field.placeholder}
                      value={field.value}
                      autoFocus={index === 0}
                      onChange={(e) => onChange(e, index)}
                    />
                  </>
                ) : field.type === "hourminute" ? (
                  <>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Hours"
                        name="hours"
                        autoFocus={index === 0}
                        defaultValue={field.value?.split(":")[0] || "00"}
                        onChange={(e) => onChange(e, index)}
                      />

                      <input
                        type="number"
                        className="form-control"
                        placeholder="Minutes"
                        name="minutes"
                        min="0"
                        max="59"
                        autoFocus={index === 0}

                        defaultValue={field.value?.split(":")[1] || "00"}
                        onChange={(e) => onChange(e, index)}
                      />
                    </div>
                  </>
                ) : field.type === "hourminute1" ? (
                  <>
                    <div className="input-group">
                      <div className="col-md-6">
                      <div className="hours-div">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Hours"
                          name="hours"
                          autoFocus={index === 0}
                          defaultValue={field.value?.split(":")[0] || "00"}
                          onChange={(e) => onChange(e, index)}
                        />
                        <span
                          className="input-group-text"
                          id="basic-addon2"
                        >
                          H
                        </span>
                      </div>
                      </div>
                      <div className="col-md-6">
                      <div className="hours-div">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Minutes"
                          name="minutes"
                          min="0"
                          max="59"
                          autoFocus={index === 0}
                          defaultValue={field.value?.split(":")[1] || "00"}
                          onChange={(e) => onChange(e, index)}
                        />
                        <span
                          className="input-group-text"
                          id="basic-addon2"
                        >
                          M
                        </span>
                      </div>
                      </div>
                     
                    </div>
                  </>
                )
                  : field.type === "email" ? (
                    <input
                      type="text"
                      name={field.name}
                      className="filter-text form-control"
                      placeholder={field.placeholder}
                      value={field.value}
                      autoFocus={index === 0}

                      onChange={(e) => onChange(e, index)}
                    />
                  ) : field.type === "password" ? (
                    <input
                      type="text"
                      name={field.name}
                      className="filter-text form-control"
                      placeholder={field.placeholder}
                      value={field.value}
                      autoFocus={index === 0}

                      onChange={(e) => onChange(e, index)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      name={field.name}
                      className="filter-select form-select"
                      value={field.value}
                      autoFocus={index === 0}

                      onChange={(e) => onChange(e, index)}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
              </div>
              </div>
            ))}
          </div>
          <div className="modal-footer ">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className="fa fa-times pe-1 "></i>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={onSave}
            >
              {buttonName}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
