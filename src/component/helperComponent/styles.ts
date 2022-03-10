import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../common/responsiveFunct';

const styles = StyleSheet.create({
    title: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        color: Colors.title,
        fontWeight: "bold",
    },
    note: {
        fontFamily: Fonts.SF_UI,
        color: Colors.borderColorInput,
    },
    taskStatusView: {
        justifyContent: "center",
        alignItems: "center",
    },
    taskStatus: {
        fontFamily: Fonts.SF_UI,
        color: Colors.white
    },
    btn: {
        backgroundColor: Colors.green,
        fontFamily: Fonts.GILROY_MED,
        justifyContent: "center",
        alignItems: "center"
    },
    sectionCont2: {
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    cardCont: {
        flexDirection: 'column',
        justifyContent: "space-between",
        borderRadius: wp('1%'),
        backgroundColor: Colors.white,
        borderWidth: 1,
    },
    cardTitle: {
        fontFamily: Fonts.GOTHAM_MEDIUM,
        fontWeight: "bold",
    },
    separator: {
        height: 1,
        backgroundColor: Colors.cadetblue1,
        width: wp('10%'),
        marginTop: hp('3%')
    },
    hintLine: {
        height: 0.5,
        backgroundColor: Colors.light_black,
    },
    sectionTitle: {
        fontFamily: Fonts.GILROY_LIGHT,
        color: "#000",
    },
})

export default styles;