import { Heights } from '../../styles';
import {
    widthPercentageOrientation as wo,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from '../../common/responsiveFunct';

import { ViewStyle } from "react-native";

export interface IOrientationStyle {
    btn: ViewStyle,
    sectionCont2: ViewStyle,
    break: ViewStyle,
    taskStatusView: ViewStyle,
    cardCont: ViewStyle,
    cardListCont: ViewStyle,
    separator: ViewStyle,
    hintLine: ViewStyle,
    sectionCont: ViewStyle

}

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string): IOrientationStyle => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        sectionCont: {
            paddingHorizontal: wo('5%', screenWidth),
        },
        btn: {
            paddingVertical: hp("2%"),
            paddingHorizontal: wp("2%"),
            marginVertical: VScale(2, 1),
            width: "100%",
            // marginHorizontal: wo("5%", screenWidth)
        },
        sectionCont2: {
            marginTop: VScale(2, 1),
        },
        break: {
            width: screenWidth,
            marginVertical: VScale(2, 1)
        },
        taskStatusView: {
            paddingHorizontal: wo('2%', screenWidth),
            height: VScale(7, 3.5),
            borderRadius: wp('1.5%'),
            marginLeft: wo('2%', screenWidth)
        },
        cardCont: {
            marginVertical: VScale(2, 1),
            marginHorizontal: wo('3%', screenWidth)
        },
        cardListCont: {
            marginBottom: VScale(6, 3),
        },
        separator: {
            marginHorizontal: wo('4%', screenWidth)
        },
        hintLine: {
            marginHorizontal: wo('3%', screenWidth),
        }
    }
}

export default orientationStyle;