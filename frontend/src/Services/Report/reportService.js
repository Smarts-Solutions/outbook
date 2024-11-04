import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

export async function JOB_STATUS_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}jobStatusReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function JOB_SUMMARY_REPORTS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}jobSummaryReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function TEAM_MONTHLY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}teamMonthlyReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function JOB_PENDING_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}jobPendingReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function JOB_RECEIVED_SEND_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}jobReceivedSentReports`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


export async function DUE_BY_REPORT(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}dueByReport`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}





 
