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

import TimerPage from './TimerPage';

const type=['25min', '50min', '75min','100min'];

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
      };
      }

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
            time = time.replace('m','');
            time = time.replace('i','');
            time = time.replace('n','');
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
                top: '45%',
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
        <View style = {styles.background}>
        <TouchableOpacity
                  style={{backgroundColor: "#28454B", borderRadius: 15,  padding: 10, top: '2%', right: '65%'}}
                  onPress= {this.logoff}>
                  <Text style = {{fontFamily: 'Cochin', color: 'white',}}>{'Log off'}</Text>
        </TouchableOpacity>
        <View style = {{alignItems: "center",}}>
        <Text style = {styles.textStyle}>{this.state.text}</Text>
        </View>
        <TextInput
          style={{ top: '13%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'50%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            text = text.replace('m','');
            text = text.replace('i','');
            text = text.replace('n','');
            let num = Number(text);
            this.setState({minSet: num});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
        />
        <ModalDropdown
                options={type}    //下拉内容数组
                style={styles.selectIcon}    //按钮样式
                dropdownStyle={[styles.selectIcon,{height:32*type.length, width: '32%',}]}    //下拉框样式
                dropdownTextStyle={styles.dropdownText}    //下拉框文本样式
                renderSeparator={this._separator}    //下拉框文本分隔样式
                adjustFrame={this._adjustType}    //下拉框位置
                dropdownTextHighlightStyle={{color:'rgba(42, 130, 228, 1)'}}    //下拉框选中颜色
                onDropdownWillShow={() => {this.setState({typeShow:true})}}      //按下按钮显示按钮时触发
                onDropdownWillHide={() => this.setState({typeShow:false})}    //当下拉按钮通过触摸按钮隐藏时触发
                onSelect={this._selectType}    //当选项行与选定的index 和 value 接触时触发
                defaultValue={'Press me to select time!'} />
        <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                  this.setState({flag:true});
                  this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true, userId: this.state.userId, oneTimeId: this.state.oneTimeId});
                  }}>
                  <Text style = {styles.buttonText}>{'Start'}</Text>
        </TouchableOpacity>
        </View>
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
     fontSize: 23,
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
     width: '60%',
     padding: 10
    },

    buttonText: {
     color: 'white',
     fontFamily: 'Cochin',
     left: '38%'
    },

    selectIcon: {
    top:'23%',
    color:'white',
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#28454B',
    borderWidth: 3,
    borderRadius: 10,
    },


  });

export default HomePage;