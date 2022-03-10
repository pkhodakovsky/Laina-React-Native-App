import * as React from 'react';
import { View, ScrollView, Platform } from 'react-native';

import { Heights, Colors } from '../../styles';
import { PageStepType, PageRenderBase, StepText, StepBase, StepSection, StepList, StepBreak, StepGroup, StepButton, StepDashStat, StepDashButton, StepForm, StepTable, StringOptions, StepTabs } from '@lainaedge/platformshared';
import { CommonOrientationStyle, CommonStyles } from '../../common/commonStyles';
import styles from './styles';
import orientationStyle from './orientationStyles';
import { IOrientationStyle } from './orientationStyles'
import { widthPercentageOrientation as wo, widthPercentageToDP as wp, screenWidth } from '../../common/responsiveFunct';
import { screenOrient } from '../../common/commonModel';
import { PageText, PageButton, PageDashStat, PageTable, PageDashButton, PageForm, PageListItem } from './PageElements';
import { ICommonOrientationStyle } from '../../common/commonStyles'
import { IHomeComponentProps, ICurrentListItem } from "../interfaces";
import { logger } from '../../common/functions';
import Share from 'react-native-share';
class HelperFunct extends PageRenderBase {
    componentThis!: IHomeComponentProps | any;

    orient_Style!: IOrientationStyle;

    CommonOrientationS!: ICommonOrientationStyle;

    orientData!: screenOrient;

    pageRoute: string | undefined; // getting the page route this is make for drawer component

    componentTargets: (JSX.Element | StepForm.FieldInfo)[][] = [];

    currentTarget: (JSX.Element | StepForm.FieldInfo)[] = [];

    currentList: JSX.Element[] | undefined;

    currentListItem: ICurrentListItem | undefined;

    groupStatus: string | undefined;
    sectionStatus: string | undefined;

    // This function is getting all the orientation through helper function height, width and orientation

    setOrient = async (screenWidth: number, screenHeight: number, orientation: string) => {
        this.orient_Style = orientationStyle(screenWidth, screenHeight, orientation);
        this.CommonOrientationS = CommonOrientationStyle(screenWidth, screenHeight, orientation);
        this.orientData = { ...this.orientData, screenWidth, screenHeight, orientation }
    }

    /** When starting a new group or collection of components,
      * use pushBranch to start a new list of components */
    pushBranch(name: string) {
        // Save the current target to the array
        logger.log("* Adding elements to a new branch named ", this.currentTarget)
        this.componentTargets.push(this.currentTarget);
        // Create a new target for components to be added to
        this.currentTarget = [];
    }

    /** When finished with a list or group then use this to go back
     * to the previous target
     * @return The current list of elements
     */
    popBranch(): (JSX.Element | StepForm.FieldInfo)[] {
        // Current branch is done, return it to the caller and hope that
        // it used for something.
        // logger.log("pop branch")
        const list: (JSX.Element | StepForm.FieldInfo)[] = [];
        this.currentTarget.forEach((e) => {
            list.push(e);
        });

        const top = this.componentTargets.pop();
        if (top) this.currentTarget = top;
        else this.currentTarget = [];

        return list;
    }

    addComponent(component: JSX.Element) {
        if (this.currentList) {
            this.currentList.push(component);
        } else {
            this.currentTarget.push(component);
        }
    }

    renderText(opt: StepText): void {
        logger.log(opt, 'render text', this.currentListItem)
        const text = opt.text;
        const type = opt.options.value;
        if (this.currentListItem) {
            this.currentListItem[type] = text;
        } else {
            this.addComponent(<PageText
                checkGroup={this.groupStatus}
                sectionStatus={this.sectionStatus}
                key={opt.key_id}
                step={opt} that={this} />);
        }
    }

    renderBreak(opt: StepBreak): void {
        logger.log(opt, 'step break')
        if (opt.options.value === 'SmallLine') {
            this.addComponent(<View key={opt.key_id} style={[styles.separator, this.orient_Style.separator]} />);
        } else {
            this.addComponent(<View key={opt.key_id} style={this.orient_Style.break} />);
        }
    }

