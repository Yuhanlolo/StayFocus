import {useRef, useState, useEffect} from 'react';
import {Text} from 'react-native';

import {CustomButton, ReflectionModal, Screen} from '../components';
import {createStyles, useStrings} from '../helpers';
import {useSessionStore, saveSession} from '../api';

function FocusEndedPage({route, navigation}) {
  const [modal, setModal] = useState(false);
  const completed = useRef(false);

  const saveLastGiveUpAttempt = useSessionStore(
    state => state.saveLastGiveUpAttempt,
  );
  const saveCompletedMinutes = useSessionStore(
    state => state.saveCompletedMinutes,
  );
  const plan = useSessionStore(state => state.plan);
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);
  const elapsedMinutes = route.params.elapsedMinutes;

  saveCompletedMinutes(elapsedMinutes);
  const strings = useStrings('focusEndedDialog', {
    completedMinutes: elapsedMinutes,
    plan: planLowerCase,
  });

  const styles = useStyles();

  // Prevent going back to timer screen
  // Taken from https://reactnavigation.org/docs/preventing-going-back
  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!completed.current) e.preventDefault();
      }),
    [navigation, completed],
  );

  return (
    <Screen>
      <Text style={styles.text}>Your focus session has ended.</Text>
      <CustomButton
        styles={{button: styles.button}}
        onPress={() => setModal(true)}>
        Start a quick reflection
      </CustomButton>
      {modal ? (
        <ReflectionModal
          visible={true}
          title={strings.dialogTitle}
          prompts={strings.questions.concat([strings.finalMessage])}
          onRequestClose={() => setModal(false)}
          onComplete={answers => {
            saveLastGiveUpAttempt(answers);
            saveSession();
            completed.current = true;
            navigation.navigate('HomePage');
          }}
          styles={styles.modal}
        />
      ) : null}
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
}));

export default FocusEndedPage;
