import * as React from 'react';
import { ColorSchemeName, Appearance, Image, View, Text, ScrollView, TextProps, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome";

import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { StepForm, LogicEngine } from '@lainaedge/platformshared';
import { renderFormFieldType } from "../../../types";
import { FieldError } from '@lainaedge/platformshared/lib/utils/DataDictionary';
import styles from '../../styles';
import InputField from './inputField';
import { orientationStyle, pageStyles } from './styles';
import { CommonStyles } from '../../../../common/commonStyles';
import AppButton from '../../../appButtonComp';
import { widthPercentageOrientation as wo, responsiveFontSize as RF } from '../../../../common/responsiveFunct';
import HtmlConvert from "../../../../common/textFormating";
import PdfField from "./pdfField";

import PageButton from '../pageButton';
import { Heights, Colors, Fonts } from '../../../../styles';
import { TPageFormProps, TPageFormState } from "../../../interfaces";
import { logger } from '../../../../common/functions';
import { IReducer } from '../../../../redux/reducer';

const logic = new LogicEngine();

const percentage = (partialValue: number, totalValue: number) => (100 * partialValue) / totalValue;
class PageForm extends React.PureComponent<TPageFormProps, TPageFormState>
{
    richText = React.createRef<RichEditor>();
    _isMounted = false;

    constructor(props: TPageFormProps) {
        super(props);

        const step = this.props.step;
        const data = step.record ? step.record.data : {};

        const that = this;

        const theme = props.theme || Appearance.getColorScheme();
        const contentStyle = that.createContentStyle(theme);
        that.editorInitializedCallback = that.editorInitializedCallback.bind(this);

        this.subscribeToFieldChange(step);
        const stepFieldsData = this.setupFieldChangeEvent(step);

        this.state = {
            dataValues: {},
            errors: {},
            orientData: {
                screenHeight: 0,
                screenWidth: 0,
                orientation: "PORTRAIT"
            },
            error_message: {},
            warning_message: {},
            submitPressStatus: false,
            warningModalStatus: false,
            hide_fields: {},
            units: {},
            data: data,
            edit_value: '',
            contentStyle,
            showForm: true,
            singlePageStepFields: stepFieldsData,
            singlePageFieldsIndex: 0,
            pdfActive: false,
            pdfPageLength: 0,
            activePageCount: 0,
            pdfScrollViewEnable: true,
            pdfScrollToEnd: false,
            keyboardState: 'closed',
        }
        this.renderFormField = this.renderFormField.bind(this);
    }

    setupFieldChangeEvent(step: StepForm): any {
        let index = -1;
        const stepFields: Array<StepForm.FieldInfo[]> = [];
        for (let i = 0; i < step.fields.length; i++) {
            if (step.fields[i].option2 === 'NewPage' || index === -1) {
                index++;
                stepFields.push([]);
            }
            stepFields[index].push(step.fields[i]);
        }
        return stepFields;
    }

    /**
     * This function will subscribe to the field change event, so everytime the field is changed it will update the enable / disable status of that field
     * @param step Should be of type StepForm
     */
    subscribeToFieldChange(step: StepForm): void {
        step.logicRef?.evFieldChanged.subscribe(async (options) => {
            const hide_fields = this.state.hide_fields;
            hide_fields[options.field] = !options.enabled;
            if (this._isMounted) {

                this.setState({ showForm: false })
            }
            if (!options.enabled) {
                step.setValueFromUser(options.field, '');
                if (this._isMounted) {

                    this.setState({ hide_fields });
                    this.setState({ [options.field]: '' });
                }
            } else {
                if (this._isMounted) {

                    this.setState({ hide_fields });
                }
            }
            if (this._isMounted) {

                this.setState({ showForm: true })
            }
        });
    }

    /**
     * This function is creating styles for content of the application. The content includes input, text, background etc.
     * @param theme This parameter should be of type ColorSchemeName
     * @returns theme
     */
    createContentStyle(theme: ColorSchemeName) {
        // Can be selected for more situations (cssText or contentCSSText).
        let contentStyle = {
            backgroundColor: Colors.contentBackgroundColor,
            color: Colors.white,
            placeholderColor: Colors.contentPlaceholderColor,
            // cssText: '#editor {background-color: #f3f3f3}', // initial valid
            contentCSSText: 'font-size: 16px; min-height: 200px; height: 100%;', // initial valid
        };
        if (theme === 'light') {
            contentStyle.backgroundColor = Colors.white;
            contentStyle.color = Colors.contentLightTextColor;
            contentStyle.placeholderColor = Colors.contentLightPlaceholderColor;
        }
        return contentStyle;

    }
    /**
     * This funtion invoked just before mounting occurs.
     * It is called before render(), therefore calling setState() synchronously in this method will not trigger an extra rendering.
     * getValueUnits returns the Units of the field by name.
     */
    UNSAFE_componentWillMount() {
        // =========== setting const units ==========
        this._isMounted = true;
        const { step, items } = this.props;
        items.forEach((item: any) => {
            let unit = step.getValueUnits(item.field);
            const valueDatabase = step.getValueDatabase(item.field);
            if (this._isMounted) {
                this.setState({ [item.field]: valueDatabase })
            }
            let state_units = this.state.units
            if (unit) {
                state_units[item.field] = unit;
                if (this._isMounted) {
                    this.setState({ units: state_units })
                }
            }
        })
        // =========== setting const units end ==========
        if (this._isMounted) {
            this.setState({ orientData: this.props.helperThis.orientData })
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }



    _keyboardDidShow = () => {
        this.setState({
            keyboardState: 'opened'
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardState: 'closed'
        });
    }



    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    /**
     * This function will submit the form to the given route and set the state on success or error condition.
     * @param targetRoute Route where the form will be submitting
     */
    async pressSubmit(targetRoute: string) {
        // logger.log("pageForm/index.ts pressSubmit: Trace 1")
        const { helperThis, parentThis } = this.props;
        parentThis.setState({ loading: true })
        if (this._isMounted) {

            this.setState({ error_message: {} })
        }
        const { submitPressStatus } = this.state;

        // logger.log("pageForm/index.ts pressSubmit: Trace 1");
        if (!submitPressStatus) {
            if (this._isMounted) {

                this.setState({ submitPressStatus: true })
            }
            await helperThis;

            // logger.log("pageForm/index.ts pressSubmit: Calling Submit Form");
            const result = await helperThis.submitForm(true);

            // logger.log("pageForm/index.ts pressSubmit: Submit Results:", result);
            if (result.length === 0) {
                // logger.log(targetRoute, 'target route')
                if (parentThis.formSuccess)
                    parentThis.formSuccess(targetRoute)
                if (this._isMounted) {

                    this.setState({ submitPressStatus: false })
                }
            } else {
                let error_message = this.state.error_message;
                for (var key in result) {
                    error_message = { ...error_message, [result[key].field_name]: result[key].error_message }
                }
                if (this._isMounted) {

                    this.setState({ submitPressStatus: false })
                    parentThis.setState({ loading: false })
                    this.setState({ error_message })
                }
            }
        } else {
            if (this._isMounted) {

                parentThis.setState({ loading: false })
            }
        }
    }

    /**
     * This function is called onBlur event. It sets the value of the field.
     * @param field 
     * @param value 
     * @param fieldType 
     * @return
     */
    onfieldBlur(field: StepForm.FieldInfo, value: string, fieldType?: string | undefined) {
        if (fieldType === "Year") {
            this.props.step.setValueFromUser(field.field, value);
        } else {
            const newValue = value.length > 1 ? value.replace(/\s+/g, ' ').trim() : value;
            this.props.step.setValueFromUser(field.field, newValue);
            if (this._isMounted) {

                this.setState({ [field.field]: newValue });
            }
        }
    }

    /**
     * This function is running on onChange event of the field. and changing the value of the field by chaecking the field type.
     * @param field 
     * @param value 
     * @param fieldType 
     */
    async onChangeField(field: StepForm.FieldInfo, value: string, fieldType?: string) {
        if (fieldType === "Year") {
            const re = /^[0-9\b]+$/;
            if (value.length <= 4 && Number(value[0]) !== 0) {
                if (this._isMounted) {

                    if (re.test(value) || value == "") {
                        this.setState({ [field.field]: value });
                    }
                }
            }
        } else {
            await this.props.step.setValueFromUser(field.field, value);
            if (this._isMounted) {

                this.setState({ [field.field]: value });
            }
        }
    }

    handleChangeDateTime(field: StepForm.FieldInfo, fieldType: string) {
        this.props.parentThis.setState({ dateModal: true, fieldName: field.field, formThis: this, fieldType: fieldType.toLowerCase() })
    }

    handleChangeModal(field: StepForm.FieldInfo, list: any) {
        this.props.parentThis.setState({ showListModal: true, fieldName: field.field, formThis: this, modalList: list })
    }

    getDateTimeFromComponent(dateTime: string, fieldName: string) {
        this.props.step.setValueFromUser(fieldName, dateTime);
        if (this._isMounted) {
            this.setState({ [fieldName]: dateTime });
        }
    }

    getSelectModalFromComponent(modalValue: any, field_name: string) {
        this.props.step.setValueFromUser(field_name, modalValue.english);
        if (this._isMounted) {
            this.setState({ [field_name]: modalValue.english });
        }
    }

    renderFormField({ step, field, item, i }: renderFormFieldType) {
        const { helperThis } = this.props;
        const { orientData, hide_fields } = this.state;
        const { screenWidth, screenHeight, orientation } = orientData;
        const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
        let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
        let setWidthField = step.option_1 === 'SinglePageFormat' ? wo('80%', screenWidth) : wo('87%', screenWidth);

        console.log("FORM STEP INDEX ==========>", step)
        // logger.log('271 printing:', field, 'src_component_helperComponent_PageElements_pageform_index.tsx');
        let fieldDisable = hide_fields[field.field];
        logger.log(field, 'renderformfield')
        if (field.type.checkOption('Button')) {
            if (step.is_edit_mode) return null;
            const target = step.logicRef?.processTextReplacement(field.option1)!;
            const targetRoute = target ? target : '';
            logger.log(targetRoute)
            return (
                <PageButton onPress={() => this.pressSubmit(targetRoute)} opt={field} buttonStyle={[{ ...styles.btn, ...orient_Style.formBtn, width: setWidthField, alignSelf: "center", marginBottom: 20 }]} labelStyle={helperThis.CommonOrientationS.btnTxt} that={helperThis} />
            )

        } else if (field.type.checkOption('Html')) {

            return (
                <>
                    {this.renderHtmlString(field)}
                </>
            )
        } else if (field.type.checkOption('HtmlImage')) {

            return (
                <Image source={{ uri: field.text }} style={{ width: wo("80%", screenWidth), height: VScale(100, 50), resizeMode: "contain", marginVertical: VScale(4, 2) }} />
            )

        } else if (field.type.checkOption("PDF")) {

            return (
                <PdfField
                    field={field}
                    pdfStyle={{
                        flex: 1,
                    }}
                    containerStyle={{
                        height: VScale(100, 50),
                    }}
                    step={step}
                />
            )
        } else {
            return (
                <>
                    {this.renderFields(field, fieldDisable, item, i)}
                </>
            )
        }
    }

    editorInitializedCallback() {
        this.richText.current?.registerToolbar(function (items) {
        });
    }

    renderHtmlString(field: StepForm.FieldInfo) {
        const { orientData, hide_fields } = this.state;
        const { screenWidth, screenHeight, orientation } = orientData;
        const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
        let setWidthField = this.props.step.option_1 === 'SinglePageFormat' ? wo('80%', screenWidth) : wo('87%', screenWidth);

        let label = field.text;
        var addLineBreak = label.replace(/<br>/g, "\n");

        let HtmlConvertedArray = HtmlConvert(addLineBreak);

        return (
            <View style={[{ alignSelf: "center", width: setWidthField }]} >
                <Text style={[{ color: Colors.inputColor, fontFamily: Fonts.GILROY_REG }, orient_Style.inputLabel]} >{HtmlConvertedArray}</Text>
            </View>
        )

    }

    renderInputField(field: StepForm.FieldInfo, is_disabled: boolean, pressField: () => void, value: string, placeholderValue: string) {
        const { step } = this.props;

        const fieldType = step.tableDef?.getFieldType(field.field);
        const { orientData, error_message } = this.state;

        return (
            <InputField
                warning_message={this.state.warning_message[field.field]}
                edit_mode={step.is_edit_mode}
                field={field}
                fieldType={fieldType}
                disable={is_disabled}
                orientData={orientData}
                showIcon={true}
                pressField={pressField}
                label={field.text}
                editable={false}
                error_message={error_message[field.field]}
                placeholder={placeholderValue}
                value={value}
            />
        )
    }

    renderFields(field: StepForm.FieldInfo, is_disabled: boolean, item: StepForm.FieldInfo[], i: number) {
        const { step } = this.props;
        const { orientData, error_message, units } = this.state;
        const { screenWidth, screenHeight, orientation } = orientData;
        const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
        let setWidthField = step.option_1 === 'SinglePageFormat' ? wo('80%', screenWidth) : wo('87%', screenWidth);

        const fieldType = step.tableDef?.getFieldType(field.field);
        const valueText = step.getValueFormatted(field.field);
        const valueDatabase = step.getValueDatabase(field.field);
        const fieldUnit = step.getValueUnits(field.field);
        // console.log(fieldType, "Aaaaaaaaaaaaaaaa")
        if (fieldType === 'Date' || fieldType === "Time") {
            var dateM = ""
            if (fieldType === "Date" && valueText) {
                let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var parts = valueText.match(/(\d+)/g);
                let d: Date = new Date();
                parts ? d = new Date(+parts[0], +parts[1] - 1, +parts[2]) : null;
                var dd = d.getDate();
                var dm = d.getMonth();
                var dy = d.getFullYear();
                dateM = `${dd < 10 ? '0' + dd : dd} ${monthNames[dm]}, ${dy}`
            }
            const datetimeValue = valueText ? (fieldType === "Time" ? valueText : dateM) : `Select ${fieldType}`;
            return (
                <InputField
                    step={step}
                    warning_message={this.state.warning_message[field.field]}
                    edit_mode={step.is_edit_mode}
                    field={field}
                    fieldType={fieldType}
                    disable={is_disabled}
                    orientData={orientData}
                    showIcon={true}
                    pressField={() => this.handleChangeDateTime(field, fieldType)}
                    label={field.text}
                    editable={false}
                    error_message={error_message[field.field]}
                    placeholder={field.field}
                    value={datetimeValue}
                />
            )
        }
        else if (fieldType === 'Lookup' || fieldType === "Boolean" || fieldType == "MultiSelect") {

            let list: any;
            if ((fieldType === 'Lookup' || fieldType === "MultiSelect") && step.tableDef && step.dataDictionary) {
                const name = step.tableDef.getFieldLookupName(field.field);
                list = step.dataDictionary.getLookupTable(name);
            } else {
                list = ["Yes", "No"]
            }

            if (field.option1 === "Autocomplete") {

                if (valueText === "") {
                    step.setValueFromUser(field.field, list[0].english);
                    return (
                        <InputField
                            step={step}
                            warning_message={this.state.warning_message[field.field]}
                            edit_mode={step.is_edit_mode}
                            field={field}
                            fieldType={fieldType}
                            disable={is_disabled}
                            orientData={orientData}
                            showIcon={true}
                            pressField={() => this.handleChangeModal(field, list)}
                            label={field.text}
                            editable={false}
                            error_message={error_message[field.field]}
                            placeholder={""}
                            value={valueText}
                        />
                    )
                } else {

                    return (
                        <InputField
                            step={step}
                            warning_message={this.state.warning_message[field.field]}
                            edit_mode={step.is_edit_mode}
                            field={field}
                            fieldType={fieldType}
                            disable={is_disabled}
                            orientData={orientData}
                            showIcon={true}
                            pressField={() => this.handleChangeModal(field, list)}
                            label={field.text}
                            editable={false}
                            error_message={error_message[field.field]}
                            placeholder={""}
                            value={valueText}
                        />
                    )
                }
            } else {
                return list.length !== 0 &&
                    <InputField
                        step={step}
                        warning_message={this.state.warning_message[field.field]}
                        edit_mode={step.is_edit_mode}
                        field={field}
                        fieldType={fieldType}
                        disable={is_disabled}
                        radioStatus={fieldType}
                        radioList={list}
                        error_message={error_message[field.field]}
                        onChangeText={(value: any) => {
                            if (fieldType === "MultiSelect") {
                                let valueArray = valueDatabase.split(',').filter((v: any) => {
                                    return v !== '';
                                });
                                let newValue = valueArray.includes(value.code)
                                    ? valueArray.filter((v: any) => {
                                        return v !== value.code;
                                    })
                                    : [...valueArray, value.code];
                                if (this._isMounted) {

                                    this.setState({ [field.field]: newValue.join(',') });
                                }
                                this.props.step.setValueFromUser(field.field, newValue.join(','));
                                // this.onChangeField(field, newValue.join(','))
                            } else {
                                let setValue = fieldType === "Lookup" ? value.english : value;
                                this.onChangeField(field, setValue)
                            }
                        }}
                        orientData={orientData}
                        label={field.text}
                        value={valueText}
                        valueDatabase={valueDatabase}
                    />
            }
        }
        else {
            let fieldValue: string = "";
            if (fieldType == "Year") {
                if (this.state[field.field] !== undefined) {
                    fieldValue = this.state[field.field]
                } else if (Number(valueDatabase) !== 0 && valueDatabase !== undefined) {
                    fieldValue = String(valueDatabase)
                }
            } else {
                if (this.state[field.field] !== undefined) {
                    fieldValue = this.state[field.field]
                }
            }
            if (field.option1 === "Memo") {
                // let label = valueDatabase !== undefined ? String(valueDatabase) : fieldValue;
                return (
                    <>
                        <Text style={[pageStyles.inputLabel, { color: Colors.inputColor, width: setWidthField, alignSelf: "center" }, orient_Style.inputLabel]} >{field.text}</Text>
                        <View style={[{ width: setWidthField }, pageStyles.editorMainCont, orient_Style.editorMainCont]} >
                            <RichToolbar
                                editor={this.richText}
                                actions={[
                                    actions.keyboard,
                                    actions.setBold,
                                    actions.setItalic,
                                    actions.insertBulletsList,
                                    actions.insertOrderedList,
                                    actions.setStrikethrough,
                                    actions.setUnderline,
                                    actions.line,
                                    actions.outdent,
                                    actions.indent,
                                    actions.alignLeft,
                                    actions.alignCenter,
                                    actions.alignRight,
                                    actions.alignFull,
                                    actions.undo,
                                    actions.redo,
                                ]}
                                selectedIconTint={Colors.themeBlue}
                                disabledIconTint={Colors.disableTxt}
                            />

                            <ScrollView
                                nestedScrollEnabled={true}
                                style={{ flex: 1 }} >
                                <RichEditor
                                    ref={this.richText}
                                    scrollEnabled={false}
                                    initialContentHTML={valueDatabase !== undefined ? String(valueDatabase) : fieldValue}
                                    style={{ flex: 1 }}
                                    editorInitializedCallback={this.editorInitializedCallback}
                                    onChange={(text: string) => this.onChangeField(field, text, fieldType)}
                                    pasteAsPlainText={true}
                                />
                            </ScrollView>

                        </View>
                    </>
                )
            } else {
                let numberCheck = (fieldType === "Decimal" || fieldType === "Number" || fieldType === "Year" || fieldType === "Float" || fieldUnit) ? true : false;
                return (
                    <InputField
                        itemList={item}
                        formThis={this}
                        itemIndex={i}
                        warning_message={this.state.warning_message[field.field]}
                        fieldType={fieldType}
                        step={step}
                        field={field}
                        edit_mode={step.is_edit_mode}
                        disable={is_disabled}
                        showIcon={false}
                        onBlurFunct={() => {
                            this.onfieldBlur(field, fieldValue, fieldType)
                        }}
                        onChangeText={(text: string) => {
                            if (fieldType == "Number") {
                                this.onChangeField(field, text.replace(/[^0-9]/g, ''), fieldType)

                            } else if (fieldType == "Decimal") {
                                if (/^[-+]?\d*\.?\d*$/.test(text)) {
                                    this.onChangeField(field, text, fieldType)
                                }
                            } else {
                                this.onChangeField(field, text, fieldType)
                            }
                        }}
                        orientData={orientData}
                        error_message={error_message[field.field]}
                        keyboardType={numberCheck ? "number-pad" : "default"}
                        label={field.text}
                        editable={true}
                        unit={units[field.field] ? units[field.field] : ""}
                        placeholder={fieldType === "Year" ? "0" : ""}
                        value={(this.state[field.field] !== undefined) ? (fieldType == "Year" ? String(fieldValue) : String(this.state[field.field])) : ""}
                    />
                )
            }
        }
    }

    handleGoBackSinglePage(): void {
        const newIndex = this.state.singlePageFieldsIndex - 1;
        this.cleanPdf();
        if (newIndex >= 0) {
            if (this._isMounted) {

                this.setState({ singlePageFieldsIndex: newIndex });
            }
        }
    }

    async handleGoNextSinglePage(): Promise<void> {
        this.cleanPdf();
        try {
            if (this._isMounted) {

                this.setState({ error_message: {}, warning_message: {} })
            }
            const result = await this.props.step.checkPage(false);
            let activeForm: FieldError[] = [];

            this.state.singlePageStepFields[this.state.singlePageFieldsIndex].map(v => {
                let activeR = result.filter((x) => {
                    if (v.field === x.field_name) {
                        return x;
                    }
                });
                activeForm = [...activeForm, ...activeR]
            })
            if (activeForm && activeForm.length !== 0) {

                let error_message = { ...this.state.error_message };
                let warningText: string = "";
                activeForm.map((v) => {
                    if (v.field_status === "error") {
                        if (error_message.hasOwnProperty(v.field_name)) {
                            error_message[v.field_name] += '\n' + v.error_message;
                        } else {
                            error_message[v.field_name] = v.error_message;
                        }
                    } else if (v.field_status === "warning") {
                        if (warningText !== "") {
                            warningText += '\n' + v.error_message;
                        } else {
                            warningText = v.error_message;
                        }
                    }
                })
                let warning_message = { ...this.state.warning_message, [activeForm[0].field_name]: warningText };
                const fields: StepForm.FieldInfo[] = this.state.singlePageStepFields[
                    this.state.singlePageFieldsIndex
                ];
                let errorLength = 0;
                fields.forEach((field: StepForm.FieldInfo) => {
                    if (field) {
                        if (error_message[field.field]) {
                            errorLength++;
                        }
                    }
                });

                if (this._isMounted) {

                    if (errorLength !== 0) {
                        this.setState({ error_message })
                    } else {
                        if (Object.keys(warning_message).length !== 0) {
                            this.setState({ warningModalStatus: true, warning_message })
                        }
                    }
                }

            } else {
                this.changeQuestion()
            }
        } catch (error) {
            logger.log(error, "Checkpage error")
        }
    }

    changeQuestion() {
        const fields = this.props.step.fields;
        const newIndex = this.state.singlePageFieldsIndex + 1;
        if (this._isMounted) {
            if (fields.length > newIndex) {

                this.setState({ singlePageFieldsIndex: newIndex });
            }
            this.setState({ warningModalStatus: false })
        }
    }

    cleanPdf() {
        this.setState({
            pdfActive: false,
            pdfPageLength: 0,
            activePageCount: 0,
            pdfScrollViewEnable: true,
            pdfScrollToEnd: false
        })
    }

    render() {
        const { items, step } = this.props;
        const { screenWidth, screenHeight, orientation } = this.state.orientData;
        const orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
        let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
        let keyNum = 1000;
        if (step.option_1 === 'SinglePageFormat') {
            return (
                <View style={{ flex: 1 }} >
                    <View style={[pageStyles.SinglePageFormatCont, orient_Style.SinglePageFormatCont]} >

                        {
                            this.state.singlePageStepFields.map(
                                (singlePageItem, index) => {
                                    if (this.state.singlePageFieldsIndex === index) {
                                        let imageIndex = singlePageItem.findIndex(item => item.type.checkOption('HtmlImage'))
                                        let pdfIndex = singlePageItem.findIndex(item => item.type.checkOption('PDF'))
                                        console.log(singlePageItem, "singlePageItem")
                                        if (imageIndex !== -1) {
                                            if (singlePageItem.length !== 1) {
                                                return (
                                                    <ScrollView
                                                        contentContainerStyle={{ backgroundColor: Colors.white, flexGrow: 1 }}
                                                        nestedScrollEnabled
                                                        key={index} >
                                                        {
                                                            singlePageItem.map((item, singlePageItemIndex) => {
                                                                return (
                                                                    <View key={'single_page_item_' + item.field + singlePageItemIndex}>
                                                                        {this.renderFormField({ step: this.props.step, field: item, item: singlePageItem, i: singlePageItemIndex })}
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </ScrollView>
                                                )
                                            } else {
                                                return (
                                                    <View key={index} style={{ flex: 1 }} >
                                                        <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={{ uri: singlePageItem[0].text }} />
                                                    </View>
                                                )
                                            }

                                        }
                                        else if (pdfIndex !== -1 && singlePageItem.length == 1) {
                                            return (
                                                <View style={{ flex: 1, backgroundColor: Colors.borderColor }} key={index} >
                                                    <PdfField
                                                        pdfStyle={{ flex: 1, backgroundColor: Colors.borderColor }}
                                                        containerStyle={{ flex: 1, backgroundColor: Colors.borderColor }}
                                                        field={singlePageItem[0]} step={this.props.step} />
                                                </View>
                                            )
                                        } else if (pdfIndex !== -1 && singlePageItem.length > 1) {
                                            const isCloseToBottom = ({
                                                layoutMeasurement,
                                                contentOffset,
                                                contentSize
                                            }: {
                                                layoutMeasurement: { height: number },
                                                contentOffset: { y: number },
                                                contentSize: { height: number }
                                            }) => {
                                                const paddingToBottom = 10;
                                                return layoutMeasurement.height + contentOffset.y >=
                                                    contentSize.height - paddingToBottom;
                                            };
                                            return (
                                                <ScrollView
                                                    scrollEnabled={this.state.pdfScrollViewEnable}
                                                    onScroll={({ nativeEvent }) => {
                                                        if (isCloseToBottom(nativeEvent)) {
                                                            this.setState({
                                                                pdfScrollViewEnable: false
                                                            })
                                                        }
                                                    }}
                                                    scrollEventThrottle={400}
                                                    nestedScrollEnabled
                                                    key={index} >
                                                    {
                                                        singlePageItem.map((item, singlePageItemIndex) => {
                                                            if (item.type.checkOption('PDF')) {
                                                                return (
                                                                    <PdfField
                                                                        onError={() => {
                                                                            this.setState({
                                                                                pdfScrollToEnd: true,
                                                                                pdfScrollViewEnable: false
                                                                            })
                                                                        }}
                                                                        pdfLoad={() => this.setState({ pdfActive: true })}
                                                                        pdfActive={(numberOfPages: number) => this.setState({ pdfPageLength: numberOfPages })}
                                                                        pdfScroll={(page: number) => {
                                                                            this.setState({ activePageCount: page })
                                                                            let percentGet = percentage(page, this.state.pdfPageLength);
                                                                            // pdf scroll method ============================
                                                                            logic.assign("pdf_scroll", percentGet)
                                                                            // ------------------------------------------
                                                                            if (page == this.state.pdfPageLength) {
                                                                                this.setState({
                                                                                    pdfScrollToEnd: true
                                                                                })
                                                                            }
                                                                            if (page === 1) {
                                                                                if (this.state.pdfScrollToEnd) {
                                                                                    this.setState({
                                                                                        pdfScrollViewEnable: true
                                                                                    })
                                                                                }
                                                                            }
                                                                        }}
                                                                        key={"single_page_item_" + singlePageItemIndex}
                                                                        pdfStyle={{ flex: 1, backgroundColor: Colors.borderColor }}
                                                                        containerStyle={{ height: VScale(100, 50), backgroundColor: Colors.borderColor }}
                                                                        field={item}
                                                                        step={this.props.step}
                                                                    />
                                                                )
                                                            }
                                                            return (
                                                                <View key={'single_page_item_' + item.field + singlePageItemIndex}>
                                                                    {this.renderFormField({ step: this.props.step, field: item, item: singlePageItem, i: singlePageItemIndex })}
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            )
                                        } else {
                                            return (
                                                <ScrollView
                                                    contentContainerStyle={{ paddingBottom: Platform.OS == "android" ? 0 : (this.state.keyboardState === "opened" ? 216 : 0), backgroundColor: Colors.white, flexGrow: 1 }}
                                                    nestedScrollEnabled
                                                    keyboardShouldPersistTaps="handled"
                                                    key={index} >
                                                    {
                                                        singlePageItem.map((item, singlePageItemIndex) => {
                                                            return (
                                                                <View key={'single_page_item_' + item.field + singlePageItemIndex}>
                                                                    {this.renderFormField({ step: this.props.step, field: item, item: singlePageItem, i: singlePageItemIndex })}
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                            )
                                        }
                                    }
                                })
                        }

                        <View style={[pageStyles.BNbtnGroup, { width: wo("80%", screenWidth) }]} >
                            {
                                this.state.singlePageFieldsIndex !== 0 ?
                                    <AppButton
                                        label="Back"
                                        press={() => this.handleGoBackSinglePage()}
                                        labelStyle={{ color: "#034A6D" }}
                                        containerStyle={{ ...orient_Style.backNextBtn, backgroundColor: Colors.white, borderColor: "#034A6D", borderWidth: 1 }}
                                    />
                                    :
                                    <View style={orient_Style.backNextBtn} />
                            }
                            {
                                (this.state.singlePageStepFields.length - 1) > this.state.singlePageFieldsIndex ?
                                    <AppButton
                                        disabled={this.state.pdfActive ? !this.state.pdfScrollToEnd : false}
                                        label="Next"
                                        press={() => this.handleGoNextSinglePage()}
                                        containerStyle={{ ...orient_Style.backNextBtn, backgroundColor: (this.state.pdfActive && !this.state.pdfScrollToEnd) ? Colors.theme_LightBlue : "#034A6D" }}
                                    />
                                    :
                                    <View style={orient_Style.backNextBtn} />
                            }

                        </View>

                        {
                            this.state.singlePageStepFields[this.state.singlePageFieldsIndex][0].option1 ===
                                'NoFooter' ?
                                null :
                                <Text style={[pageStyles.copyrightTxt, orient_Style.copyrightTxt, { marginVertical: VScale(2, 1) }]} >{step.option_2}</Text>
                        }
                    </View>

                    <Modal isVisible={this.state.warningModalStatus}>
                        <View style={{ backgroundColor: Colors.white, borderRadius: wo('2%', screenWidth), overflow: "hidden", paddingVertical: VScale(4, 2) }} >
                            <View style={{ backgroundColor: Colors.white, paddingBottom: VScale(4, 2), width: wo("80%", screenWidth), alignSelf: "center" }} >
                                <Icon name='exclamation-circle' style={{ fontSize: RF(6.0), color: Colors.Warning, alignSelf: "center", marginBottom: VScale(4, 2) }} />
                                {
                                    Object.keys(this.state.warning_message)
                                        .map((key, i) => {
                                            return (
                                                <Text key={i} style={[CommonStyles.inputError, { textAlign: "center", fontSize: RF(2.0), color: Colors.title }]} >{this.state.warning_message[key]}</Text>
                                            )
                                        })
                                }

                            </View>

                            <View style={[pageStyles.BNbtnGroup, { width: "100%", justifyContent: "space-around" }]} >
                                <AppButton
                                    label="Edit Answer(s)"
                                    press={() => this._isMounted && this.setState({ warningModalStatus: false })}
                                    containerStyle={{ backgroundColor: Colors.danger1, ...orient_Style.backNextBtn, }}
                                />
                                <AppButton
                                    label="Accept"
                                    press={() => this._isMounted && this.changeQuestion()}
                                    containerStyle={{ ...orient_Style.backNextBtn, backgroundColor: Colors.successColor }}
                                />
                            </View>
                        </View>

                    </Modal>
                </View>
            )
        } else {
            const list: ({ key: React.Key | null, item: JSX.Element | null, field: React.Key | null | string })[] = [];
            items.forEach((item: any) => {
                if (item.hasOwnProperty('key')) {
                    /** This is already a JSX.Element object from the main RenderHelper */
                    list.push({
                        key: (item as JSX.Element).key,
                        item: item as JSX.Element,
                        field: (item as JSX.Element).key
                    });
                } else {
                    /** This is a Form Element, render it from this class */
                    const comp = this.renderFormField({ step: step, field: item, item: item, i: 0 });
                    list.push({
                        key: 'item_' + keyNum++,
                        item: comp,
                        field: (item as StepForm.FieldInfo).field
                    });
                }
            });

            if (this.state.showForm) {
                return (
                    <View >
                        {list.map((i) => (
                            <View key={i.key}>
                                {i.item}
                            </View>
                        ))}
                    </View>
                )
            } else {
                return (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                        <ActivityIndicator size="small" color={Colors.primaryColor} />
                    </View>
                )
            }
        }

    }
}

const mapStateToProps = (state: IReducer) => {
    return {
        componentRef: state.RoutesReducer.componentRef
    };
}

export default connect(mapStateToProps)(PageForm);