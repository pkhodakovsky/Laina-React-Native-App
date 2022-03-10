
import {
    SET_VERSION,
    versionTypeInter
} from '../types';

import { versionType } from '../../common/commonModel';

const INITIAL_STATE: versionType = {
    version: "",
    clientPlatformSV: "",
    serverPlatformSV: "",
    serverTDDVersion: "",
    appVersion: ""
};

const VersionReducer = (state = INITIAL_STATE, action: versionTypeInter) => {

    switch (action.type) {

        case SET_VERSION:
            return { ...state, ...action.payload }

        default:
            return state;
    }
};

export default VersionReducer;