    renderButton(opt: StepButton): void {
        logger.log(opt, 'render button')
        let routeTarget = this.logicRef?.processTextReplacement(opt.raw.option_1)
        logger.log(routeTarget, "button", this.groupStatus)
        let option2 = new StringOptions(opt.option_2);
        let option = new StringOptions(opt.options.value);
        let bgColor;
        let textColor = Colors.white;
        if (this.orientData) {

            if (this.groupStatus == "ButtonBar") {
                if (opt.option_2 == "Selected") {
                    bgColor = Colors.ButtonBarSelected
                } else {
                    bgColor = Colors.ButtonBar
                }
            } else {
                if (option2.checkOption('Primary')) {
                    bgColor = Colors.buttonColorsList.primary
                } else if (option2.checkOption("Secondary")) {
                    bgColor = Colors.buttonColorsList.secondary
                } else if (option2.checkOption("Danger")) {
                    bgColor = Colors.buttonColorsList.danger
                } else if (option2.checkOption("Warning")) {
                    bgColor = Colors.buttonColorsList.warning
                } else if (option2.checkOption("Info")) {
                    bgColor = Colors.buttonColorsList.info
                } else if (option2.checkOption("Light")) {
                    bgColor = Colors.buttonColorsList.light
                    textColor = Colors.radioColor
                } else if (option2.checkOption("Dark")) {
                    bgColor = Colors.buttonColorsList.dark
                } else {
                    bgColor = Colors.buttonColorsList.success
                }
            }
            let widthSet;
            if (this.groupStatus == "Toolbar") {
                widthSet = {
                    width: null,
                    paddingHorizontal: wp("2%"),
                }
            } else if (this.groupStatus || this.sectionStatus) {
                widthSet = {
                    width: "100%"
                }
            } else {
                widthSet = {
                    marginHorizontal: wo("5%", screenWidth),
                    width: "90%"
                }
            }

            this.addComponent(<PageButton
                onPress={() => {
                    if (option.checkOption('ShareContent') && !opt.option_1) {
                        Share.open({
                            message: opt.text
                        })
                            .then((res) => {
                                console.log(res);
                            })
                            .catch((err) => {
                                err && console.log(err);
                            })
                    } else {
                        this.componentThis.btnPress(routeTarget, opt)
                    }
                }}
                key={opt.key_id}
                opt={opt}
                routeTarget={routeTarget}
                buttonStyle={[
                    styles.btn,
                    this.orient_Style.btn,
                    {
                        backgroundColor: bgColor,
                        borderRadius: this.groupStatus == "ButtonBar" ? 0 : wp('1%'),
                    },
                    widthSet,
                ]}
                labelStyle={{ ...this.CommonOrientationS.btnTxt, color: textColor }}
                that={this} />);
        }
    }

    startGroup(opt: StepGroup): void {
        logger.log(opt, 'start group')
        if (opt.options.value) {
            this.groupStatus = opt.options.value
        } else {
            this.groupStatus = "StartGroup"
        }
        this.pushBranch('StartGroup');
    }

    endGroup(opt: StepGroup): void {
        logger.log(opt, 'end group')

        const currentGroup = this.popBranch();
        if (opt.options.value == 'SuccessCard' || opt.options.value == 'PrimaryCard') {
            const list: JSX.Element[] = [];
            currentGroup.forEach((item: any, id) => {
                list.push(item);
            });
            let color = opt.options.value == 'SuccessCard' ? Colors.successColor : Colors.primaryColor;
            const PageGroup =
                <View key={opt.key_id} style={[styles.cardCont, { borderColor: color }, this.orient_Style.cardCont, { paddingHorizontal: wp("3%") }]} >
                    <PageText step={opt} that={this} />
                    <View style={this.orient_Style.cardListCont} >
                        {list}
                    </View>
                </View>
            this.addComponent(PageGroup);
        } else if (opt.options.value == 'Bullets') {
            const list: JSX.Element[] = [];
            currentGroup.forEach((item: any, id) => {
                list.push(item);
            });
            const PageGroup = (
                <View key={opt.key_id} style={this.orient_Style.cardCont}>
                    {list}
                </View>
            );
            this.addComponent(PageGroup);
        } else {

            if (this.orientData) {

                if (this.groupStatus === "DashButton" || this.groupStatus === "DashStat") {
                    const total = 3.2;
                    const percent = (1.0 / total) * 100;
                    const percentText = percent + "%";
                    /** Add each component to the list with a View wrapper that has the percent set */
                    const list: JSX.Element[] = [];

                    let style = { width: percentText };

                    currentGroup.forEach((item, id) => {
                        list.push(
                            <View key={id} style={{ ...style, flexWrap: "wrap", flexDirection: "row" }}>
                                {item}
                            </View>
                        );
                    });

                    const PageGroup = <View key={opt.key_id} style={[styles.sectionCont2, this.orient_Style.sectionCont2, { width: "100%", justifyContent: "center" }]} >{list}</View>
                    this.addComponent(PageGroup);
                } else {
                    const list: JSX.Element[] = [];

                    currentGroup.forEach((item, id) => {
                        list.push(
                            <View key={id} style={{ marginHorizontal: wp("1%"), flexWrap: "wrap", flexDirection: "row" }}>
                                {item}
                            </View>
                        );
                    });

                    const PageGroup = <View key={opt.key_id} style={[styles.sectionCont2, this.orient_Style.sectionCont2, { width: "90%", paddingHorizontal: wp("4%") }]} >{list}</View>
                    this.addComponent(PageGroup);
                }

            }

        }
        this.groupStatus = undefined;
    }

