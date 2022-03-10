import { SPLASH_LOAD, SIGN_IN, LOG_OUT } from '../types';

export type UserType = {
    accessToken: string | undefined,
    participantId: string | undefined,
    loginWith?: string | undefined
}

export type AuthType = {
    isLoading: boolean;
    data: UserType | null
};

const INITIAL_STATE: AuthType = {
    isLoading: true,
    data: null,
}

const AuthReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case SPLASH_LOAD:
            return {
                ...state,
                isLoading: false
            };

        case SIGN_IN:
            return {
                ...state,
                data: action.payload,
                isLoading: false
            };

        case LOG_OUT:
            return {
                ...state,
                data: null
            };

        default:
            return state;
    }
};

export default AuthReducer;