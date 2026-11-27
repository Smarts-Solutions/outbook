import axios from "axios";
import { base_url } from "../../Utils/Config";

export const SEND_TRIGGER_TEST = async (data, token) => {
  try {
    const res = await axios.post(`${base_url}triggerTest/send`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: error.message };
  }
};

export const GET_TRIGGER_TEST_LIST = async (token) => {
  try {
    const res = await axios.get(`${base_url}triggerTest/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res?.data;
  } catch (error) {
    return error?.response?.data || { status: false, message: error.message };
  }
};
