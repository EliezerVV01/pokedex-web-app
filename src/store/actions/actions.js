export const SET_VALIDATY= 'SET_VALIDITY';

export const SET_AUTH = 'SET_AUTH';

export const SET_TOKEN = 'SET_TOKEN';

export const setValidity = (_val) =>{
       return {
           type: SET_VALIDATY,
           val: _val,
       }
}

export const setAuth = (_val) =>{
    return {
        type: SET_AUTH,
        val: _val,
    }
}

export const setToken = (_token) =>{
    return {
        type: SET_TOKEN,
        val: _token,
    }
}