import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as RegularIcon from "@fortawesome/free-regular-svg-icons";
import * as BrandIcon from "@fortawesome/free-brands-svg-icons";
import * as DuotoneIcon from "@fortawesome/pro-duotone-svg-icons";
import * as ProSolidIcons from "@fortawesome/pro-solid-svg-icons";
import * as ProRegularIcons from "@fortawesome/pro-regular-svg-icons";
import * as ProLightIcons from "@fortawesome/pro-light-svg-icons";

export function parseIconFromClassName(iconClassName: string) {
    if (!iconClassName) return;
    // console.log(iconClassName, "iconClassName/////")

    const IconsType = iconClassName.indexOf('far') > -1 ? "regular" :
        iconClassName.indexOf('fab') > -1 ? "brand" :
            "solid"

    iconClassName = iconClassName.replace(/(fa|fas|far|fab)( )/gi, '')

    let nameParts = iconClassName.match(/(\-)(\w{1,1})/gi) || []

    nameParts.forEach(m => {
        iconClassName = iconClassName.replace(m, m.toUpperCase())
    })

    iconClassName = iconClassName.replace(/\-/gi, '')
    iconClassName = (iconClassName || '').trim()
    
    let IconPack;
    if (IconsType === "solid") {
        IconPack = SolidIcons[iconClassName] ? SolidIcons[iconClassName] : ProSolidIcons[iconClassName]
    } else if (IconsType === "regular") {
        IconPack = RegularIcon[iconClassName] ? RegularIcon[iconClassName] : ProRegularIcons[iconClassName]
    } else {
        IconPack = BrandIcon[iconClassName] ? BrandIcon[iconClassName] : (DuotoneIcon[iconClassName] ? DuotoneIcon[iconClassName] : (ProLightIcons[iconClassName] ? ProLightIcons[iconClassName] : null))
    }
    // console.log(IconPack, iconClassName, "iconClassName")
    return IconPack;
}