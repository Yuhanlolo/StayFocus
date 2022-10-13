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
      temp:'0'
      };
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
                top: '44%',
                left: '34%'
            })
        }


    render() {
      return (
        <View style = {styles.background}>
        <Text style = {styles.textStyle}>{this.state.text}</Text>
        <TextInput
          style={{ top: '23%', height: 40, borderColor: '#28454B', backgroundColor:'white', borderWidth: 3, width:'50%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
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
                  this.props.navigation.navigate('TimerPage',{timeSet: this.state.minSet, second_1: 0, second_2: 0, tag: true });
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
     backgroundColor: '#8D9E98',
     paddingHorizontal: 80
    },

    textStyle: {
     fontFamily: 'Cochin',
     fontSize: 23,
     top: '15%',
     color: 'white',
    },

    dropdownText: {
     fontFamily: 'Cochin',
     color: 'black',
    },

    button: {
     top: '60%',
     backgroundColor: "#28454B",
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
    top:'35%',
    color:'white',
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#28454B',
    borderWidth: 3,
    borderRadius: 10,
    },


  });

export default HomePage;