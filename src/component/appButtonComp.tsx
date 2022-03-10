import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Colors, Fonts, Heights } from '../styles';
import { AppButtonProps } from "./interfaces"
import { useSelector } from "react-redux";
import { widthPercentageOrientation as wo, responsiveFontSize as RF } from '../utils/responsiveFunctions';
import { IReducer } from '../redux/reducer';
import { getTestID } from '../common/functions';

/**
 *    Simple button with some custom styles props which we will use to customize the button design and label props for button text
 *    @example
 *      <AppButton />
 */

function AppButton(props: AppButtonProps) {
    const { screenHeight, screenWidth, orientation } = useSelector((state: IReducer) => state.DimensionsReducer);

    let orientStyle = orientationStyle(screenWidth, screenHeight, orientation);

    return (
        <TouchableOpacity
            accessible
            accessibilityRole="button"
            testID={getTestID(props.accessibilityLabel ? props.accessibilityLabel : props.label ? props.label : "")}
            accessibilityLabel={props.accessibilityLabel}
            accessibilityHint={props.accessibilityHint}
            onPress={props.press} style={[styles.container, orientStyle.container, props.containerStyle]} >
            <Text style={[styles.label, props.labelStyle]} >{props.label}</Text>
        </TouchableOpacity>
        
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.radioColor,
        width: "100%"
    },
    label: {
        fontFamily: Fonts.GILROY_BOLD,
        color: Colors.white,
        fontSize: RF(2.1)
    },
})

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        container: {
            marginVertical: VScale(3, 1.5),
            height: VScale(12, 6),
            borderRadius: wo(1, screenWidth)
        }
    }
}

export default AppButton;