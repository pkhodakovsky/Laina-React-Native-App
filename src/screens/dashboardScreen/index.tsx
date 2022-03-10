import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StatusBar,
    Platform,
    ImageBackground,
    TouchableOpacity,
    SafeAreaView,
    BackHandler,
    Alert,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import { connect } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import UserInactivity from 'react-native-user-inactivity';
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { Box, HStack, Modal, Text as NBText, Button } from "native-base";

import { FetchingIndicator, HelperFunct, DropdownModal, AppButtonComp } from '../../component'
import ImagesSrc from '../../common/images';

import { Colors, Fonts } from '../../styles';
import { screenOrient } from '../../common/commonModel';
import { CommonFunctions, logger } from '../../common/functions';
import { CommonStyles, CommonOrientationStyle } from '../../common/commonStyles';
import {
    setComponentRef,
    fetchingRouteStart,
    fetchingRouteEnd,
    addRoute,
    removeRoute
} from '../../redux/action/routeActions';
import { IReducer } from '../../redux/reducer';
import { routeActionTypes } from '../../redux/types';

// @ts-ignore
import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import {
    responsiveHeight,
    widthPercentageOrientation as wo,
    responsiveFontSize as RF
} from '../../utils/responsiveFunctions';
import { Notifications } from 'react-native-notifications';
import { checkNotifications, openSettings } from 'react-native-permissions';
import DrawerContentModal from "../../component/drawerComponent";
import { PageEngine, StepTable } from '@lainaedge/platformshared';

import ChangePassword from './changePassword';
import { CellValue } from '../../component/helperComponent/PageElements/pageTable';

type notificationType = {
    body: string,
    click_action: string,
    color: string | null,
    data: {
        pusher: string
    },
    icon: string | null,
    tag: string | null,
    title: string,
    appState: string | null
}

const render_helper = new HelperFunct();
interface MetaType {
    type?: string;
    title_en?: string;
    description?: string;
    route?: string;
    searchPattern?: RegExp;
}
type DashboardScreenState = {
    screenName: string;
    title: string;
    allComponents: JSX.Element[];
    fieldName: string;
    dateModal: boolean;
    formThis?: null | {
        getSelectModalFromComponent: (value: string, name: string) => void;
        getDateTimeFromComponent: (date: string, name: string) => void;
    };
    fieldType?: 'date' | 'datetime' | 'time';
    routesHistory: string[];
    showListModal: boolean;
    modalList: any[];
    active: boolean | undefined;
    intervalStart: boolean;
    openMenu: boolean;
    tableVisible: boolean;
    tableHeader: StepTable.Column[] | null,
    tableContent: CellValue[] | null
};

interface DashboardScreenProps extends IReducer {
    dispatch: (cb: routeActionTypes) => void;
    navigation: any;
}

const { height, width } = Dimensions.get("window");

