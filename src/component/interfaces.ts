import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authStackParamList } from './../navigations/authNavigator';
import { ICommonOrientationStyle } from './../common/commonStyles';
import { DataRecord, StepForm, StringOptions } from '@lainaedge/platformshared';
import { screenOrient } from '../common/commonModel';
import {
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  ColorSchemeName
} from 'react-native';
import { HelperFunct } from '.';

// Page Button Interfaces =====================>
type FormStepType = {
  text: string;
  type: StringOptions;
  field: string;
  option1: string;
  option2: string;
  option_2: string;
}

export interface PageButtonProps {
  opt: FormStepType;
  labelStyle: TextStyle;
  buttonStyle: ViewStyle[];
  that: HelperFunct;
  onPress: () => void;
  key?: string;
  routeTarget?: string | undefined;
}

// PageForm Component Interfaces =====================>

export interface LooseObject {
  [key: string]: any;
}

export interface TPageFormProps {
  step: StepForm; // Contains the step configuration for the form
  record: DataRecord | undefined; // Contains the active data record for this form

  // List of items on the page when not in single page field
  items: (JSX.Element | StepForm.FieldInfo)[];

  // Reference to HelperFunt render engine
  helperThis: HelperFunct;

  // Reference to the parent component
  parentThis: IHomeComponentProps;
  componentRef: object | undefined | null;

  theme?: ColorSchemeName;
}

export interface TPageFormState {
  // Indictator by field name if a field should be hidden
  hide_fields: { [field_name: string]: boolean };

  // Indicator by field of the units to show such as mL, kg, miles, etc...
  units: { [field_name: string]: string };

  // Indicator if the form itself is showing?
  showForm: boolean;

  // Unknown data for screen orientation
  orientData: screenOrient;

  // Unknown data for error messages
  error_message: { [key: string]: string };
  warning_message: { [key: string]: string };
  errors: LooseObject;
  // Unknown status of the submit button?
  submitPressStatus: boolean;

  // The data for this form.
  data: DataRecord<any>;

  // Unknown - Possibly current edit value?
  edit_value: string;

  // Unkown
  contentStyle: {
    backgroundColor: string;
    color: string;
    placeholderColor: string;
    contentCSSText: string;
  };

  // Unknown list that relates to single page fields
  singlePageStepFields: Array<StepForm.FieldInfo[]>;

  // Current page of the single page form showing
  singlePageFieldsIndex: number;

  // All form field values.
  [field_variable: string]: any;

  // To check if pdf is scrolled to bottom
  pdfScrolled: boolean;

  // TO check if the input is a pdf
  isPdf: boolean;

  // Keyboard State
  keyboardState: "opened" | "closed";
}

// HomeComponent index.js Interfaces =====================>

export interface IHomeComponentProps {
  btnPress(value: string | undefined, pageRoute?: string): void;
  setState(newValue: string | object | undefined): void;
  formSuccess?: (value: string) => void;
  getDateTimeFromComponent?: (date: string, fieldName: string) => void;
  getSelectModalFromComponent?: (v: any, fieldName: string) => void;
}

export interface ICurrentListItem {
  [keyName: string]: string; // Keyname of Current List Item
}

// AppButton Component  Interface ==========================>

export interface AppButtonProps {
  disabled?: boolean;
  containerStyle?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  labelStyle?: TextStyle;
  label: string;
  press: () => void;
}

// AppLogo Component  Interface ==========================>

export interface AppLogoProps {
  label?: string;
}

// customDropdownModel Component  Interface ==========================>

export interface CustomDropdownProps {
  showModal: boolean;
  hideModal: () => void;
  showItem?: string;
  itemSelected: (v: string) => void;
  showList: any[];
}

// InputField Component Interface ==========================>

export interface InputFieldProps {
  containerStyle?: ViewStyle;
  labelCont?: ViewStyle;
  labelStyle?: TextStyle;
  label?: string;
  disable?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  iconName?: string;
  accessibilityLabel?: string;
  iconPress?: () => void;
  iconPressable?: boolean;
  secure?: boolean; // for passwords only
  onChangeText: (text: string) => void;
  error?: string;
  input?: TextStyle,
  inputCont?: ViewStyle
}
