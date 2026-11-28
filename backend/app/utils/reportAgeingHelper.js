const xlsx = require('xlsx');

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Parses date string or Date object into { year, monthIdx }
 * Handles DD/MM/YYYY, YYYY-MM-DD, or ISO strings
 */
function parseYearMonth(dateVal) {
  if (!dateVal || dateVal === '-' || dateVal === ' - ') return null;

  let d = null;
  if (dateVal instanceof Date) {
    d = dateVal;
  } else if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    // Check DD/MM/YYYY
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        let yr = parseInt(parts[2], 10);
        // Fix 2-digit years if any
        if (yr < 100) yr += 2000;
        const mo = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[0], 10);
        d = new Date(yr, mo, day);
      }
    } else if (trimmed.includes('-')) {
      const parts = trimmed.split('-');
      if (parts.length >= 3) {
        let yr = parseInt(parts[0], 10);
        const mo = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].slice(0, 2), 10);
        d = new Date(yr, mo, day);
      }
    } else {
      d = new Date(trimmed);
    }
  }

  if (!d || isNaN(d.getTime())) return null;

  let year = d.getFullYear();
  // Handle any typo year formats in DB (e.g. 1925/1926 or 0225/225 or 0205/205 -> 2025/2026/2025)
  if (year < 2020) {
    const yrStr = String(year);
    if (yrStr.endsWith('25')) year = 2025;
    else if (yrStr.endsWith('26')) year = 2026;
    else if (yrStr.endsWith('24')) year = 2024;
    else if (yrStr.endsWith('27')) year = 2027;
    else year = 2025; // fallback to 2025 so no job is dropped
  }

  return {
    year,
    monthIdx: d.getMonth(),
    sortKey: year * 100 + (d.getMonth() + 1) // e.g. 202611
  };
}

/**
 * Builds clean, simple single-header matrix in DESCENDING order:
 * Columns: [ "Status", "Nov-26", "Oct-26", "Sep-26", ..., "Grand Total" ]
 * Rows: Status names with month counts
 * Bottom row: "Grand Total" with month-wise sums
 */
function buildStatusAgeingMatrix(jobs) {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  const statusMap = {}; // status -> { [sortKey]: count }
  const monthColsMap = {}; // sortKey -> { year, monthIdx, label }
  const allStatuses = new Set();

  jobs.forEach(job => {
    const status = (job.Status || job.status || ' - ').trim();
    allStatuses.add(status);

    const rawDate = job['Job Received On'] || job.job_received_on || job.date_received_on;
    const ym = parseYearMonth(rawDate);

    if (ym) {
      const { year, monthIdx, sortKey } = ym;
      const shortYr = String(year).slice(-2);
      const label = `${MONTH_NAMES[monthIdx]}-${shortYr}`; // e.g. Nov-26

      if (!monthColsMap[sortKey]) {
        monthColsMap[sortKey] = { sortKey, label };
      }

      if (!statusMap[status]) statusMap[status] = {};
      statusMap[status][sortKey] = (statusMap[status][sortKey] || 0) + 1;
    }
  });

  // Sort months in DESCENDING order: Current month -> Last month -> Earlier...
  const sortedMonthKeys = Object.keys(monthColsMap)
    .map(Number)
    .sort((a, b) => b - a);

  if (sortedMonthKeys.length === 0) {
    return [];
  }

  const rows = [];
  const sortedStatuses = Array.from(allStatuses).sort((a, b) => a.localeCompare(b));
  const isSingleStatus = sortedStatuses.length <= 1;

  // Header Row: Status, Grand Total (Status Wise) [or Grand Total if single status], Nov-26, Oct-26, ...
  const statusTotalColName = isSingleStatus ? "Grand Total" : "Grand Total (Status Wise)";
  const header = ["Status", statusTotalColName];
  sortedMonthKeys.forEach(k => {
    header.push(monthColsMap[k].label);
  });
  rows.push(header);

  // Status rows (sorted alphabetically)
  const colTotals = new Array(sortedMonthKeys.length).fill(0);
  let totalGrandSum = 0;

  sortedStatuses.forEach(st => {
    let rowSum = 0;
    const monthCounts = [];

    sortedMonthKeys.forEach((k, idx) => {
      const count = statusMap[st] ? (statusMap[st][k] || 0) : 0;
      monthCounts.push(count > 0 ? count : "-");
      colTotals[idx] += count;
      rowSum += count;
    });

    totalGrandSum += rowSum;
    const row = [st, rowSum > 0 ? rowSum : "-", ...monthCounts];
    rows.push(row);
  });

  // Bottom Grand Total row: only add if there are multiple statuses (for single status, the status row already shows the grand total)
  if (!isSingleStatus) {
    const bottomTotalRow = ["Grand Total (Month Wise)", totalGrandSum > 0 ? totalGrandSum : "-"];
    colTotals.forEach(val => {
      bottomTotalRow.push(val > 0 ? val : "-");
    });
    rows.push(bottomTotalRow);
  }

  return rows;
}

