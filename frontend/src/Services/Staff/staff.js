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

// Competency Action API Add, Edit, Delete
export async function COMPETENCY(data, token) {
    try {
        const res = await axios.post(`${Config.base_url}staffCompetency`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// Competency Action API Add, Edit, Delete
export async function GETPROFILE(data) {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
        

        const res = await axios.post(`${Config.base_url}profile`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// /staff/portfolio
export async function staffPortfolio(data) {
    const token = JSON.parse(localStorage.getItem("token"));
    try {
        const res = await axios.post(`${Config.base_url}staff/portfolio`, data, {
            headers: header(token),
            data: {}
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}