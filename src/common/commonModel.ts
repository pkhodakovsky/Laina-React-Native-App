export interface screenOrient {
    screenHeight: number,
    screenWidth: number,
    orientation: string
}

export interface DimensionsReducer {
    DimensionsReducer: screenOrient   // containing orientation data like height , width and screen orientation
}

export type screenRouteType = {
    activeRoute: string,
    routeList: string[],
    routeFetching: boolean,
    componentRef: JSX.ElementAttributesProperty | undefined | null
}

export type versionType = {
    version: string,
    clientPlatformSV: string,
    serverPlatformSV: string,
    serverTDDVersion: string,
    appVersion: string
}