    renderDashStat(opt: StepDashStat): void {

        let routeTarget = this.logicRef?.processTextReplacement(opt.raw.option_1)
        logger.log(routeTarget, 'dashStat')
        this.groupStatus = 'DashStat';
        this.addComponent(<PageDashStat
            onPress={() => this.componentThis.btnPress(routeTarget)}
            key={opt.key_id}
            participant_Count={opt.count}
            count_title="Participants"
            cardTitle={opt.text}
            orientData={this.orientData}
        />);
    }

    renderDashButton(opt: StepDashButton): void {
        logger.log(opt, 'dashBtn')
        this.groupStatus = 'DashButton';
        let route = opt.raw.option_1
        this.addComponent(<PageDashButton key={opt.key_id} press={() => this.componentThis.btnPress(route)} icon={opt.icon} title={opt.text} orientData={this.orientData} />);
    }

    renderTabs(opt: StepTabs): void {
        logger.log(opt, 'render tab')
        // this.addComponent(<PageTabs key={opt.key_id} opt={opt} pressTab={(num: number, v: any) => this.componentThis.pressTab(num, v)} parentThis={this.componentThis} />)
    }

    renderFormStart(opt: StepForm): void {
        logger.log(opt, "formStart")
        this.pushBranch('Form Start');
    }

    renderFormField(opt: StepForm, field: StepForm.FieldInfo) {
        logger.log(opt, "form field")
        /** Add the form field to the current list of compontents */
        this.currentTarget.push(field);
    }

    renderFormEnd(opt: StepForm): void {
        logger.log('renderForm', opt);
        const itemList = this.popBranch();

        this.addComponent(
            <PageForm record={opt.record} key={opt.key_id} step={opt} items={itemList} helperThis={this} parentThis={this.componentThis} />
        );
    }

    renderListStart(opt: StepList) {
        logger.log('StepListStart', opt)
        this.currentList = [];
    }

    renderListEnd(opt: StepList) {
        logger.log('StepListEnd', opt)
        if (this.orientData) {
            const { screenHeight, orientation, screenWidth } = this.orientData;
            let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
            if (this.currentList) {
                /** Add each component to the list with a View wrapper that has the percent set */
                const list: JSX.Element[] = [];
                this.currentList.forEach((item, i) => {
                    list.push(
                        <View key={'list-item' + i} style={{ width: screenWidth }} >
                            {item}
                            <View style={this.CommonOrientationS.separator} />
                        </View>
                    );
                });

                const PageList = <ScrollView nestedScrollEnabled={true} key={opt.key_id} style={{ paddingBottom: VScale(4, 2) }} >{list}</ScrollView>
                this.currentList = undefined;
                this.addComponent(PageList);
            }
        }
    }

    renderListItemStart(opt: StepList) {
        logger.log('StepListItemStart', opt)

        this.currentListItem = {
            TaskIcon: '',
            TaskTitle: '',
            TaskSubTitle: '',
            TaskStatus: '',
            click: '',
            style: '',
        };
        for (const key of Object.keys(opt.listOptions)) {
            this.currentListItem[key] = opt.listOptions[key];
        }
    }

    renderListItemEnd(opt: StepList) {
        logger.log('StepListItemEnd', opt)
        if (this.currentListItem) {
            this.addComponent(
                <PageListItem key={opt.key_id} item={this.currentListItem} pressList={(route: string) => this.componentThis.btnPress(route)} helperThis={this} />
            );
        }
        this.currentListItem = undefined;
    }


    renderTable(opt: StepTable): void {
        logger.log(opt, 'render table')
        this.addComponent(
            <PageTable key={opt.key_id} opt={opt} helperThis={this} />
        );
    }

    startSection(opt: StepSection): void {
        logger.log('startSection', opt);
        this.sectionStatus = "StartSection";

        this.pushBranch('StartSection');
    }

    endSection(opt: StepSection): void {
        // return;

        logger.log('endSection', opt);
        const currentSection = this.popBranch();
        /** Add each component to the list with a View wrapper that has the percent set */
        const list: JSX.Element[] = [];
        currentSection.forEach((item) => {
            if (item.hasOwnProperty('key')) {
                list.push(
                    <View key={'group-item' + (item as JSX.Element).key}>{item}</View>
                );
            } else {
                logger.log('endGroup unexpected issue with non JSX Element in group.');
            }
        });

        const group = <View style={this.orient_Style.sectionCont} key={opt.key_id}>{list}</View>;
        this.addComponent(group);
        this.sectionStatus = undefined;
    }

    renderUnknown(opt: PageStepType): void {
        logger.log(opt, 'render unknown')
    }

    debugForm(variableName: string, dataValue?: any | undefined) {
        // logger.log('debugForm', variableName, dataValue);
    }

    debugMessage(message: string) {
        // logger.log('debugMessage', message);
    }

    debugStep(opt: StepBase) {
        // logger.log('debugStep', opt);
    }

}

export default HelperFunct;