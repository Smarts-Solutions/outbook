import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { Role } from '../../../ReduxStore/Slice/Settings/settingSlice';
import { GetAccess } from '../../../ReduxStore/Slice/Access/AccessSlice';
import Swal from 'sweetalert2';

const Access = () => {

    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [checkboxState, setCheckboxState] = useState([]);
    const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
    const [accessData, setAccessData] = useState({ loading: true, data: [] });
    const [modalOpen, setOpenModalOpen] = useState(false);



    const roleData = async () => {
        try {
            const response = await dispatch(Role({ req: { "action": "staffRole" }, authToken: token })).unwrap();
            if (response.status) {
                setRoleDataAll({ loading: false, data: response.data });
            } else {
                setRoleDataAll({ loading: false, data: [] });
            }
        } catch (error) {
          
            setRoleDataAll({ loading: false, data: [] });
        }
    };

    const CheckboxItem = ({ id, label, role_id }) => {

        const handleChange = (event) => {
            const checked = event.target.checked;
            setCheckboxState(prevState => [...prevState.filter(item => !(item.permission_id === id && item.role_id === role_id)), { permission_id: id, role_id: role_id, is_assigned: checked }]);
        };

        const isChecked = checkboxState.some(item => item.permission_id === id && item.role_id === role_id && item.is_assigned);

        return (
            <div className="mb-3">
                <div className="form-check form-check-outline form-check-dark">
                    <input
                        className="form-check-input new-checkbox me-2"
                        type="checkbox"
                        id={id}
                        checked={isChecked}
                        onChange={(e) => handleChange(e)}
                    />
                    <label className="form-check-label new_checkbox mb-0" htmlFor={id}>
                        {label}
                    </label>
                </div>
            </div>
        );
    };


    const OpenAccourdian = async (val) => {
        try {
            const req = { "action": "get", "role_id": val.id };
            const data = { req, authToken: token };
            console.log("data", data);
            const response = await dispatch(GetAccess(data)).unwrap();
            if (response.status) {
                console.log("response", response.data);
                const assignedItems = response.data.filter((item) => {
                    item.items.forEach((data) => {
                        if (data.is_assigned === 1) {
                            setCheckboxState(prevState => [...prevState, { permission_id: data.id, role_id: val.id, is_assigned: data.is_assigned === 1 }]);
                        }
                    });
                });


                setAccessData({ loading: false, data: response.data });
            } else {
                setAccessData({ loading: false, data: [] });
            }
        } catch (error) {
           
            setAccessData({ loading: false, data: [] });
        }
    }

    const AccordionItem = ({ section, TradingName, role_id }) => {  
        return (
            <div>
                <h4 className="card-title fs-16  mb-3 flex-grow-1" style={{ marginBottom: '20px !important' }}>
                    {section.permission_name}
                </h4>

               
                <div className="row ">
                    {section.items.map((item, id) => (
                        <CheckboxItem
                            key={item.id}
                            id={item.id}
                            label={item.type}
                            title={section.title}
                            TradingName={TradingName}
                            role_id={role_id}
                            
                        />
                    ))}
                </div>
            </div>
        );
    };



    const handleSaveChanges = async () => {
        try {

            const response = await dispatch(GetAccess({
                req: {
                    action: "update",
                    permissions: checkboxState
                },
                authToken: token
            })).unwrap();

            if (response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Permissions updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 1000
                }).then(() => {
                    setTimeout(() => {
                        setOpenModalOpen(false);
                        window.location.reload();
                    }, 1000);
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update permissions. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    timer: 1000
                }).then(() => {
                    setTimeout(() => {
                        setOpenModalOpen(false);

                    }, 1000);
                });
            }
        } catch (error) {
          
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating permissions. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    useEffect(() => {
        roleData()
    }, []);
    
  
    console.log("roleDataAll" , accessData.data);

    return (

        <div className='container-fluid'>
            <div className='content-title'>
                <div className='tab-title'>
                            <h3 className='mt-0'>Access</h3>
                        </div>
                </div> 
                <div className='report-data mt-4'>
                <div className="tab-title"><h3>Set Default Access</h3></div> 
                    <div className='mt-3'>
                    <div className="accordion" id="default-accordion-example">
                                    {roleDataAll.data && roleDataAll.data.map((val, index) => (
                                        <div className="accordion-item mt-2" key={index}>
                                            <h2 className="accordion-header" id={`heading${index}`} onClick={(e) => OpenAccourdian(val)} >
                                                <button
                                                    className=" accordion-button collapsed"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${index}`}
                                                    aria-expanded="true"
                                                    aria-controls={`collapse${index}`}>
                                                    {val.role_name}
                                                </button>
                                            </h2>
                                            <div
                                                id={`collapse${index}`}
                                                className="accordion-collapse collapse"
                                                aria-labelledby={`heading${index}`}
                                                data-bs-parent="#default-accordion-example">
                                                <div className="accordion-body">
                                                    <div className="row">
                                                        {accessData && accessData.data.map((section, index) => (
                                                            <div key={index} className="col-lg-2">
                                                                <AccordionItem section={section} TradingName={val.role_name} role_id={val.id} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                        {/* <Datatable filter={true} columns={[
                            { name: 'Role Name', selector: row => row.role_name, sortable: true },
                        ]} data={roleDataAll.data} /> */}
                    </div>
                    <div className="modal-footer"> 
                       <button type="button" className="btn btn-outline-success mt-3" onClick={handleSaveChanges}>    <i className="far fa-save pe-1" /> Save changes</button>
                    </div>
                </div>


            
        </div>

    );
};

export default Access;
