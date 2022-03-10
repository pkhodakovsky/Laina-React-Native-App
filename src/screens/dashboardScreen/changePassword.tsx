import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DataServices } from "@lainaedge/platformshared";

import {
    AppBackground,
    AppLogoComp,
    InputFieldComp,
    AppButtonComp,
    LabelComp,
    LoginTitleComp
} from '../../component';
import { translate } from '../../common/services/localeService';
import {
    screenWidth,
    screenHeight,
    responsiveFontSize as RF,
    widthPercentageOrientation as wo,
    heightPercentageOrientation as ho
} from '../../utils/responsiveFunctions';
import { Colors } from '../../appStyles';
import { Fonts } from '../../styles';
import { logger } from '../../common/functions';
import {
    fetchingRouteStart,
    fetchingRouteEnd,
    setRoute
} from '../../redux/action/routeActions';
import { IReducer } from '../../redux/reducer';
import { routeActionTypes } from "../../redux/types";
import { ChangePasswordResult } from "@lainaedge/platformshared/lib/types/ChangePasswordResult";

const dataService = DataServices.instance();

type Props = {
    onSuccess: () => void,
}

type stateErrorType = {
    oldPass: string,
    newPass: string | undefined
}

function ChangePassword(props: Props) {

    const dispatch = useDispatch();
    const { data } = useSelector((state: IReducer) => state.AuthReducer);

    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [error, setError] = useState<stateErrorType>({ oldPass: "", newPass: "" });

    const updatePassword = async () => {

        setError({ oldPass: "", newPass: "" })

        // Password and confirmPass dont exist
        if (!oldPass && !newPass) {
            setError({ oldPass: "This field is Required!", newPass: "This field is Required!" })
            return
        }

        // if password doesnot exist.
        if (!oldPass) {
            setError({ ...error, oldPass: "This field is Required!", newPass: "" })
            return
        }

        // If confirmPass doesnot exist.
        if (!newPass) {
            setError({ ...error, newPass: "This field is Required!", oldPass: "" })
            return
        }

        // If reset password is less than 6 characters
        if (newPass.length < 6) {
            setError({ ...error, newPass: "Less than 6 characters are not allowed", oldPass: "" })
            return
        }

        try {

            dispatch(fetchingRouteStart())
            let successRespnse: ChangePasswordResult;
            if (data && data.loginWith === "participant") {
                successRespnse = await dataService.participantChangePassword(oldPass, newPass);
            } else {
                successRespnse = await dataService.changePassword(oldPass, newPass);
            }
            console.log(successRespnse, "/////")
            if (successRespnse.success) {
                props.onSuccess()
            } else {
                setError({ oldPass: "", newPass: successRespnse.message })
            }
            dispatch(fetchingRouteEnd())

        } catch (error) {

            // Consoling the error if API fails.
            logger.log('50 printing:', error, 'Change password screen.tsx');
        }

    }

    return (
        <View style={styles.sectCont} >
            <LoginTitleComp title="Change Password" />
            <InputFieldComp
                placeholder="Old Password"
                accessibilityLabel={"Type Old Password"}
                secure
                value={oldPass}
                onChangeText={(value: string) => setOldPass(value)}
                error={error["oldPass"]}
            />
            <InputFieldComp
                secure
                placeholder="New Password"
                value={newPass}
                accessibilityLabel={"Type New Password"}
                onChangeText={(value: string) => setNewPass(value)}
                error={error["newPass"]}
            />

            <AppButtonComp
                accessibilityLabel={"Change Password Button"}
                accessibilityHint={"Change Password Button"}
                label={"Change Password"}
                press={updatePassword}
            />
        </View>
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
})

export default ChangePassword;