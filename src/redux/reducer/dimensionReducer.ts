import { screenOrient } from '../../common/commonModel'; 
import { CHANGE_DIMENSIONS, dimensionActionTypes } from '../types';

const INITIAL_STATE: screenOrient = {
    screenHeight: 0,
    screenWidth: 0,
    orientation: ""
};

const DimensionsReducer = (state = INITIAL_STATE, action: dimensionActionTypes) => {
    switch (action.type) {
        case CHANGE_DIMENSIONS:
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
};

export default DimensionsReducer;