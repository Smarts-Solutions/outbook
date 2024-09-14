import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";
const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

// Search Company Name
export async function GETALLCOMPANY(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(`${Config.base_url}seachCompany`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Add Customer
export async function ADD_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}addCustomer`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Get All Service
export async function GET_SERVICE(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}service`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// // Create New Customer Services and Service by Manager
export async function ADD_SERVICES(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}updateProcessCustomer`,
      data,
      {
        headers: header(token),
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Get All Customer Services
export async function ADD_PEPPER_WORK(data, token) {
  try {
    const formData = new FormData();


    data.fileData.forEach((file, index) => {
      formData.append("files[]", file);
    });

    for (const key in data) {
      if (key !== "fileData" && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Config.base_url}updateProcessCustomerFile`,
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    const res = await axios.request(config);
    return res?.data;
  } catch (err) {
    return err;
  }
}

// Get All Customer KE LITE
export async function GET_ALL_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}customerAction`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Get All Customer KE EK FUNCTION BNA KE
export async function GET_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getSingleCustomer`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Edit customer
export async function EDIT_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}customerUpdate`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Edit customer
export async function Delete_Customer_File(data, token) {
  try {
    const res = await axios.post(
      `${Config.base_url}updateProcessCustomerFileAction`,
      data,
      {
        headers: header(token),
        data: {},
      }
    );
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Get All Job Data
export async function GET_ALL_JOB_DATA(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getAddJobData`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Add Job Type
export async function Add_Job_Type(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}jobAdd`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Add Job Type
export async function JOB_ACTION(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}jobAction`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Add Job Type
export async function UPDATE_JOB(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}jobUpdate`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GETALLCHECKLIST(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}checklistAction`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_ALL_TASK_TIME_SHEET(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getTaskTimeSheet`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_JOB_TIME_SHEET(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}jobTimeSheet`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_MISSING_LOG(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getMissingLog`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function ADD_MISSION_LOG(data, token) {
  try { 
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('missing_log', data.missionDetails.missing_log);
    formData.append('missing_paperwork', data.missionDetails.missing_paperwork);
    formData.append('missing_log_sent_on', data.missionDetails.missing_log_sent_on);
    formData.append('missing_log_prepared_date', data.missionDetails.missing_log_prepared_date);
    formData.append('missing_log_title', data.missionDetails.missing_log_title);
    formData.append('missing_log_reviewed_by', staffDetails.id);  
    formData.append('missing_log_reviewed_date', data.missionDetails.missing_log_reviewed_date);
    formData.append('missing_paperwork_received_on', data.missionDetails.missing_paperwork_received_on);
    formData.append('status', data.missionDetails.status);

    if (Array.isArray(data.missionDetails.missing_log_document)) {
      data.missionDetails.missing_log_document.forEach((file) => {
        formData.append('files[]', file);
      });
    } else if (data.missionDetails.missing_log_document) {
      formData.append('files[]', data.missionDetails.missing_log_document);
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Config.base_url}addMissingLog`,
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    const res = await axios.request(config);

    return await res?.data;
  } catch (err) {

    return err;
  }
}

export async function QUERY_ACTION(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getQuerie`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function ADD_QUERY(data, token) {
  try { 
     
    const formData = new FormData();
    formData.append('job_id', data.job_id);
    formData.append('queries_remaining', data.data.QueriesRemaining);
    formData.append('query_title', data.data.QueryTitle);
    formData.append('reviewed_by', data.data.ReviewedBy); 
    formData.append('missing_queries_prepared_date', data.data.MissingQueriesPreparedDate);
    formData.append('query_sent_date', data.data.QuerySentDate);
    formData.append('response_received', data.data.ResponseReceived);
    formData.append('response', data.data.Response);
    formData.append('final_query_response_received_date',data.data.FinalQueryResponseReceivedDate);  
    if (Array.isArray(data.data.QueryDocument)) {
      data.data.QueryDocument.forEach((file) => {
        formData.append('files[]', file);
      });
    } else if (data.data.QueryDocument) {
      formData.append('files[]', data.data.QueryDocument);
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${Config.base_url}addQuerie`,
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    const res = await axios.request(config);

    return await res?.data;
  } catch (err) {
  
    return err;
  }
}

export async function DRAFT_ACTION(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}getDraft`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function ADD_DRAFT(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}addDraft`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function JOBDOCUMENT_ACTION(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}JobDocumentAction`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}
