import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { DataServices } from '@lainaedge/platformshared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setRoute } from "../../../redux/action/routeActions";

import { translate } from '../../../common/services/localeService';
import { authStackParamList } from '../../../navigations/authNavigator';
import { logger } from '../../../common/functions';
import {
    AppBackground,
    AppLogoComp,
    InputFieldComp,
    AppButtonComp,
    LabelComp,
    LoginTitleComp
} from '../../../component';
import {
    screenWidth,
    screenHeight,
    responsiveFontSize as RF,
    widthPercentageOrientation as wo,
    heightPercentageOrientation as ho
} from '../../../utils/responsiveFunctions';
import { Colors } from '../../../appStyles';
import { IReducer } from '../../../redux/reducer';
import { Fonts } from '../../../styles';
import { loginAction } from '../../../redux/action/authActions';

// Setting Password Screen containing app logo component, input Field with icons and button
const dataService = DataServices.instance();
type Props = NativeStackScreenProps<authStackParamList, 'SetPassword'>;

function SetPasswordScreen({ route }: Props) {
    const dispatch = useDispatch();

    const {
        appVersion,
        clientPlatformSV,
        serverPlatformSV,
        serverTDDVersion,
        version
    } = useSelector((state: IReducer) => state.VersionReducer);

    // Destructuring route params
    const { participantId, trialName } = route.params;

    // Form Values
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [passwordRetype, setPasswordRetype] = useState<string>("")
    const [showPasswordRetype, setShowPasswordRetype] = useState<boolean>(false)
    const [error, setError] = useState<{ password?: string, confirmPassword?: string | undefined }>({ password: '', confirmPassword: '' })
    const [loading, setLoading] = useState<boolean>(false)

    const setParicipantPassword = async () => {

        // Update the state with empty errors
        setError({ password: "", confirmPassword: "" })

        // Password and confirmPass dont exist
        if (!password && !passwordRetype) {
            setError({ password: "This field is Required!", confirmPassword: "This field is Required!" })
            return
        }

        // if password doesnot exist.
        if (!password) {
            setError({ ...error, password: "This field is Required!", confirmPassword: "" })
            return
        }

        // If confirmPass doesnot exist.
        if (!passwordRetype) {
            setError({ ...error, confirmPassword: "This field is Required!", password: "" })
            return
        }

        // If password is less than 6 characters
        if (password.length < 6) {
            setError({ ...error, password: "Less than 6 characters are not allowed", confirmPassword: "" })
            return
        }

        // If reset password is less than 6 characters
        if (passwordRetype.length < 6) {
            setError({ ...error, confirmPassword: "Less than 6 characters are not allowed", password: "" })
            return
        }

        // If password is not equal to confirmPass
        if (password !== passwordRetype) {
            setError({ password: "", confirmPassword: "Password doesn't match Please Try again" })
            return
        }

        // If all the above conditions are false then proceed further ============>

        try {

            setLoading(true)

            // Main Participant password reset API Function
            if (participantId) {
                const responseSetPassword = await dataService.participantSetPassword(participantId, password);

                // If API throws an error
                if (!responseSetPassword.success) {
                    setLoading(false)
                    setError({ password: "", confirmPassword: responseSetPassword.errorMessage })
                    return
                }

                const successRespnse = await dataService.authParticipant(participantId, password);

                if (!successRespnse.success) {
                    setLoading(false)
                    setError({ confirmPassword: successRespnse.errorMessage })
                    return
                }
                setLoading(false)

                // console.log(successRespnse)
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

            }

        } catch (error) {

            // Consoling the error if API fails.
            logger.log('50 printing:', error, 'src_screens_authenticationScreens_setPasswordScreen_index.tsx');
        }
    }

    return (

        <AppBackground showStatus isBusy={loading} >

            <AppLogoComp />
            <ScrollView>

                <View style={styles.sectCont} >


                    <LoginTitleComp />
                    <LabelComp>Choose a password to continue</LabelComp>

                    <InputFieldComp
                        placeholder="Password"
                        accessibilityLabel={"Set Password"}
                        value={password}
                        secure={!showPassword}
                        onChangeText={(value: string) => setPassword(value)}
                        iconName={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                        iconPressable={true}
                        error={error["password"]}
                        iconPress={() => setShowPassword(!showPassword)}
                    />
                    <InputFieldComp
                        placeholder="Retype to confirm"
                        value={passwordRetype}
                        accessibilityLabel={"Confirm Password"}
                        secure={!showPasswordRetype}
                        onChangeText={(value: string) => setPasswordRetype(value)}
                        iconName={showPasswordRetype ? "fa fa-eye" : "fa fa-eye-slash"}
                        iconPressable={true}
                        error={error["confirmPassword"]}
                        iconPress={() => setShowPasswordRetype(!showPasswordRetype)}
                    />

                    <AppButtonComp
                        accessibilityLabel={"Set Password and Login"}
                        accessibilityHint={"Set Password and Login"}
                        label={translate("Set Password Button", '')}
                        press={setParicipantPassword}
                    />
                    <Text style={styles.footerText} >CPS: {clientPlatformSV}, SPS: {serverPlatformSV}, UI: {appVersion},{'\n'}TDD: {serverTDDVersion}, V: {version}</Text>

                </View>
            </ScrollView>

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

export default SetPasswordScreen;