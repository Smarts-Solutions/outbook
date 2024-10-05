import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


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






