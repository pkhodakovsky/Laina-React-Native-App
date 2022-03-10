import store from "./redux/store";
import React, { useEffect } from 'react';
import Routes from './navigations/routes';
import { LogBox } from 'react-native';
import { Provider } from "react-redux";
import { NativeBaseProvider } from 'native-base';

// (window as any).global = window;
// @ts-ignore
window.Buffer = window.Buffer || require('buffer').Buffer;

const App: React.FC = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  });

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <Routes />
      </Provider>
    </NativeBaseProvider>
  )
};

export default App;