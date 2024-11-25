import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Animated,
  ActivityIndicator,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import React, {useEffect, useState, useRef, useContext} from 'react';
import { useNavigation,useScrollToTop} from '@react-navigation/native';
// import {InfoDownloaded} from '../App';


export function Detail1({}) {

  const [SearchResult, setSearchResult] = useState([]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm
  
  const [input, setInput] = useState(undefined);
  // const [valueInput, setValueInput] = useState('');
  // const [valueInputForNav, setValueInputForNav] = useState('');

  const [inputFilter, setInputFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [checkedAllFilter, setCheckedAllFilter] = useState(true);

  const [name, setName] = useState(); // dùng để collapse (thu thập key của các law)
  const [nameArray, setNameArray] = useState([]); // arrray của các law đã expand

  const [article, setArticle] = useState(); // dùng để collapse (thu thập key của các 'điều')
  const [articleArray, setArticleArray] = useState([]); // arrray của các 'điều' đã expand


  const [choosenLaw, setChoosenLaw] = useState([]);
  const [LawFilted, setLawFilted] = useState(false)

  // const inf = useContext(InfoDownloaded);

  const [warning, setWanring] = useState(false);
  
  const textInput = useRef(null)

  const ScrollViewToScroll = useRef(null);

  useScrollToTop(ScrollViewToScroll)


  const dispatch = useDispatch();

  const {loading1, result} = useSelector(state => state['searchContent']);

  const navigation = useNavigation();
  
  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;

  useEffect(() => {
    setChoosenLaw(
      Object.keys(SearchResult).length
        ? Object.keys(SearchResult)
        : [],
    );
  }, [SearchResult]);
  
  useEffect(() => {
    if(result){
      let lawObject = {}
      result.map(law=>{
        lawObject[law._id] = {'lawNameDisplay':law.info['lawNameDisplay'],'lawDescription':law.info['lawDescription']}
      })
      setSearchResult(lawObject)
    }
  }, [result])
  

  const animated = useRef(new Animated.Value(0)).current;

  let Opacity = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 0.5],
  });

  let Scale = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  function collapse(a) {
    if (a == undefined) {
    } else if (nameArray.includes(a)) {
      setNameArray(nameArray.filter(a1 => a1 !== a));
    } else {
      setNameArray([...nameArray, a]);
    }
    setName(null);
  }

  function collapseArticle(a) {
    if (a == undefined) {
    } else if (articleArray.includes(a)) {
      setArticleArray(articleArray.filter(a1 => a1 !== a));
    } else {
      setArticleArray([...articleArray, a]);
    }
    setArticle(null);
  }

  // function highlight(para, word) {
  //   if (typeof para == 'string') {
  //     let inputRexgex = para.match(new RegExp(word, 'igm'));
  //     return (
  //       <Text>
  //         {para.split(new RegExp(word, 'igm')).reduce((prev, current, i) => {
  //           if (!i) {
  //             return [current];
  //           }
  //           // bị lỗi khi viết hoa và thường khi input
  //           return prev.concat(
  //             <Text style={styles.highlight}>{inputRexgex[i - 1]}</Text>,
  //             current,
  //           );
  //         }, [])}
  //       </Text>
  //     );
  //   }
  // }



  function LawFilterContent(array, obj) {
    
    let contentFilted = {}
    
    
    Object.keys(obj).filter(key=>{

    if(array.includes(key)){
      contentFilted[key] = obj[key]

    }
      
    } )

    setLawFilted(contentFilted)

  }


  useEffect(() => {
    collapse(name);
  }, [name]);

  useEffect(() => {
    collapseArticle(article);
  }, [article]);

  useEffect(() => {
    setWanring(false);
  }, [input]);

  useEffect(() => {
    setInputFilter('');

    if (
      choosenLaw.length ==
      Object.keys(SearchResult || {}).length
    ) {
      setCheckedAllFilter(true);
    } else {
      setCheckedAllFilter(false);
    }
  }, [showFilter]);

  const NoneOfResutl = () => {
    return (
      <View
        style={{height: 250, alignItems: 'center', justifyContent: 'flex-end'}}>
        <Text style={{fontSize: 40, textAlign: 'center', color: 'black'}}>
          {' '}
          Không có kết quả nào{' '}
        </Text>
      </View>
    );
  };


  return (
    <>
          { (loading1 || !internetConnected) && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: 0.7,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <Text
            style={{
              color:'white',
              marginBottom:15,
              fontWeight:'bold'
            }}
            >
            {internetConnected ?<View >
            <Text style={{color:'white',fontWeight:'bold',textAlign:'center'}}>
            Xin vui lòng đợi trong giây lát ...</Text></View> 
              
              
              :"Vui lòng kiểm tra kết nối mạng ..."}
            </Text>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}

      <ScrollView
            ref={ScrollViewToScroll}
        keyboardShouldPersistTaps="handled"
        style={{backgroundColor: '#EEEFE4'}}>
        <View style={{backgroundColor: 'green'}}>
          <Text style={styles.titleText}>{`Tìm kiếm nội dung`}</Text>

          <View style={styles.inputContainer}>
            <View style={{...styles.containerBtb,paddingTop:5}}>
              <TouchableOpacity
                style={{
                  ...styles.inputBtb,
                  backgroundColor: 'white',
                }}
                onPress={() => {
                  setShowFilter(true);
                  Keyboard.dismiss();
                  Animated.timing(animated, {
                    toValue: !showFilter ? 100 : 0,
                    // toValue:100,
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                }}>
                <Ionicons
                  name="funnel-outline"
                  style={{...styles.inputBtbText, color: 'black'}}></Ionicons>
                <View
                  style={{
                    position: 'absolute',
                    height: 25,
                    width: 25,
                    backgroundColor: 'red',
                    borderRadius: 20,
                    right: -10,
                    bottom: -10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 10,
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {choosenLaw.length}

                  </Text>
                  
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'column',
                width: '60%',
                // backgroundColor:'red'
              }}>
              <View
                style={{
                  position: 'relative',
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  // height: 50,
                  borderRadius: 15,
                }}>
                <TextInput
                  ref={textInput}
                  style={styles.inputArea}
                  onChangeText={text => {
                    setInput(text);
                    // ;dispatch(type1(text))
                  }}
                  value={input}
                  selectTextOnFocus={true}
                  placeholder="Nhập từ khóa..."
                  onSubmitEditing={()=>{
                                    Keyboard.dismiss();
                    if(input.match(/^(\s)*$/)){
                      setWanring(true)
                    }else{
                      dispatch({type:'searchContent',input:input})
  
                    }
}
                }></TextInput>
                <TouchableOpacity
                  onPress={() => {setInput('');textInput.current.focus()}}
                  style={{
                    width: '15%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    left: -3,
                    // backgroundColor:'yellow'
                  }}>
                  {input && (
                    <Ionicons
                      name="close-circle-outline"
                      style={{
                        color: 'black',
                        fontSize: 20,
                        paddingRight: 8,
                        // textAlign: 'center',
                        // width: 20,
                        // height: 20,

                        // textAlign:'right'
                      }}></Ionicons>
                  )}
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: 'orange',
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                {warning ? 'Vui lòng nhập từ khóa hợp lệ' : ' '}
              </Text>
            </View>
            <View style={styles.containerBtb}>
              <TouchableOpacity
                style={{
                  ...styles.inputBtb,
                  borderRadius: 100,
                  height: 40,
                  borderWidth:2,
                  borderColor:'#f67c1a'
    }}
                onPress={() => {
                  // let inputSearchLawReg = input;
                  // if (input) {

                  //   inputSearchLawReg = input.replace(/\(/gim, '\\(');


                  //   inputSearchLawReg = inputSearchLawReg.replace(
                  //       /\)/gim,
                  //       '\\)',
                  //     );


                  //     inputSearchLawReg = inputSearchLawReg.replace(
                  //       /\./gim,
                  //       '\\.',
                  //     );


                  //     inputSearchLawReg = inputSearchLawReg.replace(
                  //       /\+/gim,
                  //       '\\+',
                  //     );


                  //     inputSearchLawReg = inputSearchLawReg.replace(
                  //       /\?/gim,
                  //       '\\?',
                  //     );

                  //     // if (input.match(/\//gim)) {
                  //   //   inputSearchLawReg = inputSearchLawReg.replace(/\//gim, '.');
                  //   // }

                  //   inputSearchLawReg = inputSearchLawReg.replace(
                  //       /\\/gim,
                  //       '.',
                  //     );

                  //   }
                  //   setValueInputForNav(input);
                    
                    Keyboard.dismiss();
                    if(input.match(/^(\s)*$/)){
                      setWanring(true)
                    }else{
                      dispatch({type:'searchContent',input:input})
  
                    }
  
                }}>
                <Ionicons
                  name="search-outline"
                  style={styles.inputBtbText}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{marginTop: 1}}>
          {Array.isArray(SearchResult) ? null : !Object.keys(SearchResult)
              .length ? (
            <NoneOfResutl />
          ) : (
            Object.keys(LawFilted || SearchResult).map((key, i) => {
              // console.log('key',key);
              
              let nameLaw = 'unknown name'
              let descriptionLaw = 'unknown name'
              if(result){
                nameLaw =
                SearchResult[key]['lawNameDisplay'];

                descriptionLaw= SearchResult[key]['lawDescription'];

              }
              if (nameLaw) {
                if (nameLaw.match(/(?<=\w)\\(?=\w)/gim)) {
                  nameLaw = key.replace(/(?<=\w)\\(?=\w)/gim, '/');
                }
              }

              return (
                  <TouchableOpacity
                    key={i}
                    style={{
                      paddingBottom:10,
                      paddingTop:10,
                      justifyContent:'center',
                      backgroundColor: '#F9CC76',
                      marginBottom:1
                                  }}
                    onPress={() => {
                      navigation.push(`accessLaw`, {screen: key,input: input})
                      setName(i);
                    }}>
                      <View
                                          style={styles.item}
>

                    <Text style={styles.chapterText} key={`${i}a`}>
                      {nameLaw}
                    </Text>
                    {!nameLaw.match(/^(luật|bộ luật|Hiến)/gim) && (
                      <Text style={styles.descriptionText}>
                        {descriptionLaw}
                      </Text>
                    )}
                    {/* <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(`${key}`, {input: valueInputForNav,findShow:true})
                      }
                      style={styles.chapterArrow}>
                      <Ionicons
                        name="return-down-forward-outline"
                        style={{
                          fontWeight: 'bold',
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 17,
                        }}></Ionicons>
                    </TouchableOpacity> */}
                        </View>
                  </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {showFilter && (
        <>
          <Animated.View
            style={{
              backgroundColor: 'rgb(245,245,247)',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              position: 'absolute',
              opacity: Opacity,
            }}>
            <TouchableOpacity //overlay
              style={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                position: 'absolute',
              }}
              onPress={() => {
                let timeOut = setTimeout(() => {
                  setShowFilter(false);
                  return () => {};
                }, 500);

                Animated.timing(animated, {
                  toValue: !showFilter ? 100 : 0,
                  // toValue:100,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
              }}></TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              top: 80,
              bottom: 60,
              minHeight: 500,
              right: 50,
              left: 50,
              backgroundColor: 'white',
              display: 'flex',
              borderRadius: 20,
              transform: [{scale: Scale}],
              overflow: 'hidden',
              // borderWidth:1,
              // borderColor:'brown',
              shadowColor: 'black',
              shadowOpacity: 1,
              shadowOffset: {
                width: 10,
                height: 10,
              },
              shadowRadius: 4,
              elevation: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'black',
                height: 50,
              }}>
              <TextInput
                onChangeText={text => setInputFilter(text)}
                value={inputFilter}
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  color: 'white',
                  width: '85%',
                  alignItems: 'center',
                }}
                placeholder=" Input to Search ..."
                placeholderTextColor={'gray'}></TextInput>
              <TouchableOpacity
                onPress={() => setInputFilter('')}
                style={{
                  width: '15%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {inputFilter && (
                  <Text
                    style={{
                      height: 20,
                      width: 20,
                      color: 'white',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      backgroundColor: 'gray',
                      borderRadius: 25,
                    }}>
                    X
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: 10,
                width: '100%',
                paddingLeft: '5%',
                paddingTop: 10,
                alignItems: 'center',
                backgroundColor: 'rgb(240,240,240)',
                shadowColor: 'black',
                shadowOpacity: 0.5,
                shadowOffset: {
                  width: 5,
                  height: 5,
                },
                shadowRadius: 4,
                elevation: 10,
              }}
              onPress={() => {
                if (
                  choosenLaw.length ==
                  Object.keys(SearchResult).length
                ) {
                  setCheckedAllFilter(false);
                  setChoosenLaw([]);
                } else {
                  setChoosenLaw(
                    Object.keys(SearchResult),
                  );
                  setCheckedAllFilter(true);
                }
              }}>
              <CheckBox
                onClick={() => {
                  if (
                    choosenLaw.length ==
                    Object.keys(SearchResult)
                      .length
                  ) {
                    setCheckedAllFilter(false);
                    setChoosenLaw([]);
                  } else {
                    setChoosenLaw(
                      Object.keys(SearchResult),
                    );
                    setCheckedAllFilter(true);
                  }
                }}
                isChecked={checkedAllFilter}
              />

              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  marginLeft: 5,
                  // backgroundColor:'green'
                }}>
                Tất cả
              </Text>
            </TouchableOpacity>

            <ScrollView 
            keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  paddingTop: 10,
                  paddingLeft: '10%',
                  paddingRight: '5%',
                  display: 'flex',
                  // flexDirection:'row'
                }}>
                {SearchResult &&
                  Object.keys(SearchResult).map(
                    (key, i) => {
                      let nameLaw =
                      SearchResult[key]['lawNameDisplay']
                      let lawDescription =
                      SearchResult[key]['lawDescription']

                      let inputSearchLawReg = inputFilter;
                      if (
                        inputFilter.match(
                          /(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/|\s?)/gim,
                        )
                      ) {

                        inputSearchLawReg = inputFilter.replace(
                            /\(/gim,
                            '\\(',
                          );

                          

                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\)/gim,
                            '\\)',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\\/gim,
                            '.',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\./gim,
                            '\\.',
                          );


                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\+/gim,
                            '\\+',
                          );

                          

                          inputSearchLawReg = inputSearchLawReg.replace(
                            /\?/gim,
                            '\\?',
                          );

                        }
                      if (
                        nameLaw.match(new RegExp(inputSearchLawReg, 'igm')) ||
                        lawDescription.match(
                          new RegExp(inputSearchLawReg, 'igm'),
                        )
                      ) {
                        return (
                          <TouchableOpacity
                          key={`${i}b`}
                          style={{
                              display: 'flex',
                              flexDirection: 'row',
                              paddingBottom: 10,
                              width: '90%',
                              alignItems: 'center',
                            }}
                            onPress={() => {
                              if (key == undefined) {
                              } else if (choosenLaw.includes(key)) {
                                setChoosenLaw(
                                  choosenLaw.filter(a1 => a1 !== key),
                                  setCheckedAllFilter(false),
                                );
                              } else {
                                setChoosenLaw([...choosenLaw, key]);
                                if (
                                  choosenLaw.length ==
                                  Object.keys(
                                    SearchResult
                                  ).length -
                                    1
                                ) {
                                  setCheckedAllFilter(true);
                                }
                              }
                            }}
                            >
                            <CheckBox
                              onClick={() => {
                                if (key == undefined) {
                                } else if (choosenLaw.includes(key)) {
                                  setChoosenLaw(
                                    choosenLaw.filter(a1 => a1 !== key),
                                  );
                                  setCheckedAllFilter(false);
                                } else {
                                  setChoosenLaw([...choosenLaw, key]);
                                  if (
                                    choosenLaw.length ==
                                    Object.keys(
                                      SearchResult,
                                    ).length -
                                      1
                                  ) {
                                    setCheckedAllFilter(true);
                                  }
                                }
                              }}
                              isChecked={choosenLaw.includes(key)}
                              style={{}}
                            />

                            <Text style={{marginLeft: 5, color: 'black'}}>
                              {nameLaw}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    },
                  )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
              }}
              onPress={() => {
                LawFilterContent(choosenLaw,SearchResult)
                let timeOut = setTimeout(() => {
                  setShowFilter(false);
                  return () => {};
                }, 500);

                Animated.timing(animated, {
                  toValue: !showFilter ? 100 : 0,
                  // toValue:100,
                  duration: 300,
                  useNativeDriver: false,
                }).start();
              }}>
              <Text
                style={{
                  paddingBottom: 10,
                  paddingTop: 10,
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                OK
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  inputArea: {
    width: '85%',
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: 12,
    borderRadius: 15,
  },
  containerBtb: {
    width: '15%',
    alignItems: 'center',
  },
  inputBtb: {
    width: '80%',
    height: 30,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // right: 5,
  },
  inputBtbText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  // content: {
  //   height: 0,
  //   display: 'flex',
  //   position: 'relative',
  //   margin: 0,
  //   overflow: 'hidden',
  // },
  item: {
    minHeight: 80,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  chapterText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText:{
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  // chapterArrow: {
  //   backgroundColor: 'black',
  //   borderRadius: 25,
  //   // alignItems:'flex-end',
  //   display: 'flex',
  //   right: 10,
  //   position: 'absolute',
  //   width: 30,
  //   height: 30,
  //   textAlign: 'center',
  //   justifyContent: 'center',
    
  // },
  // articleContainer: {
  //   fontWeight: 'bold',
  //   paddingBottom: 6,
  //   paddingTop: 6,
  //   color: 'white',
  //   backgroundColor: '#66CCFF',
  //   justifyContent: 'center',
  //   // alignItems:'center',
  //   display: 'flex',
  //   textAlign: 'center',
  //   borderBottomColor: 'white',
  //   borderBottomWidth: 1,
  // },
  // article: {
  //   color: 'white',
  //   overflow: 'hidden',
  //   paddingRight: 10,
  //   paddingLeft: 10,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  // },
  // blackBackground: {
  //   backgroundColor: 'white',
  //   color: 'black',
  //   flexWrap: 'wrap',
  //   // width:200,
  //   overflow: 'hidden',
  //   flex: 1,
  //   display: 'flex',
  //   paddingRight: 10,
  //   paddingLeft: 10,
  //   textAlign: 'justify',
  //   paddingTop: 5,
  //   paddingBottom: 10,
  // },
  // highlight: {
  //   color: 'red',
  //   backgroundColor: 'yellow',
  //   textAlign: 'center',
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
