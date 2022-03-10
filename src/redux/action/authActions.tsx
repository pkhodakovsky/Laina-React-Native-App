import { UserType } from '../reducer/authReducer';
import {
    SPLASH_LOAD,
    SIGN_IN,
    LOG_OUT
} from '../types';

export const splashLoad = () => ({
    type: SPLASH_LOAD
});

export const logoutAction = () => ({
    type: LOG_OUT
});

export const loginAction = (user: UserType) => ({
    type: SIGN_IN,
    payload: user
});