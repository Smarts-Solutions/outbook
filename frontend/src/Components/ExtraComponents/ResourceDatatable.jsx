import React from 'react';
import DataTable from 'react-data-table-component';

const ResourceDatatable = ({ data, loading, page = 1, limit = 10 }) => {
    const columns = [
        {
            name: 'S.No',
            selector: (row, index) => (page - 1) * limit + index + 1,
            sortable: false,
            width: '80px',
        },
        {
            name: 'Employee',
            selector: row => row.name,
            sortable: true,
            width: '270px',
        },

        {
            name: 'Total Hours',
            selector: row => row.total_hours,
            sortable: true,
            center: true,
            width: '150px',
            cell: row => row.total_hours + 'h'
        },

        {
            name: 'Billable Hours',
            selector: row => row.billable_hours,
            sortable: true,
            center: true,
            width: '170px',
            cell: row => (
                <span style={{ color: '#43c752' }}>
                    {row.billable_hours}h
                </span>
            ),
        },

        {
            name: 'Leave Hours',
            selector: row => row.leave_hours,
            sortable: true,
            center: true,
            width: '150px',
            cell: row => (
                <span style={{ color: '#a46400' }}>
                    {row.leave_hours}h
                </span>
            ),
        },

        {
            name: 'Available Hours',
            selector: row => row.available_hours,
            sortable: true,
            center: true,
            width: '190px',
            cell: row => row.available_hours + 'h'
        },

        {
            name: 'Utilisation',
            selector: row => row.utilisation_pct,
            sortable: true,
            width: '300px',
            cell: row => (
                <div
                    className="d-flex align-items-center w-100"
                    style={{ gap: '8px' }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: '8px',
                            backgroundColor: 'rgb(237 247 251)',
                            borderRadius: '1000px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${row.utilisation_pct}%`,
                                height: '100%',
                                backgroundColor: '#0cb2ef',
                            }}
                        />
                    </div>

                    <span
                        style={{
                            minWidth: '30px',
                            fontSize: '11px',
                            textAlign: 'right',
                        }}
                    >
                        {row.utilisation_pct}%
                    </span>
                </div>
            ),
        },
    ];

    const noDataImage = '/assets/images/No-data-amico.png';

    const customSort = (rows, selector, direction) => {
        return [...rows].sort((rowA, rowB) => {
            let aField = selector(rowA);
            let bField = selector(rowB);
            
            // Fallback for null/undefined
            if (aField == null) aField = "";
            if (bField == null) bField = "";
      
            if (typeof aField === 'string') aField = aField.toLowerCase();
            if (typeof bField === 'string') bField = bField.toLowerCase();
      
            let comparison = 0;
            if (aField > bField) comparison = 1;
            else if (aField < bField) comparison = -1;
      
            return direction === 'desc' ? comparison * -1 : comparison;
        });
    };

    return (
        <div className="datatable-container">
            {data.length === 0 && !loading ? (
                <div className='text-center'>
                    <img
                        src={noDataImage}
                        alt="No records available"
                        style={{ width: '250px', height: 'auto', objectFit: 'contain' }}
                    />
                    <p className='fs-16'>There are no records to display</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    sortFunction={customSort}
                    progressPending={loading}
                    className="custom-datatable"
                    fixedHeader={false}
                    noHeader
                    highlightOnHover
                    responsive
                />
            )}
        </div>
    );
};

export default ResourceDatatable;