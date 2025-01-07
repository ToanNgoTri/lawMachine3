import {NavigationContainer} from '@react-navigation/native';
// import {TouchableOpacity} from 'react-native-gesture-handler'
import {useSelector, useDispatch} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import database from '@react-native-firebase/database';
import {useEffect, useContext} from 'react';
import Home from '../screens/Home';
import {Detail1} from '../screens/Detail1';
import {Detail2} from '../screens/Detail2';
// import Detail4 from '../screens/Detail4';
import Detail5 from '../screens/Detail';
import {useNetInfo} from '@react-native-community/netinfo';
import {ModalStatus} from '../App';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Ionicons from 'react-native-vector-icons/Ionicons';
// import {RefOfSearchLaw} from '../App';

// const renderScene = SceneMap({
//   Home: Home,
//   SearchLaw: Detail2,
//   SearchContent: Detail1,
// });

// const routes = [
//   {key: 'Home', title: 'Home'},
//   {key: 'SearchLaw', title: 'SearchLaw'},
//   {key: 'SearchContent', title: 'Search Content'},
//   // {key: 'SearchContent', title: 'Search Content'},
// ];

// const AppNavigators = () => {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = useState(0);

// // let index = 1
//   // const RefLawSearch = useContext(RefOfSearchLaw);

//   return (
//     <TabView
//     animationEnabled={false}
//       tabBarPosition="bottom"
//       navigationState={{index, routes}}
//       renderTabBar={props => (
//         <TabBar
//           {...props}
//           // bounces={true}
//           indicatorStyle={{backgroundColor:'red',height:50,bottom:0,zIndex:10,opacity:1,borderTopWidth:3,borderTopColor:'black'}}
//           indicatorContainerStyle={{
//             // backgroundColor: 'green',
//             height: 50,
//             position: 'absolute',
//             zIndex:10,
//             opacity:.2
//           }}
// //           renderTabBar={({route})=>{

// // console.log('props',props);

// //             return (
// //               <View>
// //                 {props.navigationState.routes.map((key,i)=>(
// //               <Pressable
// //               onPress={() => {
// //                 props.jumpTo(route.key);
// //               }}>
// //               <View
// //                 style={{
// //                   alignItems: 'center',
// //                   width: layout.width/3,
// //                   height: '100%',
// //                   backgroundColor: 'gray',
// //                   paddingBottom:5,
// //                   paddingTop:5
// //                 }}>
// //                 <Ionicons
// //                   name={
// //                     route.key == 'Home'
// //                       ? 'home-outline'
// //                       : route.key == 'SearchLaw'
// //                       ? 'albums-outline'
// //                       : 'search-outline'
// //                   }
// //                   style={
// //                     styles.IconActive
// //                   }></Ionicons>
// //                 <Text
// //                   style={{
// //                     ...(styles.IconActive),
// //                     fontSize: 10,
// //                   }}>
// //                   {route.key == 'Home'
// //                     ? 'Downloaded'
// //                     : route.key == 'SearchLaw'
// //                     ? 'Search Law'
// //                     : 'Search'}
// //                 </Text>
// //               </View>
// //             </Pressable>

// //                 ))}

// //               </View>
// //             );

// //           }}
//           renderTabBarItem={({route}) => {

//             let focus = props.navigationState.routes[index].key == route.key

//             return (
//               <Pressable
//                 onPress={() => {
//                   props.jumpTo(route.key);
//                 }}>
//                 <View
//                   style={{
//                     alignItems: 'center',
//                     width: layout.width/3,
//                     height: 50,
//                     backgroundColor: 'white',
//                     paddingBottom:5,
//                     paddingTop:5,
//                     backgroundColor:'orange',
//                     alignContent:'center',
//                     justifyContent:'center',
//                     display:'flex'
//                   }}>
//                   <Ionicons
//                     name={
//                       route.key == 'Home'
//                         ? 'home-outline'
//                         : route.key == 'SearchLaw'
//                         ? 'albums-outline'
//                         : 'search-outline'
//                     }
//                     style={
//                       focus  ?  styles.IconActive :  styles.IconInActive
//                     }></Ionicons>
//                   <Text
//                     style={{
//                       ...( focus  ?  styles.IconActive :  styles.IconInActive
//                       ),
//                       fontSize: 10,
//                     }}>
//                     {route.key == 'Home'
//                       ? 'Downloaded'
//                       : route.key == 'SearchLaw'
//                       ? 'Search Law'
//                       : 'Search Content'}
//                   </Text>
//                 </View>
//               </Pressable>
//             );
//           }}
//           pressColor="orange"
//         />
//       )}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{width: layout.width}}

//     />
//   );
// };

const Tab = createMaterialTopTabNavigator();

