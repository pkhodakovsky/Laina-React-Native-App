import './timer';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { DataServices, LogicEngine } from "@lainaedge/platformshared";
import { setRoute } from "../redux/action/routeActions";
import { splashLoad, loginAction } from "../redux/action/authActions";

import { setI18nConfig } from '../common/services/localeService';
import { changeLayout } from '../common/responsiveFunct';

import AuthNavigator from './authNavigator';

import SplashScreen from '../screens/splashScreen';

// import DrawerRoutes from './drawerRoutes';
import DashboardScreen from '../screens/dashboardScreen';
import { logger } from '../common/functions';
import { getAppVersion } from '../redux/action/getVersion';
import { IReducer } from "../redux/reducer";

const Stack = createNativeStackNavigator();

const dataService = DataServices.instance();

export default () => {

    const redux_dispatch = useDispatch();
    const { isLoading, data } = useSelector((state: IReducer) => state.AuthReducer);

    // Setting the language of the application and initial data for PlatformShared library. Essential to run the app.
    useEffect(() => {
        DataServices.setEnvironment(
            "uat"
            // (Config.REACT_APP_SERVER_ENV ? Config.REACT_APP_SERVER_ENV : 'uat') as Environment
        );
        DataServices.setProjectName("demo")

        LogicEngine.debugOutput = true;
        DataServices.debugAxiosCreate = (i) => {
            i.interceptors.request.use((config) => {
                console.log("* ApiCall Begin " + config.url);
                return config;
            }, (error) => {
                console.log("--- AXIOS ERROR:", error);
                return Promise.reject(error);
            });

            i.interceptors.response.use((response) => {

                if (response && response.headers && response.headers['content-length']) {
                    let length = parseInt(response.headers['content-length'], 10);
                    // let bytes = "                      " + numeral(length).format("#,###");
                    // bytes = bytes.substring(bytes.length-13);
                    // console.log("* ApiCall Complete " + bytes + " bytes for " + response.config.url);
                } else {
                    console.log("* ApiCall Complete unknown lenght");
                }

                return response;
            }
                , (error) => {
                    console.log("--- AXIOS RESPONSE ERROR:", error);
                    return Promise.reject(error);
                })
        };

        getPing()
        setI18nConfig()

        // changing dimensions through here by dispatching an redux action
        changeLayout(redux_dispatch);
        // const dimensionSubscription = Dimensions.addEventListener("change", () => changeLayout(redux_dispatch));

        return () => {

            // Removing listeners to prevent react data-leaks
            // dimensionSubscription.remove();

        }
    }, []);

    /**
     * This function fires and API to the PS library and fetches the required data.
     */
    const getPing = async () => {
        try {
            // AsyncStorage.clear()
            redux_dispatch(getAppVersion())

            const checkToken = await AsyncStorage.getItem("@token");
            const parseAsync = typeof checkToken === "string" ? JSON.parse(checkToken) : null;
            // console.log(checkToken, "checkToken")
            if (checkToken) {

                DataServices.setProjectName(parseAsync.trialName)

                const checkTokenExpiry = await dataService.authUserFromToken(parseAsync.token);
                // logger.log(checkTokenExpiry, "result")
                if (checkTokenExpiry.isValidLogin) {
                    let user = {
                        accessToken: parseAsync.token,
                        participantId: parseAsync.participantId,
                        loginWith: "participant"
                    }
                    redux_dispatch(setRoute(`page/participant_start/${user.participantId}`))
                    redux_dispatch(loginAction(user));
                }
            } else {
                redux_dispatch(splashLoad());
            }
        } catch (error) {
            redux_dispatch(splashLoad());
            logger.log('79 printing:', error, 'src_navigations_routes.tsx');
        }
    }

    // Main App return.
    return (
        <NavigationContainer>

            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {isLoading ?
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    : !data ?
                        <Stack.Screen name="Login" component={AuthNavigator} />
                        :
                        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
                }
            </Stack.Navigator>

        </NavigationContainer>
    );
}
