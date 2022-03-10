import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Colors, Fonts, Heights } from '../../../styles';
import { widthPercentageToDP as wp, responsiveFontSize as RF } from '../../../common/responsiveFunct';
import { Section_Card2ProsTypes } from "../../types";

const PageDashStat = ({ orientData, cardTitle, count_title, participant_Count, onPress }: Section_Card2ProsTypes) => {
    const { orientation, screenHeight, screenWidth } = orientData;
    const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);

    return (
        <TouchableOpacity onPress={onPress} style={{ width: '100%', paddingHorizontal: wp('1%') }} >
            <View style={[styles.section2CardUpper, orient_Style.section2CardUpper]} >
                <Text style={[styles.cardUpperTxt, { fontSize: cardTitle.length > 18 ? RF(1.3) : RF(1.6) }]} >{cardTitle}</Text>
            </View>
            <View style={[styles.section2CardBottom, orient_Style.section2CardBottom]} >
                <Text style={[styles.cardBottomTxtH, orient_Style.cardBottomTxtH]} >{participant_Count}</Text>
                <Text style={[styles.cardBottomTxtH, orient_Style.cardBottomTxtLabel]} >{count_title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        section2CardUpper: {
            paddingTop: VScale(2, 1),
            height: VScale(16,8)
        },
        section2CardBottom: {
            top: - VScale(2.5, 1.5),
            paddingVertical: VScale(4, 2)
        },
        cardBottomTxtH: {
            fontSize: RF(2.5)
        },
        cardBottomTxtLabel: {
            fontSize: RF(1.8)
        },
    }
}

const styles = StyleSheet.create({
    section2CardUpper: {
        width: '95%',
        alignSelf: "center",
        backgroundColor: Colors.theme_LightBlue,
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
        alignItems: "center",
        paddingHorizontal: wp('1%')
    },
    cardUpperTxt: {
        fontFamily: Fonts.GOTHAM_BOLD,
        color: Colors.white,
        fontWeight: "bold",
        textAlign: "center",
    },
    section2CardBottom: {
        width: '95%',
        backgroundColor: Colors.white,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        borderRadius: wp('2%'),
        borderColor: Colors.theme_LightBlue,
        borderWidth: 1,

    },
    cardBottomTxtH: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        color: Colors.dashboardCountTxt,
        fontWeight: "bold",
        textAlign: "center"
    },
})

export default PageDashStat;