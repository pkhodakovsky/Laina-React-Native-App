import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

import { useSelector } from "react-redux";

import { CommonOrientationStyle } from '../../../../common/commonStyles';
import { Colors } from '../../../../styles';
import { widthPercentageToDP as wp, responsiveFontSize as RF, heightPercentageToDP as hp } from '../../../../common/responsiveFunct';
import { IReducer } from '../../../../redux/reducer';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/Octicons';

const PdfField = ({
    field,
    containerStyle,
    pdfStyle,
    step,
    pdfScroll,
    pdfActive,
    pdfLoad,
    onError
}: any) => {

    const [pageIndex, setPage] = useState(1);
    const [pagechange, setPageChange] = useState(1);
    const [pageLength, setPageLength] = useState(0);

    useEffect(() => {
        pdfLoad && pdfLoad()
    }, [])

    const { screenHeight, screenWidth, orientation } = useSelector((state: IReducer) => state.DimensionsReducer);
    const CommonOrientationS = CommonOrientationStyle(screenWidth, screenHeight, orientation);
    let checkSinglePage = step.option_1 === 'SinglePageFormat';
    return (
        <View style={[styles.pdfCont, containerStyle]} >
            <Pdf
                page={pageIndex}
                // enablePaging={!checkSinglePage}
                horizontal={!checkSinglePage}
                onError={e => onError()}
                onLoadComplete={!checkSinglePage ? (numberOfPages: number) => setPageLength(numberOfPages) : pdfActive}
                onPageChanged={!checkSinglePage ? (page: number) => {
                    setPageChange(page)
                } : pdfScroll}
                source={{ uri: field.text }}
                renderActivityIndicator={() => <ActivityIndicator size="large" color={Colors.themeBlue} />}
                spacing={20}
                style={[styles.pdfStyles,
                    pdfStyle]} />
            {
                !checkSinglePage &&
                <View style={[styles.downIconCont]} >
                    <TouchableOpacity style={styles.arrowButton} onPress={() => {
                        let pageNumber = pagechange - 1;

                        if (pageNumber >= 1) {
                            setPageChange(pageNumber)
                            setPage(pageNumber)
                        }
                    }} >
                        <Icon style={[CommonOrientationS.downIcon, styles.downIcon, { color: pagechange == 1 ? Colors.borderColor : Colors.primaryColor }]} name="chevron-left" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.arrowButton} onPress={() => {
                        let pageNumber = pagechange + 1;

                        if (pageNumber <= pageLength) {
                            setPageChange(pageNumber)
                            setPage(pageNumber)
                        }
                    }} >
                        <Icon style={[CommonOrientationS.downIcon, styles.downIcon, { color: pagechange == pageLength ? Colors.borderColor : Colors.primaryColor }]} name="chevron-right" />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    pdfCont: {
        alignSelf: "center",
        marginVertical: hp("2%"),
        overflow: "hidden",
        backgroundColor: Colors.borderColor,
        paddingHorizontal: 0,
        width: wp('87%'),
        borderRadius: wp("4%"),
    },
    downIcon: {
        fontSize: RF(4)
    },
    downIconCont: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    arrowButton: {
        paddingHorizontal: wp("4%"),
        paddingBottom: wp("4%")
    },
    pdfStyles: {
        width: "90%",
        paddingVertical: hp("2%"),
        height: hp("65%"),
        marginTop: hp("2%"),
        marginHorizontal: wp('5%')
    }
})

export default PdfField;