import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { parseIconFromClassName } from "../../../common/fontAwesomeIcon";

import { useSelector } from "react-redux";

import { Heights, Colors } from '../../../styles';
import { widthPercentageOrientation as wo, responsiveFontSize as RF, widthPercentageToDP as wp } from '../../../common/responsiveFunct';
import styles from '../styles';
import orientationStyle, { IOrientationStyle } from '../orientationStyles';
import { DimensionsReducer } from '../../../common/commonModel';
import { pageListItemTypes } from "../../types";

const PageListItem = ({ item, pressList }: pageListItemTypes) => {

    const { screenHeight, screenWidth, orientation } = useSelector((state: DimensionsReducer) => state.DimensionsReducer);

    const [listPressStatus, setListPressStatus] = useState(false);

    const orient_Style = pageOrientationStyle(screenWidth, screenHeight, orientation);
    const CommonOrientHelper: IOrientationStyle = orientationStyle(screenWidth, screenHeight, orientation);

    const btnPress = () => {
        if (!listPressStatus) {
            setListPressStatus(true)
            pressList(item.click);
        }
    }
    let background_Color = item.TaskStatus?.charAt(0).toLowerCase() !== "p" ? Colors.Completed : Colors.Pending;
    return (
        <View style={[orient_Style.listChildCont, { flexDirection: "row", width: "100%", paddingLeft: wp("5%"), alignSelf: "center" }]} >
            {
                item.TaskIcon ?
                    <View style={[pageStyles.leftIconList, orient_Style.leftIconList]} >
                        {
                            item.TaskIcon ?
                                <FontAwesomeIcon size={RF(2.7)} icon={parseIconFromClassName(item.TaskIcon) ? parseIconFromClassName(item.TaskIcon) : parseIconFromClassName("fas fa-question")} />
                                : null
                        }
                    </View> : null
            }
            <View style={[orient_Style.centerList, pageStyles.centerListCont]} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    {
                        item.TaskTitle ? <Text style={[styles.title, { fontSize: RF(2.2) }]} >{item.TaskTitle}</Text> : null
                    }
                    {
                        item.TaskSubTitle ? <Text style={[styles.note, { fontSize: RF(1.9) }]} >{item.TaskSubTitle}</Text> : null
                    }
                </View>
                <View style={[pageStyles.rightListItem, orient_Style.leftIconList]} >
                    {
                        item.TaskStatus ? <TouchableOpacity onPress={() => btnPress()} style={[CommonOrientHelper.taskStatusView, styles.taskStatusView, { backgroundColor: background_Color }]} >
                            <Text style={[styles.taskStatus, { fontSize: RF(1.9) }]} >{item.TaskStatus}</Text>
                        </TouchableOpacity> : null

                    }
                    {
                        item.click ?
                            <TouchableOpacity onPress={() => btnPress()} style={orient_Style.rightIconCont} >
                                <FontAwesomeIcon size={RF(2.1)} style={{ color: Colors.primaryColor }} icon={parseIconFromClassName("fas fa-chevron-right")} />
                            </TouchableOpacity>
                            : null
                    }
                </View>
            </View>
        </View>
    );
}

const pageOrientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    return {
        listChildCont: {
            paddingVertical: VScale(2, 1)
        },
        leftIconList: {
            paddingTop: VScale(1.5, 0.7)
        },
        centerList: {
            paddingHorizontal: wo('1%', screenWidth)
        },
        rightIconCont: {
            paddingHorizontal: wo('3%', screenWidth),
        }
    }
}

const pageStyles = StyleSheet.create({
    leftIconList: {
        flex: 0.1,
        alignItems: "flex-start"
    },
    rightListItem: {
        flexDirection: "row",
        alignItems: "center"
    },
    centerListCont: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
    }
})

export default PageListItem;