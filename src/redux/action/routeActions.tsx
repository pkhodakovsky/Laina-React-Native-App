import {
    SET_ROUTE,
    ADD_ROUTE,
    REMOVE_ROUTE,
    FETCHING_ROUTE_START,
    FETCHING_ROUTE_END,
    SET_COMPONENT_REF,
    routeActionTypes
} from '../types';

export const fetchingRouteStart = (): routeActionTypes => ({
    type: FETCHING_ROUTE_START
});

export const fetchingRouteEnd = (): routeActionTypes => ({
    type: FETCHING_ROUTE_END
});

export const setRoute = (route: string): routeActionTypes => ({
    type: SET_ROUTE,
    payload: route
});

export const addRoute = (route: string): routeActionTypes => ({
    type: ADD_ROUTE,
    payload: route
});

export const setComponentRef = (payload: JSX.ElementAttributesProperty): routeActionTypes => ({
    type: SET_COMPONENT_REF,
    payload
});

export const removeRoute = (): routeActionTypes => ({
    type: REMOVE_ROUTE
});