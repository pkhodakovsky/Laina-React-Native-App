import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { widthPercentageToDP as wp } from '../common/responsiveFunct';
import { DimensionsReducer } from '../common/commonModel';
import { Colors, Heights } from '../styles';
import { useSelector } from "react-redux";

/**
 *    Simple Fetching indication with one props of removePosition which is also not required
 *    @example
 *      <FetchingIndicator />
 */

type Props = {
    addPosition?: boolean // handling condition for styling position whether in the full screen or in a part of screen
}


const FetchingIndicator = ({ addPosition = true }: Props) => {

    // Screen Layout Values
    const { screenHeight, screenWidth, orientation } = useSelector((state: DimensionsReducer) => state.DimensionsReducer);
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    let loaderCont;

    if (addPosition) {
        loaderCont = { ...styles.loaderContPosition, width: screenWidth, height: screenHeight }
    } else {
        loaderCont = { ...styles.loaderCont, marginVertical: VScale(10, 5) }
    }

    return (
        <View style={[loaderCont]} >
            <View style={{ ...styles.cardLoader, backgroundColor: addPosition ? Colors.white : Colors.TabTxt  }} >
                <ActivityIndicator size="large" color={addPosition ? Colors.themeBlue : Colors.white} />
            </View>
        </View>
    )
}
// 

const styles = StyleSheet.create({
    loaderContPosition: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        zIndex: 1,
        backgroundColor: Colors.light_black
    },
    loaderCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cardLoader: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('2%'),
        justifyContent: "center",
        alignItems: "center"
    }
})

export default FetchingIndicator;