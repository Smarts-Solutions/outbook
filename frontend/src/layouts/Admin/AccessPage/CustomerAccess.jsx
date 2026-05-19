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
  const [roleStructures, setRoleStructures] = useState({});
  const [loadingRoles, setLoadingRoles] = useState({});

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
    // If already loading or data already exists, don't fetch again
    if (loadingRoles[val.id] || roleStructures[val.id]) return;

    try {
      setLoadingRoles(prev => ({ ...prev, [val.id]: true }));
      const req = { action: "get", role_id: val.id };
      const data = { req, authToken: token };

      const response = await dispatch(CustomerContactPersonAccess(data)).unwrap();
      if (response.status) {
        // Filter out the entire 'customer' module so it's hidden from the UI
        const filteredData = response.data.filter(item => item.permission_name !== "customer");

        setRoleStructures(prev => ({ ...prev, [val.id]: filteredData }));
        
        setCheckboxState((prevState) => {
            // Only add permissions that are assigned on the server
            // We don't filter out previous state because we want to preserve other roles' changes
            let updatedState = [...prevState];
            
            filteredData.forEach((item) => {
                item.items.forEach((perm) => {
                    if (perm.is_assigned === 1) {
                        // Check if we already have this permission in state to avoid duplicates
                        const exists = updatedState.some(p => p.permission_id == perm.id && p.role_id == val.id);
                        if (!exists) {
                            updatedState.push({
                                permission_id: perm.id,
                                role_id: val.id,
                                is_assigned: true,
                                permission_name: item.permission_name,
                            });
                        }
                    }
                });
            });
            return updatedState;
        });
      }
    } catch (error) {
      console.error("Error fetching role access:", error);
    } finally {
      setLoadingRoles(prev => ({ ...prev, [val.id]: false }));
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
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these permission changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
            }).then(() => {
              // No reload needed
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to update permissions. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
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
      }
    });
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
                      {loadingRoles[val.id] ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : roleStructures[val.id] ? (
                        <>
                          <div className="d-flex justify-content-end mb-3 border-bottom pb-2">
                            <div className="form-check form-check-outline form-check-dark">
                              <input
                                className="form-check-input new-checkbox"
                                type="checkbox"
                                id={`global-select-all-${val.id}`}
                                checked={
                                    roleStructures[val.id].length > 0 && 
                                    roleStructures[val.id].every(section => 
                                        section.items.every(item => 
                                            checkboxState.some(p => p.role_id == val.id && p.permission_id == item.id && p.is_assigned)
                                        )
                                    )
                                }
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setCheckboxState(prevState => {
                                        let updatedState = prevState.filter(item => item.role_id != val.id);
                                        roleStructures[val.id].forEach(section => {
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
                                Select All Permissions
                              </label>
                            </div>
                          </div>
                          <div className="row">
                            {roleStructures[val.id]
                              ?.filter((section) => section.permission_name !== "report")
                              ?.map((section, idx) => (
                                <div key={idx} className="col-lg-2 col-md-6">
                                  <AccordionItem
                                    section={section}
                                    role_id={val.id}
                                  />
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          Click to load permissions
                        </div>
                      )}
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
