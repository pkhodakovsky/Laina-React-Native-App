import {  Heights } from '../../styles';

const orientationStyle = (screenWidth: number, screenHeight: number, orientation: string) => {
    let VScale = (num: number, diff: number) => Heights.Resp_Height(orientation, screenHeight, num, diff);
    
    return {
      
    }
}

export default orientationStyle;