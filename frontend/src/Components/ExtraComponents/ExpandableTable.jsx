import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';


const data = [
  {
    JobId: 1,
    details: "This is the first accordion data for row 1",
    moreInfo: "This is the second accordion data for row 1"
  },
  {
    JobId: 2,
    details: "This is the first accordion data for row 2",
    moreInfo: "This is the second accordion data for row 2"
  }
];


const ExpandableTable = ({ columns, data, filter }) => {
  
   
  // First-level expandable component
  const ExpandedComponent = ({ data }) => (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
    


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
