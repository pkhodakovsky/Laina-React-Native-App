import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
    Linking,
    Alert,
    Modal
} from 'react-native';
import { connect } from "react-redux";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { PageEngine } from "@lainaedge/platformshared";

import { IReducer } from "../redux/reducer";
import {
    heightPercentageToDP as hp,
    responsiveFontSize as RF,
} from '../common/responsiveFunct';
import { Colors } from '../styles';
import { CommonFunctions } from '../common/functions';
import HelperFunct from './helperComponent';
import { LANDSCAPE, PORTRAIT } from '../common/variables';

import AsyncStorage from '@react-native-community/async-storage';
import { fetchingRouteStart, fetchingRouteEnd } from '../redux/action/routeActions';
import { logoutAction } from '../redux/action/authActions';

const render_helper = new HelperFunct();
const { height, width } = Dimensions.get("window");

class DrawerContentModal extends Component<any, any>{
    private _isMounted?: boolean;

    constructor(props: any) {
        super(props);
        this.state = {
            componentList: [],
            screenHeight: height,
            screenWidth: width,
            orientation: height >= width ? PORTRAIT : LANDSCAPE,
        }
    }

    UNSAFE_componentWillMount() {
        this._isMounted = true;
        const { screenWidth, screenHeight, orientation } = this.props.DimensionsReducer
        this.setState({ screenHeight, screenWidth, orientation })
        render_helper.setOrient(screenWidth, screenHeight, orientation);
        render_helper.componentThis = this;
        this.getMobileConfig()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getMobileConfig() {
        let route = "/page/menu_quickaccess";
        let mobileConfigPage: PageEngine | null = await CommonFunctions.getMobileConfig(route);
        render_helper.pageRoute = route;
        console.log(mobileConfigPage, '......./page/menu_quickaccess......')
        render_helper.currentTarget = [];
        if (mobileConfigPage) {
            mobileConfigPage.processPage(render_helper).then(async () => {
                const list: JSX.Element[] = [];
                render_helper.currentTarget.forEach(e => {
                    list.push(e as JSX.Element);
                });
                this.setState({ componentList: list })
            })
        }
    }

    async pressLogOut() {
        Alert.alert(
            "Logout",
            "Are you sure you want to Logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: async () => {
                        try {
                            this.props.dispatch(fetchingRouteStart())
                            if (this.props.user.data.loginWith !== "coordinator") {
                                await AsyncStorage.clear();
                            }
                            this.props.dispatch(logoutAction());
                            this.props.dispatch(fetchingRouteEnd())
                        } catch (e) {
                            // clear error
                            this.props.dispatch(fetchingRouteEnd())
                            console.log('Logout error', e)
                        }
                    }
                }
            ]
        );
    }

    async btnPress(routeTarget: string, opt: any) {
        var res = routeTarget.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        console.log(routeTarget, "checking--------")
        if (res == null) {
            this.props.pressClose()
            if (routeTarget === "/system/logout") {
                this.pressLogOut()
            } else if (routeTarget.indexOf("page/participant_start") !== -1) {
                this.props.changeRoute(`page/participant_start/${this.props.user.data.participantId}`);
            } else if (routeTarget.indexOf("page/change_password") !== -1) {
                this.props.newScreen("change Password")
            } else {
                this.props.changeRoute(routeTarget);
            }
        } else {
            this.props.pressClose()
            Linking.openURL(routeTarget).catch(e => console.log(e, "open url error"))
        }
    }

    render() {
        const { componentList } = this.state;
        return (
            <Modal
                visible={this.props.visible}
                animationType="slide"
            >
                <View style={styles.modal}>
                    <ScrollView style={styles.container} >
                        <View style={styles.headerCont} >
                            <TouchableOpacity onPress={() => this.props.pressClose()} >
                                <MaterialIcon style={styles.closeIcon} name="close" />
                            </TouchableOpacity>
                        </View>
                        {
                            componentList
                        }
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}



const mapStateToProps = (state: IReducer) => {
    return {
        DimensionsReducer: state.DimensionsReducer,
        user: state.AuthReducer
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    headerCont: {
        width: '90%',
        alignSelf: "center",
        paddingTop: Platform.OS == "ios" ? hp('6%') : hp('3%'),
        paddingBottom: hp("2%")
    },
    closeIcon: {
        alignSelf: "flex-end",
        fontSize: RF(4),
        color: Colors.black
    },
    modal: {
        flex: 1,
        backgroundColor: Colors.white
    },
})

export default connect(mapStateToProps)(DrawerContentModal);