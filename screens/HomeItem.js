import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    FlatList,
    Keyboard,
    Animated,
    ScrollView,
    PanResponder
  } from 'react-native';
  import {useState} from 'react';


 export default Render = ({item, i,Info}) => {

    const [pan, setPan] = useState(new Animated.ValueXY());
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // Cho phép bắt đầu sự kiện kéo
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }), // Cập nhật vị trí khi kéo
      onPanResponderRelease: () => {
        // Khi người dùng thả tay ra, vị trí sẽ không thay đổi
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      },
    });
  
    return (
      <Animated.View
      {...panResponder.panHandlers} // Gán panResponder vào component có thể kéo
      style={[pan.getLayout(), styles.box]}
    >
      <TouchableOpacity
        key={i}
        style={{
          paddingBottom: 20,
          paddingTop: 20,
          justifyContent: 'center',
          backgroundColor:
            Info[item] && Info[item]['lawNameDisplay'].match(/^(Hiến)/gim)
              ? '#003300'
              : 'green',
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
      </Animated.View>
    );
  };
