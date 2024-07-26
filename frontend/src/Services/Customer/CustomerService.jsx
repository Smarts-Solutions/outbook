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











