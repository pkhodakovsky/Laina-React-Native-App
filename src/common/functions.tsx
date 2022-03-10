import React from 'react'
import { Text, Alert } from 'react-native';
import { PageManager } from '@lainaedge/platformshared';
import { Colors } from '../styles';
import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

/**
 * This function gets the pageRoute and configuration of survey from the lainaedge platform
 * @returns pageEngine Object provided by the platform.
 */
export const CommonFunctions = {

    getMobileConfig: async (v: string) => {
        var pageEngine;

        // Upadting the mobile object provided by @lainaedge platform.
        PageManager.allowMobileConfig = true;
        PageManager.allowEdcConfig = true;

        // Setting the page route from @lainaedge platform
        let page = await PageManager.instance().findRoute(v);

        if (page.rawConfig.tableName) {
            pageEngine = page;
        } else {
            Alert.alert(
                "Error Message",
                "Unable to find page contact support",
                [
                    { text: "OK" }
                ],
                { cancelable: false }
            )
            return null;
        }

        return pageEngine;
    }
}

/**
 * This class handles all the logging in the application.
 * @example logger.log("Message") instead of console.log("Message")
 */
export class Logger {
    constructor() {

    }

    log = function (...messages: any) {
        var args = Array.prototype.slice.call(messages)
        args.unshift("LOG =>" + " ");
        console.log.apply(console, args);
    }

    warn = function (...messages: any) {
        var args = Array.prototype.slice.call(messages)
        args.unshift("WARNING =>" + " ");
        console.warn.apply(console, args);
    }

    error = function (...messages: any) {
        var args = Array.prototype.slice.call(messages)
        args.unshift("ERROR =>" + " ");
        console.error.apply(console, args);
    }

    assert = function (condition: boolean, message: string) {
        console.assert(condition, message)
    }

}

export const logger = new Logger()

/**
 * This function converts broswer based <b> tags to React Native <Text> Tags
 * @param str 
 * @returns string or list of JSX Elements
 * @example "This is some <b>Text</b>" converts to "This is some <Text>text</Text>"
 */
export const handleBoldTagsInString = (str: string) => {
    let countForBold = (str.match(/<b>/g) || []).length;

    if (countForBold !== 0) {

        var labelArray: (string | Element)[] = [];

        for (var i = 0; i < countForBold; i++) {

            // Finding start and end indexes of <b> tags
            let startIndex = str.indexOf("<b>");
            let endIndex = str.indexOf("</b>");

            // Add the text before the tags into the return string/array.
            labelArray.push(str.slice(0, startIndex));

            // Creating the React-native text component to be placed by the HTML elements.
            let boldText: Element = <Text key={str.slice(startIndex + 3, endIndex)} style={{ fontWeight: "bold", color: Colors.black }} >{str.slice(startIndex + 3, endIndex)}</Text>

            // Adding the element to return array.
            labelArray.push(boldText)

            // Removing the <b> and </b> tags from string.
            str = str.replace(str.slice(0, endIndex + 4), "");
            if (i === countForBold - 1) {
                labelArray.push(str)
                return labelArray;
            }
        }
    } else {
        return str;
    }
}

const appIdentifier = getBundleId();

export function getTestID(testID: string) {
  if (!testID) {
    return undefined;
  }

  const prefix = `${appIdentifier}:id/`;
  const hasPrefix = testID.startsWith(prefix);

  return Platform.select({
    android: !hasPrefix ? `${prefix}${testID}` : testID,
    ios: hasPrefix ? testID.slice(prefix.length) : testID,
  });
}

export const tID = getTestID;