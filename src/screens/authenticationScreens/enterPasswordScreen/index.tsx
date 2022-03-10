import React, { useState } from 'react';
import { Linking, StyleSheet, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';

import { DataServices } from '@lainaedge/platformshared';

import { translate } from '../../../common/services/localeService';
import { setRoute } from "../../../redux/action/routeActions";
import { CommonStyles } from '../../../styles/commonStyles';
import { logger } from '../../../common/functions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authStackParamList } from '../../../navigations/authNavigator';
import { AppBackground, AppLogoComp, InputFieldComp, AppButtonComp, LabelComp, LoginTitleComp } from '../../../component';
import { screenWidth, screenHeight, responsiveFontSize as RF, widthPercentageOrientation as wo, heightPercentageOrientation as ho } from '../../../utils/responsiveFunctions';
import { Colors } from '../../../appStyles';
import { IReducer } from '../../../redux/reducer';
import { Fonts } from '../../../styles';
import { loginAction } from '../../../redux/action/authActions';

// Entering Password Screen containing app logo component, input Field with pressable Icons and button just for design
const dataService = DataServices.instance();

function EnterPasswordScreen(props: NativeStackScreenProps<authStackParamList, "EnterPassword">) {

    const dispatch = useDispatch();

    const {
        appVersion,
        clientPlatformSV,
        serverPlatformSV,
        serverTDDVersion,
        version
    } = useSelector((state: IReducer) => state.VersionReducer);

    // Desctruction route parameters
    const { participantId, trialName } = props.route.params;

    // Form Values
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    // Sign In handler
    const signInPress = async () => {
        if (!password) {
            setError("This field is Required!")
            return
        }
        setError("")
        try {

            setLoading(true)

            // Main Participant sign in API Handler
            const successRespnse = await dataService.authParticipant(participantId, password);

            setLoading(false)

            console.log(successRespnse, "successRespnse")
            
            if (!successRespnse.success) {
                setError(successRespnse.errorMessage || 'No Error')
                return 
            }
            
            let userAsync = {
                token: successRespnse.authToken,
                participantId,
                trialName
            }
            let user = {
                accessToken: successRespnse.authToken,
                participantId,
                loginWith: "participant"
            }
            AsyncStorage.setItem("@token", JSON.stringify(userAsync))

            dispatch(setRoute(`page/participant_start/${participantId}`))

            dispatch(loginAction(user))

        } catch (error) {

            // Logging the to console if API Fails
            logger.log('39 printing:', error, 'src_screens_authenticationScreens_enterPasswordScreen_index.tsx');
        }
    }

    return (
        <AppBackground showStatus isBusy={loading} >

            <AppLogoComp />

            <View style={styles.sectCont} >

                <LoginTitleComp title="VTMS Research Platform" />
                <LabelComp >{translate("Password Screen Label", {})}</LabelComp>

                <InputFieldComp
                    placeholder="Password"
                    accessibilityLabel={"Enter password"}
                    secure={!showPassword}
                    iconName={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                    iconPressable={true}
                    iconPress={() => setShowPassword(!showPassword)}
                    error={error}
                    value={password}
                    onChangeText={(value: string) => setPassword(value)}
                />
                <AppButtonComp
                    label={translate("Password Login Button", {})}
                    press={signInPress}
                    accessibilityLabel={"Login"}
                    accessibilityHint={"Login"}
                />
                <AppButtonComp
                    accessibilityLabel={"Navigates to mail app to Contact Trial Support."}
                    accessibilityHint={"Navigates to mail app to Contact Trial Support."}
                    label={translate("Trial Button", '')}
                    press={() => Linking.openURL('mailto:support@lainaent.com')}
                    containerStyle={CommonStyles.Nbutton}
                    labelStyle={CommonStyles.NbuttonLabel}
                />
                <Text style={styles.footerText} >CPS: {clientPlatformSV}, SPS: {serverPlatformSV}, UI: {appVersion},{'\n'}TDD: {serverTDDVersion}, V: {version}</Text>

            </View>
        </AppBackground>

    )
}

const styles = StyleSheet.create({
    sectCont: {
        width: wo(85, screenWidth),
        alignSelf: "center",
        backgroundColor: Colors.white,
        borderRadius: wo(5, screenWidth),
        overflow: "hidden",
        marginVertical: ho(4, screenHeight),
        paddingHorizontal: wo(4, screenWidth),
        paddingVertical: ho(4, screenHeight)
    },
    footerText: {
        color: Colors.darkGrey,
        fontSize: RF(1.7),
        fontFamily: Fonts.GILROY_REG,
        textAlign: "center",
        marginTop: ho(2, screenHeight)
    }
})

export default EnterPasswordScreen;
