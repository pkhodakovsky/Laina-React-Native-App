import { StyleSheet } from 'react-native';

import { widthPercentageOrientation as wo, widthPercentageToDP as wp, responsiveFontSize as RF } from './responsiveFunct';
import { Fonts, Colors, Heights } from '../styles';

// Common Styles used by the whole application.
const CommonStyles = StyleSheet.create({
    content: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6"
    },
    downIcon: {
        color: Colors.primaryColor
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    btnTxt: {
        color: Colors.white,
        fontFamily: Fonts.GOTHAM_BOLD,
        textAlign: "center"
    },
    listItemTxt1: {
        color: Colors.listTitle,
        fontFamily: Fonts.GOTHAM_MEDIUM
    },
    detailTxt2: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        color: Colors.Screening,
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    inputError: {
        fontFamily: Fonts.SF_UI,
        color: Colors.Danger
    },
    inputCont: {
        width: '85%',
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: wp('1%'),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        paddingHorizontal: wp('3%'),
    },
    textInput: {
        fontFamily: Fonts.SF_UI,
        color: Colors.inputColor,
        padding: 0,
    },
    error: { 
        width: '85%', 
        alignSelf: "center" 
    },
})

export interface ICommonOrientationStyle {
    hIcons: {
        width: number,
        height: number
    },
    downIcon: {
        fontSize: number
    },
    logoHeader: {
        width: number,
        height: number
    },
    separator: {
        width: number,
        height: number,
        backgroundColor: string
    },
    listItemCont: {
        paddingVertical: number,
        paddingHorizontal: number,
    },
    listItemTxt1: {
        fontSize: number
    },
    btnTxt: {
        fontSize: number
    },
    inputError: {
        fontSize: number,
        marginTop: number,
    },
    inputCont: {
        paddingVertical: number,
        marginTop: number
    },
    textInput: {
        fontSize: number
    },
}

const CommonOrientationStyle = (screenWidth: number, screenHeight: number, orientation: string) : ICommonOrientationStyle => {
    
    // Screen layout values.
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        hIcons: {
            width: wo('4%', screenWidth),
            height: wo('4%', screenWidth)
        },
        downIcon: {
            fontSize: RF(2.1)
        },
        logoHeader: {
            width: screenWidth,
            height: screenWidth / 5.224
        },
        separator: {
            width: screenWidth,
            height: 1,
            backgroundColor: Colors.borderColor
        },
        listItemCont: {
            paddingVertical: VScale(3, 1),
            paddingHorizontal: wo('3.5%', screenWidth),
        },
        listItemTxt1: {
            fontSize: RF(2.0)
        },
        btnTxt: {
            fontSize: RF(2)
        },
        inputError: {
            fontSize: RF(1.8),
            marginTop: VScale(2, 1),
        },
        inputCont: {
            paddingVertical: VScale(2, 1),
            marginTop: VScale(4, 2)
        },
        textInput: {
            fontSize: RF(2.0)
        },
    }
}

export {
    CommonStyles,
    CommonOrientationStyle
};