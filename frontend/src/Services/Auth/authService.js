import axios from "axios";

// import Files
import * as Config from "../../Utils/Config";


// LOGIN-USER
export async function SIGN_IN_STAFF(data) {
    try {
        const res = await axios.post(`${Config.base_url}login`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

// LOGIN-AUTH-TOKEN
export async function LOGIN_AUTH_TOKEN(data) {
    try {
        const res = await axios.post(`${Config.base_url}loginAuthToken`, data, {
            data: {},
        })
        return await res?.data;
    }
    catch (err) {
        return await err;
    }
}

 





