import { screenOrient } from '../../common/commonModel';
import {
    dimensionActionTypes,
    CHANGE_DIMENSIONS
} from '../types';

export const changeDimension = (data: screenOrient): dimensionActionTypes => ({
    type: CHANGE_DIMENSIONS,
    payload: data
});