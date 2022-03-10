import * as React from 'react';
import {View} from 'react-native';

import { useSelector } from "react-redux";

import { Heights } from '../../../styles';
import { DimensionsReducer } from '../../../common/commonModel';

type PageTabProps = {
    opt: { tabs: any[] },
    parentThis: { makeTabObject: (tabs: any) => void },
    pressTab: (i: number, tabs: any) => void,
}

const PageTabs = ({ opt, parentThis, pressTab }: PageTabProps) => {

    const { screenHeight, orientation } = useSelector((state: DimensionsReducer) => state.DimensionsReducer);

    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);

    React.useEffect(() => {
        parentThis.makeTabObject(opt.tabs);
        pressTab(1, opt.tabs[0])
    }, [])

    return (
        <View style={{ flexDirection: 'row', marginTop: VScale(2, 1) }} />
    )
}
export default PageTabs;