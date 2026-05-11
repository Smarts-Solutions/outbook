import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

export async function CUSTOMER_JOB_STATUS_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/jobStatusReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function CUSTOMER_JOB_SUMMARY_REPORTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/jobSummaryReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function CUSTOMER_JOB_PENDING_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/jobPendingReports`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_DUE_BY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/dueByReport`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_TEAM_MONTHLY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/teamMonthlyReports`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_TAX_WEEKLY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/taxWeeklyStatusReport`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_TAX_WEEKLY_REPORT_FILTER(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/taxWeeklyStatusReportFilterKey`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_AVERAGE_TAT_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/averageTatReport`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_REPORT_COUNT_JOB(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/reportCountJob`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_MISSING_TIMESHEET_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/missingTimesheetReport`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_DISCREPANCY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/discrepancyReport`, data, {
            headers: header(token),
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

export async function CUSTOMER_JOB_RECEIVED_SEND_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/jobReceivedSentReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function CUSTOMER_TIMESHEET_REPORTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customer/getTimesheetReportData`, data, {
            headers: header(token),
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

