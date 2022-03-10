import React from "react";
import { Text, View, TextStyle } from "react-native";

import { Colors } from '../styles';
import {
    screenWidth,
    screenHeight,
    responsiveHeight,
    responsiveFontSize as RF
} from './responsiveFunctions';

interface ItemProps {
    count: number,
    name: string,
    styles: TextStyle
}

function firstElementConvert(label: string, item: ItemProps | undefined) {

    var labelArray: (string | JSX.Element)[] = [];

    if (item) {
        let startElement = `<${item.name}>`;
        let endElement = `</${item.name}>`

        for (var i = 0; i < item.count; i++) {
            let startIndex = label.indexOf(startElement);
            let endIndex = label.indexOf(endElement);
            if (label.slice(0, startIndex)) {
                labelArray.push(label.slice(0, startIndex));
            }
            let convertLabel = label.slice(startIndex + startElement.length, endIndex);
            let customText: JSX.Element = <Text key={convertLabel} style={item.styles} >{convertLabel}</Text>
            labelArray.push(customText)
            label = label.replace(label.slice(0, endIndex + endElement.length), "");
            if (i === item.count - 1) {
                labelArray.push(label)
                return labelArray
            }
        }
    }
}

function secondElementConvert(labelArray: (string | JSX.Element)[] | undefined, item: ItemProps) {

    let labelItemArr: (string | JSX.Element)[] = [];
    let startElement = `<${item.name}>`;
    let endElement = `</${item.name}>`

    if (labelArray?.length !== 0 && labelArray) {
        labelArray.map((v: string | JSX.Element, index: number) => {

            if (typeof v == "string") {

                if (item.name === "sup") {
                    let checkSup = (v.match(/<sup>/g) || []).length;
                    if (checkSup !== 0) {
                        let startSupIndex = v.indexOf(startElement);
                        let endSupIndex = v.indexOf(endElement);
                        labelItemArr.push(v.slice(0, startSupIndex))
                        let supText: JSX.Element = <View>
                            <Text key={index} style={item.styles} >{v.slice(startSupIndex + 5, endSupIndex)}</Text>
                        </View>
                        labelItemArr.push(supText)
                        labelItemArr.push(v.slice(endSupIndex + 6))
                    } else {
                        labelItemArr.push(v)
                    }
                } else {

                    let startIndex = v.indexOf(startElement);
                    let endIndex = v.indexOf(endElement);
                    labelItemArr.push(v.slice(0, startIndex))
                    let label = v.slice(startIndex + startElement.length, endIndex);
                    let customText: JSX.Element = <Text key={label} style={item.styles} >{(index > 0 ? " " : "") + label + ((index < (labelArray.length - 1)) ? " " : "")}</Text>
                    labelItemArr.push(customText)

                }

            } else {
                labelItemArr.push(v)
            }
        })
        return labelItemArr;
    }
}

const HtmlConvert = (label: string) => {
    let countForBold = (label.match(/\s*<b>\s*/ig) || []).length;
    let countForItalic = (label.match(/\s*<i>\s*/ig) || []).length;
    let countForBoldBlue = (label.match(/\s*<BoldBlue>\s*/ig) || []).length;
    let countForBoldItalic = (label.match(/\s*<BoldItalic>\s*/ig) || []).length;
    let countForBoldBlueItalic = (label.match(/\s*<BoldBlueItalic>\s*/ig) || []).length;
    let countForUnderline = (label.match(/\s*<u>\s*/ig) || []).length;
    let countForSup = (label.match(/\s*<sup>\s*/ig) || []).length;

    let orient_Style = orientationStyle();

    let boldStyles: TextStyle = { fontWeight: "bold", color: Colors.black };
    let italicStyles: TextStyle = { fontStyle: "italic", color: Colors.black };
    let boldBlueStyles: TextStyle = { fontWeight: "bold", color: "blue" };
    let underLineStyles: TextStyle = { textDecorationLine: "underline", color: Colors.black };
    let boldItalicStyles: TextStyle = { fontStyle: "italic", fontWeight: "bold", color: Colors.black };
    let boldBlueItalicStyles: TextStyle = { fontWeight: "bold", fontStyle: "italic", color: "blue" };
    let supStyles: TextStyle = { color: Colors.black, ...orient_Style.supText };

    let ArrayCounts = [
        { count: countForBold, name: "b", styles: boldStyles },
        { count: countForItalic, name: "i", styles: italicStyles },
        { count: countForUnderline, name: "u", styles: underLineStyles },
        { count: countForBoldBlue, name: "BoldBlue", styles: boldBlueStyles },
        { count: countForBoldItalic, name: "BoldItalic", styles: boldItalicStyles },
        { count: countForBoldBlueItalic, name: "BoldBlueItalic", styles: boldBlueItalicStyles },
        { count: countForSup, name: "sup", styles: supStyles },
    ]

    let newArrayCount = ArrayCounts.filter((obj) => {
        return obj.count !== 0
    });

    if (newArrayCount.length !== 0) {

        let selectedFirstItem = newArrayCount.shift();

        let convertedArr: (string | JSX.Element)[] | undefined = firstElementConvert(label, selectedFirstItem)


        if (newArrayCount.length !== 0) {

            return newArrayCount.map((v, i) => {

                let newConvertedElement = secondElementConvert(convertedArr, v);

                return newConvertedElement

            })
        } else {
            return convertedArr;
        }

    } else {
        return label
    }

}

const orientationStyle = (screenW: number = screenWidth, screenH = screenHeight, orientation: string = "PORTRAIT") => {
    let VScale = (num: number, diff: number) => responsiveHeight(orientation, screenH, num, diff);
    return {
        supText: {
            fontSize: RF(1.3),
            marginBottom: VScale(0.7, 0.3)
        }
    }
}

export default HtmlConvert;