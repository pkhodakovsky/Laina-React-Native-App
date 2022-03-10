import React from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';

import FetchingIndicator from './fetchingIndicator';
import { Colors } from "../appStyles";
import AppBackgroundProps from "../types/propsTypes/appBackground";

/**
 * Simple App Background Component which contain props isBusy, flexGrow
 * @param props 
 * @example "widthPercentageOrientation( 20, SCREEN WIDTH )"
 *    @example
 *      <AppBackground>
 *         <Views .... >
 *      </AppBackground>
 *
 */

function AppBackground(props: AppBackgroundProps) {

    return (
        <SafeAreaView style={styles.backgroundContainer} >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} hidden={props.showStatus ? false : true} />
            {
                props.isBusy && <FetchingIndicator />
            }
            {
                props.children
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backgroundContainer: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: Colors.primaryColor
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    }
})

export default AppBackground;