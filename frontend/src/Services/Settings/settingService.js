import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";
import { header } from "../../Utils/ApiHeader";


// Role Action API Add, Edit, Delete
export async function ROLE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}role`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


// Status Type Action API Add, Edit, Delete
export async function STATUS_TYPE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}statusType`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


// Service Action API Add, Edit, Delete
export async function SERVICE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}service`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// Service Action API Add, Edit, Delete
export async function PERSONROLE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customerContactPersonRole`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// Service Action API Add, Edit, Delete
export async function CLIENTINDUSTRY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}clientIndustry`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// Service Action API Add, Edit, Delete
export async function COUNTRY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}country`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}



 





