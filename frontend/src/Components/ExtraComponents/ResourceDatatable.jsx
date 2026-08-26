import React from 'react';
import DataTable from 'react-data-table-component';

const ResourceDatatable = () => {
    const data = [
        {
            id: 1,
            employee: 'Vikas Patel',
            total: '39h',
            billable: '24h',
            leave: '3h',
            available: '168h',
            utilisation: 15,
        },
        {
            id: 2,
            employee: 'Ayesha Khan',
            total: '36h',
            billable: '24h',
            leave: '0h',
            available: '168h',
            utilisation: 14,
        },
        {
            id: 3,
            employee: 'Rohit Mehra',
            total: '20h',
            billable: '14h',
            leave: '0h',
            available: '168h',
            utilisation: 8,
        },
        {
            id: 4,
            employee: 'Priya Nair',
            total: '0h',
            billable: '0h',
            leave: '0h',
            available: '168h',
            utilisation: 0,
        },
    ];

    const columns = [
        {
            name: 'Employee',
            selector: row => row.employee,
            sortable: true,
            width: '230px',
        },

        {
            name: 'Total',
            selector: row => row.total,
            sortable: true,
            center: true,
            width: '100px',
        },

        {
            name: 'Billable',
            sortable: true,
            center: true,
            width: '100px',
            cell: row => (
                <span style={{ color: '#43c752' }}>
                    {row.billable}
                </span>
            ),
        },

        {
            name: 'Leave',
            sortable: true,
            center: true,
            width: '100px',
            cell: row => (
                <span style={{ color: '#a46400' }}>
                    {row.leave}
                </span>
            ),
        },

        {
            name: 'Available',
            selector: row => row.available,
            sortable: true,
            center: true,
            width: '130px',
        },

        {
            name: 'Utilisation',
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
                                width: `${row.utilisation}%`,
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
                        {row.utilisation}%
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div className="datatable-container">
            <DataTable
                columns={columns}
                data={data}
                className="custom-datatable"
                fixedHeader
                fixedHeaderScrollHeight="500px"
                noHeader
                highlightOnHover
                responsive
            />
        </div>
    );
};

export default ResourceDatatable;