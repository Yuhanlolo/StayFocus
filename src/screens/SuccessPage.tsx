import {useState} from 'react';
import {Text} from 'react-native';

import {CustomButton, ReflectionModal, Screen} from '../components';
import {createStyles, useStrings} from '../helpers';
import {useSessionStore, saveSession} from '../api';

//When finish the focusing task, this page come out for congrats.

function SuccessPage({navigation}) {
  const [modal, setModal] = useState(false);

  const saveReflectionAnswers = useSessionStore(
    state => state.saveReflectionAnswers,
  );
  const minutes = useSessionStore(state => state.focusDurationMinutes);
  const plan = useSessionStore(state => state.plan);
  const planLowerCase = plan[0].toLowerCase() + plan.slice(1);

  const strings = useStrings('completedDialog', {
    completedMinutes: minutes,
    plan: planLowerCase,
  });

  const styles = useStyles();

  return (
    <Screen>
      <Text style={styles.text}>{strings.initialMessage.replace('.', '') + ' mins.'}</Text>
      <CustomButton
        styles={{button: styles.button}}
        onPress={() => setModal(true)}>
        Start a quick recall
      </CustomButton>
      {modal ? (
        <ReflectionModal
          visible={true}
          title={strings.dialogTitle}
          prompts={strings.questions.concat([strings.finalMessage])}
          onRequestClose={() => setModal(false)}
          onComplete={answers => {
            saveReflectionAnswers(answers);
            saveSession();
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

export default SuccessPage;
