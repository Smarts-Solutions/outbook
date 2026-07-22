import React, { useState } from "react";
import {saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { Download } from "lucide-react";
export default function ExportToExcel({ apiData = [], fileName, headers = [] }) {
    const [exporting, setExporting] = useState(false);
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToExcel = (e, apiData, fileName, headers) => {
        if (!Array.isArray(headers) || headers.length === 0) {
            return;
        }

        setExporting(true);
        setTimeout(() => {
            try {
                let filteredData = [...apiData];
        // Find the relevant search input for the current tab/context
        const container = e.target.closest('.tab-pane') || e.target.closest('.report-data') || document;
        const searchInput = container.querySelector('.data-table-extensions-filter input') || container.querySelector('input[placeholder*="Search"]');
        
        if (searchInput && searchInput.value) {
            const query = searchInput.value.toLowerCase();
            filteredData = filteredData.filter(row => {
                return Object.values(row).some(val => 
                    val && String(val).toLowerCase().includes(query)
                );
            });
        }

        // Format data based on provided headers
        const formattedData = filteredData.map((row) =>
            headers.reduce((formattedRow, header) => {
                formattedRow[header.label] = row[header.key] || row[header.label] || ""; // Map data to header labels
                return formattedRow;
            }, {})
        );
        const headerRow = headers.map((header) => header.label);
        const dataRows = formattedData.map((row) =>
            headers.map((header) => row[header.label])
        );
        const dataWithHeaders = [headerRow, ...dataRows];
        const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders); 
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });  
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },  
                    alignment: { horizontal: "center", vertical: "center" },
                    fill: { fgColor: { rgb: "000000" } }, 
                };
            }
        } 
        const colWidths = headers.map((header) => ({
            width: Math.max(header.label.length + 5, 15), // Minimum width 15
        }));
        ws["!cols"] = colWidths;
        // Styling for data rows
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (ws[cellAddress]) {
                    ws[cellAddress].s = {
                        alignment: { horizontal: "center", vertical: "center" }, // Center-align data
                    };
                }
            }
        }

        // Create workbook and export
        const wb = { Sheets: { Data: ws }, SheetNames: ["Data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, fileName + fileExtension);
            } finally {
                setExporting(false);
            }
        }, 100);
    };
    // Dynamically generate headers if not provided
    const dynamicHeaders =
        headers.length > 0
            ? headers
            : apiData.length > 0
                ? Object.keys(apiData[0]).map((key) => ({
                    label: key.replace(/_/g, " "), // Replace underscores with spaces
                    key: key,
                }))
                : [];
    return (
        <>
            {exporting && (
                <div className="overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                    <div className="loader"></div>
                </div>
            )}
            <button
                onClick={(e) => exportToExcel(e, apiData, fileName, dynamicHeaders)}
                type="button"
                className="btn btn-outline-info fw-bold float-end border-3"
                title="Export To Excel"
            >
                 <Download size={16} /> Export Excel
            </button>
        </>
    );
}