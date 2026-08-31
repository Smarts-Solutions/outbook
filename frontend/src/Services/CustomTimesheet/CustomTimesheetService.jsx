import axios from "axios";
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";

export async function CUSTOM_TIMESHEET(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customTimesheet`, data, {
            headers: header(token),
            data: {}
        });
        return await res?.data;
    } catch (err) {
        return await err;
    }
}
