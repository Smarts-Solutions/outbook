import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";

// LOGIN-USER
export async function SIGN_IN_CUSTOMER(data) {
  try {
    const res = await axios.post(`${Config.base_url}customer/login`, data);
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function UPDATE_CUSTOMER_PASSWORD(data) {
  try {
    const res = await axios.post(`${Config.base_url}customer/update-password`, data);
    return await res?.data;
  } catch (err) {
    return await err;
  }
}


