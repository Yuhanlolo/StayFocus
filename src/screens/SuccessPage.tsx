import {Text, Image, View} from 'react-native';

import {CustomButton, Screen} from '../components';
import {createStyles} from '../helpers';

import ChatRefFinishPage from './ChatRefFinishPage';

function SuccessPage({navigation}) {
  const styles = useStyles();

  return (
    <Screen>
      <View style = {styles.bubble}>
        <Text style={styles.plan}>Focus mode completed</Text>
        <Text style={styles.timer}>00:00</Text>
        <Text style={styles.plan} onPress={()=>{navigation.navigate('ChatRefFinishPage')}}>Quick reflection</Text>
      </View>
      <View style = {styles.arrow}/>
      <Image source={require('../../assets/home_page.png')} style = {styles.image} resizeMode = 'contain'/>
    </Screen>
  );
}

const useStyles = createStyles(theme => ({
  text: {
    marginTop: '70%',
    marginBottom: '10%',
    color: theme.textColor,
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
  },
  button: {
    rippleColor: theme.backgroundColor,
  },
  modal: {
    justifyContent: 'center',
  },
  plan: {
    marginTop: 20,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: 23,
    fontWeight: '400',
    textAlign: 'center',
  },
  planPress: {
    marginTop: 20,
    marginBottom: 8,
    color: theme.textColor,
    fontSize: 23,
    fontWeight: '400',
    textAlign: 'center',
    textDecorationLine:'underline',
    textDecorationThickness:5,
  },
  timer: {
    color: theme.textColor,
    fontSize: 2 * theme.fontSizes.xl,
    textAlign: 'center',
  },
  bubble: {
    flexDirection: 'column',
    backgroundColor: '#506F4C',
    alignItems: "center",
    paddingHorizontal: 10,
    top: '15%',
    height: '35%',
    width: '90%',
    borderRadius: 25,
    borderWidth: 7,
    borderColor: '#506F4C',
  },
  image: {
    top: '15%',
    height: '18%',
    width: '100%',
    left: '25%',
  },
  arrow: {
    top: '15%',
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

export default SuccessPage;