/**
 * Builds clean, simple single-header matrix for Customers in DESCENDING order:
 * Columns: [ "Customer Name", "Nov-26", "Oct-26", "Sep-26", ..., "Grand Total" ]
 * Rows: Customer trading names with month-wise counts
 * Right column: Customer-wise Total across months
 * Bottom row: "Grand Total" with month-wise sums & overall total
 */
function buildCustomerAgeingMatrix(jobs) {
  if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  const customerMap = {}; // customer -> { [sortKey]: count }
  const monthColsMap = {}; // sortKey -> { year, monthIdx, label }
  const allCustomers = new Set();

  jobs.forEach(job => {
    const customer = (job["Customer Name"] || job.customer_trading_name || job.customer_name || ' - ').trim();
    allCustomers.add(customer);

    const rawDate = job['Job Received On'] || job.job_received_on || job.date_received_on;
    const ym = parseYearMonth(rawDate);

    if (ym) {
      const { year, monthIdx, sortKey } = ym;
      const shortYr = String(year).slice(-2);
      const label = `${MONTH_NAMES[monthIdx]}-${shortYr}`; // e.g. Nov-26

      if (!monthColsMap[sortKey]) {
        monthColsMap[sortKey] = { sortKey, label };
      }

      if (!customerMap[customer]) customerMap[customer] = {};
      customerMap[customer][sortKey] = (customerMap[customer][sortKey] || 0) + 1;
    }
  });

  // Sort months in DESCENDING order: Current month -> Last month -> Earlier...
  const sortedMonthKeys = Object.keys(monthColsMap)
    .map(Number)
    .sort((a, b) => b - a);

  if (sortedMonthKeys.length === 0) {
    return [];
  }

  const rows = [];

  // Header Row: Customer Name, Grand Total (Customer Wise), Nov-26, Oct-26, ...
  const header = ["Customer Name", "Grand Total (Customer Wise)"];
  sortedMonthKeys.forEach(k => {
    header.push(monthColsMap[k].label);
  });
  rows.push(header);

  // Customer rows (sorted alphabetically)
  const sortedCustomers = Array.from(allCustomers).sort((a, b) => a.localeCompare(b));
  const colTotals = new Array(sortedMonthKeys.length).fill(0);
  let totalGrandSum = 0;

  sortedCustomers.forEach(cust => {
    let rowSum = 0;
    const monthCounts = [];

    sortedMonthKeys.forEach((k, idx) => {
      const count = customerMap[cust] ? (customerMap[cust][k] || 0) : 0;
      monthCounts.push(count > 0 ? count : "-");
      colTotals[idx] += count;
      rowSum += count;
    });

    totalGrandSum += rowSum;
    const row = [cust, rowSum > 0 ? rowSum : "-", ...monthCounts];
    rows.push(row);
  });

  // Bottom Grand Total row: "Grand Total (Month Wise)", overall total, then month-wise totals
  const bottomTotalRow = ["Grand Total (Month Wise)", totalGrandSum > 0 ? totalGrandSum : "-"];
  colTotals.forEach(val => {
    bottomTotalRow.push(val > 0 ? val : "-");
  });
  rows.push(bottomTotalRow);

  return rows;
}

/**
 * Creates Summary worksheet with:
 * Simple, descending-month ageing table with horizontal & vertical Grand Totals
 * (Status / Customer, Grand Total, and month-wise columns)
 * Supports groupBy: "status" (default) or "customer"
 */
function createSummaryWorksheet(summaryData, finalJobData, options = {}) {
  let matrix = [];
  if (options.groupBy === 'customer') {
    matrix = buildCustomerAgeingMatrix(finalJobData);
  } else {
    matrix = buildStatusAgeingMatrix(finalJobData);
  }

  if (matrix && matrix.length > 0) {
    return xlsx.utils.aoa_to_sheet(matrix);
  }

  return xlsx.utils.aoa_to_sheet([["No data to display"]]);
}

module.exports = {
  buildStatusAgeingMatrix,
  buildCustomerAgeingMatrix,
  createSummaryWorksheet
};
