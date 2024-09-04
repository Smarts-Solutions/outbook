import React from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';

const ExpandableTable = ({ columns, data, filter }) => {
 

  // Component to show when a row is expanded
  const ExpandedComponent = ({ data }) => (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
      <strong>Details:</strong> {data.details}
    </div>
  );

  return (
    <div className="datatable-container">

    <DataTableExtensions
          columns={columns}
          data={data}
          export={false}
          print={false}
          search={false}
          filter={filter}
        >
          <DataTable
            fixedHeader
            fixedHeaderScrollHeight="700px"
            noHeader
            defaultSortField="JobId"
            defaultSortAsc={false}
            pagination
            expandableRows
        expandableRowsComponent={ExpandedComponent}
            highlightOnHover
            paginationRowsPerPageOptions={[10, 50, 100]}
            paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
          />
        </DataTableExtensions>
 
    
    </div>
  );
};

export default ExpandableTable;
