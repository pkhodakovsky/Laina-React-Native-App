import { moderateScaleO, moderateScale } from '../common/responsiveFunct';

// Font Name
export const GOTHAM_BOLD = "Gotham Bold";
export const GOTHAM_MEDIUM = "Gotham Medium";
export const SF_UI = "sfuitext-Regular";
export const GILROY_REG = "Gilroy-Regular";
export const GILROY_BOLD = "Gilroy-Bold";
export const GILROY_HEAVY = "Gilroy-Heavy";
export const GILROY_MED = "Gilroy-Medium";
export const GILROY_SB = "Gilroy-Semibold";
export const GILROY_LIGHT = "Gilroy-Light";

// Font Sizes
export const Resp_Font_Size = (screenWidth: number, num: number, diff = 2) => screenWidth <= 420 ? moderateScaleO(num - diff, screenWidth) : moderateScaleO(num, screenWidth)
export const Resp_Font = (screenWidth: number, num: number, diff = 2) => screenWidth <= 420 ? moderateScale(num - diff) : moderateScale(num)