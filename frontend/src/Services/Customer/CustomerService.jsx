import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

// Search Company Name
export async function GETALLCOMPANY(data) {
  const token = JSON.parse(localStorage.getItem("token"));
  try {
    const res = await axios.post(`${Config.base_url}seachCompany`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}


// Add Customer 
export async function ADD_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}addCustomer`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }
}

// Get All Service 
export async function GET_SERVICE(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}service`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}


// // Create New Customer Services and Service by Manager
export async function ADD_SERVICES(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}updateProcessCustomer`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }
}


// // Create New Customer For Update Pepper Work
export async function ADD_PEPPER_WORK(data, token) {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${Config.base_url}updateProcessCustomerFile`,
      headers: {
        'Authorization': token,
        ...data
      },
      data: data
    };

    const res = await axios.request(config);


    return await res?.data;
  }
  catch (err) {
    return await err;
  }
}

// Get All Customer KE LITE
export async function GET_ALL_CUSTOMER(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}customerAction`, data, {
      headers: header(token),
      data: {}
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
      data: {}
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
      data: {}
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Edit customer
export async function Delete_Customer_File(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}updateProcessCustomerFileAction`, data, {
      headers: header(token),
      data: {}
    });
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
      data: {}
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
      data: {}
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

// Add Job Type
export async function GET_ALL_JOB_LIST(data, token) {
  try {
    const res = await axios.post(`${Config.base_url}jobAction`, data, {
      headers: header(token),
      data: {}
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
      data: {}
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}





