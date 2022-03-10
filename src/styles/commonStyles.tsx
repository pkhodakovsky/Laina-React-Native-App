import {StyleSheet} from 'react-native';
import { widthPercentageOrientation as wo, responsiveFontSize as RF } from '../common/responsiveFunct';
import { Fonts, Colors, Heights } from '../styles';

/**
 * Common styles for the componentsn used by the whole application.
 */
const CommonStyles = StyleSheet.create({
    labelContainer: {
        alignSelf: "center"
    },
    button: {
        borderWidth: 1,
        borderColor: Colors.themeBlue,
        backgroundColor: Colors.white
    },
    buttonLabel: {
        color: Colors.themeBlue
    },
    NlabelContainer: {
        alignSelf: "center"
    },
    Nbutton: {
        borderWidth: 1,
        borderColor: Colors.radioColor,
        backgroundColor: Colors.white
    },
    NbuttonLabel: {
        color: Colors.radioColor,
    }
})

// Setting the Common Orientation styles for the app.
const CommonOrientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
   
    return {
        labelContainer: {
            width: wo('90%', screenWidth),
        },
        screenLabel: {
            fontSize: RF(2.2),
        }
    }
}

export {
    CommonStyles,
    CommonOrientationStyle
};