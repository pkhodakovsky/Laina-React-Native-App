
import {
    ADD_ROUTE,
    REMOVE_ROUTE,
    FETCHING_ROUTE_START,
    FETCHING_ROUTE_END,
    SET_ROUTE,
    SET_COMPONENT_REF,
    routeActionTypes
} from '../types';
import { screenRouteType } from '../../common/commonModel';

const INITIAL_STATE: screenRouteType = {
    activeRoute: "/page/participants",
    routeList: ["/page/participants"],
    routeFetching: false,
    componentRef: null
};

const RoutesReducer = (state = INITIAL_STATE, action: routeActionTypes) => {
    let routeHistory = state.routeList;

    switch (action.type) {

        case FETCHING_ROUTE_START:
            return { ...state, routeFetching: true }

        case FETCHING_ROUTE_END:
            return { ...state, routeFetching: false }

        case SET_ROUTE:
            return { ...state, activeRoute: action.payload, routeList: [action.payload] }

        case ADD_ROUTE:
            let findIndex = routeHistory.findIndex((v: string) => v === action.payload);

            if (findIndex !== -1) {
                let newRouteList = routeHistory.slice(0, findIndex + 1)
                return { ...state, routeList: newRouteList, activeRoute: action.payload }
            } else {
                routeHistory.push(action.payload)
                return { ...state, routeList: routeHistory, activeRoute: action.payload }
            }

        case REMOVE_ROUTE:
            routeHistory.pop();
            return { ...state, routeList: routeHistory, activeRoute: routeHistory[routeHistory.length - 1] }

        case SET_COMPONENT_REF:
            return { ...state, componentRef: action.payload }

        default:
            return state;
    }
};

export default RoutesReducer;