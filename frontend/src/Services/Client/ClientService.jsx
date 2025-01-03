import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";




// Get Client Industry
export async function GET_CLIENT_INDUSTRY(data ,token) {
   
  try {
    const res = await axios.post(`${Config.base_url}clientIndustry`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}


// Get All Client List
export async function CLIENT_ACTION(data) {
  const token =  JSON.parse(localStorage.getItem("token"));
  try {
    const res = await axios.post(`${Config.base_url}clientAction`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}


// Get Client List
export async function ADD_CLIENT(data) {
  const token =  JSON.parse(localStorage.getItem("token"));
 
   
  try {
    const res = await axios.post(`${Config.base_url}addClient`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}


// Get Client List
export async function EDIT_CLIENT(data) {
  const token =  JSON.parse(localStorage.getItem("token"));
 
   
  try {
    const res = await axios.post(`${Config.base_url}clientUpdate`, data, {
      headers: header(token),
      data: {}
    })
    return await res?.data;
  }
  catch (err) {
    return await err;
  }

}

 