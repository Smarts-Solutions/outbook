import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Datatable = ({ columns, data, filter }) => {
  const noDataImage = '/assets/images/No-data-amico.png'; 

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Change placeholder text of the search input if it exists
      const searchInput = document.querySelector('.data-table-extensions-filter input');
      if (searchInput) {
        searchInput.placeholder = 'Search here...'; // Change the placeholder text
      }
    });

    // Start observing the body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const table = document.querySelector('.rdt_Table');

    if (table) {
      const preventDrag = (e) => e.preventDefault();

      const columns = table.querySelectorAll('th, td');
      columns.forEach(column => {
        column.addEventListener('dragstart', preventDrag);
      });

      return () => {
        columns.forEach(column => {
          column.removeEventListener('dragstart', preventDrag);
        });
      };
    }
  }, []);
  
  return (
    <div className="datatable-container">
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
