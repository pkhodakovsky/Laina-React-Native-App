import { Dimensions, PixelRatio } from 'react-native';
import { LANDSCAPE, PORTRAIT } from './variables';

import { changeDimension } from '../redux/action/dimensionAction';
import { dimensionActionTypes } from '../redux/types';
import { screenOrient } from '../common/commonModel';

// Windows height and width values.
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

/**
 * This function convert width percentage into width pixel ratio
 * @param widthPercent 
 * @returns Display Pixels
 */
const widthPercentageToDP = (widthPercent: string) => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

/**
 * This function gets the width percentage according to the orientation.
 * @param widthPercent 
 * @param sWidth 
 * @returns width percentage value
 */
const widthPercentageOrientation = (widthPercent: string, sWidth: number) => {
    const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(sWidth * elemWidth / 100);
};

/**
 * This function convert height percentage to pixel ratio
 * @param heightPercent 
 * @returns 
 */
const heightPercentageToDP = (heightPercent: string) => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

/**
 * This function gets the height percentage according to the orientation.
 * @param heightPercent 
 * @param sHeight 
 * @returns 
 */
const heightPercentageOrientation = (heightPercent: string, sHeight: number) => {
    const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(sHeight * elemHeight / 100);
};

// Helper height and width presets
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

// Horizantal Scale calculated values. 
const scale = (size: number) => screenWidth / guidelineBaseWidth * size;
const scaleO = (size: number, sWidth: number) => sWidth / guidelineBaseWidth * size;

// Vertical Scale calculated values.
const verticalScale = (size: number) => screenHeight / guidelineBaseHeight * size;
const verticalScaleO = (size: number, h: number) => h / guidelineBaseHeight * size;

// Moderate scale values.
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;
const moderateScaleO = (size: number, sWidth: number, factor = 0.5) => size + (scaleO(size, sWidth) - size) * factor;

/**
 * Responsive scale values
 * @param 
 * @returns Number
 */
const responsiveFontSize = (f: number) => {
    const tempHeight = (16 / 9) * screenWidth;
    return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(screenWidth, 2)) * (f / 100);
};

// Changing layout values on screen rotation.
const changeLayout = (dispatch: (cb: dimensionActionTypes) => void) => {
    let sWidth = Dimensions.get("window").width;
    let sHeight = Dimensions.get("window").height;
    let orientation = sHeight >= sWidth ? PORTRAIT : LANDSCAPE;
    let screenDimensions: screenOrient  = {
        screenHeight: sHeight,
        screenWidth: sWidth,
        orientation
    }
    dispatch(changeDimension(screenDimensions))
    return screenDimensions
}

export {
    screenWidth,
    screenHeight,
    moderateScale,
    verticalScale,
    responsiveFontSize,
    widthPercentageToDP,
    heightPercentageToDP,
    widthPercentageOrientation,
    heightPercentageOrientation,
    moderateScaleO,
    changeLayout,
    verticalScaleO
};