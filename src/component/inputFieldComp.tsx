import React from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { parseIconFromClassName } from "../common/fontAwesomeIcon";

import { widthPercentageOrientation as wo, responsiveFontSize as RF } from '../utils/responsiveFunctions';
import { DimensionsReducer } from '../common/commonModel';
import { InputFieldProps } from "./interfaces";
import { Colors, Heights, Fonts } from '../styles';
import { LabelComp } from '.';
import { getTestID } from '../common/functions';

/**
 *    Simple input field with some props which we will use in all over app
 *    @example
 *    <InputField />
 */

function InputField(props: InputFieldProps) {

    // Screen Layout Values
    const { screenHeight, screenWidth, orientation } = useSelector((state: DimensionsReducer) => state.DimensionsReducer);
    let orientStyle = orientationStyle(screenWidth, screenHeight, orientation);

    // Getting the icon.
    const icon = props.iconName !== undefined ? props.iconName : ""

    return (
        <View style={[styles.container, orientStyle.container, props.containerStyle]} >
            {
                props.label &&
                <LabelComp labelCont={props.labelCont} style={props.labelStyle} >{props.label}</LabelComp>
            }
            <View style={[styles.inputContainer, orientStyle.inputContainer, props.inputCont]} >
                <TextInput
                    accessible
                    editable={props.disable}
                    accessibilityLabel={props.accessibilityLabel}
                    testID={getTestID(props.accessibilityLabel ? props.accessibilityLabel : props.label ? props.label : "")}
                    onChangeText={props.onChangeText}
                    value={props.value}
                    keyboardType={props.keyboardType}
                    secureTextEntry={props.secure}
                    placeholder={props.placeholder}
                    underlineColorAndroid={Colors.blackOpacity(0)}
                    placeholderTextColor={Colors.Placeholder}
                    style={[styles.input, props.input]}
                    autoCapitalize='none'
                />

                {
                    props.iconName &&
                    <TouchableOpacity activeOpacity={props.iconPressable ? 1 : 0.2} onPress={props.iconPress} >
                        <FontAwesomeIcon
                            icon={parseIconFromClassName(icon)}
                            size={RF(2.2)}
                        />
                    </TouchableOpacity>
                }

            </View>
            {
                props.error ?
                    <Text style={[styles.error, orientStyle.error]} >{props.error}</Text>
                    : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
    },
    inputContainer: {
        backgroundColor: Colors.grey1,
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        flex: 1,
        fontFamily: Fonts.GILROY_REG,
        fontSize: RF(2),
        color: Colors.grey2,
    },
    error: {
        color: Colors.danger,
        fontFamily: Fonts.GOTHAM_BOLD,
        fontWeight: "bold"
    }
})

export const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        container: {
            width: "100%",
            marginVertical: VScale(3, 1.5)
        },
        inputContainer: {
            height: VScale(12, 6),
            paddingHorizontal: wo(3, screenWidth),
            borderRadius: wo(1, screenWidth)
        },
        input: {
        },
        error: {
            fontSize: RF(1.8),
            marginLeft: wo(1, screenWidth),
            marginTop: VScale(1, 0.5)
        }
    }
}

export default InputField;