import { Dispatch } from 'redux';

import { DataServices } from '@lainaedge/platformshared';
import { PingResult } from '@lainaedge/platformshared/src/types/PingResult';
import {
    SET_VERSION,
} from '../types';
import { versionType } from '../../common/commonModel';
import VersionCheck from 'react-native-version-check';

const dataService = DataServices.instance();

const setVersion = (payload: versionType) => ({
    type: SET_VERSION,
    payload
});

export function getAppVersion() {
    return (dispatch: Dispatch) => {
        dataService
            .pingServer()
            .then((resp: PingResult) => {
                return dispatch(
                    setVersion({
                        version: resp.version,
                        clientPlatformSV: resp.clientPlatformSharedVersion,
                        serverPlatformSV: resp.serverPlatformSharedVersion,
                        serverTDDVersion: resp.serverTDDVersion,
                        appVersion: VersionCheck.getCurrentVersion()
                    }),
                );
            })
            .catch((error) => {
                console.log(error)
                return error;
            });
    }
}