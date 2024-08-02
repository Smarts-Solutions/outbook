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

 