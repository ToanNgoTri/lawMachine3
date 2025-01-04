import {
    Platform,
    KeyboardAvoidingView,
  } from 'react-native';
import Detail5 from './Detail5'
  
 export default function Detail() {
    
    return (Platform.OS == 'ios' ? 
(
    <KeyboardAvoidingView
    behavior="position"
    keyboardVerticalOffset={60 + insets.bottom / 2}
    // style={{height:1000}}
  >
<Detail5/>
</KeyboardAvoidingView>
):(
<Detail5/>
)
    )
  }