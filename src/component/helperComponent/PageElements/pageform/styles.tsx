import { StyleSheet } from 'react-native';
import { Heights, Colors, Fonts } from '../../../../styles';
import { widthPercentageOrientation as wo, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../../../common/responsiveFunct';

export const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
 
    return {
        step_cmn: {
            width: screenWidth,
        },
        inputGroupItem: {
            width: wo('90%', screenWidth),
        },
        inputCont: {
            height: VScale(10, 5),
            paddingRight: wo('2.5%', screenWidth)
        },
        inputLabel: {
            fontSize: RF(2),
            marginTop: VScale(3, 1.5),
            marginBottom: VScale(2, 1)
        },
        input: {
            fontSize: RF(1.8),
            paddingHorizontal: wo('2%', screenWidth)
        },
        radioCont: {
            marginTop: VScale(2, 1)
        },
        rCont: {
            marginVertical: VScale(1, 0.5)
        },
        formBtn: {
            marginTop: VScale(6, 3),
            paddingHorizontal: wo('6%', screenWidth),
            paddingVertical: VScale(3, 1.5),
            borderRadius: wo("2%", screenWidth)
        },
        editorMainCont: {
            height: VScale(40, 20),
        },
        editTxt: {
            fontSize: RF(1.8)
        },
        editBtn: {
            paddingHorizontal: wo('2%', screenWidth),
            marginLeft: wo('2%', screenWidth),
            height: VScale(10, 5),
        },
        editBtnGroup: {
            paddingHorizontal: wo('2%', screenWidth),
            height: VScale(10, 5),
            marginTop: VScale(3, 1.5),
            marginHorizontal: wo('2%', screenWidth)
        },
        loaderCont: {
            height: VScale(14, 7)
        },
        backNextBtn: {
            width: wo("35%", screenWidth)
        },
        SinglePageFormatCont: {
            width: wo("90%", screenWidth),
            height: VScale(130, 65),
            marginVertical: VScale(3, 1.5),
            paddingVertical: VScale(3, 1.5)
        },
        copyrightTxt: {
            fontSize: RF(1.8),
            width: wo('85%', screenWidth),
        }
    }
}

export const pageStyles = StyleSheet.create({
    inputMainCont: {
        flexDirection: 'row',
        width: '100%'
    },
    inputLabel: {
        fontFamily: Fonts.GILROY_REG,
    },
    input: {
        padding: 0,
        margin: 0,
        fontFamily: Fonts.GILROY_REG,
        backgroundColor: Colors.white
    },
    inputCont: {
        borderWidth: 1,
        flex: 1,
        borderRadius: wp('2%'),
        overflow: "hidden",
        borderColor: Colors.borderColor1,
        backgroundColor: Colors.white,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center"
    },
    editorMainCont: {
        alignSelf: "center",
        borderWidth: 1,
        borderRadius: wp('1%'),
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        overflow: 'hidden'
    },
    editTxt: {
        color: Colors.white,
        fontFamily: Fonts.SF_UI,
    },
    editBtnGroup: {
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: wp('1%'),
        borderWidth: 1,
        borderColor: Colors.primaryColor
    },
    loaderCont: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    BNbtnGroup: {
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center"
    },
    copyrightTxt: {
        alignSelf: "center",
        textAlign: "center",
        color: "#868686",
        fontFamily: Fonts.GILROY_LIGHT,
    },
    SinglePageFormatCont: {
        backgroundColor: "#fff",
        borderRadius: wp('5%'),
        alignSelf: "center",
        overflow: "hidden"
    }
})
