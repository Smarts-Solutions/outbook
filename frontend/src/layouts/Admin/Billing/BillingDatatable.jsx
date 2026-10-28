import React, { useState, useRef, useMemo } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, Plus } from "lucide-react";
import "./BillingDatatable.css";

const BillingDatatable = ({
  columns = [],
  data = [],
  filter = false,
  pagination = true,
  title = "",
  totalCount = null,
  showExportButtons = true,
  exportFileName = "Billing_Data",
  actionButton = null,
  noDataText = "There are no records to display",
  dense = false,
  includeSno = true,
  defaultRowsPerPage = 10,
}) => {
  const noDataImage = "/assets/images/No-data-amico.png";
  const tableContainerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [isExporting, setIsExporting] = useState(false);

  const handleTableRef = (node) => {
    tableContainerRef.current = node;
    if (node) {
      const searchInput = node.querySelector(
        ".data-table-extensions-filter input"
      );
      if (searchInput && searchInput.placeholder !== "Search here") {
        searchInput.placeholder = "Search here";
      }
    }
  };

  // Prepend S.No column if includeSno is true and not already provided
  const processedColumns = useMemo(() => {
    const hasSno = columns.some(
      (c) =>
        c.name &&
        ["s.no", "s. no", "sno", "sr.no", "#"].includes(
          c.name.trim().toLowerCase()
        )
    );

    if (!includeSno || hasSno) {
      return columns;
    }

    const snoColumn = {
      name: "S.No",
      selector: (row, index) =>
        pagination
          ? (currentPage - 1) * rowsPerPage + (index + 1)
          : index + 1,
      width: "75px",
      sortable: false,
      cell: (row, index) => (
        <span className="sno-badge">
          {pagination
            ? (currentPage - 1) * rowsPerPage + (index + 1)
            : index + 1}
        </span>
      ),
    };

    return [snoColumn, ...columns];
  }, [columns, includeSno, pagination, currentPage, rowsPerPage]);

  // Helper to extract clean value for export
  const getCellValue = (row, col, rowIndex) => {
    if (col.name?.toLowerCase() === "s.no") {
      return String(rowIndex + 1);
    }
    if (typeof col.selector === "function") {
      try {
        const val = col.selector(row, rowIndex);
        if (val !== undefined && val !== null) return String(val);
      } catch (e) {
        // ignore
      }
    }
    const colKey = col.id || col.name?.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const k of Object.keys(row)) {
      if (k.toLowerCase().replace(/[^a-z0-9]/g, "") === colKey) {
        return row[k] !== undefined && row[k] !== null ? String(row[k]) : "";
      }
    }
    return "";
  };

  const getCleanExportData = () => {
    const validCols = processedColumns.filter(
      (c) =>
        c.name &&
        !["action", "actions", ""].includes(c.name.trim().toLowerCase())
    );

    return data.map((row, rowIndex) => {
      const rowObj = {};
      validCols.forEach((col) => {
        rowObj[col.name] = getCellValue(row, col, rowIndex);
      });
      return rowObj;
    });
  };

  const handleExportExcel = () => {
    if (!data.length) return;
    setIsExporting(true);
    setTimeout(() => {
      try {
        const cleanData = getCleanExportData();
        const worksheet = XLSX.utils.json_to_sheet(cleanData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BillingData");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        saveAs(blob, `${exportFileName}.xlsx`);
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  const lastIndex = processedColumns.length - 1;
  let actionColumn = false;
  if (
    [
      "actions",
      "action",
    ].includes(processedColumns[lastIndex]?.name?.toLowerCase())
  ) {
    actionColumn = true;
  }

  const countDisplay =
    totalCount !== null && totalCount !== undefined
      ? totalCount
      : data?.length || 0;

  return (
    <div className="billing-table-wrapper" ref={handleTableRef}>
      {(title || showExportButtons || actionButton) && (
        <div className="billing-table-header">
          <div>
            {title && (
              <h6 className="billing-table-title">
                {title}{" "}
                <span className="billing-table-count">
                  {countDisplay} {countDisplay === 1 ? "Row" : "Rows"}
                </span>
              </h6>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {showExportButtons && (
              <button
                type="button"
                className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-1 py-1 px-3 fs-13"
                onClick={handleExportExcel}
                disabled={!data.length || isExporting}
              >
                {isExporting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Export Excel
                  </>
                )}
              </button>
            )}
            {actionButton && <div>{actionButton}</div>}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-5">
          <img
            src={noDataImage}
            alt="No records available"
            style={{ width: "220px", height: "auto", objectFit: "contain" }}
          />
          <p className="fs-15 text-muted mt-2">{noDataText}</p>
        </div>
      ) : (
        <div className="datatable-container">
          <DataTableExtensions
            columns={processedColumns}
            data={data}
            export={false}
            print={false}
            search={true}
            filter={filter}
          >
            <DataTable
              className={
                actionColumn
                  ? "custom-datatable billing-datatable custom-datatable-sticky-action"
                  : "custom-datatable billing-datatable"
              }
              keyField="id"
              fixedHeader={true}
              fixedHeaderScrollHeight="550px"
              noHeader
              pagination={pagination}
              onChangePage={(page) => setCurrentPage(page)}
              onChangeRowsPerPage={(currentRowsPerPage) => {
                setRowsPerPage(currentRowsPerPage);
                setCurrentPage(1);
              }}
              highlightOnHover
              dense={dense}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationComponentOptions={{
                selectAllRowsItem: true,
                selectAllRowsItemText: "All",
              }}
            />
          </DataTableExtensions>
        </div>
      )}
    </div>
  );
};

export default React.memo(BillingDatatable);
