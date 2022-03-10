import * as React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';

import { widthPercentageToDP as wp, widthPercentageOrientation as wo, responsiveFontSize as RF } from '../common/responsiveFunct';

import { Fonts, Colors } from '../styles';

import { radioPropsTypes, customRadioButtonProps, radioPropsDataType } from "./types";
import HtmlConvert from "../common/textFormating";
import { getTestID } from '../common/functions';

export const RadioButton = (props: radioPropsTypes) => {

    // Layout Style Values
    const { screenHeight, screenWidth, orientation } = props.screenHWO;
    const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);

    // Colors of the input
    let circleNTextColor = "";

    // Changing the color and the design of the input based on the selection.
    if (props.getValue) {
        if (props.selectedValue !== undefined) {
            circleNTextColor = props.data.english == props.selectedValue ? "#034a6d" : Colors.radioColor;
        } else {
            circleNTextColor = Colors.radioColor
        }
    } else {
        circleNTextColor = props.data == props.selectedValue ? "#034a6d" : Colors.radioColor;

    }

    // Brian - Change to disabled color when disabled
    if (props.disable) circleNTextColor = Colors.radioColorDisabled;

    /**
     * This function Sets the label on the right side of the checkbox.
     * @returns Label of the input (Checkbox)
     * @example <Text style={{...styles.radioTxt}} >I am the label</Text>
    */
    const renderLabel = () => {

        // Getting the value of label on the basis of its type
        let label = typeof props.getValue === 'boolean' ? props.data.toString() : props.data.english;

        /**
         * Converting the html line breaks to text line breaks
         * @example "<br> String" converts to "\n String"
         */
        var addLineBreak = label.replace(/<br>/g, "\n");

        let HtmlConvertedArray = HtmlConvert(addLineBreak);
        /**
         * Converting html <b></b> tags to React Native <Text></Text> Tags
         * @example <b>I should be bold</b> coverts to <Text style={{fonWeight: "bold"}}> 
         */
        // const convertedText: convertedTextType = handleBoldTagsInString(addLineBreak)
        let labelColor = props.disable ? Colors.disableTxt : Colors.radioTxt;

        return <Text style={{ ...styles.radioTxt, ...orient_Style.radioTxt, ...props.radioTxt, color: labelColor }} >{HtmlConvertedArray}</Text>
    }

    // Checking if the input type is a multiselect.
    let checkMulti: boolean = props.multiSelect === "MultiSelect";

    // Styles of the Checkbox based on the selection type i.e. Multiselect / Boolean
    let optionOrientStyle: ViewStyle = checkMulti ? orient_Style.radioSquareB : orient_Style.radioCircleB;
    let optionActiveStyle: ViewStyle = checkMulti ? orient_Style.square : orient_Style.circle;

    if (checkMulti) {
        // Checking if value is selected or not.
        let checkAvailability: boolean = props.selectedValue.includes(props.data.code);

        return (
            <TouchableOpacity accessible testID={getTestID(props.radioTxt)} accessibilityLabel={props.radioTxt} onPress={() => !props.disable ? props.onPressRadio() : null} style={{ ...styles.rContainer, ...props.radioCont }} >
                <View style={{ ...styles.radioCircleB, ...optionOrientStyle, borderColor: checkAvailability ? "#034a6d" : Colors.radioColor }} >
                    {
                        checkAvailability && <View style={[styles.circle, optionActiveStyle]} />
                    }
                </View>
                {
                    renderLabel()
                }
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity onPress={() => !props.disable ? props.onPressRadio() : null} style={{ ...styles.rContainer, ...props.radioCont }} >
                <View style={{ ...styles.radioCircleB, ...optionOrientStyle, borderColor: circleNTextColor }} >
                    {props.getValue ?
                        (props.selectedValue !== undefined &&
                            (props.data.english == props.selectedValue && <View style={[styles.circle, optionActiveStyle]} />))
                        : props.data == props.selectedValue && <View style={[styles.circle, orient_Style.circle]} />}
                </View>
                {
                    renderLabel()
                }
            </TouchableOpacity>
        )
    }
}

export const CustomRadioBtn = (props: customRadioButtonProps) => {
    console.log("CUSTOM RADIUO PROPS ==================>", props)
    return (
        <View style={{ ...styles.rContainer, ...props.radioCont }} >
            {
                props.data ? props.data.map((v: radioPropsDataType, i: number) => {
                    return (
                        <RadioButton
                            getValue={props.getValue}
                            type={props.type}
                            disable={props.disable ? props.disable : false}
                            selectedValue={props.selectedValue}
                            screenHWO={props.screenHWO}
                            multiSelect={props.type}
                            key={i}
                            data={v}
                            radioTxt={props.radioTxt}
                            radioCont={props.rContainer}
                            onPressRadio={() => props.setValue ? props.setValue(v) : undefined}
                        />
                    )
                })
                    : []}
        </View>
    )
}

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    return {
        radioCircleB: {
            width: wo('5%', screenWidth),
            height: wo('5%', screenWidth),
            borderRadius: wo('5%', screenWidth) / 2,
            padding: 2
        },
        radioSquareB: {
            width: wo('5%', screenWidth),
            height: wo('5%', screenWidth),
            borderRadius: wo('1%', screenWidth) / 2,
            padding: 2
        },
        square: {
            borderRadius: wo('0.5%', screenWidth) / 2,
            width: wo('3%', screenWidth),
            height: wo('3%', screenWidth),
        },
        circle: {
            borderRadius: wo('3%', screenWidth) / 2,
            width: wo('3%', screenWidth),
            height: wo('3%', screenWidth),
        },
        radioTxt: {
            fontSize: RF(2),
            // marginTop: ho('0.2%', screenHeight)
        }
    }
}

const styles = StyleSheet.create({
    rContainer: {
        flex: 1,
        flexDirection: "row"
    },
    radioCircleB: {
        borderWidth: wp('0.3%'),
        justifyContent: "center",
        alignItems: "center"
    },
    circle: {
        backgroundColor: "#034a6d",
    },
    radioTxt: {
        fontFamily: Fonts.GILROY_REG,
        marginLeft: wp('2%'),
        width: "90%"
    },
})
