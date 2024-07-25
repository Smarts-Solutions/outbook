import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

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










