import React from "react";
import { Text, View, TextStyle } from "react-native";

import { Heights, Colors } from '../styles';
import { screenWidth, screenHeight, responsiveFontSize as RF } from './responsiveFunct';

interface ItemProps {
    count: number,
    name: string,
    styles: TextStyle
}

/**
 * This function converts the HTML formatted elements to React native compatible. 
 * @param label 
 * @param item 
 * @returns React native <Text></Text> Element
 * @example <li>List Item</li> converts to <Text style={{ ...given_styles }}>List Item</Text> 
 */
function firstElementConvert(label: string, item: ItemProps | undefined) {

    var labelArray: (string | JSX.Element)[] = [];

    if (item) {
        let startElement = `<${item.name}>`;
        let endElement = `</${item.name}>`

        // Looping according to the given count
        for (var i = 0; i < item.count; i++) {

            // Getting the starting and ending indexes of the given tag.
            let startIndex = label.indexOf(startElement);
            let endIndex = label.indexOf(endElement);

            // Getting the Text before the tag appears in the string.
            if (label.slice(0, startIndex)) {
                labelArray.push(label.slice(0, startIndex));
            }

            // Getting the text within the tags.
            let convertLabel = label.slice(startIndex + startElement.length, endIndex);

            // React-native compatible Text Element
            let customText: JSX.Element = <Text key={convertLabel} style={item.styles} >{convertLabel}</Text>

            // Adding it to the return array
            labelArray.push(customText)

            // Removing the end label of the HTML Element tag.
            label = label.replace(label.slice(0, endIndex + endElement.length), "");

            // Checking if the required number of elements have been replaced
            if (i === item.count - 1) {

                // Adding it to the return array.
                labelArray.push(label)

                // Returning the converted final Text
                return labelArray
            }
        }
    }
}


/**
 * This function converts HTML elements like <sup> to React native compatible tags like <View><Text></Text></View>
 * @param labelArray 
 * @param item 
 * @returns React native <View><Text>{given_text}</Text></View> Element
 */
function secondElementConvert(labelArray: (string | JSX.Element)[] | undefined, item: ItemProps) {

    // Setting the initial Elements to be replaced
    let labelItemArr: (string | JSX.Element)[] = [];
    let startElement = `<${item.name}>`;
    let endElement = `</${item.name}>`

    if (labelArray?.length !== 0 && labelArray) {

        // Mapping the string.
        labelArray.map((v: string | JSX.Element, index: number) => {

            // Checking if the type of element is Text or JSX.Element
            if (typeof v == "string") {

                if (item.name === "sup") {

                    // Getting the total numbers of <sup> element in the string array.
                    let checkSup = (v.match(/<sup>/g) || []).length;

                    // If there are <sup> Tags
                    if (checkSup !== 0) {

                        // Getting starting and ending indexes of the elements
                        let startSupIndex = v.indexOf(startElement);
                        let endSupIndex = v.indexOf(endElement);

                        // Pushing the Text before that tags in thne return string / array.
                        labelItemArr.push(v.slice(0, startSupIndex))

                        // Creating the JSX element that needs to be Replaced by the given tag
                        let supText: JSX.Element = <View key={index + v.slice(startSupIndex + 5, endSupIndex)} >
                            <Text style={item.styles} >{v.slice(startSupIndex + 5, endSupIndex)}</Text>
                        </View>

                        // Pushing the text inside the tags to the return string / array.
                        labelItemArr.push(supText)

                        // Pushing the text after the tags into the retrun array.
                        labelItemArr.push(v.slice(endSupIndex + 6))
                    } else {

                        // if there are no <sup> tags then just simply return the string in the given paramters.
                        labelItemArr.push(v)
                    }
                    // if elemeents isn't equal to the HTML <sup> tag
                } else {

                    // getting the starting and ending indexes of gthe given tag.
                    let startIndex = v.indexOf(startElement);
                    let endIndex = v.indexOf(endElement);

                    // Pushing the text before the tag into the returhn string / array.
                    labelItemArr.push(v.slice(0, startIndex))

                    // Getting the Text inside the tags.
                    let label = v.slice(startIndex + startElement.length, endIndex);

                    // Creating the JSX element that needs to be Replaced by the given tag 
                    let customText: JSX.Element = <Text key={label} style={item.styles} >{(index > 0 ? " " : "") + label + ((index < (labelArray.length - 1)) ? " " : "")}</Text>

                    // Pushing the text inside the tags to the return string / array.
                    labelItemArr.push(customText)

                }

            } else {

                // if the given elements do not exist in the array simply return the whole string.
                labelItemArr.push(v)
            }
        })

        // Returning the converted HTML to React-native elements
        return labelItemArr;
    }
}


