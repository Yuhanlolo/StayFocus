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
  AppState,
  BackHandler,
  Pressable,
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
import DropDownPicker from "react-native-dropdown-picker";

import TimerPage from './TimerPage';
import ControlPanel from './ControlPanel';
import { CaretDown, CaretUp, Gear } from '../Icons/icons';

const type=['25 Minutes', '50 Minutes', '75 Minutes','100 Minutes'];

//Home page to set focusing time

class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
      text: 'I want to keep focus for',
      minSet: 0,
      minTemp: '',
      areaIndex: '0',
      typeShow: false,
      flag: false,
      temp:'0',
      userId: '',
      oneTimeId: '',
      drawerOpen: false,
      drawerDisabled: false,
      select: false,
      mode: 'none',

      open: false,
      value: null,
      items: [
                 { label: "25 minutes", value: 25 },
                 { label: "50 minutes", value: 50 },
                 { label: "75 minutes", value: 75 },
                 { label: "100 minutes", value: 100 },
               ],
      isFocus: false,
      txt: '',
      };
      this.setValue = this.setValue.bind(this);
      }

  setOpen = (open) => {
    this.setState({
      open: open
    });
  }

  setValue = (callback) =>{
    this.setState(state => ({
      value: callback(state.value)
    }), ()=>{
      console.log(this.state.value);
      this.setState({minSet: this.state.value});
    });
    this.setState({select: true});
    this.setState({mode: 'selection'});
  }

  setItems = (callback) =>{
    this.setState(state => ({
      items: callback(state.items)
    }));
  }

    backAction = () => {
        return true;
   };

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
         countDown_1 = 10;
         display = false;
         //console.log(id);
    }

    _handleAppStateChange = (nextAppState) => {
         if (nextAppState === 'background') {
           	display = false;
           	console.log('homeDisplay:', display);
         }
    }

    componentDidMount()
    {
        this.userSetter();
        console.log('display:', display);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

        logoff ()
        {
           display = false;
           auth()
              .signOut()
              .then(() => {console.log('User signed out!');});
        }

    render() {
      return (
      <Drawer
                   ref={(ref) => this._drawer = ref}
                   // type: 一共是3种（displace,overlay,static）, 用static就好啦，static让人感觉更舒适一些
                   type="overlay"
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
        <Pressable onPress={()=>{this.openDrawer()}} style = {{top: '4%', right: '67%'}}>
          <Gear size={32} color={styles.icon.color} />
        </Pressable>
        <View style = {{flexDirection: 'column',  alignItems: "center",}}>
        <View style = {{top: '35%', alignItems: "center",}}>
        <Text style = {styles.textStyle}>{this.state.text}</Text>
        </View>
              <View style = {{top: '30%'}}>
                <DropDownPicker
                open={this.state.open}
                value={this.state.value}
                items={this.state.items}
                setOpen={this.setOpen}
                setValue={this.setValue}
                showTickIcon={false}
                setItems={this.setItems}
                containerStyle={styles.container}
                dropDownContainerStyle={styles.dropDownContainer}
                style={styles.dropDown}
                textStyle={styles.dropDownText}
                selectedItemLabelStyle={{
                fontWeight: "bold",
                 }}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {this.setState({minTemp:text});
                                        this.setState({select: true});
                                        this.setState({mode: 'enter'})}}
                  onFocus={() => {
                    this.setState({open: false});
                    this.setState({isFocus: true});
                  }}
                  onEndEditing={() => {this.setState({isFocus: false});}}
                  keyboardType="numeric"
                  autoFocus={true}
                  placeholder="Choose/enter focus time"
                  placeholderTextColor="black"
                  maxLength={32}
                />
                <Pressable style={styles.caret} onPress={() => {this.setOpen(!this.state.open); }}>
                  {this.state.open ? (
                    <CaretUp size={24} color={styles.caret.color} />
                  ) : (
                    <CaretDown size={24} color={styles.caret.color} />
                  )}
                </Pressable>
              </View>
        <View style = {{top: '80%'}}>
        <Text style={{fontFamily: 'Roboto', fontSize: 10, color: 'red'}}>{'*Please enter more than 25 minutes'}{'\n'}{'         and less than 125 minutes'}</Text>
        </View>
        <View style = {{top: '66%', width: '150%'}}>
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
                    if(this.state.mode == 'enter')
                    {
                    let inputs = this.state.minTemp;
                    //console.log("time input: ", inputs);
                    if(isNaN(Number(inputs, 10)))
                    {
                      Alert.alert('Please input Arabic numbers');
                    }
                    else
                    {
                      if(Number(inputs) > 125)
                      {
                        Alert.alert('Please enter less than 125 minutes');
                      }
                      if(Number(inputs) < 25)
                      {
                        Alert.alert('Please enter more than 25 minutes');
                      }
                      if(Number(inputs) >= 25 && Number(inputs) <= 125)
                      {
                        //console.log(Number(inputs));
                        this.setState({minSet: Number(inputs)});
                        let timeNum = Number(inputs);
                        this.props.navigation.navigate('TimerPage',{timeSet: timeNum, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                      }
                    }
                    }
                    if(this.state.mode == 'selection')
                    {
                      this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                    }
                  }
                  }}>
                  <Text style = {styles.buttonText}>{'Start Focusing'}</Text>
        </TouchableOpacity>
        </View>
        </View>
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
     fontSize: 21,
     width: '60%',
     color: 'white',
    },

    button: {
     top: '50%',
     backgroundColor: "#506F4C",
     borderRadius: 15,
     width: '150%',
     height: '35%',
     padding: 10
    },

    buttonText: {
     color: 'white',
     fontSize: 19,
     fontFamily: 'Roboto',
     textAlign: 'center',
     textAlignVertical: 'center',
     left: '1%'
    },


  input: {
    position: "absolute",
    width: '100%',
    borderRadius: 6,
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
    fontFamily: 'Roboto',
    textAlign: "center",
    padding: 8,
    zIndex: 200,
  },
  container: {
    width: 200,
    zIndex: 100,
  },
  dropDownContainer: {
    borderWidth: 0,
    zIndex: 100,
  },
  dropDown: {
    borderWidth: 0,
    zIndex: 100,
  },
  caret: {
    position: "absolute",
    width: 32,
    height: 50,
    top: 13,
    right: 0,
    color: '#506F4C',
    zIndex: 300,
  },
  dropDownText: {
    textAlign: "center",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },

  icon: {
    color: '#B8C59E',
  },

  });

const triggerCustomStyle = {
    triggerOuterWrapper: {
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
};
const optionsCustomStyle = {
    optionsContainer: {
        backgroundColor: 'white',
        marginTop: '10%',
        width: '50%',
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