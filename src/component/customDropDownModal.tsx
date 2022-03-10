import React from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList, Text} from 'react-native';
import Modal from 'react-native-modal';

import { heightPercentageToDP as hp, widthPercentageToDP as wp, moderateScale } from '../common/responsiveFunct';
import { Fonts, Colors } from '../styles';
import {CustomDropdownProps} from './interfaces'
import { useSelector } from "react-redux";
import { IReducer } from '../redux/reducer';

function DropdownModal(props: CustomDropdownProps) {

    // Screen Width and height values
    const { screenHeight, screenWidth } = useSelector((state: IReducer) => state.DimensionsReducer);

    return (

        <Modal
            isVisible={props.showModal}
            backdropOpacity={0.8}
            deviceWidth={screenWidth}
            swipeDirection={['up']}
            style={styles.modalMain}
            onBackdropPress={() => props.hideModal()}
        >
            <View style={[styles.modalCont, { maxHeight: screenHeight / 2.5, width: screenWidth }]} >
                <FlatList
                    data={props.showList}
                    keyExtractor={(item, index) => String(index)}
                    initialNumToRender={20}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity onPress={() => props.itemSelected(item)} style={styles.modalBtn} >
                                <Text style={{ ...styles.dropdownTxt, fontSize: moderateScale(17) }} >{props.showItem ? item[props.showItem] : item}</Text>
                            </TouchableOpacity> 

                        )
                    }}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalMain: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalCont: {
        backgroundColor: Colors.white,
        paddingVertical: hp('1.5%')
    },
    modalBtn: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('5%')
    },
    dropdownTxt: {
        fontFamily: Fonts.SF_UI,
        color: Colors.inputColor
    },
})

export default DropdownModal;