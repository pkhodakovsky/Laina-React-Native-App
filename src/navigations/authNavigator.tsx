import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Old Screens
import CoordinatorLoginScreen from '../screens/authenticationScreens/coordinatorLoginScreen';
import EnterPasswordScreen from '../screens/authenticationScreens/enterPasswordScreen';
import SetPasswordScreen from '../screens/authenticationScreens/setPasswordScreen';
import ForgetPassword from '../screens/authenticationScreens/forgetPassword';

// New Screens
import Login from '../screens/authenticationScreens/Login';

export type authStackParamList = {
  LoginScreen: undefined;
  CoordinatorLogin: undefined;
  ForgetPassword: undefined;
  EnterPassword: {participantId?: string; trialName: string};
  SetPassword: {participantId?: string; trialName: string};
};

const AuthStack = createNativeStackNavigator<authStackParamList>();

/**
 * This function handles all the navigations between the screen in the applciation.
 * @returns <AuthNavigator>{App}</AuthNavigator>
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="LoginScreen" component={Login} />
      <AuthStack.Screen name="EnterPassword" component={EnterPasswordScreen} />
      <AuthStack.Screen name="SetPassword" component={SetPasswordScreen} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
      <AuthStack.Screen
        name="CoordinatorLogin"
        component={CoordinatorLoginScreen}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
