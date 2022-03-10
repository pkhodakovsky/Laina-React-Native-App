import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { parseIconFromClassName } from "../../../common/fontAwesomeIcon";

import { Colors, Fonts, Heights } from '../../../styles';
import { widthPercentageToDP as wp, responsiveFontSize as RF } from '../../../common/responsiveFunct';
import { Section_Card1ProsTypes } from '../../types';
import { getTestID } from '../../../common/functions';

const PageDashButton = ({ orientData, title, icon, press }: Section_Card1ProsTypes) => {
    const { orientation, screenHeight, screenWidth } = orientData;
    const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);

    return (
        <View style={{ alignItems: "center", width: "30%" }} >
            {
                icon && <View style={[styles.linkIconCont]} >
                    <FontAwesomeIcon
                        style={orient_Style.fontASize}
                        size={RF(3.5)}
                        icon={parseIconFromClassName(icon)}
                    />
                </View>
            }
            <View style={[{ width: '100%', alignItems: "center" }]} >
                <TouchableOpacity accessible accessibilityLabel={title} testID={getTestID(title)} onPress={() => press()} style={[styles.linkIconTxtChild, orient_Style.linkIconTxtChild]} >
                    <Text style={[styles.linkIconTxt, orient_Style.linkIconTxt]} >{title}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        fontASize: {
            marginVertical: VScale(4, 2)
        },
        linkIconTxtChild: {
            width: '75%',
            height: VScale(13, 5.5),
            top: - VScale(2, 1),
        },
        linkIconTxt: {
            fontSize: RF(1.9),
            lineHeight: VScale(5, 2)
        },
    }
}

const styles = StyleSheet.create({
    linkIconCont: {
        justifyContent: "center",
        width: '80%',
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: Colors.orangeColor,
    },
    linkIconTxtChild: {
        borderRadius: wp('2%'),
        backgroundColor: Colors.orangeColor,
        justifyContent: 'center',
        alignItems: "center"
    },
    linkIconTxt: {
        fontFamily: Fonts.GOTHAM_BOLD,
        color: Colors.white,
        width: '80%',
        alignSelf: "center",
        fontWeight: "bold",
        textAlign: "center",
    },
})

export default PageDashButton;