import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


// Role Action API Add, Edit, Delete
export async function GETACCESS(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}accessRolePermissions`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// ROLE COMMAN ACCESS PERMISION
export async function ROLEACCESS(data, token) {
    try {
      
        const res = await axios.post(`${Config.base_url}accessRolePermissions`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}