// import React from 'react';
// import DataTable from 'react-data-table-component';
// import DataTableExtensions from 'react-data-table-component-extensions';

// const ExpandableTable = ({ columns, data, filter }) => {
 

//   // Component to show when a row is expanded
//   const ExpandedComponent = ({ data }) => (
//     <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
//       <strong>Details:</strong> {data.details}
//     </div>
//   );

//   return (
//     <div className="datatable-container">

//     <DataTableExtensions
//           columns={columns}
//           data={data}
//           export={false}
//           print={false}
//           search={false}
//           filter={filter}
//         >
//           <DataTable
//             fixedHeader
//             fixedHeaderScrollHeight="700px"
//             noHeader
//             defaultSortField="JobId"
//             defaultSortAsc={false}
//             pagination
//             expandableRows
//         expandableRowsComponent={ExpandedComponent}
//             highlightOnHover
//             paginationRowsPerPageOptions={[10, 50, 100]}
//             paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
//           />
//         </DataTableExtensions>
 
    
//     </div>
//   );
// };

// export default ExpandableTable;


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
  
  // First Accordion Component
  const FirstAccordion = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div style={{ marginBottom: '10px' }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <strong>First Accordion</strong> {isOpen ? '-' : '+'}
        </div>
        {isOpen && (
          <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
            <strong>Details:</strong> {data.details}
          </div>
        )}
      </div>
    );
  };

  // Second Accordion Component
  const SecondAccordion = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <strong>Second Accordion</strong> {isOpen ? '-' : '+'}
        </div>
        {isOpen && (
          <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
            <strong>More Info:</strong> {data.moreInfo}
          </div>
        )}
      </div>
    );
  };

  // First-level expandable component
  const ExpandedComponent = ({ data }) => (
    <div style={{ padding: '10px', backgroundColor: '#f9f9f9' }}>
      <FirstAccordion data={data} />
      <SecondAccordion data={data} />
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
          expandableRowsComponent={ExpandedComponent}  // First-level expansion with two accordions
          highlightOnHover
          paginationRowsPerPageOptions={[10, 50, 100]}
          paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
        />
      </DataTableExtensions>
    </div>
  );
};

export default ExpandableTable;
