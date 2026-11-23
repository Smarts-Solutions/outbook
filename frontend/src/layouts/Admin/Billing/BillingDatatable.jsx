import React, { useState, useRef, useMemo } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, Plus } from "lucide-react";
import dayjs from "dayjs";
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
        typeof c?.name === "string" &&
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

    // If the first column is a checkbox column (e.g. selection column without string name or isSelection), place checkbox first, then S.No
    const firstCol = columns[0];
    const isFirstColCheckbox =
      firstCol &&
      (typeof firstCol.name !== "string" ||
        firstCol.isSelection ||
        firstCol.width === "50px" ||
        firstCol.width === "55px");

    if (isFirstColCheckbox) {
      return [firstCol, snoColumn, ...columns.slice(1)];
    }

    return [snoColumn, ...columns];
  }, [columns, includeSno, pagination, currentPage, rowsPerPage]);

  // Helper to extract clean value for export
  const getCellValue = (row, col, rowIndex) => {
    const colNameStr = typeof col.name === "string" ? col.name.trim().toLowerCase() : "";
    if (colNameStr === "s.no") {
      return String(rowIndex + 1);
    }

    let val = undefined;
    if (typeof col.selector === "function") {
      try {
        val = col.selector(row, rowIndex);
      } catch (e) {
        // ignore
      }
    }
    if (val === undefined || val === null) {
      const colKey = col.id || (typeof col.name === "string" ? col.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "");
      for (const k of Object.keys(row)) {
        if (colKey && k.toLowerCase().replace(/[^a-z0-9]/g, "") === colKey) {
          val = row[k];
          break;
        }
      }
    }

    if (val === undefined || val === null) return "";

    // If value is a Date or ISO timestamp string, format to DD-MM-YYYY
    const isDateCol = colNameStr.includes("date") || colNameStr.includes("at");
    if (typeof val === "string") {
      const trimmed = val.trim();
      // Match ISO strings like 2026-11-18T12:14:26.000Z or YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}(T|\s|$)/.test(trimmed)) {
        const parsed = dayjs(trimmed);
        if (parsed.isValid()) {
          return parsed.format("DD-MM-YYYY");
        }
      }
    } else if (val instanceof Date) {
      const parsed = dayjs(val);
      if (parsed.isValid()) {
        return parsed.format("DD-MM-YYYY");
      }
    } else if (typeof val === "number" && isDateCol && val > 1000000000) {
      const parsed = dayjs(val);
      if (parsed.isValid()) {
        return parsed.format("DD-MM-YYYY");
      }
    }

    // If column is Discount, format with % sign
    if (colNameStr === "discount" || colNameStr.includes("discount")) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        return num > 0 ? `${num}%` : "0%";
      }
    }

    // If column is Gross Amount, Net Amount, or Amount, ensure clean 2 decimal places with currency if applicable
    if (typeof val === "number" && (colNameStr.includes("amount") || colNameStr.includes("gross") || colNameStr.includes("net"))) {
      const curr = row.currency === "AUD" ? "AUD " : "£";
      return `${curr}${val.toFixed(2)}`;
    }
    if (typeof val === "string" && (colNameStr.includes("amount") || colNameStr.includes("gross") || colNameStr.includes("net"))) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        const curr = row.currency === "AUD" ? "AUD " : "£";
        return `${curr}${num.toFixed(2)}`;
      }
    }

    return String(val);
  };

  const getCleanExportData = () => {
    const validCols = processedColumns.filter(
      (c) =>
        typeof c.name === "string" &&
        !c.button &&
        !["actions", ""].includes(c.name.trim().toLowerCase())
    );

    // Check if any row in data contains calculation breakdown information (calc_json)
    const hasAnyCalcJson = data.some((r) => {
      if (!r || !r.calc_json) return false;
      if (typeof r.calc_json === "object") return Object.keys(r.calc_json).length > 0;
      if (typeof r.calc_json === "string") {
        try {
          const parsed = JSON.parse(r.calc_json);
          return parsed && typeof parsed === "object" && Object.keys(parsed).length > 0;
        } catch (e) {
          return false;
        }
      }
      return false;
    });

    // Pre-calculate all distinct model calculation column names across all rows in data
    // so every row has consistent columns, and if a row doesn't have a model, it shows "-"
    const allCalculatedModelNames = [];
    if (hasAnyCalcJson) {
      data.forEach((r) => {
        let calc = r.calc_json;
        if (typeof calc === "string") {
          try {
            calc = JSON.parse(calc);
          } catch (e) {
            calc = null;
          }
        }
        if (!calc) return;
        if (calc.adhoc && (Number(calc.adhoc.hours) > 0 || Number(calc.adhoc.total) > 0)) {
          if (!allCalculatedModelNames.includes("Adhoc / Hourly Calculation")) {
            allCalculatedModelNames.push("Adhoc / Hourly Calculation");
          }
        }
        if (calc.fte && (Number(calc.fte.total) > 0 || (calc.fte.accountants > 0 || calc.fte.bookkeepers > 0 || calc.fte.payroll > 0 || calc.fte.tax > 0 || calc.fte.admin > 0))) {
          if (!allCalculatedModelNames.includes("FTE Staffing Calculation")) {
            allCalculatedModelNames.push("FTE Staffing Calculation");
          }
        }
        if (calc.percentage && (Number(calc.percentage.total) > 0 || Number(calc.percentage.base) > 0 || (Array.isArray(calc.percentage.items) && calc.percentage.items.some((it) => it.base > 0 || it.subtotal > 0)))) {
          if (!allCalculatedModelNames.includes("Percentage Model Calculation")) {
            allCalculatedModelNames.push("Percentage Model Calculation");
          }
        }
        if (calc.customised && (Number(calc.customised.count) > 0 || Number(calc.customised.total) > 0)) {
          if (!allCalculatedModelNames.includes("Customised Pricing Calculation")) {
            allCalculatedModelNames.push("Customised Pricing Calculation");
          }
        }
      });
    }

    return data.map((row, rowIndex) => {
      const rowObj = {};

      // Parse calc_json if present
      let calc = row.calc_json;
      if (typeof calc === "string") {
        try {
          calc = JSON.parse(calc);
        } catch (e) {
          calc = null;
        }
      }

      const curr = row.currency === "AUD" ? "AUD " : "£";

      // Extract only active calculated models (where calculation was actually performed)
      const activeModels = [];

      // 1. Adhoc
      if (calc?.adhoc && (Number(calc.adhoc.hours) > 0 || Number(calc.adhoc.total) > 0)) {
        const role = (calc.adhoc.role || "Standard").replace(/_/g, " ");
        const hrs = calc.adhoc.hours || 0;
        const rate = parseFloat(calc.adhoc.rate || 0).toFixed(2);
        const subtotal = parseFloat(calc.adhoc.total || 0).toFixed(2);
        activeModels.push({
          modelKey: "Adhoc",
          modelName: "Adhoc / Hourly",
          details: `${role} — ${hrs} Hrs @ ${curr}${rate}/Hr`,
          subtotal: `${curr}${subtotal}`,
        });
      }

      // 2. FTE
      if (calc?.fte && (Number(calc.fte.total) > 0 || (calc.fte.accountants > 0 || calc.fte.bookkeepers > 0 || calc.fte.payroll > 0 || calc.fte.tax > 0 || calc.fte.admin > 0))) {
        const roles = [
          { label: "Accountants", qty: calc.fte.accountants, fee: calc.fte.fee_per_accountant },
          { label: "Bookkeepers", qty: calc.fte.bookkeepers, fee: calc.fte.fee_per_bookkeeper },
          { label: "Payroll", qty: calc.fte.payroll, fee: calc.fte.fee_per_payroll },
          { label: "Tax", qty: calc.fte.tax, fee: calc.fte.fee_per_tax },
          { label: "Admin", qty: calc.fte.admin, fee: calc.fte.fee_per_admin },
        ].filter((r) => r.qty > 0);

        const subtotal = parseFloat(calc.fte.total || 0).toFixed(2);
        const rolesText = roles.length > 0
          ? roles
              .map((r) => {
                const feeNum = parseFloat(r.fee || 0);
                if (feeNum > 0) {
                  const roleTotal = (r.qty * feeNum).toFixed(2);
                  return `${r.label}: ${r.qty} @ ${curr}${feeNum.toFixed(2)} = ${curr}${roleTotal}`;
                }
                return `${r.label}: ${r.qty}`;
              })
              .join("; ")
          : "Dedicated FTE Resource Allocation";

        activeModels.push({
          modelKey: "FTE",
          modelName: "FTE Staffing",
          details: rolesText,
          subtotal: `${curr}${subtotal}`,
        });
      }

      // 3. Percentage
      if (calc?.percentage && (Number(calc.percentage.total) > 0 || Number(calc.percentage.base) > 0 || (Array.isArray(calc.percentage.items) && calc.percentage.items.some((it) => it.base > 0 || it.subtotal > 0)))) {
        let details = "";
        if (Array.isArray(calc.percentage.items) && calc.percentage.items.length > 0) {
          const activeItems = calc.percentage.items.filter((it) => it.base > 0 || it.subtotal > 0);
          details = activeItems.length > 0
            ? activeItems
                .map((it) => `${it.label || it.key}: Base ${curr}${parseFloat(it.base || 0).toFixed(2)} @ ${it.pct}% = ${curr}${parseFloat(it.subtotal || 0).toFixed(2)}`)
                .join("; ")
            : `Base ${curr}${parseFloat(calc.percentage.base || 0).toFixed(2)} @ ${calc.percentage.pct || 0}%`;
        } else {
          details = `Base ${curr}${parseFloat(calc.percentage.base || 0).toFixed(2)} @ ${calc.percentage.pct || 0}%`;
        }
        const subtotal = parseFloat(calc.percentage.total || 0).toFixed(2);
        activeModels.push({
          modelKey: "Percentage",
          modelName: "Percentage Model",
          details,
          subtotal: `${curr}${subtotal}`,
        });
      }

      // 4. Customised
      if (calc?.customised && (Number(calc.customised.count) > 0 || Number(calc.customised.total) > 0)) {
        const cnt = calc.customised.count || 0;
        const cost = parseFloat(calc.customised.costPerJob || 0).toFixed(2);
        const jobLabel = Number(cnt) === 1 ? "Job" : "Jobs";
        const subtotal = parseFloat(calc.customised.total || 0).toFixed(2);
        activeModels.push({
          modelKey: "Customised",
          modelName: "Customised Pricing",
          details: `${cnt} ${jobLabel} @ ${curr}${cost}/Job`,
          subtotal: `${curr}${subtotal}`,
        });
      }

      validCols.forEach((col) => {
        const colName = col.name.trim();
        const colNameLower = colName.toLowerCase();

        // 1. If this is the "Model" column and we have active calculated models, show only the models that were actually calculated
        if (colNameLower === "model" && activeModels.length > 0) {
          rowObj[col.name] = activeModels.map((m) => m.modelName).join(", ");
        } else if (colNameLower === "revenue split" || colNameLower.includes("revenue split") || colNameLower.includes("distribution")) {
          // Format full distribution with name, percentage and allocated amount
          const list = row.contributors || [];
          if (Array.isArray(list) && list.length > 0) {
            const netAmt = parseFloat(row.net_amount || row.net || 0);
            rowObj[col.name] = list
              .map((c) => {
                const pct = parseFloat(c.pct || 0);
                const allocAmt = (netAmt * pct) / 100;
                return `${c.staff_name || "Staff"} (${pct.toFixed(0)}% - ${curr}${allocAmt.toFixed(2)})`;
              })
              .join(", ");
          } else {
            rowObj[col.name] = getCellValue(row, col, rowIndex);
          }
        } else {
          rowObj[col.name] = getCellValue(row, col, rowIndex);
        }

        // 2. If this is the "Discount" column, immediately insert "Discount Amount" right after it
        if (colNameLower === "discount") {
          const gross = parseFloat(row.gross_amount || 0);
          const discPct = parseFloat(row.discount_pct || 0);
          const discAmt = row.discount_amt !== undefined && row.discount_amt !== null
            ? parseFloat(row.discount_amt)
            : (gross * discPct) / 100;
          rowObj["Discount Amount"] = `${curr}${discAmt.toFixed(2)}`;
        }
      });

      // 1. ALL model calculation columns come first across all models
      // If a row has that model, it displays the calculation text; otherwise "-"
      if (hasAnyCalcJson) {
        if (allCalculatedModelNames.length > 0) {
          allCalculatedModelNames.forEach((colName) => {
            const foundModel = activeModels.find((m) => `${m.modelName} Calculation` === colName);
            rowObj[colName] = foundModel ? `${foundModel.details} = ${foundModel.subtotal}` : "-";
          });
        } else {
          rowObj["Calculation Breakdown"] = "—";
        }
      }

      // 2. Final Remark column ALWAYS comes after all model calculation columns
      const finalRemarkVal = row.remark || row.final_remark || row.submitter_remark;
      rowObj["Final Remark"] = finalRemarkVal && String(finalRemarkVal).trim() ? String(finalRemarkVal).trim() : "-";

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
  const lastColName = typeof processedColumns[lastIndex]?.name === "string" ? processedColumns[lastIndex]?.name?.toLowerCase() : "";
  if (["actions", "action"].includes(lastColName)) {
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
