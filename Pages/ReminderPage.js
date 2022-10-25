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
  Picker,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

const type=['25 Minutes', '50 Minutes', '75 Minutes','100 Minutes'];

class ReminderPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text_1: "My Plan",
        text_2: "For each day, I plan to focus at least",
        text_3: "I want to be reminded at",
        typeShow: false,
        minSet: 0,
        hour: 0,
        min: 0,
      };
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
                top: '37%',
                left: '29.6%',
                width: '40%'
            })
        }


    render() {
      return (
        <View style = {styles.background}>
        <View style = {styles.iconContainer}>
           <Icon.Button
            size={25}
            name="arrow-left"
            backgroundColor="black"
            color= "#B8C59E"
            onPress={()=>{this.props.navigation.navigate('HomePage');}}
           />
        </View>
         <Text style = {styles.baseText_1}>{this.state.text_1}</Text>
         <Text style = {styles.baseText_2}>{this.state.text_2}</Text>
         <TextInput
          style={{ top: '23%', height: 40, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'45%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
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
                dropdownStyle={{top:'15%',left: '24%',height: '5.3%',color: 'white',backgroundColor:'white',justifyContent: "center",alignItems: "center",borderColor: 'white',borderWidth: 3,borderRadius: 10,height:32*type.length, width: '32%',}}    //下拉框样式
                dropdownTextStyle={styles.dropdownText}    //下拉框文本样式
                renderSeparator={this._separator}    //下拉框文本分隔样式
                adjustFrame={this._adjustType}    //下拉框位置
                dropdownTextHighlightStyle={{color:'rgba(42, 130, 228, 1)'}}    //下拉框选中颜色
                onDropdownWillShow={() => {this.setState({typeShow:true})}}      //按下按钮显示按钮时触发
                onDropdownWillHide={() => this.setState({typeShow:false})}    //当下拉按钮通过触摸按钮隐藏时触发
                onSelect={this._selectType}    //当选项行与选定的index 和 value 接触时触发
                defaultValue={'Select Time'}
                />
         <Text style = {styles.baseText_3}>{this.state.text_3}</Text>
         <View style = {styles.container}>
         <TextInput
          style={{ top: '5%', height: 40, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'25%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            this.setState({hour: text});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
         <Text style = {styles.mark}>{':'}</Text>
         <TextInput
          style={{ top: '5%', height: 40, borderColor: 'black', backgroundColor:'white', borderWidth: 3, width:'25%', borderRadius: 10, color: 'black', fontFamily: 'Cochin'}}
          onChangeText={(text) => {
            this.setState({min: text});
          }}
          //value = ' Input focusing time (e.g., 35mins)'
         />
         </View>
        </View>
      );
    }
}

  const styles = StyleSheet.create({

    background: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: 'black',
     alignItems: "center",
     paddingHorizontal: 10,
    },

    baseText_1: {
      fontSize: 21,
      top: '12%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },

    baseText_2: {
      fontSize: 18,
      top: '17%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    baseText_3: {
      fontSize: 18,
      top: '40%',
      fontFamily: "Cochin",
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
    },

    selectIcon: {
    top:'17.5%',
    left: '12%',
    height: '5.3%',
    color: '#506F4C',
    backgroundColor:'#506F4C',
    justifyContent: "center",
    alignItems: "center",
    borderColor: '#506F4C',
    borderWidth: 3,
    borderRadius: 10,
    //borderBottomRightRadius: 10,
    },

    dropdownText: {
     fontFamily: 'Cochin',
     color: 'black',
    },

    container: {
      flexDirection: 'row',
      top: '85%',
      //left: '7.5%',
    },

    mark: {
     fontFamily: 'Cochin',
     color: 'white',
     fontSize: 35,
     top: '3.2%',
    },

    iconContainer: {
     flexDirection: 'row',
     top: '8%',
     right: '18%'
     //justifyContent: "start",
    },

  });

export default ReminderPage;