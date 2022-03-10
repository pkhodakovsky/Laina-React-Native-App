import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { Colors, Heights } from '../../../styles';
import { IReducer } from '../../../redux/reducer';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../../common/responsiveFunct';
import { Divider, Icon, Box, Text, Pressable, HStack } from 'native-base';
import { StepTable } from '@lainaedge/platformshared';
import HelperFunct from '..';

interface PageTablesTypes {
    helperThis: HelperFunct,
    opt: StepTable
}

export interface CellValue {
    sortValue: any;
    text: string;
    link?: string;
    icon?: string;
    align: string;
}

const PageTables = ({ opt, helperThis }: PageTablesTypes) => {

    const { screenHeight, orientation } = useSelector((state: IReducer) => state.DimensionsReducer);

    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
    const formattedData = opt.getFormattedData();
    const records = opt.records;
    return (
        <Box bg="white" >
            <Box py={3} px={5} shadow={1} bg="white"  >
                <Text fontSize="md" fontWeight={"bold"} >{opt.columns.length !== 0 && opt.columns[0].text}</Text>
            </Box>
            <Box py={3} px={5} >
                {
                    formattedData.map((row: CellValue[], i: number) => {
                        if (row.length !== 0) {
                            return (
                                <Box key={i} >
                                    <Pressable onPress={() => helperThis.componentThis.tablePress(opt.columns, row)} _pressed={{ opacity: 60 }} >
                                        <HStack py={2} alignItems={"center"} justifyContent={"space-between"} >
                                            <Text>{row[0].text}</Text>
                                            <Icon as={MaterialIcon} size={RF(4)} color={Colors.grey2} name="chevron-right" />
                                        </HStack>
                                    </Pressable>
                                    <Divider bg={"gray.300"} />
                                </Box>
                            )
                        }
                    })
                }
            </Box>
        </Box>
    )
}

const styles = StyleSheet.create({

})

export default PageTables;