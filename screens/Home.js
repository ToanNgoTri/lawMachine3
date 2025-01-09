import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Keyboard,
  Animated,
  ScrollView
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import dataOrg from '../data/data.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dirs, FileSystem} from 'react-native-file-access';
import {useScrollToTop} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
// import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";


export default function Home({}) {
  const navigation = useNavigation();

  // const [Content, setContent] = useState('');

  const [Info, setInfo] = useState(false);

  const [inputSearchLaw, setInputSearchLaw] = useState('');
  const [searchLawResult, setSearchLawResult] = useState([]);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showBackground, setShowBackground] = useState(false)
  

  const insets = useSafeAreaInsets(); // lất chiều cao để menu top iphone

  const ScrollViewToScroll = useRef(null);
  useScrollToTop(ScrollViewToScroll);

  const Render = ({item, i,drag, isActive}) => {

    return (
      <ScaleDecorator>
      <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
        key={i}
        style={{
          paddingBottom: 20,
          paddingTop: 20,
          justifyContent: 'center',
          backgroundColor:
            Info[item] && Info[item]['lawNameDisplay'].match(/^(Hiến)/gim)
              ? '#da251dff' 
              :'green' 
              ,
          marginBottom: 6,
        }}
        onPress={() => navigation.navigate(`accessLaw`, {screen: item})}>
        <View style={styles.item}>
          <Text
            style={{
              ...styles.itemDisplay,
              color:
                Info[item] && Info[item]['lawNameDisplay'].match(/^(Hiến)/gim)
                  ? 'yellow'
                  : 'white',
            }}>
            {Info[item] && Info[item]['lawNameDisplay']}
          </Text>
          {Info[item] &&
            !Info[item]['lawNameDisplay'].match(/^(luật|bộ luật|hiến)/gim) && (
              <Text style={{...styles.itemDescription}}>
                {Info[item] && Info[item]['lawDescription']}
              </Text>
            )}
        </View>
      </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  useEffect(() => {
    setSearchLawResult(
      Info &&
        Object.keys(Info).filter(item => {
          if (
            inputSearchLaw.match(/(\w+|\(|\)|\.|\+|\-|\,|\&|\?|\;|\!|\s?)/gim)
          ) {
            let inputSearchLawReg = inputSearchLaw;
            if (inputSearchLaw.match(/\(/gim)) {
              inputSearchLawReg = inputSearchLaw.replace(/\(/gim, '\\(');
            }

            if (inputSearchLaw.match(/\)/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\)/gim, '\\)');
            }
            if (inputSearchLaw.match(/\//gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\//gim, '.');
            }
            if (inputSearchLaw.match(/\\/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\\/gim, '.');
            }
            if (inputSearchLaw.match(/\./gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\./gim, '\\.');
            }
            if (inputSearchLaw.match(/\+/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\+/gim, '\\+');
            }
            if (inputSearchLaw.match(/\?/gim)) {
              inputSearchLawReg = inputSearchLawReg.replace(/\?/gim, '\\?');
            }

            return (
              Info[item]['lawNameDisplay'].match(
                new RegExp(inputSearchLawReg, 'igm'),
              ) ||
              Info[item]['lawDescription'].match(
                new RegExp(inputSearchLawReg, 'igm'),
              ) ||
              Info[item]['lawNumber'].match(
                new RegExp(inputSearchLawReg, 'igm'),
              )
            );
          }
        }),
    );
  }, [inputSearchLaw]);

  // const UserSchema = {
  //   name:'task',
  //   properties:{
  //     _id:'string',
  //     info: 'string',
  //     content: 'string',
  //     }
  // };

  // const realmConfig = {
  //   path: 'myrealm.realm',
  //   schema: [UserSchema],
  // };

  // const realm = new Realm(realmConfig);

  async function getPolicyAppear() {
    if (await FileSystem.exists(Dirs.CacheDir + '/Appear.txt', 'utf8')) {
      // const FileInfoStringContent = await FileSystem.readFile(
      //   Dirs.CacheDir + '/Content.txt',
      //   'utf8',
      // );
      // if (FileInfoStringContent) {
      //   return {
      //     status: true,
      //   };
      //   // f = JSON.parse(FileInfoStringInfo)
      // }

      return false
    }else{
      return true
    }
  }



  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      async function getContentExist() {
        if (await FileSystem.exists(Dirs.CacheDir + '/Content.txt', 'utf8')) {
          
          setShowBackground(false)

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
              content: JSON.parse(FileInfoStringContent),
              info: JSON.parse(FileInfoStringInfo),
            };
            // f = JSON.parse(FileInfoStringInfo)
          }
        }else{
        setShowBackground(true)

        }
      }

      getContentExist().then(cont => {
      if(!Object.keys(cont.content).length){
        setShowBackground(true)
      }else{
        setShowBackground(false)
      }

        if (cont) {
          setInfo({...cont.info});
        } else {
          setInfo({});
        }
      });
    });

    getPolicyAppear()
    .then((status)=> setShowPolicy(status))


  }, []);

  const animated = useRef(new Animated.Value(0)).current;


  let Opacity = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [0.5, 0],
  });

  let Scale = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
  });

  const [data, setData] = useState([]);

  console.log('data',data);
  console.log('Info',Info);
  
  useEffect(() => {
setData(Object.keys(Info))  
  }, [Info])
  
  
  return (
    <>
      <View
        style={{
          flexDirection: 'column',
          // height: 50,
          paddingLeft: 10,
          paddingRight: 10,
          display: 'flex',
          alignItems: 'center',
          // backgroundColor:'#EEEFE4',
          justifyContent: 'space-between',
          // backgroundColor: 'red',
          flexDirection: 'column',
        }}>
        <View
          style={{
            backgroundColor: 'green',
            height: insets.top,
            width: '150%',
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="logo-buffer"
              style={{
                color: 'green',
                fontSize: 25,
              }}></Ionicons>
          </View>
          <TextInput
            onChangeText={text => setInputSearchLaw(text)}
            value={inputSearchLaw}
            style={inputSearchLaw ? styles.inputSearchArea : styles.placeholder}
            placeholder="Nhập tên, Số văn bản, Trích yếu . . ."
            placeholderTextColor={'gray'}></TextInput>
          <TouchableOpacity
            onPress={() => {
              setInputSearchLaw('');
              Keyboard.dismiss();
            }}
            style={{
              width: '10%',
              display: 'flex',
              // backgroundColor:'red',
            }}>
            {inputSearchLaw && (
              <Ionicons
                name="close-circle-outline"
                style={{
                  color: 'black',
                  fontSize: 25,
                  justifyContent: 'center',
                  textAlign: 'right',
                  // backgroundColor:'black';
                  paddingRight: 10,
                }}></Ionicons>
            )}
          </TouchableOpacity>
        </View>
      </View>
        {showBackground ? (      <View
        style={{paddingBottom:100,height: '100%', alignItems: 'center', justifyContent: 'center',width:'100%',backgroundColor: '#EEEFE4'}}>
        <Text style={{fontSize: 40, textAlign: 'center', color: 'gray'}}>
          {' '}
          Chưa có văn bản tải xuống{' '}
        </Text>
      </View>
)

:(
//   <NestableScrollContainer>
//   <NestableDraggableFlatList
//   // ref={ScrollViewToScroll}
//   style={{backgroundColor: '#EEEFE4'}}
//   keyboardShouldPersistTaps="handled"
//   // data={Info && (searchLawResult || Object.keys(Info))}
//   data={data}
//   renderItem={Render}
//   onDragEnd={({ data }) => setData(data)}
// keyExtractor={(item) => item.key}  //   onEndReached={ loadMoreItem}
// />
//   </NestableScrollContainer>


  <DraggableFlatList
  // style={{backgroundColor: '#EEEFE4'}}
  // keyboardShouldPersistTaps="handled"
  // data={Info && (searchLawResult || Object.keys(Info))}
  data={data}
  renderItem={Render}
  keyExtractor={(item) => item.key}
  onDragEnd={({ data }) => setData(data)}
  //   ListFooterComponent={(totalPaper > currentPaper) && renderLoader} //(totalPaper > currentPaper) &&
  //   onEndReached={ loadMoreItem}
/>

)
        }

      {showPolicy && (
        <>
          <Animated.View
            style={{
              backgroundColor: 'black',
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
              // onPress={() => {
              //   let timeOut = setTimeout(() => {
              //     setShowPolicy(false);
              //     return () => {};
              //   }, 500);

              //   Animated.timing(animated, {
              //     toValue: !showPolicy ? 100 : 0,
              //     // toValue:100,
              //     duration: 300,
              //     useNativeDriver: false,
              //   }).start();
              // }}
              ></TouchableOpacity>
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
            <ScrollView style={{}} showsVerticalScrollIndicator={false}>
              <View style={{marginBottom: 20, marginTop: 30}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 30,
                    textAlign: 'center',
                  }}>
                  Lời mở đầu{' '}
                </Text>
              </View>

              <View style={{}}>
                <Text
                  style={{
                    fontWeight: 600,
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'justify',
                    lineHeight:23,

                  }}>
                  {'  '}Các thông tin, nội dung và dịch vụ mà Thư viện Luật cung cấp
                  chỉ mang tính chất tham khảo, với mục đích đem lại cho người
                  sử dụng những thông tin tổng quát về các quy định của pháp luật
                   qua từng thời kỳ. Thêm vào đó, việc thay đổi, bổ
                  sung các quy định luật pháp là điều không tránh khỏi ở mỗi
                  giai đoạn phát triển, bởi vậy, mọi trường hợp người sử dụng
                  muốn vận dụng các quy định pháp luật vào từng trường hợp cụ
                  thể, nhất thiết phải tham khảo ý kiến của các cơ quan nhà nước
                  có thẩm quyền hoặc của các chuyên gia tư vấn pháp lý về việc
                  áp dụng các quy định này.
                </Text>
              </View>
              <View style={{}}>
                <Text
                  style={{
                    fontWeight: 600,
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'justify',
                    lineHeight:23
                  }}>
                  {'  '}Mặc dù đã cố gắng hạn chế những sai sót trong quá trình nhập
                  liệu và đăng tải, các thông tin, nội dung văn bản pháp luật do
                  Thư viện Luật cung cấp không tránh khỏi những khiếm khuyết hay
                  sai sót do lỗi đánh máy, trình bày, hay tính đúng sai về hiệu
                  lực pháp lý của văn bản. Việc người sử dụng chấp nhận sử dụng
                  dịch vụ của Thư viện Luật ngay từ lần đầu tiên cũng đồng nghĩa
                  với việc chấp nhận những khiếm khuyết này, cũng như không làm
                  nảy sinh bất cứ trách nhiệm pháp lý nào của Thư viện Luật với
                  người sử dụng khi xảy ra thiệt hại (nếu có) từ việc vận dụng
                  các nội dung, thông tin mà Thư viện Luật cung cấp
                </Text>
              </View>
              <View style={{}}>
                <Text
                  style={{
                    fontWeight: 600,
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'justify',
                    lineHeight:23
                  }}>
                  {'   '}Đây là ứng dụng tra cứu Luật của tập thể SViet xây dựng và phát triển. Ứng dụng không
                  đại diện cho bất kỳ cơ quan nào thuộc Chính phủ. Cuối cùng, xin chân thành cảm ơn tất cả các bạn 
                  và người dùng ứng dụng đã tin tưởng và ủng hộ chúng tôi !
                </Text>
              </View>

            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
              }}
              
              onPress={async() => {
                let timeOut = setTimeout(() => {
                  setShowPolicy(false);
                  return () => {};
                }, 300);
                const addContent = await FileSystem.writeFile(
                  Dirs.CacheDir + '/Appear.txt',
                  JSON.stringify('abc'),
                  'utf8',
                );
          
                Animated.timing(animated, {
                  toValue:showPolicy ? 100 : 0,
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
                Chấp nhận chính sách và tiếp tục
              
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 100,
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'column',
  },
  itemDisplay: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    marginBottom:5
  },
  itemDescription: {
    color: '#EEEEEE',
    textAlign: 'justify',
    fontSize: 15,
  },
  inputSearchArea: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    color: 'black',
    width: '85%',
    alignItems: 'center',
    height: 50,
  },
  placeholder: {
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    width: '85%',
    alignItems: 'center',
    height: 50,
  },
});
