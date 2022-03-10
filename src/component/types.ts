import { Animated, ViewStyle } from "react-native"
import { StepForm } from '@lainaedge/platformshared';
import { screenOrient } from '../common/commonModel';
import { HelperFunct } from ".";

// PageForm Field Component Types ================>

export type renderFormFieldType = {
    step: StepForm,
    field: StepForm.FieldInfo,
    item: StepForm.FieldInfo[],
    i: number
}

// PageDashButton Prop Types ==================>

export type Section_Card1ProsTypes = {
    orientData: screenOrient,
    title: string,
    icon: string,
    press: () => void
}

export type Section_Card2ProsTypes = {
    orientData: screenOrient,
    cardTitle: string,
    count_title: string,
    participant_Count: number,
    onPress: () => void
}

// PageListItem Component Types =========================>

export type pageListItemTypes = {
    item: {
        TaskTitle?: string,
        TaskSubTitle?: string,
        TaskStatus?: string,
        click?: any,
        TaskIcon?: string,
    },
    pressList: (click: any) => void,
    helperThis: HelperFunct,
}

// CustomToast Component Types =========================>

export type ToastPropsTypes = {
    animateTranslate?: Animated.Value;
    animateOpacity?: Animated.Value;
    isShownToast?: boolean;
    message?: string;
    timerID?: NodeJS.Timeout | null;
}


export type ToastRenderState = {
    renderToast: boolean
}


// Custom Radio Button Component types ==========================>

export type radioPropsDataType = {
    code: string,
    custom_code: string,
    english: string,
}
export type convertedTextType = (string | Element)[] | string | undefined
export type radioPropsTypes = {
    getValue: 'code' | 'custom_code' | 'english' | boolean,
    type: string,
    disable: boolean,
    selectedValue: string | any,
    screenHWO: screenOrient,
    multiSelect: string,
    key: number,
    data: radioPropsDataType,
    radioTxt: string | any,
    radioCont: ViewStyle,
    onPressRadio: () => ({} | void),
}
export type customRadioButtonProps = {
    getValue: 'code' | 'custom_code' | 'english' | boolean,
    type: string,
    disable?: boolean,
    selectedValue: string | any,
    screenHWO: screenOrient,
    multiSelect?: string,
    key?: number,
    data?: radioPropsDataType[],
    radioTxt?: string | any,
    radioCont: ViewStyle,
    onPressRadio?: () => {},
    rContainer: ViewStyle,
    setValue?: (v: radioPropsDataType) => ({} | void),
}

// ==========================>