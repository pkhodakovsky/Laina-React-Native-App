import * as React from 'react';
import { Text, StyleSheet, TextStyle, View } from 'react-native';
import * as NB from 'native-base';

import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { parseIconFromClassName } from "../../../common/fontAwesomeIcon";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from '../styles';
import orientationStyle from '../orientationStyles';
import { Colors, Fonts, Heights } from '../../../styles';
import { DimensionsReducer } from '../../../common/commonModel';
import { widthPercentageOrientation as wo, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../../common/responsiveFunct';
import { StepGroup, StepText } from '@lainaedge/platformshared';
import HtmlConvert from "../../../common/textFormating";

type PageTextProps = {
    step: StepGroup | StepText,
    that: any,
    checkGroup?: string
    sectionStatus?: string
}

const PageText = ({ step, that, checkGroup, sectionStatus }: PageTextProps) => {

    const { screenHeight, screenWidth, orientation } = useSelector((state: DimensionsReducer) => state.DimensionsReducer);

    const orient_Style = pageOrientationStyle(screenWidth, screenHeight, orientation);
    const CommonOrientHelper: any = orientationStyle(screenWidth, screenHeight, orientation);

    var addLineBreak = step.text.replace(/<br>/g, "\n");

    let HtmlConvertedArray = HtmlConvert(addLineBreak);
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    let addMargin = !checkGroup && !sectionStatus ? { marginHorizontal: "5%" } : {}
    let textStyle: TextStyle[] = [addMargin];
    if (that.pageRoute === "/page/menu_quickaccess") {
        if (step.options.checkOption('Title')) {
            textStyle.unshift(pageStyles.menutitle, { ...orient_Style.menuTitle })
        } else {
            textStyle.unshift(pageStyles.subTitle, { ...orient_Style.title, fontSize: RF(1.9), color: Colors.desciption1 })
        }
    } else {
        if (step.options.checkOption('Title')) {
            textStyle.unshift(styles.title, orient_Style.title);
        } else if (step.options.checkOption('SubTitle')) {
            textStyle.unshift(pageStyles.subTitle, orient_Style.title, { fontSize: RF(1.9) })
        } else if (step.options.checkOption('TaskTitle')) {
            textStyle.unshift(styles.title, { fontSize: RF(2.1) })
        } else if (step.options.checkOption('CardTitle')) {
            textStyle.unshift(styles.title, orient_Style.title, { fontSize: RF(1.9) })
        } else if (step.options.checkOption('CardText')) {
            textStyle.unshift(pageStyles.subTitle, { ...orient_Style.title, fontSize: RF(1.9) })
        } else if (step.options.checkOption('SectionTitle')) {
            textStyle.unshift(styles.sectionTitle, orient_Style.secTitle, { fontSize: RF(2.5) })
        } else if (step.options.checkOption('HintLine')) {
            textStyle.unshift(pageStyles.hintTxt, { ...orient_Style.title, fontSize: RF(1.9) })
        } else {
            textStyle.unshift(pageStyles.regular, {
                ...orient_Style.title,
                fontSize: RF(2.0),
                color: step.options.checkOption('AlertDanger') ? Colors.danger1 : Colors.title
            })
        }
    }

    if (step.options.checkOption('Warning')) {
        return (
            <View style={[pageStyles.warningCont, orient_Style.warningCont]} >
                <NB.Icon name="error-outline" fontSize={RF(1.9)} color={pageStyles.warningIcon.color} />
                <Text style={[pageStyles.warningTxt, orient_Style.warningTxt]} >{step.text}</Text>
            </View>
        )
    } else if (step.options.checkOption('TaskSubTitle')) {
        return <NB.Text style={[addMargin]} >{step.text}</NB.Text>
    } else if (step.options.checkOption('TaskIcon')) {
        return step.text ?
            <FontAwesomeIcon
                icon={parseIconFromClassName(step.text) ? parseIconFromClassName(step.text) : parseIconFromClassName("fas fa-question")}
                size={RF(2.6)}
            /> : null
    } else if (step.options.checkOption('TaskStatus')) {
        let background_Color = step.text.charAt(0).toLowerCase() !== "p" ? Colors.Success : Colors.listTxt;
        return (
            <View style={[CommonOrientHelper.taskStatusView, styles.taskStatusView, { backgroundColor: background_Color }]} >
                <Text style={[styles.taskStatus, { fontSize: RF(1.7) }]} >{step.text}</Text>
            </View>
        )
    } else if (step.options.checkOption('SuccessCard')) {
        return (
            <View style={[pageStyles.cardTitleCont, orient_Style.cardTitleCont]} >
                <FontAwesomeIcon
                    icon={parseIconFromClassName("far fa-thumbs-up")}
                    size={RF(2.6)}
                    style={{ color: Colors.successColor }}
                />
                <Text style={[styles.cardTitle, { ...orient_Style.title, fontSize: RF(2.2), color: Colors.successColor }]} >{step.text}</Text>
            </View>
        )
    } else if (step.options.checkOption('PrimaryCard')) {
        return (
            <View style={[pageStyles.cardTitleCont, orient_Style.cardTitleCont, { paddingHorizontal: 0 }]} >
                <Icon name="bullseye-arrow" style={{ fontSize: RF(2.6), color: Colors.primaryColor }} />
                <Text style={[styles.cardTitle, { ...orient_Style.title, fontSize: RF(2.2), color: Colors.primaryColor }]} >{step.text}</Text>
            </View>
        )
    } else if (step.options.checkOption('BulletItem')) {
        return (
            <View style={[pageStyles.bulletCont, orient_Style.bulletCont]} >
                <FontAwesomeIcon
                    icon={parseIconFromClassName("far fa-thumbs-up")}
                    size={RF(1.6)}
                    style={{ color: Colors.title, paddingTop: VScale(1.2, 0.7) }}
                />
                <Text style={[pageStyles.regular, { ...orient_Style.bulletText }]} >{step.text}</Text>
            </View>
        )
    } else if (step.options.checkOption('AlertWarning')) {
        return (
            <View style={[pageStyles.AlertWarningCont, orient_Style.AlertWarningCont]}>
                <Text style={[pageStyles.regular, { ...orient_Style.alertTxt, fontSize: RF(1.9) }]} >{step.text}</Text>
            </View>
        )
    }

    return <Text style={textStyle} >{HtmlConvertedArray}</Text>
}

const pageOrientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        title: {
            fontSize: RF(2.4),
            marginVertical: VScale(1, 0.5),
        },
        menuTitle: {
            fontSize: RF(2.5),
            marginVertical: VScale(1, 0.5),
            marginHorizontal: wo('4%', screenWidth),
        },
        warningCont: {
            paddingHorizontal: wo('3%', screenWidth),
            marginHorizontal: wo('3%', screenWidth),
            marginVertical: VScale(2, 1),
            paddingVertical: VScale(2, 1),
        },
        cardTitleCont: {
            paddingHorizontal: wo('3%', screenWidth),
            marginVertical: VScale(2, 1),
        },
        warningTxt: {
            fontSize: RF(1.9),
            marginLeft: wo('1%', screenWidth)
        },
        bulletCont: {
            paddingVertical: VScale(2, 1),
        },
        bulletText: {
            fontSize: RF(1.9),
            paddingHorizontal: wo('2%', screenWidth),
        },
        secTitle: {
            marginTop: VScale(2, 1),
            // marginHorizontal: wo('5%', screenWidth),
        },
        AlertWarningCont: {
            marginTop: VScale(4, 2),
            marginHorizontal: wo('3%', screenWidth),
            borderRadius: wp('1%'),
            borderWidth: 1,
        },
        alertTxt: {
            margin: wo('3%', screenWidth),
        },
    }
}

const pageStyles = StyleSheet.create({
    menutitle: {
        fontFamily: Fonts.SF_UI,
        fontWeight: "bold",
        color: Colors.black,
    },
    subTitle: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        color: Colors.desciption
    },
    warningCont: {
        backgroundColor: Colors.Home_Warning_BG,
        borderRadius: wp('10%'),
        flexDirection: "row",
    },
    cardTitleCont: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center'
    },
    bulletCont: {
        flexDirection: "row",
    },
    warningTxt: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        flexWrap: "wrap",
        color: Colors.Home_Warning_Txt,
    },
    warningIcon: {
        color: Colors.Home_Warning_Txt,
    },
    regular: {
        fontFamily: Fonts.SF_UI,
        color: Colors.title
    },
    hintTxt: {
        fontFamily: Fonts.GILROY_REG,
        color: "#034a6d"
    },
    AlertWarningCont: {
        backgroundColor: Colors.Alert_Warning_BG,
        borderColor: Colors.themeBlue,
    },
})

export default PageText;