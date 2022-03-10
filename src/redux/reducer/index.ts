import { screenOrient, screenRouteType, versionType } from './../../common/commonModel';
import { combineReducers } from "redux";
import DimensionsReducer from './dimensionReducer';
import RoutesReducer from './routesReducer';
import VersionReducer from './versionReducer';
import AuthReducer, { AuthType } from './authReducer';

export interface IReducer {
    DimensionsReducer: screenOrient,
    RoutesReducer: screenRouteType,
    VersionReducer: versionType,
    AuthReducer: AuthType
}

export default combineReducers<IReducer>({
    DimensionsReducer,
    RoutesReducer,
    VersionReducer,
    AuthReducer
});