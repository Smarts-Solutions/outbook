import axios from "axios";
import * as Config from "../../Utils/Config";

export async function GET_ASSIGNED_CUSTOMERS(token) {
  try {
    const res = await axios.get(`${Config.base_url}customer/assigned-customers`, {
      headers: { Authorization: token },
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_ASSIGNED_CLIENTS(token) {
  try {
    const res = await axios.get(`${Config.base_url}customer/assigned-clients`, {
      headers: { Authorization: token },
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_ASSIGNED_JOBS(token) {
  try {
    const res = await axios.get(`${Config.base_url}customer/assigned-jobs`, {
      headers: { Authorization: token },
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}
