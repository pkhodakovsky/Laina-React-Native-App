import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
import { Fonts } from '../../../styles';
import { ValidateParticipantResult } from '@lainaedge/platformshared/lib/types/ValidateParticipantResult';
import { 
	screenWidth, 
	screenHeight, 
	responsiveFontSize as RF, 
	widthPercentageOrientation as wo, 
	heightPercentageOrientation as ho 
} from '../../../utils/responsiveFunctions';
import { Colors } from '../../../appStyles';
import { IReducer } from '../../../redux/reducer';

// Login Screen containing app logo component, input Field and button just for design

const dataService = DataServices.instance();
type Props = NativeStackScreenProps<authStackParamList, 'LoginScreen'>;

function LoginScreen({ route, navigation }: Props) {

	const {
		appVersion,
		clientPlatformSV,
		serverPlatformSV,
		serverTDDVersion,
		version
	} = useSelector((state: IReducer) => state.VersionReducer);

	// Form Values

	// const [participantId, setParticipantId] = useState<string>("980-643-2665"); 
	const [participantId, setParticipantId] = useState<string>(""); 
	const [error, setError] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

	// login Handler
	const login = async () => {
		
	 if (!participantId) {
			setError("This Field is Required!")
			return
		}
		setError("")
		try {

			setLoading(true)
			// Main Participant authentication API Function
			const successRespnse: ValidateParticipantResult = await dataService.validateParticipantHubServer(participantId);
			logger.log("login success", successRespnse)
			setLoading(false)
			// API throughs an error
			if (!successRespnse.success || !successRespnse.trialName) {
				setError(successRespnse.errorMessage || "No error")
				return
			}

			// Set the survey / project name
			DataServices.setProjectName(successRespnse.trialName)

			// Check if password is need or not and act accordingly
			if (successRespnse.passwordStatus === "needed") {
				navigation.navigate("SetPassword", { participantId: successRespnse.participantId, trialName: successRespnse.trialName })
			} else {
				navigation.navigate("EnterPassword", { participantId: successRespnse.participantId, trialName: successRespnse.trialName })
			}

		} catch (error) {

			// Consoling the error if API Fails
			logger.log('50 printing:', error, 'src_screens_authenticationScreens_loginScreen_index.tsx');
		}

	}

	// Main render
	return (
		<AppBackground showStatus isBusy={loading} >

			<AppLogoComp />

			<View style={styles.sectCont} >
				<LoginTitleComp title="VTMS Research Platform" />
				<LabelComp >{translate("Login Label Field", '')}</LabelComp>
				<InputFieldComp
					placeholder=""
					accessibilityLabel={"Enter participant ID"}
					value={participantId}
					keyboardType="number-pad"
					error={error}
					onChangeText={(value: string) => setParticipantId(value)}
				/>
				<AppButtonComp
					label={translate("Login Button", '')}
					accessibilityLabel={"Navigates to password screen to set or enter password"}
					accessibilityHint={"Navigates to password screen to set or enter password"}
					press={login}
				/>
				<AppButtonComp
					accessibilityLabel={"Navigates to the coordinator username screen"}
					accessibilityHint={"Navigates to the coordinator username screen"}
					label={translate("Login Coordinator Button", '')}
					press={() => navigation.navigate("CoordinatorLogin")}
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

export default LoginScreen;