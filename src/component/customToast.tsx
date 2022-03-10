import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { moderateScaleO } from '../common/responsiveFunct';
import { Colors } from '../styles';
import { ToastRenderState, ToastPropsTypes } from "./types";
import { DimensionsReducer } from '../common/commonModel';

// Toast component render and class contructor props.
export interface ToastRenderProps extends ToastPropsTypes {
    position?: string,
    backgroundColor?: string,
    textColor?: string,
    orientation?: string,
    screenWidth: number
}

class Toast extends Component<ToastRenderProps, ToastRenderState> {
    animateTranslate: Animated.Value;
    animateOpacity: Animated.Value;
    isShownToast: boolean;
    message: string;
    timerID: NodeJS.Timeout | null;
    static defaultProps: { backgroundColor: string; textColor: string; orientation: string; };
    static propTypes: { backgroundColor: PropTypes.Requireable<string>; position: PropTypes.Requireable<string>; textColor: PropTypes.Requireable<string>; orientation: PropTypes.Requireable<string>; };
    constructor(props: ToastRenderProps) {
        super(props);

        this.animateTranslate = new Animated.Value(-10);

        this.animateOpacity = new Animated.Value(0);

        this.state = {
            renderToast: false,
        }

        this.isShownToast = false;

        this.message = '';
        this.timerID = null;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.timerID && clearTimeout(this.timerID);
    }

    showToast(message = "Custom Toast...", duration = 3000) {
        if (this.isShownToast === false) {
            this.message = message;

            this.isShownToast = true;

            this.setState({ renderToast: true }, () => {
                Animated.parallel([
                    Animated.timing(
                        this.animateTranslate,
                        {
                            toValue: 0,
                            duration: 350,
                            useNativeDriver: true
                        }
                    ),


                    Animated.timing(
                        this.animateOpacity,
                        {
                            toValue: 1,
                            duration: 350,
                            useNativeDriver: true
                        }
                    )
                ]).start(this.hideToast(duration))
            });
        }
    }

    hideToast = (duration: number) => {
        this.timerID = setTimeout(() => {
            Animated.parallel([
                Animated.timing(
                    this.animateTranslate,
                    {
                        toValue: 10,
                        duration: 350,
                        useNativeDriver: true
                    }
                ),

                Animated.timing(
                    this.animateOpacity,
                    {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: true
                    }
                )

            ]).start(() => {
                this.setState({ renderToast: false });
                this.animateTranslate.setValue(-10);
                this.isShownToast = false;
                this.timerID &&
                    clearTimeout(+this.timerID);
            })
        }, duration);
        return undefined
    }

    render() {
        const { position, backgroundColor, textColor, orientation } = this.props;

        if (this.state.renderToast) {
            return (
                <Animated.View style={[
                    styles.animatedToastViewContainer,
                    {
                        top: (position === 'top') ? '10%' : '80%',
                        transform: [orientation === "yAxis" ? {
                            translateY: this.animateTranslate
                        } : {
                            translateX: this.animateTranslate
                        }],
                        opacity: this.animateOpacity
                    }]}
                    pointerEvents='none'
                >
                    <View
                        style={[
                            styles.animatedToastView,
                            { backgroundColor }
                        ]}
                    >
                        <Text
                            numberOfLines={3}
                            style={[styles.toastText, { color: textColor, fontSize: moderateScaleO(15, this.props.screenWidth) }]}>
                            {this.message}
                        </Text>
                    </View>
                </Animated.View>
            );
        }
        else {
            return null;
        }
    }
}

Toast.propTypes = {
    backgroundColor: PropTypes.string,
    position: PropTypes.oneOf([
        'top',
        'bottom'
    ]),
    textColor: PropTypes.string,
    orientation: PropTypes.string
};

Toast.defaultProps = {
    backgroundColor: Colors.toastBackgroundColor,
    textColor: Colors.white,
    orientation: 'xAxis'
}

const styles = StyleSheet.create({
    animatedToastViewContainer: {
        width: '100%',
        zIndex: 9999,
        position: 'absolute'
    },

    animatedToastView: {
        marginHorizontal: 30,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 5,
        overflow: "hidden",
        justifyContent: 'center',
        alignSelf: 'center'
    },

    toastText: {
        alignSelf: 'stretch',
        textAlign: 'center',
        backgroundColor: Colors.toastTextBackgroundColor
    }
});

const mapStateToProps = ({DimensionsReducer}: DimensionsReducer) => ({
    screenHeight:DimensionsReducer.screenHeight, 
    screenWidth: DimensionsReducer.screenWidth, 
    orientation: DimensionsReducer.orientation
});

export default connect(mapStateToProps)(Toast);