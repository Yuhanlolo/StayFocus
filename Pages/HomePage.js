import React, { Component } from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Drawer from 'react-native-drawer';

import TimerPage from './TimerPage';
import ControlPanel from './ControlPanel';

const type=['25 Minutes', '50 Minutes', '75 Minutes','100 Minutes'];

//Home page to set focusing time

class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      text: 'I want to keep focus for',
      minSet: 0,
      areaIndex: '0',
      typeShow: false,
      flag: false,
      temp:'0',
      userId: '',
      oneTimeId: '',
      drawerOpen: false,
      drawerDisabled: false,
      select: false,
      };
      }

    closeDrawer = () => {
        this._drawer.close()
    };
    openDrawer = () => {
        this._drawer.open()
    };

    userSetter()
    {
         let id = this.props.route.params.userId;
         this.setState({userId: id},()=>{console.log(this.state.userId)});
         let item = this.props.route.params.oneTimeId;
         this.setState({oneTimeId: item},()=>{console.log(this.state.oneTimeId)});
         //console.log(id);
    }

    componentDidMount()
    {
         this.userSetter();
    }

        logoff ()
        {
           auth()
              .signOut()
              .then(() => {console.log('User signed out!');});
        }

    render() {
      return (
      <Drawer
                   ref={(ref) => this._drawer = ref}
                   // type: 一共是3种（displace,overlay,static）, 用static就好啦，static让人感觉更舒适一些
                   type="static"
                   // Drawer 展开区域组件
                   content={
                       <ControlPanel navigate={this.props.navigation.navigate} closeDrawer={this.closeDrawer} />
                   }
                   // 响应区域双击可以打开抽屉
                   acceptDoubleTap
                   // styles 和 tweenHandler是设置向左拉后主内容区的颜色，相当于给主内容区加了一个遮罩
                   styles={{
                       mainOverlay: {
                           backgroundColor: 'black',
                           opacity: 0,
                       },
                   }}
                   tweenHandler={(ratio) => ({
                       mainOverlay: {
                           opacity: ratio / 2,
                       }
                   })}
                   // drawer打开后调用的函数
                   onOpen={() => {
                       this.setState({drawerOpen: true});
                   }}
                   // drawer关闭后调用的函数
                   onClose={() => {
                       this.setState({drawerOpen: false});
                   }}

                   captureGestures={false}
                   // 打开/关闭 Drawer所需要的时间
                   tweenDuration={100}
                   // 触发抽屉打开/关闭必须经过的屏幕宽度比例
                   panThreshold={0.08}
                   disabled={this.state.drawerDisabled}
                   // Drawer打开后有边界距离屏幕右边界的距离
                   openDrawerOffset={0.5}
                   // 拉开抽屉的响应区域
                   panOpenMask={0.2}
                   // 如果为true, 则尝试仅处理水平滑动
                   negotiatePan
         >

        <ScrollView contentContainerStyle = {styles.background}>
        <View style = {{top: '20%', alignItems: "center",}}>
        <Text style = {styles.textStyle}>{this.state.text}</Text>
        </View>
        <View style = {{top: '23%', width: '78%',}}>
        <TextInput
          style={{ top: '25%', height: 45, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'100%', borderRadius: 10, color: 'black', fontFamily: 'Roboto'}}
          placeholder="Enter a number"
          placeholderTextColor="black"
          clearTextOnFocus={true}
          autoFocus={true}
          onChangeText={(text) => {
            const newText = text.replace(/[^\d]+/, '');
            let num = Number(newText);
            if(num > 120)
            {
              num = 120;
            }
            if(num < 10)
            {
              num = 10;
            }
            this.setState({minSet: num});
            this.setState({select: true});
          }}
        />
        <Menu style = {{top:'-20%', right:'2.1%'}} onSelect={(value) => {this.setState({minSet: value}); this.setState({select: true});}}>
          <MenuTrigger style = {{ width: '10%',left:'85%',top:'-10%'}}>
            <Text style={{color: '#B8C59E',  fontSize: 16,}}>{'▼'}</Text>
          </MenuTrigger>
          <MenuOptions customStyles={optionsCustomStyle}>
            <MenuOption style = {{alignItems: 'center',}} value={25} ><Text style = {{color: 'black'}}>{"25 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={50} ><Text style = {{color: 'black'}}>{"50 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={75} ><Text style = {{color: 'black'}}>{"75 Minutes"}</Text></MenuOption>
            <MenuOption style = {{alignItems: 'center',}} value={100}><Text style = {{color: 'black'}}>{"100 Minutes"}</Text></MenuOption>
          </MenuOptions>
        </Menu>
        </View>
        <View style = {{top: '48.5%'}}>
        <Text style={{fontFamily: 'Roboto', fontSize: 10, color: 'red'}}>{'*Please enter more than 25 minutes'}</Text>
        </View>
        <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                  this.setState({flag:true});
                  if(this.state.select == false)
                  {
                    Alert.alert('Please select your focus time!');
                  }
                  if(this.state.select == true)
                  {
                    this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                  }
                  }}>
                  <Text style = {styles.buttonText}>{'Start Focusing'}</Text>
        </TouchableOpacity>
        </ScrollView>
      </Drawer>
      );
    }
}


  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     alignItems: "center",
     backgroundColor: 'black',
     paddingHorizontal: 80
    },

    textStyle: {
     fontFamily: 'Roboto',
     fontSize: 17,
     top: '90%',
     width: '60%',
     color: 'white',
    },

    button: {
     top: '50%',
     backgroundColor: "#506F4C",
     borderRadius: 15,
     width: '85%',
     padding: 10
    },

    buttonText: {
     color: 'white',
     fontFamily: 'Roboto',
     textAlign: 'center',
     textAlignVertical: 'center',
     left: '1%'
    },

  });

const triggerCustomStyle = {
    triggerOuterWrapper: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
};
const optionsCustomStyle = {
    optionsContainer: {
        backgroundColor: 'white',
        marginTop: '10%',
        width: '45%',
        height: '18%',
        borderRadius: 10,
    },
    optionTouchable: {
        underlayColor: 'gray',
        activeOpacity: 40,
    },
    optionWrapper: {
        margin: 5,
    },
};

export default HomePage;