import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Alert, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { DataServices } from '@lainaedge/platformshared';
import { useNavigation } from '@react-navigation/native'

import { AppBackground, AppLogoComp, InputFieldComp, AppButtonComp, LabelComp, LoginTitleComp } from '../../../component';

import { translate } from '../../../common/services/localeService';
import { CommonStyles } from '../../../styles/commonStyles';
import { setRoute } from "../../../redux/action/routeActions";
import { logger } from '../../../common/functions';
import { screenWidth, screenHeight, responsiveFontSize as RF, widthPercentageOrientation as wo, heightPercentageOrientation as ho } from '../../../utils/responsiveFunctions';
import { IReducer } from '../../../redux/reducer';
import { Colors, Fonts } from '../../../styles';
import { loginAction } from '../../../redux/action/authActions';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../common/responsiveFunct';
import { ValidateUserResult } from '@lainaedge/platformshared/lib/types/ValidateUserResult';
import { AuthResult } from '@lainaedge/platformshared/lib/types/AuthResult';

// Login Screen for Coordinator containing app logo component, input Field and button just for design
const dataService = DataServices.instance();

type stateErrorType = {
    trial: string,
    username: string,
    password: string
}

const emptyError = {
    trial: "",
    username: "",
    password: ""
}

function CoordinatorLoginScreen() {

    // initialize dispatcher
    const dispatch = useDispatch();
    const {
        appVersion,
        clientPlatformSV,
        serverPlatformSV,
        serverTDDVersion,
        version
    } = useSelector((state: IReducer) => state.VersionReducer);
    // Sign in function from AuthContext
    const [loading, setLoading] = useState<boolean>(false);
    const navigation = useNavigation()

    // Navigation Object

    // State
    const [trial, setTrial] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<stateErrorType>(emptyError)

    /**
     * The login request handler function
     *
     * @param username string
     * @param password string
     *
     */

    const login = async () => {
        setError(emptyError)
        if (!trial) {
            setError({ ...emptyError, trial: "Field is Required!" });
            return
        } else if (!username) {
            setError({ ...emptyError, username: "Field is Required!" });
            return
        } else if (!password) {
            setError({ ...emptyError, password: "Field is Required!" });
            return
        } else {

            setLoading(true);

            DataServices.setProjectName(trial.toLowerCase())
            const participantAuthResponse: AuthResult = await dataService.authUser(username, password);

            if (participantAuthResponse.isValidLogin) {

                dispatch(setRoute(`/page/portaldashboard`))
                let user = {
                    accessToken: participantAuthResponse.authToken,
                    participantId: username,
                    loginWith: "coordinator"
                }
                // Saving the AuthToken
                dispatch(loginAction(user))

            } else {
                setLoading(false)
                setError({ ...emptyError, password: participantAuthResponse.errorMessage ? participantAuthResponse.errorMessage : "Something went wrong!" })
            }
        }
    }

    // Screen Render
    return (
        <AppBackground showStatus isBusy={loading} >

            <AppLogoComp />
            <ScrollView>
                <View style={styles.sectCont} >

                    <LoginTitleComp title='Coordinator Login' />
                    <LabelComp >{translate("Coordinator Login Label", '')}</LabelComp>
                    <InputFieldComp
                        placeholder="Trial Code"
                        accessibilityLabel={"Coordinator Username field"}
                        value={trial}
                        error={error["trial"]}
                        onChangeText={(value: string) => setTrial(value)}
                    />
                    <InputFieldComp
                        placeholder="Username"
                        accessibilityLabel={"Coordinator Username field"}
                        value={username}
                        error={error["username"]}
                        onChangeText={(value: string) => setUsername(value)}
                    />
                    <InputFieldComp
                        placeholder="Password"
                        accessibilityLabel={"Coordinator password field"}
                        secure={true}
                        error={error["password"]}
                        value={password}
                        onChangeText={(value: string) => setPassword(value)}
                    />

                    <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword" as never)} style={styles.forgetPassCont} >
                        <Text style={styles.forgetPass} >Forget Password</Text>
                    </TouchableOpacity>

                    <AppButtonComp
                        label={translate("Login Button", '')}
                        press={login}
                        accessibilityLabel={"Coordinator Screen Login Button."}
                        accessibilityHint={"Coordinator Screen Login Button."}
                    />
                    <AppButtonComp
                        accessibilityLabel={"Navigates to the previous screen."}
                        accessibilityHint={"Navigates to the previous screen."}
                        label={translate("Back", '')}
                        press={() => navigation.goBack()}
                        containerStyle={CommonStyles.Nbutton}
                        labelStyle={CommonStyles.NbuttonLabel}
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
    },
    forgetPassCont: {
        alignSelf: "flex-end",
        paddingVertical: hp("1%"),
        marginVertical: hp('1%')
    },
    forgetPass: {
        color: Colors.ButtonBar,
        fontSize: RF(1.7)
    }
})

export default CoordinatorLoginScreen;