import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";



export async function GET_TIMESHEET(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const res = await axios.post(`${Config.base_url}getTimesheet`, data, {
      headers: header(token),
      data: {},
    });

    console.log("res===>", res);
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function GET_TIMESHEET_TASK_TYPE(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const res = await axios.post(`${Config.base_url}getTimesheetTaskType`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}

export async function SAVE_TIMESHEET(data) {
  try {
    const IP_Data = JSON.parse(localStorage.getItem("IP_Data"));
    const token = JSON.parse(localStorage.getItem("token"));
    var StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
    const { req, authToken } = data;
    const updatedReq = {
      ...req,
      ip: IP_Data,
      StaffUserId: StaffUserId.id,
    };
    const res = await axios.post(`${Config.base_url}saveTimesheet`, updatedReq, {
      headers: header(token),
      data: {},
    });
    // const res = await axios.post(`${Config.base_url}saveTimesheet`, data, {
    //   headers: header(token),
    //   data: {},
    // });
    return await res?.data;

  } catch (err) {
    return await err;
  }
}

export async function GET_STAFF_HOURSMINUTE(data) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const res = await axios.post(`${Config.base_url}getStaffHourMinute`, data, {
      headers: header(token),
      data: {},
    });
    return await res?.data;
  } catch (err) {
    return await err;
  }
}










