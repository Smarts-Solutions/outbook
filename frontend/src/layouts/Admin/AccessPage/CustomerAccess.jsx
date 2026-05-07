import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PersonRole, CustomerContactPersonAccess } from "../../../ReduxStore/Slice/Settings/settingSlice";
import Swal from "sweetalert2";
import { Save } from "lucide-react";

const CustomerAccess = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [checkboxState, setCheckboxState] = useState([]);
  const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
  const [accessData, setAccessData] = useState({ loading: true, data: [], role_id: null });

  const roleData = async () => {
    try {
      const response = await dispatch(
        PersonRole({ req: { action: "getAll" }, authToken: token }),
      ).unwrap();
      if (response.status) {
        setRoleDataAll({ loading: false, data: response.data });
      } else {
        setRoleDataAll({ loading: false, data: [] });
      }
    } catch (error) {
      setRoleDataAll({ loading: false, data: [] });
    }
  };

  const CheckboxItem = ({ id, label, role_id, permission_name }) => {
    const handleChange = (event) => {
      const checked = event.target.checked;

      setCheckboxState((prevState) => {
        let updatedState = prevState.filter(
          (item) => !(item.permission_id == id && item.role_id == role_id),
        );
        updatedState.push({
          permission_id: id,
          role_id: role_id,
          is_assigned: checked,
          permission_name,
        });
        return updatedState;
      });
    };

    const isChecked = checkboxState.some(
      (item) =>
        item.permission_id == id &&
        item.role_id == role_id &&
        item.is_assigned,
    );

    return (
      <div className="mb-3">
        <div className="form-check form-check-outline form-check-dark">
          <input
            className="form-check-input new-checkbox me-2"
            type="checkbox"
            id={`perm-${id}-${role_id}`}
            checked={isChecked}
            onChange={(e) => handleChange(e)}
          />
          <label className="form-check-label new_checkbox mb-0" htmlFor={`perm-${id}-${role_id}`}>
            {label && label.replace(/_/g, " ")}
          </label>
        </div>
      </div>
    );
  };

  const OpenAccourdian = async (val) => {
    try {
      const req = { action: "get", role_id: val.id };
      const data = { req, authToken: token };

      const response = await dispatch(CustomerContactPersonAccess(data)).unwrap();
      if (response.status) {
        setCheckboxState((prevState) => {
            // Remove existing permissions for this role to avoid duplicates
            let updatedState = prevState.filter(item => item.role_id !== val.id);
            
            response.data.forEach((item) => {
                item.items.forEach((perm) => {
                    if (perm.is_assigned === 1) {
                        updatedState.push({
                            permission_id: perm.id,
                            role_id: val.id,
                            is_assigned: true,
                            permission_name: item.permission_name,
                        });
                    }
                });
            });
            return updatedState;
        });

        setAccessData({ loading: false, data: response.data, role_id: val.id });
      } else {
        setAccessData({ loading: false, data: [], role_id: val.id });
      }
    } catch (error) {
      setAccessData({ loading: false, data: [], role_id: val.id });
    }
  };

  const AccordionItem = ({ section, role_id }) => {
    const sectionPermissions = section.items.map(item => item.id);
    const selectedSectionPermissions = checkboxState.filter(
      (item) => item.role_id == role_id && sectionPermissions.some(pid => pid == item.permission_id) && item.is_assigned
    );

    const isAllSelected = sectionPermissions.length > 0 && selectedSectionPermissions.length === sectionPermissions.length;

    const handleSelectAll = (event) => {
      const checked = event.target.checked;
      setCheckboxState((prevState) => {
        let updatedState = prevState.filter(
          (item) => !(item.role_id == role_id && sectionPermissions.some(pid => pid == item.permission_id))
        );

        // Always push records for all items in the section with the current toggle status
        section.items.forEach((item) => {
          updatedState.push({
            permission_id: item.id,
            role_id: role_id,
            is_assigned: checked,
            permission_name: section.permission_name,
          });
        });
        return updatedState;
      });
    };

    return (
      <div>
        <h4
          className="card-title fs-16 mb-2 flex-grow-1"
          style={{ textTransform: 'capitalize' }}
        >
          {section.permission_name && section.permission_name.replace(/_/g, " ")}
        </h4>
        <div className="mb-3 border-bottom pb-2">
          <div className="form-check form-check-outline form-check-dark">
            <input
              className="form-check-input new-checkbox me-2"
              type="checkbox"
              id={`select-all-${section.permission_name}-${role_id}`}
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <label 
              className="form-check-label new_checkbox mb-0" 
              htmlFor={`select-all-${section.permission_name}-${role_id}`}
              style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff' }}
            >
              Select All
            </label>
          </div>
        </div>

        <div className="row">
          {section.items.map((item) => (
            <CheckboxItem
              key={item.id}
              id={item.id}
              label={item.type}
              permission_name={section.permission_name}
              role_id={role_id}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleSaveChanges = async () => {
    try {
      const response = await dispatch(
        CustomerContactPersonAccess({
          req: {
            action: "update",
            permissions: checkboxState,
          },
          authToken: token,
        }),
      ).unwrap();

      if (response.status) {
        Swal.fire({
          title: "Success!",
          text: "Permissions updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,
        }).then(() => {
          setTimeout(() => {
             window.location.reload();
          }, 1000);
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update permissions. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          timer: 1000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating permissions. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    roleData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="tab-title">
          <h3 className="mt-0">Customer Contact Person Access</h3>
        </div>
      </div>
      <div className="report-data mt-4">
        <div className="tab-title">
          <h3>Set Role Access</h3>
        </div>
        <div className="mt-3">
          <div className="accordion" id="customer-access-accordion">
            {roleDataAll.data &&
              roleDataAll.data.map((val, index) => (
                <div className="accordion-item mt-2" key={index}>
                  <h2
                    className="accordion-header"
                    id={`heading${index}`}
                    onClick={(e) => OpenAccourdian(val)}
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {val.name}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#customer-access-accordion"
                  >
                    <div className="accordion-body">
                      <div className="d-flex justify-content-end mb-3 border-bottom pb-2">
                        <div className="form-check form-check-outline form-check-dark">
                          <input
                            className="form-check-input new-checkbox"
                            type="checkbox"
                            id={`global-select-all-${val.id}`}
                            checked={
                                accessData.role_id == val.id &&
                                accessData.data.length > 0 && 
                                accessData.data.every(section => 
                                    section.items.every(item => 
                                        checkboxState.some(p => p.role_id == val.id && p.permission_id == item.id && p.is_assigned)
                                    )
                                )
                            }
                            onChange={(e) => {
                                const checked = e.target.checked;
                                if (accessData.role_id != val.id) return;

                                setCheckboxState(prevState => {
                                    // Clear existing records for this role
                                    let updatedState = prevState.filter(item => item.role_id != val.id);
                                    
                                    // Push all permissions for this role with the toggle status
                                    accessData.data.forEach(section => {
                                        section.items.forEach(item => {
                                            updatedState.push({
                                                permission_id: item.id,
                                                role_id: val.id,
                                                is_assigned: checked,
                                                permission_name: section.permission_name,
                                            });
                                        });
                                    });
                                    return updatedState;
                                });
                            }}
                          />
                          <label 
                            className="form-check-label new_checkbox mb-0 ms-2 fw-bold text-primary" 
                            htmlFor={`global-select-all-${val.id}`}
                          >
                            Select All Permissions for {val.name}
                          </label>
                        </div>
                      </div>
                      <div className="row">
                        {accessData &&
                          accessData.data.map((section, idx) => (
                            <div key={idx} className="col-lg-2 col-md-6">
                              <AccordionItem
                                section={section}
                                role_id={val.id}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-success mt-3"
            onClick={handleSaveChanges}
          >
            <Save size={16} /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccess;
