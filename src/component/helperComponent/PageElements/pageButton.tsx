import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { parseIconFromClassName } from "../../../common/fontAwesomeIcon";

import { CommonStyles } from '../../../common/commonStyles';
import { Colors, Fonts } from '../../../styles';
import { PageButtonProps } from "../../../component/interfaces";
import { widthPercentageToDP as wp, widthPercentageOrientation as wo, heightPercentageToDP as hp, responsiveFontSize as RF } from '../../../common/responsiveFunct';
import { getTestID } from '../../../common/functions';


const PageButton = ({ opt, labelStyle, buttonStyle, that, onPress }: PageButtonProps) => {
    const { screenWidth } = that.orientData;
    let label = opt.text;
    let checkIcon;
    if (opt.hasOwnProperty("option_2")) {
        checkIcon = opt.option_2.indexOf("fa")
    } else if (opt.hasOwnProperty("option2")) {
        checkIcon = opt.option2.indexOf("fa")
    }
    if (that.pageRoute === "/page/menu_quickaccess") {
        const checkElement = opt.text.indexOf("<");
        if (checkElement !== -1) {
            const reIcon = /(<[^>]+>)/;
            const matches = opt.text.match(reIcon);
            let parsedIcon = null;
            let labelText = "";
            if (!parsedIcon && !labelText && matches && matches[0]) {
                parsedIcon = parseIconFromClassName(matches[1].replace("<", "").replace(">", ""));
                labelText = opt.text.replace(reIcon, "");
            } else {
                labelText = opt.text;
            }
            return (
                <TouchableOpacity accessible accessibilityLabel={label} testID={getTestID(label)} onPress={() => onPress()} style={[pageStles.menuBtnCont, { paddingHorizontal: wo('5%', screenWidth) }]} >
                    {parsedIcon ?
                        <FontAwesomeIcon
                            icon={parsedIcon ? parsedIcon : parseIconFromClassName("fas fa-question")}
                            size={RF(2.7)}
                            style={{ color: Colors.black }}
                        /> : null}
                    <Text style={[{ ...pageStles.label, fontSize: RF(2.2) }]} >{labelText}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity accessible accessibilityLabel={label} testID={getTestID(label)} onPress={() => onPress()} style={[pageStles.menuBtnCont, { paddingHorizontal: wo('5%', screenWidth) }]} >
                {
                    opt.option_2 ?
                        <FontAwesomeIcon
                            icon={parseIconFromClassName(opt.option_2) ? parseIconFromClassName(opt.option_2) : parseIconFromClassName("fas fa-question")}
                            size={RF(2.7)}
                            style={{ color: Colors.black }}
                        /> : null
                }
                <Text style={[{ ...pageStles.label, fontSize: RF(2.2) }]} >{label}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity accessible accessibilityLabel={label} testID={getTestID(label)} onPress={() => onPress()} style={[buttonStyle]} >
            {
                checkIcon !== -1 &&
                    opt.option_2 ?
                    <FontAwesomeIcon
                        icon={parseIconFromClassName(opt.option_2) ? parseIconFromClassName(opt.option_2) : parseIconFromClassName("fas fa-question")}
                        size={RF(3.2)}
                        style={pageStles.buttonIcon}
                    /> : null
            }

            <Text style={[CommonStyles.btnTxt, labelStyle]} >{label}</Text>
        </TouchableOpacity>
    )
}

const pageStles = StyleSheet.create({
    label: {
        fontFamily: Fonts.SF_UI,
        fontWeight: "400",
        marginLeft: wp('3%'),
        color: Colors.black
    },
    menuBtnCont: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: hp('2%'),
        alignItems: "center"
    },
    buttonIcon: {
        color: Colors.white,
        marginRight: wp("2%")
    }
})

export default PageButton;