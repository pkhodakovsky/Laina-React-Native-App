import React from 'react';
import { Image, StyleSheet, ImageBackground } from 'react-native';
import { ImagesSrc } from "../common";

import { AppBackground } from '../component';
import {
    screenWidth,
    screenHeight,
    widthPercentageOrientation as wo,
    heightPercentageOrientation as ho
} from "../utils/responsiveFunctions";

// Simple splashscreen containing logo component and fetching indicator just for design

function SplashScreen() {
    return (
        <AppBackground >
            <ImageBackground source={ImagesSrc.splashScreen} style={styles.splash} resizeMode="stretch" >
                <Image source={ImagesSrc.appIconNew} style={styles.logo} />
            </ImageBackground>
        </AppBackground>
    )
}

const styles = StyleSheet.create({
    splash: {
        width: screenWidth,
        height: screenHeight
    },
    logo: {
        width: wo(88, screenWidth),
        height: wo(88, screenWidth) / 2.9,
        resizeMode: "contain",
        marginTop: ho(30, screenHeight),
        alignSelf: "center"
    }
})

export default SplashScreen;