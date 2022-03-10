import { screenOrient, versionType } from '../common/commonModel';

export const SPLASH_LOAD = "SPLASH_LOAD";

export const SIGN_IN = "SIGN_IN";
export const LOG_OUT = "LOG_OUT";

export const CHANGE_DIMENSIONS = "CHANGE_DIMENSIONS";

export const SET_ROUTE = "SET_ROUTE";
export const ADD_ROUTE = "ADD_ROUTE";
export const REMOVE_ROUTE = "REMOVE_ROUTE";
export const FETCHING_ROUTE_START = "FETCHING_ROUTE_START";
export const FETCHING_ROUTE_END = "FETCHING_ROUTE_END";

export const SET_COMPONENT_REF = "SET_COMPONENT_REF";
export const SET_VERSION = "SET_VERSION";

export type dimensionActionTypes = {
    type: typeof CHANGE_DIMENSIONS,
    payload: screenOrient
}

export type routeActionTypes = {
    type: typeof FETCHING_ROUTE_START
} | {
    type: typeof FETCHING_ROUTE_END
} | {
    type: typeof SET_ROUTE,
    payload: string
} | {
    type: typeof ADD_ROUTE,
    payload: string
} | {
    type: typeof SET_COMPONENT_REF,
    payload: JSX.ElementAttributesProperty
} | {
    type: typeof REMOVE_ROUTE
}

export type userTypes =
    {
        type: typeof SIGN_IN,
        payload: any
    }
export type versionTypeInter =
    {
        type: typeof SET_VERSION,
        payload: versionType
    }