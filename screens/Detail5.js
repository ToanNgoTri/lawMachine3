import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Dirs, FileSystem} from 'react-native-file-access';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import dataOrg from '../data/data.json';
// import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ModalStatus} from '../App';
import {useSelector, useDispatch} from 'react-redux';
import {InfoDownloaded} from '../App';
import {loader, noLoading} from '../redux/fetchData';
import { SafeAreaView } from 'react-native-safe-area-context';

let TopUnitCount; // là đơn vị lớn nhất vd là 'phần thứ' hoặc chương
let articleCount = 0;
let sumChapterArray = []; // array mà mỗi phần tử là 'phần thứ...' có tổng bn chương
sumChapterArray[0] = 0;
let sumChapterPrevious; // sum cộng dồn các phần trư của các chương trong luật có phần thứ

let eachSectionWithChapter = [];
//lineHeight trong lines phải luôn nhỏ hơn trong highlight và View Hightlight

export default function Detail() {
  // const inf = useContext(InfoDownloaded);

  // const [tittle, setTittle] = useState();     // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có
  const [tittleArray, setTittleArray] = useState([true]); // đây là 'phần thứ...' hoặc chương (nói chung là section cao nhất)

  const [tittleArray2, setTittleArray2] = useState([true]); // nếu có 'phần thứ...' thì đây sẽ là chương

  const [positionYArr, setPositionYArr] = useState([]); // tập hợp pos Y Search
  const [positionYArrArtical, setPositionYArrArtical] = useState([]);
  const [showArticle, setShowArticle] = useState(false);

  const [currentY, setCurrentY] = useState(0); // để lấy vị trí mình đang scroll tới

  const [inputSearchArtical, setInputSearchArtical] = useState(''); // input phần tìm kiếm 'Điều'

  const [currentSearchPoint, setCurrentSearchPoint] = useState(1); // thứ tự kết quả search đang trỏ tới

  const [exists, setExists] = useState(false);

  const dispatch = useDispatch();

  const route = useRoute();

  const navigation = useNavigation();

  async function StoreInternal() {
    async function k() {
      if (await FileSystem.exists(Dirs.CacheDir + '/Info.txt', 'utf8')) {
        const FileInfoString = await FileSystem.readFile(
          Dirs.CacheDir + '/Info.txt',
          'utf8',
        );
        return JSON.parse(FileInfoString);
      }
    }

    let m = await k();
    if (m) {
      const FileInfoStringContent = await FileSystem.readFile(
        Dirs.CacheDir + '/Content.txt',
        'utf8',
      );
      let contentObject = JSON.parse(FileInfoStringContent);
      contentObject[route.params.screen] = Content;

      const addContent = await FileSystem.writeFile(
        Dirs.CacheDir + '/Content.txt',
        JSON.stringify(contentObject),
        'utf8',
      );

      const FileInfoStringInfo = await FileSystem.readFile(
        Dirs.CacheDir + '/Info.txt',
        'utf8',
      );
      let infoObject = JSON.parse(FileInfoStringInfo);
      infoObject[route.params.screen] = Info;

      const addInfo = await FileSystem.writeFile(
        Dirs.CacheDir + '/Info.txt',
        JSON.stringify(infoObject),
        'utf8',
      );
    } else {
      const addContent = await FileSystem.writeFile(
        Dirs.CacheDir + '/Content.txt',
        JSON.stringify({[route.params.screen]: Content}),
        'utf8',
      );

      const addInfo = await FileSystem.writeFile(
        Dirs.CacheDir + '/Info.txt',
        JSON.stringify({[route.params.screen]: Info}),
        'utf8',
      );
    }

    const FileInfoStringContent1 = await FileSystem.readFile(
      Dirs.CacheDir + '/Content.txt',
      'utf8',
    );
    let contentObject = JSON.parse(FileInfoStringContent1);

    const FileInfoStringInfo1 = await FileSystem.readFile(
      Dirs.CacheDir + '/Info.txt',
      'utf8',
    );
    let infoObject = JSON.parse(FileInfoStringInfo1);
  }

  async function DeleteInternal() {
    const FileInfoStringContent = await FileSystem.readFile(
      Dirs.CacheDir + '/Content.txt',
      'utf8',
    );
    let contentObject = JSON.parse(FileInfoStringContent);
    delete contentObject[route.params.screen];

    const addContent = await FileSystem.writeFile(
      Dirs.CacheDir + '/Content.txt',
      JSON.stringify(contentObject),
      'utf8',
    );

    const FileInfoStringInfo = await FileSystem.readFile(
      Dirs.CacheDir + '/Info.txt',
      'utf8',
    );
    let infoObject = JSON.parse(FileInfoStringInfo);
    delete infoObject[route.params.screen];

    const addInfo = await FileSystem.writeFile(
      Dirs.CacheDir + '/Info.txt',
      JSON.stringify(infoObject),
      'utf8',
    );
  }

  const animatedForNavi = useRef(new Animated.Value(0)).current;

  const list = useRef(null);
  const textInputFind = useRef(null);
  const textInputArticle = useRef(null);
  const PositionYArrArticalForDev = useRef(null);
  PositionYArrArticalForDev.current = [];
  // const [input, setInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [find, setFind] = useState();

  const [input, setInput] = useState(route.params ? route.params.input : '');
  // const [find, setFind] = useState(route.params ? route.params.input? true : false: true);
  // const [go, setGo] = useState(route.params ? true : false);

  const [go, setGo] = useState(false);

  const [Content, setContent] = useState([]);
  const [Info, setInfo] = useState({});

  const {width, height} = Dimensions.get('window');
  let heightDevice = height;
  // let widthDevice = width;

  const [widthDevice, setWidthDevice] = useState(width);
  Dimensions.addEventListener('change', ({window: {width, height}}) => {
    heightDevice = height;
    setWidthDevice(width);
  });


  function pushToSearch() {
    
    if(!go){
  setPositionYArr([]);
  setGo(true);
  if (input) {
    if (input.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
      let inputSearchLawReg = input;

      inputSearchLawReg = input.replace(/\(/gim, '\\(');

      inputSearchLawReg = inputSearchLawReg.replace(/\)/gim, '\\)');

      inputSearchLawReg = inputSearchLawReg.replace(/\./gim, '\\.');

      inputSearchLawReg = inputSearchLawReg.replace(/\+/gim, '\\+');

      // if(input.match(/\//img)){
      //   inputSearchLawReg = inputSearchLawReg.replace(/\//img,'\\/')
      // }

      inputSearchLawReg = inputSearchLawReg.replace(/\\/gim, '.');

      setValueInput(inputSearchLawReg);
    } else {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa hợp lệ');
    }
    // setSearchCount(searchResultCount);

    setCurrentSearchPoint(1);
    Keyboard.dismiss();
  } else {
    Alert.alert('Thông báo', 'Vui lòng nhập từ khóa hợp lệ');
  }

}else if(go && positionYArr.length){
  list.current.scrollTo({
    y: positionYArr[0] , //- 57
  });
  setCurrentSearchPoint(1)
}
  }
  const ModalVisibleStatus = useContext(ModalStatus);

  const {loading} = useSelector(state => state['read']);
  const {info3} = useSelector(state => state['stackscreen']);


  async function callOneLaw() {
    // dùng để khi qua screen related Law khác khi quay về vẫn còn
    let info = await fetch(
      `https://us-central1-project2-197c0.cloudfunctions.net/callOneLaw`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({screen:route.params.screen})
      },
    );

    let respond = await info.json();
    return respond;
  }

  useEffect(() => {
    callOneLaw().then(res => {
      setContent(res.content);
      setInfo(res.info);
    });
    
  }, [loading]);

  useEffect(() => {
    if (!exists) {
      // dispatch(noLoading())
    }
  }, [exists]);

  async function getContentExist() {
    if (await FileSystem.exists(Dirs.CacheDir + '/Content.txt', 'utf8')) {
      const FileInfoStringContent = await FileSystem.readFile(
        Dirs.CacheDir + '/Content.txt',
        'utf8',
      );
      const FileInfoStringInfo = await FileSystem.readFile(
        Dirs.CacheDir + '/Info.txt',
        'utf8',
      );
      if (FileInfoStringContent) {
        return {
          _id: route.params.screen,
          content: JSON.parse(FileInfoStringContent),
          info: JSON.parse(FileInfoStringInfo),
        };
        // f = JSON.parse(FileInfoStringInfo)
      }
    }
  }

  useEffect(() => {
    getContentExist().then(cont => {
      if (
        cont &&
        Object.keys({...dataOrg['info'], ...cont.info}).includes(
          route.params.screen,
        )
      ) {
        setInfo({...dataOrg['info'], ...cont.info}[route.params.screen]);
        setContent(
          {...dataOrg['content'], ...cont.content}[route.params.screen],
        );
      } else if (Object.keys(dataOrg['info']).includes(route.params.screen)) {
        setInfo(dataOrg['info'][route.params.screen]);
        setContent(dataOrg['content'][route.params.screen]);
      } else {
        setExists(true);
        dispatch({type: 'read', lawName: route.params.screen});
      }
    });

    Animated.timing(animatedForNavi, {
      toValue: find ? 80 : 0,
      duration: 600,
      useNativeDriver: false,
    }).start();

    if (route.params) {
      if (route.params.input) {
        setTimeout(() => {
          pushToSearch();
          Animated.timing(animatedForNavi, {
            toValue: !find ? 80 : 0,
            duration: 600,
            useNativeDriver: false,
          }).start();
          setFind(true);
        }, 500);
      }
    }

    return () => {
      eachSectionWithChapter = [];
    };
  }, []);

  function collapse(a) {
    // để collapse chương nếu không có mục 'phần thứ...' hoặc mục' phần thứ...' nếu có
    if (a == undefined) {
    } else if (tittleArray.includes(a)) {
      setTittleArray(tittleArray.filter(a1 => a1 !== a));
    } else {
      setTittleArray([...tittleArray, a]);
    }

    let contain = false;
    if (eachSectionWithChapter[a]) {
      for (let m = 0; m < eachSectionWithChapter[a].length; m++) {
        if (tittleArray2.includes(eachSectionWithChapter[a][m])) {
          contain = true;
        } else {
          contain = false;
          break;
        }
      }

      let tittleArray2Copy = tittleArray2;
      for (let m = 0; m < eachSectionWithChapter[a].length; m++) {
        if (!contain) {
          if (!tittleArray2.includes(eachSectionWithChapter[a][m])) {
            tittleArray2.push(eachSectionWithChapter[a][m]);
          }
        } else {
          tittleArray2Copy = tittleArray2Copy.filter(
            item => item != eachSectionWithChapter[a][m],
          );
          setTittleArray2(tittleArray2Copy);
        }
      }
    }
  }

  function collapse2(a) {
    // để collapse chương nếu có mục 'phần thứ...'
    if (a == undefined) {
    } else if (tittleArray2.includes(a)) {
      setTittleArray2(tittleArray2.filter(a1 => a1 !== a));
    } else {
      setTittleArray2([...tittleArray2, a]);
    }
    // setTittle(null);
  }


  let searchResultCount = 0;
  // let c = 0;
  function highlight(para, word, i2) {
    // console.log('para',para);
    if (para[0][[0]]) {
      // đôi khi Điều ... không có khoản (nội dung chính trong điều) thì điều này giúp không load ['']
      if (word.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\/)/gim)) {
        let inputRexgex = para[0].match(new RegExp(String(word), 'igmu'));
        // let inputRexgex = para[0].match(new RegExp('hội', 'igmu'));
        if (inputRexgex) {
          searchResultCount += inputRexgex.length;
          let searchedPara = para[0]
            .split(new RegExp(String(word), 'igmu'))
            // .split(new RegExp('hội', 'igmu'))
            .reduce((prev, current, i) => {
              if (!i) {
                return [<Text  key={`${i}xa`}
>{current}</Text>];
              }

              function setPositionYSearch({y}) {

                positionYArr.push(y + currentY -heightDevice/3);
                
                positionYArr.sort((a, b) => {
                  if (a > b) {
                    return 1;
                  } else {
                    if (a < b) return -1;
                  }
                });

                if (go) {
                  setTimeout(() => {
                    list.current.scrollTo({
                      y: positionYArr[0] , //- 57
                    });
                  }, 500);
                }
              }

              return prev.concat(
                // <View
                //   // key={`${i0000)}htth`}
                //   >
                <React.Fragment
                key={`${i}htth`}
                >
                <View
                                style={{
                                  // backgroundColor: 'blue',
                                  // flex: 1,
                                  // alignSelf: 'center',
                                  // padding: 0,
                                  // margin: 0,
                                  // overflow: 'visible',
                                  // right: -50,
                                  height: go ? 9 : 1,
                                }}
            
                >
                  <View
                key={`${i}img`}
                style={{
                      // backgroundColor: 'blue',
                      // flex: 1,
                      // alignSelf: 'center',
                      // padding: 0,
                      // margin: 0,
                      // overflow: 'visible',
                      // right: -50,
                      height: go ? 9 : 1,
                    }}
                    onLayout={event => {
                      event.target.measure(
                        (x, y, width, height, pageX, pageY) => {
                          if(go){
                            setPositionYSearch({
                              y:y+ pageY,
                            });

                          }
                        },
                      );
                    }}></View>
                    </View>
                  <Text
                    style={
                      searchResultCount - inputRexgex.length + i - 1 <
                        currentSearchPoint &&
                      searchResultCount - inputRexgex.length + i >=
                        currentSearchPoint
                        ? styles.highlight1
                        : styles.highlight
                      // {width:'auto',backgroundColor:'yellow'}
                    }
                    key={`${i}gmi`}
                    >
                    {inputRexgex[i - 1]}
                  </Text>
              </React.Fragment> ,
                <Text
                key={`${i}vvv`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    margin: 0,
                    lineHeight: 23,
                  }}>
                  {current}
                </Text>,
              );
            }, []);
          return <View ><Text >{searchedPara}</Text></View>;
          // return <View >{searchedPara}</View>;
          // return <Text >{searchedPara}</Text>;
        } else {
          
          return para[0];
        }
      } else {
        return para[0];
      }

      // }
    }
  }

  let positionYArrArticalDemo = positionYArrArtical;

  function setPositionYArtical({y, key3}) {
    if (
      true
      // tittleArray.length ||
      // tittleArray2.length ||
      // go ||
      // tittleArray[0] ||
      // tittleArray2[0]
    ) {
      var contains = positionYArrArtical.some((elem, i) => {
        return key3 == Object.keys(elem);
      });

      if (!showArticle) {
        // nếu showArticle đang đóng
        if (contains) {
          // nếu positionYArrArtical chưa có "điều" gì đó
          articleCount++;

          for (let g = 0; g <= positionYArrArtical.length; g++) {
            if (positionYArrArticalDemo[g][key3]) {
              positionYArrArticalDemo[g][key3] = y + currentY;
              break;
            }
          }

          if (articleCount >= positionYArrArtical.length) {
            // nếu positionYArrArtical đã đủ số lượng điều
            setPositionYArrArtical(positionYArrArticalDemo);
            // setPositionYArrArtical(q.current);
            PositionYArrArticalForDev.current = [];

            articleCount = 0;
          }
        } else {
          // nếu positionYArrArtical chưa đủ số lượng điều
          positionYArrArtical.push({[key3]: y + currentY});
        }
      } else {
        // nếu showArticle đang mở
        articleCount++;

        // positionYArrArtical.map((elem, i) => {
        PositionYArrArticalForDev.current[articleCount - 1] = {
          [key3]: y + currentY,
        };

        // });
        if (articleCount >= positionYArrArtical.length) {
          setPositionYArrArtical(PositionYArrArticalForDev.current);
          articleCount = 0;
          PositionYArrArticalForDev.current = [];
        }
      }
    }
  }

  TopUnitCount = Content && Object.keys(Content).length;

  function Shrink() {
    for (let b = 0; b <= TopUnitCount - 1; b++) {
      if (tittleArray == []) {
        setTittleArray([b]);
      } else {
        setTittleArray(oldArray => [...oldArray, b]);
      }
    }

    let sumChapter = sumChapterArray.reduce((total, currentValue) => {
      // tổng chapter nếu có phần thứ
      if (currentValue) {
        return total + currentValue;
      }
    });

    for (let b = 0; b <= sumChapter - 1; b++) {
      if (tittleArray2 == []) {
        setTittleArray2([b]);
      } else {
        setTittleArray2(oldArray => [...oldArray, b + 1]);
      }
    }
  }

  useEffect(() => {
    setGo(false);
  }, [input]);

  useEffect(() => {
    // setPositionYArr([]);
  }, [go]);

  useEffect(() => {
    if (!loading && route.params.input) {
      pushToSearch();
    }
  }, [loading]);



  useEffect(() => {

    if (currentSearchPoint != 0 && searchResultCount) {
      list.current.scrollTo({
        y: positionYArr[currentSearchPoint - 1] , //- 57
      });
    }
  }, [currentSearchPoint]);

  let SearchArticalResult = positionYArrArtical.filter(item => {
    let abc = inputSearchArtical;

    abc = inputSearchArtical.replace(/\(/gim, '\\(');

    abc = abc.replace(/\)/gim, '\\)');

    return Object.keys(item)[0].match(new RegExp(abc, 'igm'));
  });

  let transY = animatedForNavi.interpolate({
    inputRange: [-100, 0, 80, 90, 100],
    outputRange: [0, 0, -50, 0, 0],
  });

  let transX = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [0, (widthDevice / 100) * 60],
  });

  let Opacity = animatedForNavi.interpolate({
    inputRange: [-100, 0],
    outputRange: [0.7, 0],
  });

  let MagginBottom = animatedForNavi.interpolate({
    inputRange: [-100, 0, 80, 90, 100],
    outputRange: [40, 40, 78, 0, 0],
  });

  useEffect(() => {
    if (find == true) {
      setTittleArray([]);
      setTittleArray2([]);
      Shrink();
    }
    Keyboard.dismiss();
  }, [find]);

  const a = (key, i, key1, i1a, t) => {
    // phần nếu có mục 'chương' trong văn bản

    return Object.keys(key)[0] != '0' ? (
      <View
        // key={`${i}a`}
        // style={
        //   showArticle ||
        //   find ||
        //   ((t == undefined
        //     ? !tittleArray.includes(i)
        //     : !tittleArray2.includes(t)) &&
        //     styles.content) //////////////////////////////////////////////////////////////////
        // }>
        style={
          showArticle ||
          find ||
          ((t == undefined
            ? tittleArray.includes(i)
            : tittleArray2.includes(t)) &&
            styles.content) //////////////////////////////////////////////////////////////////
        }>
        {key[key1].map((key2, i2) => {
          return (
            <View key={`${i2}a1`}>
              <View
                onLayout={event => {
                  event.target.measure((x, y, width, height, pageX, pageY) => {
                    setPositionYArtical({
                      y: y + pageY,
                      key3: Object.keys(key2)[0],
                    });
                  });
                }}
                // style={
                //   go
                //     ? {width: '100%', marginBottom: 20}
                //     : {width: '99%', marginBottom: 20}
                // }
                >
                <Text style={styles.dieu}>
                  {highlight(Object.keys(key2), valueInput, i2)}
                </Text>
                <Text style={styles.lines}>
                  {highlight(Object.values(key2), valueInput, i2)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    ) : (
      <View key={`${i}a3`}></View>
    );
  };

  const b = (keyA, i, keyB) => {
    // phần nếu có mục 'phần' trong văn bản
    return (
      <View 
      // key={`${i}b`}
      >
        {keyA[keyB].map((keyC, iC) => {
          // keyC ra object là từng chương hoặc ra điều luôn

          let chapterOrdinal = 0;
          if (Object.keys(keyC)[0].match(/^Chương.*$/gim)) {
            //nếu có chương

            sumChapterArray[i + 1] = keyA[keyB].length ? keyA[keyB].length : 0;
            sumChapterPrevious = sumChapterArray
              .slice(0, i + 1)
              .reduce((total, currentValue) => {
                if (currentValue) {
                  return total + currentValue;
                }
              });

            chapterOrdinal = sumChapterPrevious + iC + 1;
            if (!eachSectionWithChapter[i]) {
              eachSectionWithChapter[i] = [chapterOrdinal];
            } else if (!eachSectionWithChapter[i].includes(chapterOrdinal)) {
              eachSectionWithChapter[i].push(chapterOrdinal);
            }
            return (
              <React.Fragment key={`${iC}b1`}>
                <TouchableOpacity // đây là chương
                  onPress={() => {
                    collapse2(chapterOrdinal);
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'white',
                      fontWeight: 'bold',
                      padding: 4,
                      textAlign: 'center',
                      backgroundColor: '#66CCFF',
                      marginBottom: 1,
                    }}>
                    {Object.keys(keyC)[0].toUpperCase()}
                  </Text>
                </TouchableOpacity>

                {a(keyC, i, Object.keys(keyC)[0], iC, chapterOrdinal)}
              </React.Fragment>
            );
          } else {
            //nếu không có chương
            return (
              <View
                key={`${iC}b2`}
                style={
                  showArticle ||
                  find ||
                  (!tittleArray.includes(i) && styles.content) //////////////////////////////////////////////////////////////////
                }>
                <View
                  onLayout={event => {
                    event.target.measure(
                      (x, y, width, height, pageX, pageY) => {
                        setPositionYArtical({
                          y: y + pageY,
                          key3: Object.keys(keyC)[0],
                        });
                      },
                    );
                  }}
                  // style={go ? {width: '100%'} : {width: '99%'}}
                  >
                  <Text style={styles.dieu}>
                    {highlight(Object.keys(keyC), valueInput, iC)}
                  </Text>
                  <Text style={styles.lines}>
                    {highlight(Object.values(keyC), valueInput, iC)}
                  </Text>
                </View>
              </View>
            );
          }
        })}
      </View>
    );
  };

  let onlyArticle = false; // dùng để hiển thị collapse và expand
  const c = (key, i, ObjKeys) => {
    // phần nếu chỉ có Điều ...
    onlyArticle = true;

    return Object.keys(key)[0] != '0' ? (
      <View key={`${i}c`}>
        <View
          onLayout={event => {
            event.target.measure((x, y, width, height, pageX, pageY) => {
              setPositionYArtical({
                y: y + pageY,
                key3: ObjKeys,
              });
            });
          }}
          // style={
          //   go
          //     ? {width: '100%', marginBottom: 20}
          //     : {width: '99%', marginBottom: 20}
          // }
          >
          <Text style={styles.dieu} >
            {highlight([ObjKeys], valueInput, i*2)}
          </Text>
          <Text style={styles.lines} >
            {highlight([key[ObjKeys]], valueInput, i*2+1)}
          </Text>
        </View>
      </View>
    ) : (
      <View key={`${i}c1`}></View>
    );
  };

  // const d = (key, i) => {
  //   // dành cho phụ lục, danh mục
  //   return (
  //     <View
  //       style={
  //         showArticle || find || (!tittleArray.includes(i) && styles.content)
  //       }>
  //       {Object.values(key)[0].map((key1, i) => (
  //         <Text style={styles.lines}>{`${key1}\n`}</Text>
  //       ))}
  //     </View>
  //   );
  // };


  
  return (
    <>
      {loading && (
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
            Xin vui lòng đợi trong giây lát ...
          </Text>
          <ActivityIndicator size="large" color="white"></ActivityIndicator>
        </View>
      )}
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        visible={ModalVisibleStatus.modalStatus}
        onRequestClose={() => ModalVisibleStatus.updateModalStatus(false)}
        style={{}}>
        <ScrollView
          style={{
            backgroundColor: '#EEEFE4',
          }}>
          <View style={{paddingBottom: 30}}>
            <View
              style={{
                // marginTop:20,
                backgroundColor: 'white', // #CCCCCC
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60,
                // borderBottomWidth:3,
                borderColor: '#2F4F4F',
                // shadowColor: 'gray',
                // shadowOpacity: 1,
                // shadowOffset: {
                //   width: 2,
                //   height: 2,
                // },
                // shadowRadius: 4,
                // elevation: 1,
              }}>
              <TouchableOpacity
                onPress={() => {
                  ModalVisibleStatus.updateModalStatus(false);
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                  width: 60,
                  // borderWidth:4,
                  borderColor: 'black',
                  // borderRadius:10,
                  // backgroundColor:'white',
                }}>
                <Ionicons
                  name="close-outline"
                  style={{
                    color: 'black',
                    fontSize: 30,
                    textAlign: 'center',
                    // width: '100%',
                    fontWeight: 'bold',
                  }}></Ionicons>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}>
                {exists && !dataOrg['info'][route.params.screen] && (
                  <TouchableOpacity
                    onPress={() => {
                      StoreInternal();
                      setExists(false);
                    }}
                    style={{
                      // backgroundColor: '#00CC33',
                      // padding: 20,
                      alignItems: 'center',
                      width: 70,
                      height: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name="save-outline"
                      style={{
                        color: '#009933',
                        fontSize: 25,
                        textAlign: 'center',
                        width: '100%',
                        fontWeight: 'bold',
                      }}></Ionicons>
                  </TouchableOpacity>
                )}
                {!exists && !dataOrg['info'][route.params.screen] && (
                  <TouchableOpacity
                    onPress={async () => {
                      Alert.alert(
                        'thông báo',
                        'Bạn có muốn xóa văn bản ra khỏi bộ nhớ không?',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              DeleteInternal();
                              setExists(true);
                            },
                          },
                        ],
                      );
                    }}
                    style={{
                      // backgroundColor: '#00CC33',
                      // padding: 20,
                      alignItems: 'center',
                      width: 70,
                      height: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <Text
                    style={{
                      // backgroundColor: 'red',
                      paddingLeft: 10,
                      paddingRight: 5,
                      fontSize: 15,
                      color: 'white',
                    }}>
                    Xóa
                  </Text> */}
                    <Ionicons
                      name="trash-outline"
                      style={{
                        color: 'red',
                        fontSize: 25,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}></Ionicons>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                padding: 20,
                paddingTop: 30,
                paddingBottom: 20,
                // backgroundColor: 'blue',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 23,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                THÔNG TIN CHI TIẾT
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 10,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                // backgroundColor: 'green',
                paddingLeft: '5%',
                paddingRight: '5%',
              }}>
              <View style={{...styles.ModalInfoContainer, borderTopWidth: 2}}>
                <View style={{width: '40%', justifyContent: 'center'}}>
                  <Text style={styles.ModalInfoTitle}>Tên gọi:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawNameDisplay']}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%', justifyContent: 'center'}}>
                  <Text style={styles.ModalInfoTitle}>Trích yếu nội dung:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info && Info['lawDescription']}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Ngày ký:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info &&
                      new Date(Info['lawDaySign']).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Ngày có hiệu lực:</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.ModalInfoContent}>
                    {Info &&
                      new Date(Info['lawDayActive']).toLocaleDateString(
                        'vi-VN',
                      )}
                  </Text>
                </View>
              </View>
              {Info['lawNumber'] && (
                <View style={styles.ModalInfoContainer}>
                  <View style={{width: '40%'}}>
                    <Text style={styles.ModalInfoTitle}>Số văn bản:</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.ModalInfoContent}>
                      {Info && !Info['lawNumber'].match(/^0001\\HP/gim)
                        ? Info['lawNumber']
                        : ''}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Tên người ký:</Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['nameSign']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['nameSign']}
                    </Text>
                  ) : (
                    Info['nameSign'] &&
                    Info['nameSign'].map((key, i) => (
                      <View key={`${i}nameSign`}>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              <View style={styles.ModalInfoContainer}>
                <View style={{width: '40%'}}>
                  <Text style={styles.ModalInfoTitle}>Chức vụ người ký:</Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['roleSign']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['roleSign']}
                    </Text>
                  ) : (
                    Info['roleSign'] &&
                    Info['roleSign'].map((key, i) => (
                      <View key={`${i}roleSign`}>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              <View style={{...styles.ModalInfoContainer}}>
                <View style={{width: '40%'}}>
                  <Text style={{...styles.ModalInfoTitle}}>
                    Cơ quan ban hành:
                  </Text>
                </View>
                <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                  {Info && !Array.isArray(Info['unitPublish']) ? (
                    <Text style={styles.ModalInfoContent}>
                      {Info['unitPublish']}
                    </Text>
                  ) : (
                    Info['unitPublish'] &&
                    Info['unitPublish'].map((key, i) => (
                      <View key={`${i}unitPublish`}>
                        <Text style={{...styles.ModalInfoContentLawRelated}}>
                          {`- ${key}`}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
              {Info && Object.keys(Info).includes('lawRelated') && (
                <View
                  style={{...styles.ModalInfoContainer, borderBottomWidth: 2}}>
                  <View style={{width: '40%'}}>
                    <Text style={styles.ModalInfoTitle}>
                      Văn bản liên quan:
                    </Text>
                  </View>
                  <View style={{flex: 1, paddingBottom: 10, paddingTop: 10}}>
                    {Info &&
                      Info['lawRelated'].map((key, i) => {
                        let nameLaw = key;

                        let LawHaveWord;
                        let LawHaveNoWord;
                        let correctIndex;
                        for (let a = 0; a < info3.length; a++) {
                          if (
                            info3[a]['info']['lawNameDisplay'].match(
                              new RegExp(`^${key}`, 'gim'),
                            )
                          ) {
                            correctIndex = a;
                            LawHaveWord = info3[a]['info']['lawNameDisplay'];
                            break;
                          } else if (
                            info3[a]['info']['lawDescription'].match(
                              new RegExp(`^${key}`, 'gim'),
                            )
                          ) {
                            correctIndex = a;
                            LawHaveWord = info3[a]['info']['lawNameDisplay'];
                          } else if (
                            info3[a]['info']['lawNumber'].match(
                              new RegExp(`^${key}`, 'gim'),
                            )
                          ) {
                            correctIndex = a;
                            LawHaveNoWord = info3[a]['info']['lawNameDisplay'];
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={`${i}lawRelated`}
                            onPress={() => {
                              if (LawHaveWord || LawHaveNoWord) {
                                navigation.push(`accessLaw`, {
                                  screen: info3[correctIndex]._id,
                                });
                                ModalVisibleStatus.updateModalStatus(false);
                              }
                            }}>
                            <Text
                              style={{
                                ...styles.ModalInfoContentLawRelated,
                                fontWeight:
                                  LawHaveNoWord || LawHaveWord ? 'bold' : '300',
                              }}>
                              -{' '}
                              {
                                LawHaveNoWord
                                  ? LawHaveNoWord
                                  : LawHaveWord
                                  ? LawHaveWord
                                  : nameLaw

                                // info3[nameLaw] ? info3[nameLaw] : nameLaw
                              }
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </View>
              )}
              <TouchableOpacity
                onPress={async () => {
                  ModalVisibleStatus.updateModalStatus(false);
                }}
                style={{
                  padding: 5,
                  marginTop: 30,
                  backgroundColor: 'white', //#778899
                  // backgroundColor: '#00CC33',
                  alignItems: 'center',
                  width: 100,
                  height: 35,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                  // borderColor:'#555555',
                  // borderWidth:1,

                  shadowColor: 'gray',
                  shadowOpacity: 1,
                  shadowOffset: {
                    width: 1,
                    height: 1,
                  },
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                <Text
                  style={{
                    // backgroundColor: 'red',
                    // paddingLeft: 10,
                    // paddingRight: 5,
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Đóng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>


      <Animated.View style={{marginBottom: MagginBottom}}>
        <ScrollView
          onScroll={event => {
            {
              const {y} = event.nativeEvent.contentOffset;
              setCurrentY(y);
            }
          }}
          
          ref={list}
          showsVerticalScrollIndicator={true}>
          <Text key={'abc'} style={styles.titleText}>
            {Info && Info['lawNameDisplay']}
          </Text>
          {Content &&
            Content.map((key, i) => {
              if (i + 1 == Content.length) {
                // dispatch(noLoading())
              }
              return (
                <View key={`${i}Main`}>
                  {!Object.keys(key)[0].match(/^(Điều|Điều)/gim) && (
                    <TouchableOpacity
                      // key={`${i}qq`}
                      style={styles.chapter}
                      onPress={() => {
                        collapse(i);
                        // setTittle(i);
                      }}>
                      <Text
                        // key={`${i}bb`}
                        style={{
                          fontSize: 18,
                          color: 'black',
                          fontWeight: 'bold',
                          padding: 9,
                          textAlign: 'center',
                        }}>
                        {Object.keys(key)[0].toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {Object.keys(key)[0].match(/^phần thứ .*/gim)
                    ? b(key, i, Object.keys(key)[0])
                    : Object.keys(key)[0].match(/^chương .*/gim)
                    ? a(key, i, Object.keys(key)[0])
                    : Object.keys(key)[0].match(/^điều .*/gim)
                    ? c(key, i, Object.keys(key)[0])
                    : ''}
                </View>
              );
            })}
        </ScrollView>
      </Animated.View>
      {/* {Boolean(searchResultCount) && find && searchResultCount > 1 && (
        <Animated.View
          style={{
            right: 25,
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            justifyContent: 'space-between',
            height: 130,
            opacity: 0.5,
            transform: [{translateY: transY}],
            bottom: 80,
          }}>
          <TouchableOpacity
            style={styles.tabSearch}
            onPress={() => {
              currentSearchPoint == 1
                ? setCurrentSearchPoint(positionYArr.length)
                : setCurrentSearchPoint(currentSearchPoint - 1);
            }}>
            <Ionicons
              name="caret-up-outline"
              style={{
                color: 'rgb(240,240,208)',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
              }}></Ionicons>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabSearch}
            onPress={() => {
              currentSearchPoint == positionYArr.length
                ? setCurrentSearchPoint(1)
                : setCurrentSearchPoint(currentSearchPoint + 1);
            }}>
            <Ionicons
              name="caret-down-outline"
              style={{
                color: 'rgb(240,240,208)',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 25,
              }}></Ionicons>
          </TouchableOpacity>
        </Animated.View>
      )} */}

      <Animated.View
        style={{
          ...styles.findArea,
          width: widthDevice,
          transform: [{translateY: transY}],
        }}>
        <View
          // distance={10}
          // startColor={'gray'}
          // sides={'top'}
          style={{...styles.searchView, width: widthDevice}}>
          {/* <View style={styles.searchView}> */}

          <View
            style={{
              flexDirection: 'row',
              minWidth: 98,
              width: '20%',
              justifyContent: 'space-around',
              height: '100%',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == 1
                  ? setCurrentSearchPoint(positionYArr.length)
                  : setCurrentSearchPoint(currentSearchPoint - 1);
                  
                  if ( currentSearchPoint == searchResultCount) {
                    list.current.scrollTo({
                      y: positionYArr[currentSearchPoint - 1] ,
                    });
                  }
              
              }}>
              <Ionicons
                name="caret-up-outline"
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  fontSize: 18,
                  color: '#888888',
                  // textAlign: 'center',
                  // fontWeight: 'bold',
                  // fontSize: 25,
                }}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabSearch}
              onPress={() => {
                currentSearchPoint == positionYArr.length
                  ? setCurrentSearchPoint(1)
                  : setCurrentSearchPoint(currentSearchPoint + 1);
                  if ( currentSearchPoint == searchResultCount) {
                    list.current.scrollTo({
                      y: positionYArr[currentSearchPoint - 1] ,
                    });
                  }
              }}>
              <Ionicons
                name="caret-down-outline"
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  fontSize: 18,
                  color: '#888888',
                  // textAlign: 'center',
                  // fontWeight: 'bold',
                  // fontSize: 25,
                }}></Ionicons>
            </TouchableOpacity>
          </View>

          <View style={styles.inputArea}>
            <View style={{flexDirection: 'row', width: '89%'}}>
              <TextInput
                ref={textInputFind}
                selectTextOnFocus={true}
                style={{
                  width: '90%',
                  color: 'black',
                  height: 35,
                  fontSize: 13,
                  padding: 0,
                  paddingLeft: 10,
                }}
                onChangeText={text => setInput(text)}
                autoFocus={false}
                value={input}
                placeholder=" Vui lòng nhập từ khóa ..."
                placeholderTextColor={'gray'}
                onSubmitEditing={() => pushToSearch()}></TextInput>
              <TouchableOpacity
                style={{
                  color: 'white',
                  fontSize: 16,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  right: 0,
                  alignItems: 'center',
                }}
                onPress={() => {
                  setInput('');
                  textInputFind.current.focus();
                }}>
                {input && (
                  <Ionicons
                    name="close-circle-outline"
                    style={{
                      color: 'black',
                      fontSize: 20,
                      textAlign: 'center',
                      width: '100%',
                      height: 20,
                    }}></Ionicons>
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignContent: 'center',
                padding: 0,
                left: 0,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 8,
                  textAlign: 'center',
                  // minWidth:18
                }}>
                {searchResultCount
                  ? `${currentSearchPoint}`
                  : searchResultCount}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 8,
                  textAlign: 'center',
                  borderTopColor: 'gray',
                  borderTopWidth: 1,
                  // minWidth:18,
                }}>
                {searchResultCount ? `${searchResultCount}` : searchResultCount}
              </Text>
            </View>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.searchBtb}
              onPress={() => {
                pushToSearch();
              }}>
              <Ionicons
                name="return-down-forward-outline"
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                }}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <View style={styles.functionTab}>
        {!onlyArticle && (
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setFind(false);

              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);

              setTittleArray([]);
              Shrink();

              Animated.timing(animatedForNavi, {
                toValue: 0,
                // toValue:100,
                duration: 600,
                useNativeDriver: false,
              }).start();
            }}>
            {/* <Text style={styles.innerTab}>S</Text> */}
            <Ionicons
              name="chevron-collapse-outline"
              style={styles.innerTab}></Ionicons>
          </TouchableOpacity>
        )}
        {!onlyArticle && (
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setTittleArray([]);
              setTittleArray2([]);
              setFind(false);
              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);

              Animated.timing(animatedForNavi, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
              }).start();
            }}>
            {/* <Text style={styles.innerTab}>E</Text> */}
            <Ionicons
              name="chevron-expand-outline"
              style={styles.innerTab}></Ionicons>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            list.current.scrollTo({y: 0});
            let timeOut = setTimeout(() => {
              setShowArticle(false);
              return () => {};
            }, 600);
          }}>
          <Ionicons name="arrow-up-outline" style={styles.innerTab}></Ionicons>
        </TouchableOpacity>

        <TouchableOpacity
          // style={find ? styles.ActiveTab : styles.tab}
          style={styles.tab}
          onPress={() => {
            setFind(!find);
            let timeOut = setTimeout(() => {
              setShowArticle(false);
              return () => {};
            }, 600);
            Animated.timing(animatedForNavi, {
              toValue: !find ? 80 : 0,
              duration: 600,
              useNativeDriver: false,
            }).start();

            setTittleArray([]);
            setTittleArray2([]);
            // Shrink();
            setGo(false);
          }}>
          {/* <Text style={styles.innerTab}>Find</Text> */}
          <Ionicons
            name="search-outline"
            style={find ? styles.ActiveInner : styles.innerTab}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity
          // style={showArticle && !find ? styles.ActiveTab : styles.tab}
          style={styles.tab}
          onPress={() => {
            if (showArticle) {
              let timeOut = setTimeout(() => {
                setShowArticle(false);
                return () => {};
              }, 600);
            } else {
              setShowArticle(true);
            }
            setFind(false);
            Keyboard.dismiss();
            Animated.timing(animatedForNavi, {
              toValue: !showArticle ? -100 : 0,
              duration: 600,
              useNativeDriver: false,
            }).start();

            setTittleArray([]);
            setTittleArray2([]);
            // Shrink();
          }}>
          <Ionicons
            name="menu-outline"
            style={
              showArticle ? styles.ActiveInner : styles.innerTab
            }></Ionicons>
        </TouchableOpacity>
      </View>
      <>
        {showArticle && (
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
                  // Keyboard.dismiss()
                  let timeOut = setTimeout(() => {
                    setShowArticle(false);
                    return () => {};
                  }, 600);
                  Animated.timing(animatedForNavi, {
                    toValue: !showArticle ? -100 : 0,
                    duration: 600,
                    useNativeDriver: false,
                  }).start();
                }}></TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                ...styles.listArticle,
                width: (widthDevice / 100) * 60,
                transform: [{translateX: transX}],
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'black',
                  height: 50,
                }}>
                <TextInput
                  ref={textInputArticle}
                  onChangeText={text => setInputSearchArtical(text)}
                  selectTextOnFocus={true}
                  value={inputSearchArtical}
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    color: 'white',
                    width: '85%',
                    alignItems: 'center',
                  }}
                  placeholder=" Nhập từ điều luật ..."
                  placeholderTextColor={'gray'}></TextInput>
                <TouchableOpacity
                  onPress={() => {
                    setInputSearchArtical('');
                    textInputArticle.current.focus();
                  }}
                  style={{
                    width: '15%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {inputSearchArtical && (
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
              <ScrollView 
              // keyboardShouldPersistTaps="handled"
              >
                <View style={{height: 7}}>
                  {
                    // đây là hàng ảo để thêm margin
                  }
                </View>
                {(SearchArticalResult || positionYArrArtical).map((key, i) => {
                  return (
                    <TouchableOpacity
                      key={`${i}SearchArtical`}
                      style={styles.listItem}
                      onPress={() => {
                        setShowArticle(false);
                        list.current.scrollTo({y: Object.values(key) - 70});
                        Animated.timing(animatedForNavi, {
                          toValue: !showArticle ? -100 : 0,
                          duration: 600,
                          useNativeDriver: false,
                        }).start();
                      }}>
                      <Text style={styles.listItemText}>
                        {Object.keys(key)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </>
        )}
      </>
    </>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    color: 'rgb(68,68,68)',
    // backgroundColor:'rgb(230,230,230)',
    fontWeight: 'bold',
  },
  chapter: {
    // height: 60,
    justifyContent: 'center',
    backgroundColor: '#F9CC76',
    color: 'black',
    alignItems: 'center',
    marginBottom: 1,
  },
  dieu: {
    fontWeight: 'bold',
    // marginBottom: 5,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 22,
    // backgroundColor:'blue',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  },
  lines: {
    display: 'flex',
    position: 'relative',
    textAlign: 'justify',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: '0',
    fontSize: 14,
    color: 'black',
    lineHeight: 23,
    overflow: 'hidden',
  },
  highlight: {
    color: 'black',
    backgroundColor: 'yellow',
    // position:'re',
    // display: 'flex',
    textAlign: 'center',
    lineHeight: 23,
    // position:'absolute',
    position: 'relative',
  },
  highlight1: {
    color: 'black',
    // display: 'flex',
    textAlign: 'center',
    position: 'relative',
    backgroundColor: 'orange',
    lineHeight: 23,
  },
  content: {
    height: 0,
  },
  functionTab: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    bottom: 0,
    backgroundColor: '#00CD66',
    height: 40,
    paddingTop: 3,
    paddingBottom:3,
    zIndex: 10,
    borderTopWidth: 2,
    borderTopColor: 'black',
    alignItems: 'center',
  },
  tab: {
    // backgroundColor: 'red',
    borderRadius: 30,
    width: '15%',
    height: 40,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  // ActiveTab: {
  //   backgroundColor: 'black',
  //   borderRadius: 40,
  //   width: 50,
  //   height: 50,
  //   // marginBottom:10,
  //   textAlign: 'center',
  //   justifyContent: 'center',
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  innerTab: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  ActiveInner: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  findArea: {
    display: 'flex',
    flexDirection: 'column',
    bottom: -10,
    position: 'absolute',
    right: 0,
    left: 0,
    borderTopWidth: 0.4,
    borderTopColor: 'gray',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'black', //#FAEBD7
    overflow: 'hidden',
    margin: 0,
    paddingTop: 1.5,
    paddingBottom: 0.5,
  },
  tabSearch: {
    display: 'flex',
    // width: 55,
    height: '100%',
    // borderRadius: 30,
    // backgroundColor: '#777777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputArea: {
    width: '58%',
    backgroundColor: '#F5F5F5',
    color: 'white',
    padding: 0,
    alignItems: 'center',
    // paddingLeft: 5,
    // paddingRight: 5,
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    // borderWidth:1
  },
  searchBtb: {
    backgroundColor: '#008080',
    color: 'white',
    borderRadius: 30,
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  listArticle: {
    position: 'absolute',
    width: '55%',
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    display: 'flex',
    right: 0,
    marginBottom: 40,
  },
  listItem: {
    display: 'flex',
    paddingBottom: 8,
    paddingTop: 10,

    borderBottomWidth: 1,
    borderBottomColor: 'rgb(245,245,247)',
  },
  listItemText: {
    color: 'black',
    textAlign: 'justify',
    marginRight: 5,
    marginLeft: 5,
  },
  ModalInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '2%',
    paddingRight: '2%',
    flexWrap: 'wrap',
    borderWidth: 2,
    // paddingTop: 10,
    // borderBottomWidth: 1,
    borderTopWidth: 2,
    borderBottomWidth: 0,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingBottom:10
  },
  ModalInfoTitle: {
    paddingBottom: 10,
    paddingTop: 10,
    // flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
    paddingRight: 5,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalInfoContent: {
    paddingBottom: 10,
    paddingTop: 10,
    flex: 1,
    color: 'black',
    fontSize: 14,
    paddingLeft: '4%',
    // backgroundColor:'yellow',
    textAlignVertical: 'center',
  },
  ModalInfoContentLawRelated: {
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
    color: 'black',
    fontSize: 14,
    paddingLeft: '4%',
  },
});
