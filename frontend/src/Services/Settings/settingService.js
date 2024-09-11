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

// Service Action API Add, Edit, Delete
export async function JOBTYPE(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}JobType`, data, {
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
export async function ADDTASK(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}addTask`, data, {
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
export async function GetServicesByCustomer(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customerGetService`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


export async function GETTASK(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}getTask`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}



export async function getListAction(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}checklistAction`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}



export async function addChecklist(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}addChecklist`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}



export async function UpdateChecklist(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}updateChecklist`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


export async function MasterStatus(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}masterStatus`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function incorporationApi(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}incorporation`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}


export async function customerSource(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customerSource`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

export async function customerSubSource(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}customerSubSource`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}