/**
 * This function converts HTML <b> / <i> / <BoldBlue> / <BoldItalic> / <BoldBlueItalic> / <u> / <sup> Tags to <Text>{label}</Text> React-native Elements
 * @param label The string that needs to be converted
 * @returns JSX.Element (<Text>{label}</Text>)
 */
const HtmlConvert = (label: string) => {

    // Getting the count of all HTML Elements unsupported in React-native
    let countForBold = (label.match(/<b>/g) || []).length;
    let countForItalic = (label.match(/<i>/g) || []).length;
    let countForBoldBlue = (label.match(/<BoldBlue>/g) || []).length;
    let countForBoldItalic = (label.match(/<BoldItalic>/g) || []).length;
    let countForBoldBlueItalic = (label.match(/<BoldBlueItalic>/g) || []).length;
    let countForUnderline = (label.match(/<u>/g) || []).length;
    let countForSup = (label.match(/<sup>/g) || []).length;

    // Getting the orientation styles values
    let orient_Style = orientationStyle();

    // Setting custom styles for each Element like <b>{label}</b> will convert to <Text style={{ fontWeight: "bold", color: Colors.black }}>{label}</Text>
    let boldStyles: TextStyle = { fontWeight: "bold", color: Colors.black };
    let italicStyles: TextStyle = { fontStyle: "italic", color: Colors.black };
    let boldBlueStyles: TextStyle = { fontWeight: "bold", color: "blue" };
    let underLineStyles: TextStyle = { textDecorationLine: "underline", color: Colors.black };
    let boldItalicStyles: TextStyle = { fontStyle: "italic", fontWeight: "bold", color: Colors.black };
    let boldBlueItalicStyles: TextStyle = { fontWeight: "bold", fontStyle: "italic", color: "blue" };
    let supStyles: TextStyle = { color: Colors.black, ...orient_Style.supText };

    // Creating an array of the found elements
    let ArrayCounts = [
        { count: countForBold, name: "b", styles: boldStyles },
        { count: countForItalic, name: "i", styles: italicStyles },
        { count: countForUnderline, name: "u", styles: underLineStyles },
        { count: countForBoldBlue, name: "BoldBlue", styles: boldBlueStyles },
        { count: countForBoldItalic, name: "BoldItalic", styles: boldItalicStyles },
        { count: countForBoldBlueItalic, name: "BoldBlueItalic", styles: boldBlueItalicStyles },
        { count: countForSup, name: "sup", styles: supStyles },
    ]

    // Filtering out the tags that doesnt exist in the given string.
    let newArrayCount = ArrayCounts.filter((obj) => {
        return obj.count !== 0
    });

    // Checking if there were any HTML elements in the string.
    if (newArrayCount.length !== 0) {


        let selectedFirstItem = newArrayCount.shift();

        // Converting the text if there is any
        let convertedArr: (string | JSX.Element)[] | undefined = firstElementConvert(label, selectedFirstItem)

        // Checking if there were any HTML elements in the string.
        if (newArrayCount.length !== 0) {

            // Checking if there was any tag inside the tag that has been converted.
            return newArrayCount.map((v, i) => {

                // Converting the tags if there were any.
                let newConvertedElement = secondElementConvert(convertedArr, v);

                // Returning the converted text
                return newConvertedElement

            })
        } else {
            // Returning the converted text
            return convertedArr;
        }

    } else {
        // Returning the text as it is if there were no HTML elements / tags.
        return label
    }

}

// Setting the oreintation styles for the elements.
const orientationStyle = (screenW: number = screenWidth, screenH = screenHeight, orientation: string = "PORTRAIT") => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenH, num, diff);
    return {
        supText: {
            fontSize: RF(1.3),
            marginBottom: VScale(0.7, 0.3)
        }
    }
}

export default HtmlConvert;