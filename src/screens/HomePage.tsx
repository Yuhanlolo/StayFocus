import React, { useState, useCallback, useEffect } from 'react';
import {Text, Pressable, View, Keyboard, Image} from 'react-native';

import {createStyles} from '../helpers';
import {CustomButton, Screen, TimeDropdown, Gear} from '../components';
import {useSessionStore} from '../api';

import { useFocusEffect } from '@react-navigation/native';

import {getChatPrompts} from '../api/firestore';
import {
  getSession,
  getAppStore,
  resetSessionStore,
} from '../api/store';

import SetTimePage from './SetTimePage';

//Home page to set focusing time

function HomePage({navigation}) {

  const appStore = getAppStore();
  const uid = appStore.uid!;
  let tag = false;

  const onPress = () => {
    // Unfocus the input before changing page, so that the
    // user sees if their input gets clamped to min or max
    if(tag == true)
    {
      navigation.navigate('SetTimePage');
    }
  };

  useEffect(() => {
    (async () => {
      chat_history = await getChatPrompts(uid);
      for(i=0; i<chat_history.length; i++)
      {
        let date = chat_history[i].date;
        date = new Date(date);
        chat_history[i].date = date;
      }
      tag = true;
    })()
  }, []);

  useFocusEffect(React.useCallback(() => {
      once_history = [];
	}, []));

  const styles = useStyles();
  return (
    <Screen>
      <View style={styles.iconContainer}>
        <Pressable onPress={navigation.toggleDrawer}>
          <Gear size={32} color={styles.icon.color} />
        </Pressable>
      </View>
      
      <View style = {styles.bubble}>
        <Text style = {styles.bubbleText}>{'\n'}{'Are you ready to focus'}{'\n'}{'with me?'}{'\n'}</Text>
        <Text style = {styles.bubbleTextPress} onPress = {onPress}>{'start'}</Text>
      </View>
      <View style = {styles.arrow}/>
      <Image source={require('../../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
    </Screen>
  );
}

const useStyles = createStyles(theme => ({
  iconContainer: {
    width: '100%',
  },
  icon: {
    color: theme.primaryColor,
  },
  container: {
    alignItems: 'center',
    height: '100%',
    padding: theme.padding,
    backgroundColor: theme.primaryColor,
  },
  text: {
    marginBottom: 12,
    color: theme.textColor,
    fontSize: theme.fontSizes.md,
    textAlign: 'center',
  },
  bubble: {
    flexDirection: 'column',
    backgroundColor: '#506F4C',
    alignItems: "center",
    paddingHorizontal: 10,
    top: '22%',
    height: '27%',
    width: '90%',
    borderRadius: 25,
    borderWidth: 7,
    borderColor: '#506F4C',
  },
  bubbleText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bubbleTextPress: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    textDecorationLine: 'underline',
    textDecorationThickness:5,
  },
  image: {
    top: '20%',
    height: '18%',
    width: '100%',
    left: '25%',
  },
  arrow: {
    top: '21%',
    left: '25%',
    width: 30,
    height: 30,
    borderWidth: 20,
    borderTopColor: '#506F4C',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
},
}));

export default HomePage;
