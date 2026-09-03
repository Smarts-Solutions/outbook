import React from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import { Pencil } from 'lucide-react';
import Select from 'react-select';

const TimesheetDatatable = ({
    rows,
    weekDays,
    multipleFilter,
    staffDetails,
    isWeekSwitching,
    submitStatusAllKey,
    handleChangeTaskType,
    selectCustomerData,
    selectClientData,
    selectJobData,
    selectTaskData,
    handleHoursInput,
    handleDeleteRow,
    setActiveIndex,
    setActiveField,
    activeIndex,
    activeField,
    setIsModalOpen,
    setModalText,
    setSelectedRowIndex,
    getTotalHoursFromKey,
    getGrandTotal
}) => {

    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => index + 1,
            width: '70px',
        },
        {
            name: 'Task Type',
            width: '150px',
            cell: (row, index) =>
                row.isTotal ? null : (
                    <Select
                        className="basic-multi-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        classNamePrefix="react-select"
                        styles={{ container: (base) => ({ ...base, width: 130 }) }}
                        options={[
                            { value: "1", label: "Internal" },
                            { value: "2", label: "External" }
                        ]}
                        value={[
                            { value: "1", label: "Internal" },
                            { value: "2", label: "External" }
                        ].find(opt => String(opt.value) === String(row.task_type)) || null}
                        isSearchable={false}
                        placeholder="Task Type"
                        isDisabled={row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id}
                        onChange={(selectedOption) => {
                            const e = { target: { name: "task_type", value: selectedOption?.value || "" } };
                            handleChangeTaskType(e, row, index);
                        }}
                    />
                ),
        },
        {
            name: 'Customer',
            width: '150px',
            cell: (row, index) =>
                row.isTotal ? null : (
                    row.task_type === "1" ? (
                        <input
                            className="form-control form-control-sm cursor-pointer"
                            style={{ width: "130px" }}
                            value="No Customer"
                            disabled
                        />
                    ) : (
                        <Select
                            className="basic-multi-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            classNamePrefix="react-select"
                            styles={{ container: (base) => ({ ...base, width: 130 }) }}
                            options={row.customerData?.map(item => ({ value: item.id, label: item.trading_name })) || []}
                            value={(row.customerData?.map(item => ({ value: item.id, label: item.trading_name })) || []).find(opt => String(opt.value) === String(row.customer_id)) || (row.customer_name ? { value: row.customer_id, label: row.customer_name } : null)}
                            isSearchable
                            placeholder="Customer"
                            isDisabled={row.task_type !== "2" || row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id}
                            onChange={(selectedOption) => {
                                const e = { target: { name: "customer_id", value: selectedOption?.value || "" } };
                                selectCustomerData(e, index);
                            }}
                        />
                    )
                ),
        },
        {
            name: 'Client',
            width: '150px',
            cell: (row, index) =>
                row.isTotal ? null : (
                    row.task_type === "1" ? (
                        <input
                            className="form-control form-control-sm cursor-pointer"
                            style={{ width: "130px" }}
                            value="No Client"
                            disabled
                        />
                    ) : (
                        <Select
                            className="basic-multi-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            classNamePrefix="react-select"
                            styles={{ container: (base) => ({ ...base, width: 130 }) }}
                            options={row.clientData?.map(item => ({ value: item.id, label: item.trading_name })) || []}
                            value={(row.clientData?.map(item => ({ value: item.id, label: item.trading_name })) || []).find(opt => String(opt.value) === String(row.client_id)) || (row.client_name ? { value: row.client_id, label: row.client_name } : null)}
                            isSearchable
                            placeholder="Client"
                            isDisabled={row.task_type !== "2" || row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id}
                            onChange={(selectedOption) => {
                                const e = { target: { name: "client_id", value: selectedOption?.value || "" } };
                                selectClientData(e, index);
                            }}
                        />
                    )
                ),
        },
        {
            name: 'Job',
            width: '150px',
            cell: (row, index) =>
                row.isTotal ? null : (
                    <Select
                        className="basic-multi-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        classNamePrefix="react-select"
                        styles={{ container: (base) => ({ ...base, width: 130 }) }}
                        options={row.jobData?.map(item => ({ value: item.id, label: item.name })) || []}
                        value={(row.jobData?.map(item => ({ value: item.id, label: item.name })) || []).find(opt => String(opt.value) === String(row.job_id)) || (row.job_name ? { value: row.job_id, label: row.job_name } : null)}
                        isSearchable
                        placeholder="Job"
                        isDisabled={row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id}
                        onChange={(selectedOption) => {
                            const e = { target: { name: "job_id", value: selectedOption?.value || "" } };
                            selectJobData(e, row.task_type, index);
                        }}
                    />
                ),
        },
        {
            name: 'Task',
            width: '150px',
            cell: (row, index) =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>Daily total</span>
                ) : (
                    <Select
                        className="basic-multi-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        classNamePrefix="react-select"
                        styles={{ container: (base) => ({ ...base, width: 130 }) }}
                        options={row.taskData?.map(item => ({ value: item.id, label: item.name })) || []}
                        value={(row.taskData?.map(item => ({ value: item.id, label: item.name })) || []).find(opt => String(opt.value) === String(row.task_id)) || (row.task_name ? { value: row.task_id, label: row.task_name } : null)}
                        isSearchable
                        placeholder="Task"
                        isDisabled={row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id}
                        onChange={(selectedOption) => {
                            const e = { target: { name: "task_id", value: selectedOption?.value || "" } };
                            selectTaskData(e, index);
                        }}
                    />
                ),
        }
    ];

    const days = [
        { label: 'Mon', dateKey: 'monday', stateKey: 'monday_hours', noteKey: 'monday_note', dateValueKey: 'monday' },
        { label: 'Tue', dateKey: 'tuesday', stateKey: 'tuesday_hours', noteKey: 'tuesday_note', dateValueKey: 'tuesday' },
        { label: 'Wed', dateKey: 'wednesday', stateKey: 'wednesday_hours', noteKey: 'wednesday_note', dateValueKey: 'wednesday' },
        { label: 'Thu', dateKey: 'thursday', stateKey: 'thursday_hours', noteKey: 'thursday_note', dateValueKey: 'thursday' },
        { label: 'Fri', dateKey: 'friday', stateKey: 'friday_hours', noteKey: 'friday_note', dateValueKey: 'friday' },
        { label: 'Sat', dateKey: 'saturday', stateKey: 'saturday_hours', noteKey: 'saturday_note', dateValueKey: 'saturday' },
        { label: 'Sun', dateKey: 'sunday', stateKey: 'sunday_hours', noteKey: 'sunday_note', dateValueKey: 'sunday' }
    ];

    days.forEach(day => {
        columns.push({
            name: (
                <div className="text-center">
                    <span className="d-block">{weekDays && weekDays[day.dateValueKey] ? weekDays[day.dateValueKey].split('/')[0] : day.label}</span>
                </div>
            ),
            width: '100px',
            cell: (row, index) =>
                row.isTotal ? (
                    <span className='timesheet-table-strong'>{getTotalHoursFromKey(day.stateKey)}</span>
                ) : (
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            name={day.stateKey}
                            value={row[day.stateKey] == null ? "0" : row[day.stateKey]}
                            onChange={e => handleHoursInput(e, index, `${day.dateKey}_date`, weekDays[day.dateValueKey], row)}
                            disabled={!row.task_id || row.submit_status === "1" || staffDetails.id != multipleFilter.staff_id || isWeekSwitching}
                            onFocus={() => {
                                setActiveIndex(index);
                                setActiveField(day.dateKey);
                            }}
                        />
                        {activeIndex === index && activeField === day.dateKey && (
                            <Pencil
                                className="ms-1 mt-2 cursor-pointer"
                                size={22}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setSelectedRowIndex(index);
                                    setModalText(row[day.noteKey] || '');
                                    setIsModalOpen(true);
                                }}
                            />
                        )}
                    </div>
                ),
        });
    });

    columns.push({
        name: 'Total',
        width: '100px',
        cell: (row) =>
            row.isTotal ? (
                <span className='timesheet-table-strong'>{getGrandTotal()}</span>
            ) : (
                <span className='timesheet-table-strong'>{row.total_hours || "0.00"}</span>
            ),
    });

    columns.push({
        name: '',
        width: '70px',
        cell: (row, index) =>
            row.isTotal ? null : (
                submitStatusAllKey === 0 && staffDetails.id == multipleFilter.staff_id && (
                    <button
                        type="button"
                        className="delete-icon btn btn-sm"
                        onClick={() => handleDeleteRow(index)}
                    >
                        <i className="ti-trash text-danger" />
                    </button>
                )
            ),
    });

    const tableData = rows ? [...rows] : [];
    if (tableData.length > 0) {
        tableData.push({
            id: 'total-row',
            isTotal: true,
        });
    }

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
        </div>
    );
};

export default TimesheetDatatable;
