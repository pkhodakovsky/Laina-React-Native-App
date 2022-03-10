import { Dimensions, PixelRatio } from 'react-native';

// Imported Common Variables for Orientation name like Landscape / Portrait
import { LANDSCAPE } from "../common/variables";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const guidelineBaseWidth = 350;

/**
 * This function convert percentage width number and convert it into pixel number 
 * @param widthPercent NUMBER CONSIDER AS A PERCENTAGE FROM 1 TO 100
 * @param sWidth SCREEN WIDTH
 * @returns NUMBER CONSIDER AS A PIXEL 
 * @example "widthPercentageOrientation( 20, SCREEN WIDTH )"
 */

const widthPercentageOrientation = (widthPercent: number, sWidth: number) => {
    return PixelRatio.roundToNearestPixel(sWidth * widthPercent / 100);
};

/**
 * This function convert percentage height number and convert it into pixel number 
 * @param heightPercent NUMBER CONSIDER AS A PERCENTAGE FROM 1 TO 100
 * @param sHeight SCREEN HEIGHT
 * @returns NUMBER CONSIDER AS A PIXEL 
 * @example "heightPercentageOrientation( 20, SCREEN HEIGHT )"
 */

const heightPercentageOrientation = (heightPercent: number, sHeight: number) => {
    return PixelRatio.roundToNearestPixel(sHeight * heightPercent / 100);
};

/**
 * This function convert percentage number width and convert it into pixel number 
 * @param size NUMBER CONSIDER AS A PERCENTAGE FROM 1 TO 100
 * @param sWidth SCREEN WIDTH
 * @returns NUMBER CONSIDER AS A PIXEL 
 * @example "scaleO( 20, SCREEN WIDTH )"
 */

// method to convert percentage number width and convert it into pixel number 
const scaleO = (size: number, sWidth: number) => sWidth / guidelineBaseWidth * size;

// method to calculate font size according to screen width and height
const moderateScaleO = (size: number, sWidth: number, factor = 0.5) => {
    return size + (scaleO(size, sWidth) - size) * factor;
}

// method to make responsive height according to screen size 
const responsiveHeight = (orientation: string, height: number, num: number, diff: number) => {
    return orientation == LANDSCAPE ?
        heightPercentageOrientation(num, height) :
        heightPercentageOrientation(diff, height)
};

// method to make font size responsive according to screen size 
const responsiveFont = (screenWidth: number, num: number, diff = 2) => {
    return screenWidth <= 420 ?
        moderateScaleO(num - diff, screenWidth) :
        moderateScaleO(num, screenWidth)
}

const responsiveFontSize = (f: number) => {
    const tempHeight = (16 / 9) * screenWidth;
    return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(screenWidth, 2)) * (f / 100);
};

// Exports the Screen Dimensions and methods to make screens designs responsive

export {
    screenWidth,
    screenHeight,
    widthPercentageOrientation,
    heightPercentageOrientation,
    moderateScaleO,
    scaleO,
    responsiveHeight,
    responsiveFont,
    responsiveFontSize
};