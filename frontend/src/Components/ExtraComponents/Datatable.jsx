import React from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Datatable = ({ columns, data,filter }) => {
  return (
    <div className="datatable-container">
      <DataTableExtensions
        columns={columns}
        data={data}
        export={false}
        print={false}
        search={true}
        filter={filter}
        class
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
    </div>
  );
};

export default Datatable;
