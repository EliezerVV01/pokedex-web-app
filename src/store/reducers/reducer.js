import * as actions from '../actions/actions';
import {updateObject} from '../../utility/utility';

const initialState = {
    validated : null,
    auth: false,
    token: '',
};

const reducer = ( state = initialState, action ) => {
        switch (action.type) {
            case 'SET_VALIDITY': return updateObject(state, {validated: action.val});
            case 'SET_AUTH': return updateObject(state, {auth: action.val});
            case 'SET_TOKEN': return updateObject(state, {token: action.val});
            default: return state;
        }
};

export default reducer;