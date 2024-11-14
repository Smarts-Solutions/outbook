import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


export async function DASHBOARD(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const res = await axios.post(`${Config.base_url}getDashboardData`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function ACTIVITYLOG(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(`${Config.base_url}getDashboardActivityLog`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function LINKDATA(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    const res = await axios.post(`${Config.base_url}getCountLinkData`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}





