import React, { useState, useEffect } from 'react';
import Datatable from '../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { Role } from '../../ReduxStore/Slice/Settings/settingSlice';
import { GetAccess } from '../../ReduxStore/Slice/Access/AccessSlice';

const Access = () => {

    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [checkboxState, setCheckboxState] = useState([]);
    const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
    const [accessData, setAccessData] = useState({ loading: true, data: [] });



    const roleData = async () => {
        try {
            const response = await dispatch(Role({ req: { "action": "staffRole" }, authToken: token })).unwrap();
            if (response.status) {
                setRoleDataAll({ loading: false, data: response.data });
            } else {
                setRoleDataAll({ loading: false, data: [] });
            }
        } catch (error) {
            console.error("Error fetching role data:", error);
            setRoleDataAll({ loading: false, data: [] });
        }
    };

    const CheckboxItem = ({ id, label, roleId }) => {

        const handleChange = (event) => {
            const checked = event.target.checked;
            setCheckboxState(prevState => [...prevState.filter(item => !(item.id === id && item.roleId === roleId)), { id: id, roleId: roleId, is_assigned: checked }]);
        };

        const isChecked = checkboxState.some(item => item.id === id && item.roleId === roleId && item.is_assigned);

        return (
            <div className="mb-3">
                <div className="form-check form-check-outline form-check-dark">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={id}
                        checked={isChecked}
                        onChange={(e) => handleChange(e)}
                    />
                    <label className="form-check-label new_checkbox" htmlFor={id}>
                        {label}
                    </label>
                </div>
            </div>
        );
    };


    const OpenAccourdian = async (val) => {

        try {
            const response = await dispatch(GetAccess({ req: { "role_id": val.id }, authToken: token })).unwrap();
            if (response.status) {
                const assignedItems = response.data.filter((item) => {
                    item.items.forEach((data) => {
                        if (data.is_assigned === 1) {
                            setCheckboxState(prevState => [...prevState, { id: data.id, roleId: val.id, is_assigned: data.is_assigned === 1 }]);
                        }
                    });
                });


                setAccessData({ loading: false, data: response.data });
            } else {
                setAccessData({ loading: false, data: [] });
            }
        } catch (error) {
            console.error("Error fetching role data:", error);
            setAccessData({ loading: false, data: [] });
        }
    }

    const AccordionItem = ({ section, TradingName, roleId }) => {

        return (
            <div>
                <h4 className="card-title mb-3 flex-grow-1" style={{ marginBottom: '20px !important' }}>
                    {section.permission_name}
                </h4>
                <div className="row">
                    {section.items.map((item, id) => (
                        <CheckboxItem
                            key={item.id}
                            id={item.id}
                            label={item.type}
                            title={section.title}
                            TradingName={TradingName}
                            roleId={roleId}
                        />
                    ))}
                </div>
            </div>
        );
    };



    const handleSaveChanges = () => {
        console.log('Checkbox state:', checkboxState);
    };


    useEffect(() => {
        roleData()
    }, []);

    return (
        <div>
            <div className='container-fluid'>
                <div className='report-data mt-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='tab-title'>
                            <h3 className='mt-0'>Access</h3>
                        </div>
                        <div>
                            <button
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                className='btn btn-info text-white float-end'>
                                <i className="fa fa-plus" /> Set Default Access
                            </button>
                        </div>
                    </div>
                    <div className='datatable-wrapper'>
                        <Datatable filter={true} columns={[
                            { name: 'Role Name', selector: row => row.role_name, sortable: true },
                        ]} data={roleDataAll.data} />
                    </div>
                </div>

                {/* Modal */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Set Default Access</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="accordion" id="default-accordion-example">
                                    {roleDataAll.data && roleDataAll.data.map((val, index) => (
                                        <div className="accordion-item mt-2" key={index}>
                                            <h2 className="accordion-header" id={`heading${index}`} onClick={(e) => OpenAccourdian(val)} >
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#collapse${index}`}
                                                    aria-expanded="false"
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
                                                            <div key={index} className="col-lg-6">
                                                                <AccordionItem section={section} TradingName={val.role_name} roleId={val.id} />
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Access;
