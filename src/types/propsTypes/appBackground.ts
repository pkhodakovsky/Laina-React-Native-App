// AppBackground Component Interfaces ======================>

interface AppBackgroundProps {
    isBusy?: boolean, // it will show fetching indicator when its value is true
    flexGrow?: boolean, // it is handling scrollview so when we set value of flexGrow into 1 it will cover all the remaining extra space in the screen
    showStatus?: boolean,
    children: React.ReactNode
}

export default AppBackgroundProps;