const AppNavigators = () => {
  const insets = useSafeAreaInsets(); // lất chiều cao để manu top iphone
  
  
  return (
    <Tab.Navigator
    
      tabBarPosition="bottom"
      screenOptions={({route}) => ({
        tabBarPressColor: '#FFCC66',
        animationEnabled: false,
        animation: 'shift',
        lazy: false,
        tabBarIndicatorStyle: {
          backgroundColor: '#336600',
          top: -2,
          margin: 0,
          padding: 0,
        },
        tabBarStyle: {
          postion: 'absolute',
          height: 55 + (insets.bottom)/2 ,
          borderWidth: 0.5 ,
          borderColor: '#DDDDDD',
          bottom:-1,
          // backgroundColor:'red',
          // width:'100%'
        },
      })}>
      <Tab.Screen
        name="SearchLaw"
        component={Detail2}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={{alignItems: 'center', top: -5, minWidth: 100,}}>
                <Ionicons
                  name="albums-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Tìm văn bản
                </Text>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
            // SearchScrollview.forSearch.current.scrollTo({y: 0});
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Detail1}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                // style={focused ? {...styles.tabItemActive,width:widthTab,height:(widthTab>heightTab?'108%':'104%')} : styles.tabItemInactive}
                style={{alignItems: 'center', top: -5, minWidth: 100}}>
                <Ionicons
                  name="search-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}>
                  Tìm nội dung
                </Text>
              </View>
            );
          },
          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {
            // SearchScrollview.forSearch.current.scrollTo({y: 0});
          },
        }}
      />
            <Tab.Screen
        name="Home"
        component={Home}
        options={{
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={{alignItems: 'center', top: -5, minWidth: 100,}}>
                <Ionicons
                  name="home-outline"
                  style={
                    focused ? styles.IconActive : styles.IconInActive
                  }></Ionicons>
                <Text
                  style={{
                    ...(focused ? styles.IconActive : styles.IconInActive),
                    fontSize: 13,
                    fontWeight: 'bold',
                    
                  }}>
                  Đã tải xuống
                </Text>
              </View>
            );
          },

          tabBarLabel: () => {
            return null;
          },
        }}
        listeners={{
          tabPress: props => {},
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const ModalVisibleStatus = useContext(ModalStatus);

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (internetConnected) {
      // dispatch({type: 'stackscreen'})
    }

    // callAllSearchLaw().then(res=>inf.updateInfo(res))
  }, [internetConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator
      
      screenOptions={{
        // headerShadowVisible:true,

        headerStyle:{
          backgroundColor:'green',

        },
        headerBlurEffect:'extraLight',
        headerShadowVisible:false
      }}
      >
        <Stack.Screen
          name="HomeStack"
          component={AppNavigators}
          options={{
            // animationEnabled: false,
            header: () => null,
            // headerStyle:{backgroundColor:'red'}
          }}
        />

        <Stack.Screen
          name={`accessLaw`}
          component={Detail5}
          options={({navigation}) => ({
            // header:()=>{      <View style={{height: (Platform.OS === 'ios') ? 10 : 0,backgroundColor:'yellow',position:'relative'}}>
            // </View>
            // },
            // headerStyle:{backgroundColor:'red',top:20},
            // headerLargeTitleShadowVisible:true,
            headerTitleAlign: 'center',
            animation: 'simple_push',
            animationTypeForReplace: 'push',
            headerLeft: () => (
              <TouchableOpacity
              
                // onPress={() => {
                //   navigation.goBack();
                //   console.log(1);
                // }}
                onPressIn={() => {
                  navigation.goBack();
                }}
                // onPressOut={() => {
                //   navigation.goBack();
                //   console.log(3);
                // }}

                >
                <Ionicons
                  name="chevron-back-outline"
                  style={styles.IconInfo}></Ionicons>
              </TouchableOpacity>
            ), // headerStyle: { backgroundColor: 'black',alignItems:'center',justifyContent:'flex-end',display:'flex',padding:100 },
            // headerTitle: props => (
            //   <TouchableOpacity
            //     style={{
            //       backgroundColor: 'red',
            //       // height: '60%',
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //       overflow: 'hidden',
            //       borderRadius: 30,
            //       // marginBottom:40
            //       // paddingTop:5,
            //       // paddingBottom:5
            //     }}
            //     // onPress={() => {
            //     //   navigation.popToTop();
            //     //   console.log(1);
            //     // }}
            //     onPressIn={() => {
            //       navigation.popToTop();
            //       console.log(2);
            //     }}
            //     // onPressOut={() => {
            //     //   navigation.popToTop();
            //     //   console.log(3);
            //     // }}
            //     >
            //     <Image style={{alignItems:'center',justifyContent:'center',backgroundColor:'red'}} source={require('../assets/t.png')}></Image>
            //   </TouchableOpacity>
            // ),
            headerTitle:()=> <></>,
            headerRight: () => (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.iconInfoContainer}
                  // onPress={() => {
                  //   // navigation.navigate('Search')
                  //   ModalVisibleStatus.updateModalStatus(true);
                  // }}
                  onPressIn={() => {
                    ModalVisibleStatus.updateModalStatus(true);
                  }}
                  >
                  <Ionicons
                    name="document-text-outline"
                    style={styles.IconInfo}></Ionicons>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        {/* ))} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // tabItemActive: {
  //   // backgroundColor:'red',
  //   width: '100%',
  //   // right:0,
  //   // left:100,
  //   height: '104%',
  //   position: 'relative',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderTopColor: 'red',
  //   borderTopWidth: 4,
  //   overflow: 'hidden',
  // },
  tabItemInactive: {
    position: 'relative',
    // width: '100%',
    height: '102%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconActive: {
    fontSize: 24,
    color: 'green',
    // transform:animatedValue
  },
  IconInActive: {
    fontSize: 24,
    color: 'black',
  },
  IconInfo: {
    fontSize: 30,
    display: 'flex',
    color:'white',

  },
  iconInfoContainer: {
    // width: 50,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black',
    borderRadius: 25,
  },
});
export default StackNavigator;
