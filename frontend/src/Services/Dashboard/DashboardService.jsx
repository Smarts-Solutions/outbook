import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


export async function DASHBOARD(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    console.log("data", data);
    const res = await axios.post(`${Config.base_url}getDashboardData`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}




