import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { Pencil } from 'lucide-react';
import CommonModal from './Modals/CommanModal';

const TimesheetDatatable = () => {
    const [activeRowId, setActiveRowId] = useState(null);
    const [activeField, setActiveField] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState('');

    const [rows, setRows] = useState([
        {
            id: 1,
            taskType: 'External',
            customer: '',
            client: '',
            job: '',
            task: '',
            mon: '', mon_note: '',
            tue: '', tue_note: '',
            wed: '', wed_note: '',
            thu: '', thu_note: '',
            fri: '', fri_note: '',
            sat: '', sat_note: '',
            sun: '', sun_note: '',
            remark: '',
        }
    ]);

    const handleChange = (id, field, value) => {
        setRows(prev =>
            prev.map(row =>
                row.id === id
                    ? { ...row, [field]: value }
                    : row
            )
        );
    };

    const handleSaveNote = () => {
        if (activeRowId && activeField) {
            handleChange(activeRowId, `${activeField}_note`, modalText);
        }
        setIsModalOpen(false);
    };

    const timeToMinutes = value => {
        if (!value) return 0;

        const [hours, minutes] = value.split(':').map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };

    const minutesToTime = minutes => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const getRowTotal = row => {
        const total =
            timeToMinutes(row.mon) +
            timeToMinutes(row.tue) +
            timeToMinutes(row.wed) +
            timeToMinutes(row.thu) +
            timeToMinutes(row.fri) +
            timeToMinutes(row.sat) +
            timeToMinutes(row.sun);

        return minutesToTime(total);
    };

    const getDailyTotal = field => {
        const total = rows.reduce(
            (sum, row) => sum + timeToMinutes(row[field]),
            0
        );

        return minutesToTime(total);
    };

    const getGrandTotal = () => {
        const total = rows.reduce(
            (sum, row) => sum + timeToMinutes(getRowTotal(row)),
            0
        );

        return minutesToTime(total);
    };

    const handleDelete = id => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    const columns = [
        {
            name: 'S.No',
            selector: row => row.id,
            width: '70px',
        },

        {
            name: 'Task Type',
            width: '150px',
            cell: row =>
                row.isTotal ? null : (
                    <select
                        className="form-select form-select-sm"
                        value={row.taskType}
                        onChange={e =>
                            handleChange(
                                row.id,
                                'taskType',
                                e.target.value
                            )
                        }
                    >
                        <option value="">Task Type</option>
                        <option value="External">External</option>
                        <option value="Internal">Internal</option>
                    </select>
                ),
        },

        {
            name: 'Customer',
            width: '150px',
            cell: row =>
                row.isTotal ? null : (
                    <select
                        className="form-select form-select-sm"
                        value={row.customer}
                        onChange={e =>
                            handleChange(
                                row.id,
                                'customer',
                                e.target.value
                            )
                        }
                    >
                        <option value="">Customer</option>
                        <option value="ABC Company">
                            ABC Company
                        </option>
                        <option value="XYZ Limited">
                            XYZ Limited
                        </option>
                    </select>
                ),
        },

        {
            name: 'Client',
            width: '150px',
            cell: row =>
                row.isTotal ? null : (
                    <select
                        className="form-select form-select-sm"
                        value={row.client}
                        onChange={e =>
                            handleChange(
                                row.id,
                                'client',
                                e.target.value
                            )
                        }
                    >
                        <option value="">Client</option>
                        <option value="Client 1">Client 1</option>
                        <option value="Client 2">Client 2</option>
                    </select>
                ),
        },

        {
            name: 'Job',
            width: '115px',
            cell: row =>
                row.isTotal ? null : (
                    <select
                        className="form-select form-select-sm"
                        value={row.job}
                        onChange={e =>
                            handleChange(
                                row.id,
                                'job',
                                e.target.value
                            )
                        }
                    >
                        <option value="">Job</option>
                        <option value="Job 001">Job 001</option>
                        <option value="Job 002">Job 002</option>
                    </select>
                ),
        },

        {
            name: 'Task',
            width: '130px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>Daily total</span>
                ) : (
                    <select
                        className="form-select form-select-sm"
                        value={row.task}
                        onChange={e =>
                            handleChange(
                                row.id,
                                'task',
                                e.target.value
                            )
                        }
                    >
                        <option value="">Task</option>
                        <option value="Development">
                            Development
                        </option>
                        <option value="Testing">Testing</option>
                        <option value="Meeting">Meeting</option>
                    </select>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Mon
                    <small className="d-block">24 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('mon')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.mon}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'mon',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('mon');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'mon' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.mon_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Tue
                    <small className="d-block">25 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('tue')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.tue}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'tue',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('tue');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'tue' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.tue_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Wed
                    <small className="d-block">26 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('wed')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.wed}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'wed',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('wed');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'wed' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.wed_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Thu
                    <small className="d-block">27 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('thu')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.thu}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'thu',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('thu');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'thu' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.thu_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Fri
                    <small className="d-block">28 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('fri')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.fri}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'fri',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('fri');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'fri' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.fri_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Sat
                    <small className="d-block">29 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('sat')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.sat}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'sat',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('sat');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'sat' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.sat_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: (
                <div className="text-center">
                    Sun
                    <small className="d-block">30 Aug</small>
                </div>
            ),
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getDailyTotal('sun')}</span>
                ) : (<div className="d-flex">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={row.sun}
                        placeholder="00:00"
                        onChange={e =>
                            handleChange(
                                row.id,
                                'sun',
                                e.target.value
                            )
                        }
                        onFocus={() => {
                            setActiveRowId(row.id);
                            setActiveField('sun');
                        }}
                    />
                    {activeRowId === row.id && activeField === 'sun' && (
                        <Pencil
                            className="ms-1 mt-2 cursor-pointer"
                            size={14}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setModalText(row.sun_note || '');
                                setIsModalOpen(true);
                            }}
                        />
                    )}
                </div>
                ),
        },

        {
            name: 'Total',
            width: '100px',
            cell: row =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getGrandTotal()}</span>
                ) : (
                    <span className='timesheet-table-strong'>{getRowTotal(row)}</span>
                ),
        },

        // {
        //     name: 'REMARK',
        //     width: '200px',
        //     cell: row =>
        //         row.isTotal ? null : (
        //             <input
        //                 type="text"
        //                 className="form-control form-control-sm"
        //                 placeholder="Remark"
        //                 value={row.remark}
        //                 onChange={e =>
        //                     handleChange(
        //                         row.id,
        //                         'remark',
        //                         e.target.value
        //                     )
        //                 }
        //             />
        //         ),
        // },

        // {
        //     name: '',
        //     width: '70px',
        //     cell: row =>
        //         row.isTotal ? null : (
        //             <button className='timesheet-row-add-hours-btn'>8×5</button>
        //         ),
        // },

        {
            name: '',
            width: '70px',
            cell: row =>
                row.isTotal ? null : (
                    <button
                        type="button"
                        className="delete-icon"
                        onClick={() => handleDelete(row.id)}
                    >
                        <i className="ti-trash text-danger" />
                    </button>
                ),
        },
    ];

    const tableData = [
        ...rows,
        {
            id: '',
            isTotal: true,
        },
    ];

    return (
        <div className="datatable-container timesheet-datatable-container">
            <DataTable
                columns={columns}
                data={tableData}
                className="custom-datatable"
                fixedHeader={true}
                fixedHeaderScrollHeight="500px"
                noHeader
                highlightOnHover
                responsive
            />
            
            <CommonModal
                isOpen={isModalOpen}
                backdrop="static"
                size="lg"
                cancel_btn={false}
                btn_2="true"
                btn_name={"Save"}
                title={activeField ? activeField.charAt(0).toUpperCase() + activeField.slice(1) + " Note" : "Note"}
                hideBtn={false}
                handleClose={() => {
                    setIsModalOpen(false);
                    setModalText("");
                    setActiveRowId(null);
                    setActiveField(null);
                }}
                Submit_Function={(e) => handleSaveNote(e)}
            >
                <div className="modal-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h5>Add Note</h5>
                            <textarea
                                className="form-control"
                                rows={4}
                                value={modalText}
                                onChange={(e) => setModalText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CommonModal>
        </div>
    );
};

export default TimesheetDatatable;