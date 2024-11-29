import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Animated,
} from 'react-native';
// import {handle2, searchLaw} from '../redux/fetchData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation,useScrollToTop} from '@react-navigation/native';
import React, {useEffect, useState, useRef, useContext} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import CheckBox from 'react-native-check-box';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export function Detail2({}) {
  const {loading2, info} = useSelector(state => state['searchLaw']);
// console.log('info',info);

  const {loading3, info3} = useSelector(state => state['stackscreen']);
  // console.log('info3',info3);
  const [input, setInput] = useState(undefined);
  const [valueInput, setValueInput] = useState('');

  const [warning, setWanring] = useState(false);
  // const inf = useContext(InfoDownloaded);

  const [SearchResult, setSearchResult] = useState(info3?convertResult(info3.slice(0,10)):[]); // đây Object là các luật, điểm, khoản có kết quả tìm kiếm
// console.log('info3',info3);

  const [inputFilter, setInputFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [checkedAllFilter, setCheckedAllFilter] = useState(true);
  const [choosenLaw, setChoosenLaw] = useState([]);
  const [LawFilted, setLawFilted] = useState(false);
  // console.log('LawFilted',LawFilted);

  const [choosenKindLaw, setChoosenKindLaw] = useState([0, 1, 2]);

  const navigation = useNavigation();

  const insets = useSafeAreaInsets(); // lất chiều cao để manu top iphone

  const textInput = useRef(null)


  const ScrollViewToScroll = useRef(null);
  useScrollToTop(ScrollViewToScroll)

  const dispatch = useDispatch();

  const animated = useRef(new Animated.Value(0)).current;

  let Opacity = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 0.5],
  });

  let Scale = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  function LawFilterContent(array, obj) {
    let contentFilted = {};
    Object.keys(obj).filter(key => {
      if (array.includes(key)) {
        contentFilted[key] = obj[key];
      }
    });
    setLawFilted(contentFilted);
  }

  useEffect(() => {
    if(info3){
      setSearchResult(convertResult(info3.slice(0,10)));
      setLawFilted(convertResult(info3.slice(0,10)));
      // console.log('convertResult(info3.slice(0,10))',(info3.slice(0,10)));
      // console.log('SearchResult',SearchResult);
      
    }
  }, [info3])


  function highlight(para, word, i2) {
    // console.log('para',para);
    if (para) {
      // đôi khi Điều ... không có khoản (nội dung chính trong điều) thì điều này giúp không load ['']
      if (word.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
        let inputRexgex = para.match(new RegExp(String(word), 'igmu'));
        // let inputRexgex = para[0].match(new RegExp('hội', 'igmu'));
        if (inputRexgex) {
          let searchedPara = para
            .split(new RegExp(String(word), 'igmu'))
            // .split(new RegExp('hội', 'igmu'))
            .reduce((prev, current, i) => {
              if (!i) {
                return [<Text style={ i2.match(/aa/)?{...styles.chapterText}:{}
                } key={`${i}xa`}
>{current}</Text>];
              }


              return prev.concat(
                <React.Fragment
                key={`${i}htth`}
                >
                  <Text
                    style={
                      // searchResultCount - inputRexgex.length + i - 1 <
                      //   currentSearchPoint &&
                      // searchResultCount - inputRexgex.length + i >=
                      //   currentSearchPoint
                      //   ? styles.highlight1
                      //   : styles.highlight
                      
                        
                      i2.match(/aa/)?{...styles.chapterText,backgroundColor:'yellow'}:{backgroundColor:'yellow'}
                      
                    }
                    key={`${i}gmi`}
                    >
                    {inputRexgex[i - 1]}
                  </Text>
              </React.Fragment> ,
                <Text
                key={`${i}vvv`}
                  style={
                    
                    i2.match(/aa/)?{...styles.chapterText}:{}
                      
                  //   {
                  //   position: 'relative',
                  //   display: 'flex',
                  //   margin: 0,
                  //   lineHeight: 23,
                    
                  // }
                  }>
                  {current}
                </Text>,
              );
            }, []);
          return <View ><Text >{searchedPara}</Text></View>;
          // return <View >{searchedPara}</View>;
          // return <Text >{searchedPara}</Text>;
        } else {
          
          return para
        }
      } else {
        return para;
      }

      // }
    }
  }

  
  function convertResult(info){
    let lawObject = {};
    info.map((law, i) => {
      // lawObject[i] = {[law._id]:{'lawNameDisplay':law.info['lawNameDisplay'],'lawDescription':law.info['lawDescription'],'lawDaySign':law.info['lawDaySign']}}
      lawObject[law._id] = {
        lawNameDisplay: law.info['lawNameDisplay'],
        lawDescription: law.info['lawDescription'],
        lawDaySign: law.info['lawDaySign'],
      };
    });
return lawObject
  }
  
  useEffect(() => {
    if (info) {

      setSearchResult(convertResult(info));
      setLawFilted(convertResult(info));
    }
  }, [info]);

  useEffect(() => {
    setInputFilter('');

    if (choosenLaw.length == Object.keys(SearchResult || {}).length) {
      setCheckedAllFilter(true);
    } else {
      setCheckedAllFilter(false);
    }
  }, [showFilter]);

  useEffect(() => {
    setChoosenLaw(
      Object.keys(SearchResult).length ? Object.keys(SearchResult) : [],
    );
  }, [SearchResult]);

  useEffect(() => {
    setWanring(false);
  }, [input]);

  function OrderDaySign() {
    let data = LawFilted;
    let ArrayResult = [];

    if (Object.keys(LawFilted).length) {
      Object.keys(data).map((law, i) => {
        ArrayResult[i] = {
          [Object.keys(data)[Object.keys(data).length - i - 1]]:
            data[Object.keys(data)[Object.keys(data).length - i - 1]],
        };
      });
      let newArraySearch = [];
      ArrayResult.map((key, i) => {
        newArraySearch[i] = JSON.stringify(key);
      });
      newArraySearch = newArraySearch.join(',');
      newArraySearch = newArraySearch.replace(/\}\}\,\{/gim, '},');
      newArraySearch = newArraySearch.replace(/^\[\{/, '');
      newArraySearch = newArraySearch.replace(/\}\}\]$/, '}');
      // newArraySearch = newArraySearch.replace(/\\/g,'')
      let newObjectSearch = JSON.parse(newArraySearch);
      setLawFilted(newObjectSearch);
    }
  }

  useEffect(() => {
    chooseDisplayKindLaw();
  }, [choosenKindLaw]);

  function chooseDisplayKindLaw() {
    // 1 là luật, 2 là nd, 3 là TT

    let newResult = {};

    if (choosenKindLaw.length) {
      Object.keys(SearchResult).map((law, i) => {
        let kindSample =
          (choosenKindLaw.includes(0) ? 'Luật|Bộ luật' : '') +
          (choosenKindLaw.includes(1) ? '|Nghị định' : '') +
          (choosenKindLaw.includes(2) ? '|Thông tư' : '');
        kindSample = kindSample.replace(/^\|/, '');
        // console.log('kindSample',kindSample);

        if (
          SearchResult[law]['lawNameDisplay'].match(
            new RegExp(`^(${kindSample})`, 'img'),
          )
        ) {
          newResult[law] = SearchResult[law];
        }
      });
      setLawFilted(newResult);
      setChoosenLaw(Object.keys(newResult));
    } else {
      setLawFilted({});
      setChoosenLaw([]);
    }
    //     if(choosenKindLaw.includes(0)){
    //   console.log(1);
    //   Object.keys(SearchResult).map( (law,i)=>{
    //     if(SearchResult[law]['lawNameDisplay'].match(/^(Luật|Bộ Luật)/img)){
    //       newResult[law] = SearchResult[law]
    //       console.log('1a');

    //     }
    //   })
    // }
    // if(choosenKindLaw.includes(1)){
    //   Object.keys(SearchResult).map( (law,i)=>{
    //     if(SearchResult[law]['lawNameDisplay'].match(/^Nghị định/img)){
    //       newResult[law] = SearchResult[law]
    //     }
    //   })
    // }
    // if(choosenKindLaw.includes(2)){
    //   Object.keys(SearchResult).map( (law,i)=>{
    //     if(SearchResult[law]['lawNameDisplay'].match(/^Thông tư/img)){
    //       newResult[law] = SearchResult[law]
    //     }
    //   })
    // }
    // console.log('newResult',newResult)
  }

  const netInfo = useNetInfo();
  let internetConnected = netInfo.isConnected;

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

      {(loading2 || loading3|| !internetConnected) && (
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
              color: 'white',
              marginBottom: 15,
              fontWeight: 'bold',
            }}>
            {internetConnected
              ? 'Xin vui lòng đợi trong giây lát ...'
              : 'Vui lòng kiểm tra kết nối mạng ...'}
          </Text>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}

      <ScrollView

      ref={ScrollViewToScroll}
        keyboardShouldPersistTaps='handled'
        style={{backgroundColor: '#EEEFE4',}}>
        <View style={{backgroundColor: 'green',paddingTop: insets.top}}>
          <Text style={styles.titleText}>{`Tìm kiếm văn bản`}</Text>

          <View style={styles.inputContainer}>
            <View style={{...styles.containerBtb, paddingTop: 5}}>
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
                  style={{...styles.inputArea}}
                  onChangeText={text => {
                    setInput(text);
                  }}
                  value={input}
                  selectTextOnFocus={true}
                  placeholder="Nhập từ khóa..."
                  onSubmitEditing={() =>{
                    Keyboard.dismiss();

                    if(input.match(/^(\s)*$/)){
                      setWanring(true)
                    }else{
                      dispatch({type: 'searchLaw', input: input});
                      setValueInput(input)
                    }
                    setChoosenKindLaw([0, 1, 2]);
                  }
                    }></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setInput('');
                    textInput.current.focus();
                  }}
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
            <View style={{...styles.containerBtb,paddingTop:-5}}>
              <TouchableOpacity
                style={{
                  ...styles.inputBtb,
                  borderRadius: 100,
                  height: 40,
                  borderWidth:2,
                  borderColor:'#f67c1a',
                  minWidth:40
                }}
                onPress={async () => {
                  Keyboard.dismiss();

                  if(input.match(/^(\s)*$/)){
                    setWanring(true)
                  }else{
                    dispatch({type: 'searchLaw', input: input});
                    setValueInput(input)

                  }
                  setChoosenKindLaw([0, 1, 2]);
                }}>
                <Ionicons
                  name="search-outline"
                  style={styles.inputBtbText}></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              paddingBottom: 13,
            }}>
            {['Luật/Bộ Luật', 'Nghị định', 'Thông tư'].map((option, i) => {
              return (
                <TouchableOpacity
                key={`${i}a`}
                  onPress={() => {
                    if (choosenKindLaw.includes(i)) {
                      setChoosenKindLaw(choosenKindLaw.filter(a => a !== i));
                    } else {
                      setChoosenKindLaw([...choosenKindLaw, i]);
                    }
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    // width:75
                  }}>
                  <CheckBox
                    onClick={() => {
                      if (choosenKindLaw.includes(i)) {
                        setChoosenKindLaw(choosenKindLaw.filter(a => a !== i));
                      } else {
                        setChoosenKindLaw([...choosenKindLaw, i]);
                      }

                      // chooseDisplayKindLaw()
                    }}
                    isChecked={choosenKindLaw.includes(i)}
                    style={{}}
                    uncheckedCheckBoxColor={'white'}
                    checkedCheckBoxColor={'white'}
                  />
                  <Text style={{fontSize: 13, color: 'white'}}>{option}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 100,
                height: 25,
                backgroundColor: 'white',
                width: 50,
                padding: 0,
              }}
              onPress={async () => {
                Keyboard.dismiss();
                OrderDaySign();
              }}>
              <Ionicons
                name="swap-vertical-outline"
                style={{
                  ...styles.inputBtbText,
                  fontSize: 19,
                  color: 'black',
                }}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginTop: 1,flex:1}}>
          { ( !info3.length && info == null )? (
            <></>
          ) : Object.keys(SearchResult).length || info3.length || info.length? (
            Object.keys(LawFilted || SearchResult).map((detailId, i) => {
              return (
                <TouchableOpacity
                key={i}
                  style={{
                    paddingBottom: 10,
                    paddingTop: 10,
                    justifyContent: 'center',
                    backgroundColor: i%2 ? 'white':'#DDDDDD', // #F9CC76
                    // marginBottom: 6,
                  }}
                  onPress={() => {
                    // navigation.navigate(`${detailInfo._id}`)
                    navigation.push(`accessLaw`, {screen: detailId});
                  }}>
                  <View style={styles.item}>
                    <Text style={styles.chapterText} key={`${i}a`}>
                      {/* {SearchResult[detailId]['lawNameDisplay']} */}
                      {highlight(SearchResult[detailId]['lawNameDisplay'],valueInput,`${i}aa`)}
                    </Text>
                    {/* {!SearchResult[detailId]['lawNameDisplay'].match(
                      /^(luật|bộ luật|Hiến)/gim,
                    ) && (
                      <Text style={styles.descriptionText}>
                        {SearchResult[detailId] &&
                          SearchResult[detailId]['lawDescription']}
                      </Text>
                    )} */}
                    <Text style={styles.descriptionText}>
                      
                    {highlight(SearchResult[detailId]['lawDescription'],valueInput,`${i}ab`)}
                      </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <NoneOfResutl />
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
                if (choosenLaw.length == Object.keys(SearchResult).length) {
                  setCheckedAllFilter(false);
                  setChoosenLaw([]);
                } else {
                  setChoosenLaw(Object.keys(SearchResult));
                  setCheckedAllFilter(true);
                }
                // console.log(choosenLaw);
              }}>
              <CheckBox
                onClick={() => {
                  if (choosenLaw.length == Object.keys(SearchResult).length) {
                    setCheckedAllFilter(false);
                    setChoosenLaw([]);
                  } else {
                    setChoosenLaw(Object.keys(SearchResult));
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
                  Object.keys(SearchResult).map((key, i) => {
                    let nameLaw = SearchResult[key]['lawNameDisplay'];
                    let lawDescription = SearchResult[key]['lawDescription'];

                    let inputSearchLawReg = inputFilter;
                    if (
                      inputFilter.match(
                        /(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/|\s?)/gim,
                      )
                    ) {
                      inputSearchLawReg = inputFilter.replace(/\(/gim, '\\(');

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
                      lawDescription.match(new RegExp(inputSearchLawReg, 'igm'))
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
                                Object.keys(SearchResult).length - 1
                              ) {
                                setCheckedAllFilter(true);
                              }
                            }
                          }}>
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
                                  Object.keys(SearchResult).length - 1
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
                  })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
              }}
              onPress={() => {
                LawFilterContent(choosenLaw, SearchResult);
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
    fontSize: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
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
    paddingTop:10,
    paddingBottom:10
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
  content: {
    height: 0,
    display: 'flex',
    position: 'relative',
    // paddingRight: 10,
    // paddingLeft: 10,
    margin: 0,
    overflow: 'hidden',
  },
  // chapter: {
  //   minHeight: 50,
  //   justifyContent: 'space-around',
  //   backgroundColor: '#F9CC76',
  //   color: 'black',
  //   alignItems: 'center',
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  item: {
    minHeight: 80,
    // height: 120,
    // backgroundColor: 'green',
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
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom:5
  },
  descriptionText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    // backgroundColor:'blue'
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
