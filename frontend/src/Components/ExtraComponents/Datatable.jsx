import React from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Datatable = ({ columns, data, filter }) => {
  const noDataImage = '/assets/images/No-data-amico.png';

  // Ref function to handle search input placeholder update
  const handleTableRef = (node) => {
    if (node) {
      const searchInput = node.querySelector('.data-table-extensions-filter input');
      if (searchInput && searchInput.placeholder !== 'Search here') {
        searchInput.placeholder = 'Search here';
      }
    }
  };

  return (
    <div className="datatable-container" ref={handleTableRef}>
      {data.length === 0 ? (
        <div className='text-center'>
          <img 
            src={noDataImage} 
            alt="No records available" 
            style={{ width: '250px', height: 'auto', objectFit: 'contain' }}
          />
          <p className='fs-16'>There are no records to display</p>
        </div>
      ) : (
        <DataTableExtensions
          columns={columns}
          data={data}
          export={false}
          print={false}
          search={true}
          filter={filter}
        >
          <DataTable
            fixedHeader
            fixedHeaderScrollHeight="700px"
            noHeader
            defaultSortField="JobId"
            defaultSortAsc={false}
            pagination
            highlightOnHover
            paginationRowsPerPageOptions={[10, 50, 100]}
            paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
          />
        </DataTableExtensions>
      )}
    </div>
  );
};

export default Datatable;
