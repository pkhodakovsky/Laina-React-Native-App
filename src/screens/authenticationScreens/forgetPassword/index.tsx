import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DataServices } from "@lainaedge/platformshared";
import { useSelector } from "react-redux";

import {
    AppBackground,
    AppLogoComp,
    InputFieldComp,
    AppButtonComp,
    LabelComp,
    LoginTitleComp
} from '../../../component';
import { translate } from '../../../common/services/localeService';
import { authStackParamList } from '../../../navigations/authNavigator';

import { CommonStyles } from '../../../styles/commonStyles';
import { logger } from '../../../common/functions';
import { Colors, Fonts } from '../../../styles';
import { ValidateParticipantResult } from '@lainaedge/platformshared/lib/types/ValidateParticipantResult';
import {
    screenWidth,
    screenHeight,
    responsiveFontSize as RF,
    widthPercentageOrientation as wo,
    heightPercentageOrientation as ho
} from '../../../utils/responsiveFunctions';
import { IReducer } from '../../../redux/reducer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../common/responsiveFunct';

// Login Screen containing app logo component, input Field and button just for design

const dataService = DataServices.instance();
type Props = NativeStackScreenProps<authStackParamList, 'LoginScreen'>;

function ForgetPassword({ route, navigation }: Props) {

    const {
        appVersion,
        clientPlatformSV,
        serverPlatformSV,
        serverTDDVersion,
        version
    } = useSelector((state: IReducer) => state.VersionReducer);

    // Form Values
    const [username, setUsername] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [showMess, setShowMess] = useState<boolean>(false);

    const [error, setError] = useState<{
        username?: string,
        code?: string,
        pass?: string,
        confirmPass?: string
    }>({
        username: "",
        code: "",
        pass: "",
        confirmPass: ""
    });

    const clean = () => {
        setUsername("")
        setCode("")
        setPass("")
        setConfirmPass("")
        setError({
            username: "",
            code: "",
            pass: "",
            confirmPass: ""
        })
    }

    const [loading, setLoading] = useState<boolean>(false);

    const Next = async () => {
        setError({
            username: "",
            code: "",
            pass: "",
            confirmPass: ""
        })
        if (!username) {
            setError({ username: "This field is Required" })
        } else {
            setLoading(true)
            const sendEmail = await dataService.resetPasswordRequest(username);
            if (sendEmail) {
                setShowMess(true)
                setEmailSent(true)
                setTimeout(function () {
                    setShowMess(false)
                }, 5000);
            }
            setLoading(false)
        }
    }

    const Reset = async () => {

        setError({
            username: "",
            code: "",
            pass: "",
            confirmPass: ""
        })

        if (!username) {
            setError({ username: "This field is Required" })
        } else if (!code) {
            setError({ code: "This field is Required" })
        } else if (!pass) {
            setError({ pass: "This field is Required" })
        } else if (!confirmPass) {
            setError({ confirmPass: "This field is Required" })
        } else if (pass !== confirmPass) {
            setError({ confirmPass: "New password doesn't match. Please type again" })
        } else {
            setLoading(true)
            const checkPass = await dataService.resetPasswordWithCode(username, Number(code), pass)
            console.log(checkPass)
            if (checkPass.success) {
                clean()
                navigation.goBack()
            } else {
                setError({ code: checkPass.message })
            }
            setLoading(false)
        }
    }

    // Main render
    return (
        <AppBackground showStatus isBusy={loading} >

            <AppLogoComp />
            <ScrollView>

                <View style={styles.sectCont} >
                    <LoginTitleComp title="Forget Password" />
                    {
                        showMess &&
                        <View style={styles.messageCont} >
                            <Text style={styles.message} >A verification code has been sent to the email.</Text>
                        </View>
                    }
                    <InputFieldComp
                        inputCont={{ backgroundColor: emailSent ? Colors.green2 : Colors.grey1 }}
                        disable={!emailSent}
                        labelCont={styles.labelCont}
                        labelStyle={{ textAlign: "left" }}
                        label='Username'
                        placeholder="Username"
                        accessibilityLabel={"Coordinator Username field"}
                        error={error["username"]}
                        value={username}
                        onChangeText={(value: string) => setUsername(value)}
                    />
                    {
                        emailSent &&
                        <>
                            <InputFieldComp
                                labelCont={styles.labelCont}
                                labelStyle={{ textAlign: "left" }}
                                label='Code'
                                keyboardType="number-pad"
                                placeholder="Type Code"
                                accessibilityLabel={"Type Code"}
                                error={error["code"]}
                                value={code}
                                onChangeText={(value: string) => setCode(value)}
                            />
                            <InputFieldComp
                                labelCont={styles.labelCont}
                                labelStyle={{ textAlign: "left" }}
                                label='New Password'
                                placeholder="Password"
                                accessibilityLabel={"Set Password"}
                                value={pass}
                                secure
                                onChangeText={(value: string) => setPass(value)}
                                error={error["pass"]}
                            />
                            <InputFieldComp
                                labelCont={styles.labelCont}
                                labelStyle={{ textAlign: "left" }}
                                label='Confirm Password'
                                placeholder="Confirm Password"
                                value={confirmPass}
                                accessibilityLabel={"Confirm Password"}
                                secure
                                onChangeText={(value: string) => setConfirmPass(value)}
                                error={error["confirmPass"]}
                            />
                        </>
                    }

                    <AppButtonComp
                        label={emailSent ? "Reset" : "Next"}
                        accessibilityLabel={"Next"}
                        accessibilityHint={"Next"}
                        press={emailSent ? Reset : Next}
                    />
                    <AppButtonComp
                        accessibilityLabel={"Back"}
                        accessibilityHint={"Back"}
                        label={"Back"}
                        press={() => {
                            clean();
                            emailSent ?
                                setEmailSent(false)
                                :
                                navigation.goBack()
                        }}
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
    labelCont: {
        width: wp("75%"),
        marginTop: hp("1%")
    },
    messageCont: {
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        marginTop: hp("2%"),
        marginBottom: hp("1%"),
        backgroundColor: Colors.green2,
        borderRadius: wp("2%")
    },
    message: {
        color: Colors.green1,
        fontSize: RF(1.7)
    }
})

export default ForgetPassword;