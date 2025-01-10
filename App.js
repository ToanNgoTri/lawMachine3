/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './navigators/AppNavigators';
import {createContext, useState} from 'react';
import {Provider} from 'react-redux';
import {store} from './redux/store';
// import dataOrg from './data/data.json';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ModalStatus = createContext(); // lấy modalVisible status
// const InfoDownloaded = createContext(); //
// const RefOfSearchLaw = createContext(); //

function App() {


  const [modalStatus, setModalStatus] = useState(false);
  const updateModalStatus = data => {
    setModalStatus(data);
  };
  
  // const [info, setInfo] = useState({});
  // const updateInfo = data => {
  //   setInfo(data);
  // };

  // const [searchLawRef, setSearchLawRef] = useState('');
  // const updatesearchLawRef = data => {
  //   setSearchLawRef(data);
  // };

  // const [linkLawRelated, setLinkLawRelated] = useState('');
  // const updateLinkLawRelated = data => {
  //   setLinkLawRelated(data);
  // };

  
  return (
    <GestureHandlerRootView>
    <SafeAreaProvider>
    <Provider store={store}>
      <ModalStatus.Provider value={{modalStatus, updateModalStatus}}>
      {/* <RefOfSearchLaw.Provider value={{searchLawRef, updatesearchLawRef}}> */}
            {/* <InfoDownloaded.Provider value={{info,updateInfo}}> */}
      {/* <SafeAreaProvider> */}
      {/* <SafeAreaView> */}
            <StackNavigator />
    {/* </SafeAreaView> */}
    {/* </SafeAreaProvider> */}
            {/* </InfoDownloaded.Provider> */}
            {/* </RefOfSearchLaw.Provider> */}
      </ModalStatus.Provider>
    </Provider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// export default App;
export { ModalStatus, App};
