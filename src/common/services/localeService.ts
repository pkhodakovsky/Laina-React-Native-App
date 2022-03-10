import * as RNLocalize from 'react-native-localize';
import i18n from "i18n-js";
import * as _ from "lodash";

type localeType = {
    [v: string | number]: () => {},
}

// Getting the language presets.
const translationGetters: localeType = {
    en: () => require('../locales/en.json'),
}

export const translate = _.memoize(
    (key: string, config: any) => i18n.t(key, config),
    (key: string, config: any) => (config ? key + JSON.stringify(config) : key)
)

/**
 * This function handles all the multilanguage support in the application.
 */
export const setI18nConfig: () => void = () => {
    const fallback = { languageTag: 'en' }
    const { languageTag } = RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

    if (translate.cache.clear)
        translate.cache.clear()

    i18n.translations = { [languageTag]: translationGetters[languageTag]() }
    i18n.locale = languageTag
}