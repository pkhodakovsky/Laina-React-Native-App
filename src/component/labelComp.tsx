import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Colors, Fonts } from '../styles';
import {
    responsiveFontSize as RF,
    screenWidth,
    screenHeight,
    widthPercentageOrientation as wo,
    heightPercentageOrientation as ho
} from '../utils/responsiveFunctions';

/**
 *    Simple label component
 *    @example
 *      <LabelComp />
 */
interface Props {
    style?: TextStyle,
    containerStyle?: ViewStyle | ViewStyle[],
    labelCont?: ViewStyle | ViewStyle[],
    children: React.ReactChild,
    isLoginTitle?: boolean,
    isRadio?: boolean,
}

function LabelComp(props: Props) {

    return (
        <View style={[styles.labelContainer, props.labelCont]} >
            <Text style={[styles.label, props.style]} >
                {props.children}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontFamily: Fonts.GILROY_MED,
        fontWeight: "normal",
        color: Colors.darkGrey,
        textAlign: 'center',
        fontSize: RF(2)
    },
    labelContainer: {
        alignSelf: 'center',
        // width: wo(70, screenWidth),
        textAlign: 'center',
        marginTop: ho(3, screenHeight),
        marginBottom: ho(2, screenHeight)
    },
})

export default LabelComp;