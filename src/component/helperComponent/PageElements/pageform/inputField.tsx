import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, ActivityIndicator, KeyboardTypeOptions } from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";

import { CustomRadioBtn } from '../../../radioBtn';
import { CommonStyles, CommonOrientationStyle } from '../../../../common/commonStyles';
import { pageStyles, orientationStyle } from './styles';
import { radioPropsDataType } from "../../../types";
import { Colors, Fonts, Heights } from '../../../../styles';
import { widthPercentageOrientation as wo } from '../../../../common/responsiveFunct';
import HtmlConvert from "../../../../common/textFormating";
import { screenOrient } from '../../../../common/commonModel';
import { logger, getTestID } from '../../../../common/functions';

interface errorProps {
    [field: string]: string
}

type inputFieldProps = {
    orientData: screenOrient,
    label: string,
    warning_message?: string | undefined,
    editable?: boolean,
    placeholder?: string,
    step?: any,
    field?: any,
    fieldType?: string,
    edit_mode?: boolean,
    value: string,
    showIcon?: boolean,
    onChangeText?: (value: any) => ({} | void),
    unit?: string,
    keyboardType?: KeyboardTypeOptions,
    pressField?: () => void,
    radioStatus?: string,
    radioList?: radioPropsDataType[],
    error_message?: string,
    onBlurFunct?: () => void,
    disable?: boolean,
    onFocus?: () => {},
    valueDatabase?: string,
    itemList?: any[],
    itemIndex?: number,
    formThis?: Element | any
}



