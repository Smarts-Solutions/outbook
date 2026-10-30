import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

// 1. Get Active Customers for Billing
export async function getActiveCustomersBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getActiveCustomers`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 2. Get Active Clients for Billing
export async function getActiveClientsBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getActiveClients`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 3. Get Customer Engagement Details for Billing
export async function getCustomerEngagementDetailsBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getCustomerEngagementDetails`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 4. Get Clients By Customer
export async function getClientsByCustomerBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getClientsByCustomer`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 5. Get Jobs (filtered by customer_id and/or client_id)
export async function getJobsBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getJobs`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 6. Get Services
export async function getServicesBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getServices`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 7. Get Job Types
export async function getJobTypesBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getJobTypes`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 8. Get Services from existing jobs for a given client
export async function getServicesByClientBilling(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getServicesByClient`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 9. Submit Billing (creates live submission and contributors)
export async function submitBillingApi(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/submitBilling`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 10. Get Submissions For Approvals
export async function getSubmissionsForApprovalsApi(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/getSubmissionsForApprovals`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 11. Manager Approve Submission
export async function managerApproveSubmissionApi(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/managerApprove`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 12. Manager Return Submission
export async function managerReturnSubmissionApi(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/managerReturn`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}

// 13. Manager Edit Submission
export async function managerEditSubmissionApi(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}billing/managerEdit`, data, {
      headers: header(token),
    });
    return res?.data;
  } catch (err) {
    return err?.response?.data || { status: false, message: err.message };
  }
}
