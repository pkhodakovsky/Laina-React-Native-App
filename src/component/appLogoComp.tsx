import React from 'react';
import { Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import ImagesSrc from '../common/images';
import { screenWidth, widthPercentageOrientation as wo } from "../utils/responsiveFunctions";

const { height } = Dimensions.get("window");

/**
 *    Simple Logo Image Wrapper that will display the App Logo Icon on the top of the screen with App Title
 *    @example
 *    <AppLogo />
 */
function AppLogo() {
    return (
        <ImageBackground source={ImagesSrc.vectorLinesBg} style={styles.logoContainer} >
            <Image style={styles.logo} resizeMode="contain" source={ImagesSrc.appIconNew} />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: height * 0.22,
        overflow: 'hidden',
    },
    logo: {
        width: wo(80, screenWidth),
        height: wo(80, screenWidth) / 2.9,
    },
})

export default AppLogo;