const InputField = ({
    orientData,
    label,
    editable = true,
    placeholder,
    step,
    field,
    fieldType,
    edit_mode,
    value,
    showIcon,
    onChangeText,
    unit,
    keyboardType = "default",
    pressField,
    radioStatus,
    radioList,
    error_message,
    onBlurFunct,
    disable,
    onFocus,
    valueDatabase,
    itemList,
    itemIndex,
    formThis
}: inputFieldProps) => {
    const { screenWidth, screenHeight, orientation } = orientData;
    const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
    const CommonOrientationS = CommonOrientationStyle(screenWidth, screenHeight, orientation);
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    // logger.log(label, '//////////')

    const [errorMessage, setErrorMessage] = React.useState<errorProps>({});
    const [labelString, setlabelString] = React.useState(null);
    const [labelArr, setlabelArr] = React.useState([]);
    const [loading, setloading] = React.useState(false);
    const [editScreen, setEditScreen] = React.useState(edit_mode);
    const [editStatus, setEditStatus] = React.useState(edit_mode);
    const [oldValue, setOldValue] = React.useState(value);
    const [showDone, setShowDone] = React.useState(false);
    const inputEl: any = React.useRef(null);
    let [reason, setReason] = React.useState("");

    React.useEffect(() => {
        if (itemList && itemList !== undefined && typeof itemList !== "object") {
            let index = itemList.findIndex(item => item.field === field.field);
            if ((itemList.length - 1) === index) {
                setShowDone(true)
            }
        }
        setLabel();
    }, []);

    const setLabel = async () => {
        var addLineBreak = label.replace(/<br>/g, "\n");
        let InputLabelConvert: any = HtmlConvert(addLineBreak)

        setlabelString(InputLabelConvert)

    }

    const onEditSave = async () => {
        setloading(true)
        let emptyFieldErr = "This field is required and may not be left empty.";
        setErrorMessage({})
        if (value === "") {
            setloading(false)
            setErrorMessage({ [field.field]: emptyFieldErr })
        } else if (reason === "") {
            setloading(false)
            setErrorMessage({ reason: emptyFieldErr })
        } else {
            if (fieldType === "Year") {
                if (value.length < 4) {
                    setloading(false)
                    setErrorMessage({ [field.field]: "Please use correct format of Year YYYY." })
                } else {
                    editSaveMethod()
                }
            } else {
                editSaveMethod()
            }
        }
    }

    const editSaveMethod = async () => {
        // logger.log(fieldType, '//////////')
        const result = await step.saveEditField(field.field, value, reason);
        // logger.log(result, '////')
        if (result.length === 0) {
            setloading(false)
            setEditStatus(true)
        } else {
            let Error_Message = errorMessage;
            for (var key in result) {
                Error_Message = { ...Error_Message, [result[key].field_name]: result[key].error_message }
            }
            setloading(false)
            setErrorMessage(Error_Message)
        }
    }

    const pressBtn = () => {
        if (!editable && pressField) {
            pressField()
        }
    }

    let setWidthField = step.option_1 === 'SinglePageFormat' ? wo('80%', screenWidth) : wo('87%', screenWidth);
    if (radioStatus !== "MultiSelect") {
        return (
            <View style={[{ alignSelf: "center", width: setWidthField }]} >
                {
                    labelString ?
                        <>
                            <Text style={[{ color: disable ? Colors.disableTxt : Colors.inputColor, fontFamily: Fonts.GILROY_REG }, orient_Style.inputLabel]} >{labelString}</Text>
                            {
                                radioStatus ?
                                    <ScrollView nestedScrollEnabled={true} >
                                        <View style={{ flexDirection: 'row', flexGrow: 1 }} >
                                            <CustomRadioBtn
                                                disable={disable || (editScreen && editStatus)}
                                                getValue={radioStatus == "Boolean" ? false : "english"}
                                                data={radioList}
                                                type={radioStatus}
                                                radioCont={{ width: radioStatus == "Boolean" ? screenWidth / 2.3 : '100%', flexDirection: radioStatus == "Boolean" ? "row" : 'column' }}
                                                screenHWO={orientData}
                                                rContainer={orient_Style.rCont}
                                                selectedValue={value}
                                                setValue={onChangeText} />
                                            {
                                                editScreen && editStatus ?
                                                    <TouchableOpacity accessible accessibilityLabel="Edit" testID={getTestID("Edit")} onPress={() => {
                                                        setEditStatus(false)
                                                    }} style={[pageStyles.editBtnGroup, orient_Style.editBtn]} >
                                                        <Text style={[pageStyles.editTxt, orient_Style.editTxt]} >Edit</Text>
                                                    </TouchableOpacity> : null
                                            }
                                        </View>
                                        {
                                            editScreen ?
                                                (errorMessage.hasOwnProperty(field.field) && errorMessage[field.field]) &&
                                                <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{errorMessage[field.field]}</Text>
                                                : null
                                        }
                                        {
                                            editScreen && !editStatus ?
                                                loading ?
                                                    <View style={[pageStyles.loaderCont, orient_Style.loaderCont]} >
                                                        <ActivityIndicator size="small" color={Colors.primaryColor} />
                                                    </View> :
                                                    <>
                                                        <Text style={[pageStyles.inputLabel, { color: disable ? Colors.disableTxt : Colors.inputColor }, orient_Style.inputLabel]} >Reason for change:</Text>
                                                        <View style={[pageStyles.inputCont, orient_Style.inputCont]} >
                                                            <TextInput
                                                                testID={getTestID("Reason for change:")}
                                                                accessibilityLabel={"Reason for change:"}
                                                                onChangeText={(text: string) => setReason(text)}
                                                                value={reason}
                                                                style={[pageStyles.input, { color: Colors.inputColor }, orient_Style.input, { flex: 1 }]}
                                                                placeholder={""}
                                                                placeholderTextColor={Colors.Placeholder} />

                                                        </View>
                                                        {
                                                            editScreen ?
                                                                (errorMessage.hasOwnProperty('reason') && errorMessage.reason) &&
                                                                <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{errorMessage["reason"]}</Text>
                                                                : null
                                                        }
                                                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
                                                            <TouchableOpacity onPress={() => {
                                                                setEditStatus(true)
                                                                setErrorMessage({})
                                                                onChangeText && onChangeText(oldValue)
                                                            }} style={[pageStyles.editBtnGroup, orient_Style.editBtnGroup, { backgroundColor: Colors.white }]} >
                                                                <Text style={[pageStyles.editTxt, orient_Style.editTxt, { color: Colors.primaryColor }]} >Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => onEditSave()} style={[pageStyles.editBtnGroup, orient_Style.editBtnGroup]} >
                                                                <Text style={[pageStyles.editTxt, orient_Style.editTxt]} >Save</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                : null
                                        }
                                    </ScrollView>

                                    :
                                    <View>
                                        <View style={{ flexDirection: 'row' }} >
                                            {
                                                fieldType === 'Date' || fieldType === "Time" ?
                                                    <TouchableOpacity activeOpacity={editable ? 1 : 0} onPress={() => disable || (editScreen && editStatus) ? null : pressBtn()} style={[pageStyles.inputCont, orient_Style.inputCont]} >
                                                        <TextInput
                                                            testID={getTestID(label)}
                                                            accessibilityLabel={getTestID(label)}
                                                            ref={inputEl}
                                                            editable={(disable || (editScreen && editStatus)) ? false : editable}
                                                            value={value}
                                                            style={[pageStyles.input, { color: (disable || (editScreen && editStatus)) ? Colors.disableTxt : Colors.inputColor }, orient_Style.input, { flex: 1 }]}
                                                        />
                                                        {
                                                            unit ? <Text style={[pageStyles.input, { color: disable ? Colors.disableTxt : Colors.inputColor }, orient_Style.input]} >{String(unit)}</Text> : null
                                                        }
                                                        {
                                                            showIcon &&
                                                            <Icon name='chevron-down' style={[{ color: disable ? Colors.disableTxt : Colors.primaryColor }, CommonOrientationS.downIcon]} />
                                                        }
                                                    </TouchableOpacity> :
                                                    <View style={[pageStyles.inputCont, orient_Style.inputCont]} >
                                                        <TextInput
                                                            testID={getTestID(label)}
                                                            accessibilityLabel={getTestID(label)}
                                                            ref={inputEl}
                                                            editable={(disable || (editScreen && editStatus)) ? false : editable}
                                                            onChangeText={onChangeText}
                                                            value={value}
                                                            onSubmitEditing={() => {
                                                                showDone ?
                                                                    formThis.handleGoNextSinglePage() :
                                                                    Keyboard.dismiss()
                                                            }}
                                                            onFocus={() => onFocus && onFocus()}
                                                            onBlur={() => onBlurFunct && onBlurFunct()}
                                                            keyboardType={keyboardType}
                                                            returnKeyType={showDone ? "done" : "next"}
                                                            style={[pageStyles.input, { color: (disable || (editScreen && editStatus)) ? Colors.disableTxt : Colors.inputColor }, orient_Style.input, { flex: 1 }]}
                                                            placeholder={placeholder}
                                                            placeholderTextColor={Colors.Placeholder} />
                                                        {
                                                            unit ? <Text style={[pageStyles.input, { color: disable ? Colors.disableTxt : Colors.inputColor }, orient_Style.input]} >{String(unit)}</Text> : null
                                                        }
                                                        {
                                                            showIcon &&
                                                            <Icon name='chevron-down' style={[{ color: disable ? Colors.disableTxt : Colors.primaryColor }, CommonOrientationS.downIcon]} />
                                                        }
                                                    </View>
                                            }

                                            {
                                                editScreen && editStatus ?
                                                    <TouchableOpacity onPress={() => {
                                                        setEditStatus(false)
                                                    }} style={[pageStyles.editBtnGroup, orient_Style.editBtn]} >
                                                        <Text style={[pageStyles.editTxt, orient_Style.editTxt]} >Edit</Text>
                                                    </TouchableOpacity> : null
                                            }
                                        </View>
                                        {
                                            editScreen ?
                                                (errorMessage.hasOwnProperty(field.field) && errorMessage[field.field]) &&
                                                <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{errorMessage[field.field]}</Text>
                                                : null
                                        }
                                        {
                                            editScreen && !editStatus ?
                                                loading ?
                                                    <View style={[pageStyles.loaderCont, orient_Style.loaderCont]} >
                                                        <ActivityIndicator size="small" color={Colors.primaryColor} />
                                                    </View> :
                                                    <>
                                                        <Text style={[pageStyles.inputLabel, { color: disable ? Colors.disableTxt : Colors.inputColor }, orient_Style.inputLabel]} >Reason for change:</Text>
                                                        <View style={[pageStyles.inputCont, orient_Style.inputCont]} >
                                                            <TextInput
                                                                testID={getTestID(label)}
                                                                accessibilityLabel={getTestID(label)}
                                                                onChangeText={(text: string) => setReason(text)}
                                                                value={reason}
                                                                style={[pageStyles.input, { color: Colors.inputColor }, orient_Style.input, { flex: 1 }]}
                                                                placeholder={""}
                                                                placeholderTextColor={Colors.Placeholder} />

                                                        </View>
                                                        {
                                                            editScreen ?
                                                                (errorMessage.hasOwnProperty('reason') && errorMessage.reason) &&
                                                                <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{errorMessage["reason"]}</Text>
                                                                : null
                                                        }
                                                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} >
                                                            <TouchableOpacity onPress={() => {
                                                                setEditStatus(true)
                                                                setErrorMessage({})
                                                                onChangeText && onChangeText(oldValue)
                                                            }} style={[pageStyles.editBtnGroup, orient_Style.editBtnGroup, { backgroundColor: Colors.white }]} >
                                                                <Text style={[pageStyles.editTxt, orient_Style.editTxt, { color: Colors.primaryColor }]} >Cancel</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => onEditSave()} style={[pageStyles.editBtnGroup, orient_Style.editBtnGroup]} >
                                                                <Text style={[pageStyles.editTxt, orient_Style.editTxt]} >Save</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </>
                                                : null
                                        }
                                    </View>
                            }{
                                error_message ?
                                    <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{error_message}</Text>
                                    : null
                            }

                        </> : null
                }
            </View >
        )
    } else {
        let valueArray = valueDatabase ? valueDatabase.split(',') : "";
        logger.log(valueArray, value)
        return (
            <View style={[{ alignSelf: "center", width: setWidthField }]} >
                <Text style={[pageStyles.inputLabel, { color: disable ? Colors.disableTxt : Colors.inputColor }, orient_Style.inputLabel]} >{labelString}</Text>

                <ScrollView nestedScrollEnabled={true} >
                    <View style={{ flexDirection: 'row', flexGrow: 1 }} >
                        <CustomRadioBtn
                            disable={disable || (editScreen && editStatus)}
                            getValue={"english"}
                            data={radioList}
                            type={radioStatus}
                            radioCont={{ width: '100%', flexDirection: 'column' }}
                            screenHWO={orientData}
                            rContainer={orient_Style.rCont}
                            selectedValue={valueArray}
                            setValue={onChangeText} />
                    </View>
                </ScrollView>
                {
                    error_message ?
                        <Text style={[CommonStyles.inputError, CommonOrientationS.inputError]} >{error_message}</Text>
                        : null
                }

            </View>
        )
    }
}

export default InputField;