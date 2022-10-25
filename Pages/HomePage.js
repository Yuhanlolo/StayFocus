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
  TouchableOpacity
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';
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

        _selectType = (index,value) => {
            console.log(index + '--' + value)
            this.setState({
                areaIndex: index
            });
            let time = value.substr(0);
            time = time.replace(' Minutes','');
            let num = Number(time);
            this.setState({minSet: num});
        }

        _separator = () => {
            return(
                <Text style={{height:0}}></Text>
            )
        }

        _adjustType = () => {
            return({
                justifyContent: "center",
                top: '40%',
                left: '29.6%',
                width: '40%'
            })
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
        <TextInput
          style={{ top: '25%', height: 40, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'85%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            text = text.replace('m','');
            text = text.replace('i','');
            text = text.replace('n','');
            let num = Number(text);
            this.setState({minSet: num});
          }}
          //value = 'enter xxmin'
        />
        <ModalDropdown
                options={type}    //下拉内容数组
                style={styles.selectIcon}    //按钮样式
                dropdownStyle={{top:'19.5%',left: '24%',height: '5.3%',color: 'white',backgroundColor:'white',justifyContent: "center",alignItems: "center",borderColor: 'white',borderWidth: 3,borderRadius: 10,height:32*type.length, width: '32%',}}    //下拉框样式
                dropdownTextStyle={styles.dropdownText}    //下拉框文本样式
                renderSeparator={this._separator}    //下拉框文本分隔样式
                adjustFrame={this._adjustType}    //下拉框位置
                dropdownTextHighlightStyle={{color:'rgba(42, 130, 228, 1)'}}    //下拉框选中颜色
                onDropdownWillShow={() => {this.setState({typeShow:true})}}      //按下按钮显示按钮时触发
                onDropdownWillHide={() => this.setState({typeShow:false})}    //当下拉按钮通过触摸按钮隐藏时触发
                onSelect={this._selectType}    //当选项行与选定的index 和 value 接触时触发
                defaultValue={'Select Time'}
                />
        <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                  this.setState({flag:true});
                  this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
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
     fontFamily: 'Cochin',
     fontSize: 17,
     top: '90%',
     width: '60%',
     color: 'white',
    },

    dropdownText: {
     fontFamily: 'Cochin',
     color: 'black',
    },

    button: {
     top: '45%',
     backgroundColor: "#506F4C",
     borderRadius: 15,
     width: '85%',
     padding: 10
    },

    buttonText: {
     color: 'white',
     fontFamily: 'Cochin',
     textAlign: 'center',
     textAlignVertical: 'center',
     left: '1%'
    },

    selectIcon: {
    top:'19.5%',
    left: '24.7%',
    height: '5.3%',
    color: '#506F4C',
    backgroundColor:'#506F4C',
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#506F4C',
    borderWidth: 3,
    borderRadius: 10,
    },
  });

export default HomePage;