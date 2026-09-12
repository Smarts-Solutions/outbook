import React from 'react';
import DataTable from 'react-data-table-component';

const ManagerReviewDatatable = ({
  columns,
  data,
  filter,
  pagination = true,
  expandableRows,
  expandableRowsComponent,
  expandableRowExpanded,
  expandableRowDisabled,
  onRowClicked,
  expandOnRowClicked,
  expandableRowsHideExpander
}) => {
  const noDataImage = '/assets/images/No-data-amico.png';

  //get last index of columns
  const lastIndex = columns.length - 1;
  let actionColumn = false
  if (['actions', 'action'].includes(columns[lastIndex]?.name?.toLowerCase())) {
    actionColumn = true
  }

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

      if (aField > bField) {
        comparison = 1;
      } else if (aField < bField) {
        comparison = -1;
      }

      return direction === 'desc' ? comparison * -1 : comparison;
    });
  };

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
        <div >
            <DataTable
              columns={columns}
              data={data}
              sortFunction={customSort}
              className={actionColumn ? 'custom-datatable custom-datatable-sticky-action' : 'custom-datatable'}
              fixedHeader={false}
              noHeader
              pagination={pagination}
              onColumnOrderChange={cols => console.log(cols)}
              highlightOnHover
              paginationRowsPerPageOptions={[10, 50, 100]}
              paginationComponentOptions={{ selectAllRowsItem: true, selectAllRowsItemText: 'All' }}
              expandableRows={expandableRows}
              expandableRowsComponent={expandableRowsComponent}
              expandableRowExpanded={expandableRowExpanded}
              expandableRowDisabled={expandableRowDisabled}
              onRowClicked={onRowClicked}
              expandOnRowClicked={expandOnRowClicked}
              expandableRowsHideExpander={expandableRowsHideExpander}
            />
        </div>
      )}
    </div>
  );
};

export default ManagerReviewDatatable;
