import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


// Service Action API Add, Edit, Delete
export async function STAFF(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}staff`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}