export class DashBoardScreen extends Component<DashboardScreenProps, DashboardScreenState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            screenName: "",
            title: "",
            openMenu: false,
            active: true,
            allComponents: [],

            // render helper
            fieldName: "",
            dateModal: false,
            formThis: null,
            fieldType: "date",
            routesHistory: [],

            // list modal
            showListModal: false,
            modalList: [],
            intervalStart: false,

            // table 
            tableHeader: null,
            tableContent: null,
            tableVisible: false
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.btnPress = this.btnPress.bind(this);
    }

    handleBackButtonClick() {
        this.pressBack();
        return true;
    }

    /**
     * This method helps to refresh the screen
     */
    UNSAFE_componentWillMount() {

        this.checkNotificationPermission();
        const { screenHeight, screenWidth, orientation }: screenOrient = this.props.DimensionsReducer;
        render_helper.setOrient(screenWidth, screenHeight, orientation);
        render_helper.componentThis = this;

        this.props.dispatch(setComponentRef(this))
        this.getMobileConfigData(this.props.RoutesReducer.activeRoute)
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    checkNotificationPermission() {
        checkNotifications().then(({ status, settings }) => {
            if (status == "blocked") {
                Alert.alert(
                    "Laina Would Like to Send You Notification",
                    "Open Settings to allow Notification",
                    [
                        {
                            text: "Cancel",
                            onPress: () => null,
                            style: "cancel",
                        },
                        {
                            text: "Ok",
                            onPress: () => {
                                openSettings().catch(() => console.log('cannot open settings'));
                            },
                        },
                    ],
                    {
                        cancelable: true
                    })
            }
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    notificationHandler(page: PageEngine) {
        console.log("notificiation handler")
        page.notificationManager.evInitializeClient.subscribe((data) => {
            console.log('Notification Engine Initialize', data);
        });

        page.notificationManager.evSubscribe.subscribe((data) => {
            console.log('Notification Engine Subscribe to:', data);

            RNPusherPushNotifications.setInstanceId(data.instanceKey);

            RNPusherPushNotifications.on('registered', () => {
                console.log("notification registered")

                this.notificationSubscribe(data.topic);
            });

            // Setup notification listeners
            RNPusherPushNotifications.on('notification', this.handleNotification);

        });
    }

    handleNotification(notification: notificationType) {
        console.log(notification, "aaaaaaa");

        //     // iOS app specific handling
        if (Platform.OS === 'ios') {
            switch (notification.appState) {
                case 'inactive':
                // inactive: App came in foreground by clicking on notification.
                //           Use notification.userInfo for redirecting to specific view controller
                case 'background':
                // background: App is in background and notification is received.
                //             You can fetch required data here don't do anything with UI
                case 'active':
                // App is foreground and notification is received. Show a alert or something.
                default:
                    break;
            }
        } else {
            Notifications.postLocalNotification({
                title: notification.title,
                body: notification.body,
                identifier: "",
                sound: "",
                badge: 1,
                type: "",
                thread: "",
                payload: null
            });
            // console.log("android handled notification...");
        }
    }

    // // Subscribe to an interest
    notificationSubscribe(interest: string) {
        // Note that only Android devices will respond to success/error callbacks
        RNPusherPushNotifications.subscribe(
            interest,
            (statusCode: string, response: string) => {
                console.log(statusCode, response, "status");
            },
            () => {
                console.log('Subscribed Successfully to the ' + interest);
            }
        );
    };



    async getMobileConfigData(route: string) {

        this.props.dispatch(fetchingRouteStart())

        this.setState({ allComponents: [] })

        render_helper.currentTarget = [];
        let mobileConfigPage = await CommonFunctions.getMobileConfig(route);

        logger.log(mobileConfigPage, 'candidate detail file')
        // If mobileConfigPage exists subscribe the incoming events.
        if (mobileConfigPage) {
            this.notificationHandler(mobileConfigPage)
            mobileConfigPage.evInitializePage.subscribe((meta: MetaType) => {

                let title = meta.title_en || "";
                logger.log("getMobileConfigData Event: evInitializePage", meta);
                this.setState({ title })

            });

            mobileConfigPage.evFinishedPage.subscribe(() => {
                logger.log("getMobileConfigData Event: evFinishedPage");
            });

            mobileConfigPage.processPage(render_helper).then(async () => {

                // Initialize the components list
                const list: JSX.Element[] = [];

                // Added to see why events are coming in after render_helper is complete
                // This works for testing and should be removed when the latest platformshare is installed
                // await new Promise((resolve)=>setTimeout(resolve, 1000));

                // logger.log("getMobileConfigData List length=", render_helper.currentTarget.length);

                // Add the JSX Elements to the list array.
                render_helper.currentTarget.forEach(e => {
                    // logger.log("getMobileConfigData renderHelper list item:", e);
                    list.push(e as JSX.Element);
                });
                // Updating the state if component is still mount

                // Set the title, Mapped Components to the state
                this.setState({ allComponents: list, active: true })

                this.props.dispatch(fetchingRouteEnd())
            })
        } else {

            // Ending the function if mobileConfig does not exist.
            this.props.dispatch(fetchingRouteEnd())
        }
    }

    /**
     * This method runs when the form is submitting successfully
     * @param route 
     */
    formSuccess(route: string) {
        this.props.dispatch(addRoute(route))
        this.getMobileConfigData(route)
    }

    /**
     * Button press handler > Gets the data for next screen and adds the route to reducer
     * @param route 
     */
    btnPress(route: string) {
        this.getMobileConfigData(route)
        this.props.dispatch(addRoute(route))
    }

    /**
     * If the user presses backbutton during the survey process.
     * @params none
     */
    pressBack() {
        if (this.props.RoutesReducer.routeList.length > 1) {
            this.props.dispatch(removeRoute())
        }
    }

    tablePress(header: StepTable.Column[], rows: CellValue[]) {
        // console.log(header, rows)
        this.setState({
            tableHeader: header,
            tableContent: rows,
            tableVisible: true
        })
    }

    render() {
        // Destructuring the screen data from the state
        const { title, openMenu, allComponents, modalList, dateModal, fieldName, fieldType, formThis, showListModal } = this.state;
        // Getting screen layout values
        const { screenHeight, screenWidth, orientation }: screenOrient = this.props.DimensionsReducer;
        let minute = (1000 * 60) * 5 // 5 minutes calculation (1000 * 60)* 5
        let screenHWO = { screenHeight, screenWidth, orientation };
        let orientStyles = orientationStyle(screenWidth, screenHeight, orientation);
        let CommonOrientationS = CommonOrientationStyle(screenWidth, screenHeight, orientation);

        return (
            <SafeAreaView style={CommonStyles.container} >
                <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

                {this.props.RoutesReducer.routeFetching && <FetchingIndicator />}

                <UserInactivity
                    isActive={this.state.active}
                    timeForInactivity={minute}
                    onAction={(isActive) => {
                        if (!isActive) {
                            this.getMobileConfigData(this.props.RoutesReducer.activeRoute)
                        } else {
                            this.setState({ intervalStart: false })
                        }
                        this.setState({ active: isActive })
                    }}
                    style={CommonStyles.container}
                >

                    <>
                        <View style={{ flex: 1 }} >
                            <ImageBackground style={[CommonOrientationS.logoHeader, { flexDirection: "row" }]} resizeMode="cover" source={ImagesSrc.appHeaderBackground} >
                                <View style={{ flex: 0.3 }} />
                                <View style={styles.headerCont} >
                                    <Text style={[styles.label, orientStyles.label]} >{this.state.screenName === "change Password" ? "Change Password" : title}</Text>
                                </View>
                                <View style={{ flex: 0.3 }} >
                                    <TouchableOpacity
                                        onPress={() => this.setState({ openMenu: true })}
                                        style={[styles.menuBtn, { paddingHorizontal: wo(5, screenWidth) }]} >
                                        <MaterialIcon style={{ fontSize: RF(3.5), color: Colors.white1 }} name="menu" />
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                            {
                                this.state.screenName === "change Password" ?
                                    <ChangePassword
                                        onSuccess={() => {
                                            this.setState({ screenName: "dashboard" })
                                        }}
                                    /> :
                                    allComponents.length !== 0 &&
                                    <View style={{ flex: 1, ...orientStyles.contentCont }} >
                                        <ScrollView keyboardShouldPersistTaps="always">
                                            {
                                                allComponents
                                            }
                                        </ScrollView>
                                    </View>
                            }
                        </View>
                    </>

                </UserInactivity >
                <DateTimePickerModal
                    isVisible={dateModal}
                    mode={fieldType}
                    is24Hour={false}
                    onConfirm={(date: any) => {
                        logger.log(date)
                        if (formThis?.getDateTimeFromComponent)
                            formThis.getDateTimeFromComponent(date, fieldName);
                        this.setState({ dateModal: false, fieldName: "", formThis: null, fieldType: "date" })
                    }}
                    onCancel={() => this.setState({ dateModal: false, fieldName: "", formThis: null, fieldType: "date" })}
                />

                <DropdownModal
                    showModal={showListModal}
                    showItem={"english"}
                    hideModal={() => this.setState({ showListModal: false, modalList: [], fieldName: "", formThis: null })}
                    showList={modalList ? modalList : []}
                    itemSelected={(v: any) => {
                        if (formThis?.getSelectModalFromComponent)
                            formThis.getSelectModalFromComponent(v, fieldName);
                        this.setState({ showListModal: false, modalList: [], fieldName: "", formThis: null })
                    }}
                />

                <DrawerContentModal
                    visible={openMenu}
                    newScreen={(screenName: string) => this.setState({ screenName })}
                    changeRoute={(route: string) => {
                        this.setState({ screenName: "" })
                        this.btnPress(route)
                    }}
                    pressClose={() => this.setState({ openMenu: false })}
                />

                <Modal isOpen={this.state.tableVisible} onClose={() => this.setState({ tableVisible: false })}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header></Modal.Header>
                        <Modal.Body>
                            {this.state.tableHeader &&
                                this.state.tableHeader.map((v, i: number) => {
                                    if (!v.link) {
                                        return (
                                            <HStack key={v.text + i} py={2} >
                                                <NBText flex={1} fontSize={"md"} fontWeight="bold" >{v.text}</NBText>
                                                <NBText flex={1} fontSize={"md"} fontWeight="normal" >{this.state.tableContent && this.state.tableContent[i].text ? this.state.tableContent[i].text : "-"}</NBText>
                                            </HStack>
                                        )
                                    } else {
                                        return (
                                            <HStack key={v.text + i} py={2} alignItems="center" >
                                                <Box flex={1} justifyContent="center" >
                                                    <NBText fontSize={"md"} fontWeight="bold" >{v.text}</NBText>
                                                </Box>
                                                <Button bg={Colors.themeBlue} flex={1} onPress={() => {
                                                    if (this.state.tableContent) {
                                                        let link = this.state.tableContent[i].link;
                                                        this.setState({
                                                            tableHeader: null,
                                                            tableContent: null,
                                                            tableVisible: false
                                                        })
                                                        if (link) {
                                                            this.btnPress(link)
                                                        }

                                                    }
                                                }}>{this.state.tableContent && this.state.tableContent[i].text}</Button>
                                            </HStack>
                                        )
                                    }
                                })
                            }
                        </Modal.Body>

                    </Modal.Content>
                </Modal>

            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    headerCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        fontFamily: Fonts.GILROY_BOLD,
        color: "#fff",
        textAlign: "center"
    },
    menuBtn: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => responsiveHeight(orientation, screenHeight, num, diff);

    return {
        label: {
            fontSize: RF(2.3)
        },
        contentCont: {
            paddingVertical: VScale(4, 2)
        }
    }
}

const mapStateToProps = (state: IReducer) => {
    return {
        DimensionsReducer: state.DimensionsReducer,
        RoutesReducer: state.RoutesReducer,
    };
}

export default connect(mapStateToProps)(DashBoardScreen);