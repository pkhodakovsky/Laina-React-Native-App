import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '../styles';
import { responsiveFontSize as RF } from '../utils/responsiveFunctions';

/**
 *    Simple Styled Title component
 *    @example
 *      <LoginTitle />
 */
function LoginTitle({ title }: { title: string}) {

    return (
        <View style={styles.containerStyle} >
            <Text style={styles.label} >
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: 'center',
    },
    label: {
        fontFamily: Fonts.GILROY_SB,
        color: Colors.title,
        fontSize: RF(2.7)
    },
})

LoginTitle.defaultProps = {
    title: "First Time Login",
}

export default LoginTitle;