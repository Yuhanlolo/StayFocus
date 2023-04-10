import {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

import {createStyles, CSSStyles} from '../helpers';
import {CustomModal} from '../components/CustomModal';
import {CustomButton} from '../components/CustomButton';

interface ReflectionModalProps {
  visible: boolean;
  title: string;
  prompts: string[];
  styles?: CSSStyles;
  onRequestClose: () => void;
  onBack?: (answers: string[]) => void;
  onComplete: (answers: string[]) => void;
}

export function ReflectionModal({
  visible,
  title,
  prompts,
  styles,
  onBack,
  onRequestClose,
  onComplete,
}: ReflectionModalProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);

  const addAnswer = (ans: string) => setAnswers([...answers, ans]);

  const emptyFirstOrSecondAnswer = () => promptIndex <= 1 && input === '';

  const next = () => {
    if (promptIndex < prompts.length - 1) {
      if (emptyFirstOrSecondAnswer()) {
        return;
      }
      addAnswer(input);
      setInput('');
      setPromptIndex(promptIndex + 1);
    } else if (promptIndex === prompts.length - 1) {
      onComplete(answers);
    }
  };

  const buttonText = () => {
    if (promptIndex < prompts.length - 2) {
      return 'Next';
    } else if (promptIndex === prompts.length - 2) {
      return 'Finish';
    } else {
      return 'Back to home';
    }
  };

  const defaultStyles = useModalStyles(emptyFirstOrSecondAnswer());

  return (
    <CustomModal
      styles={styles}
      visible={visible}
      onRequestClose={onRequestClose}
      title={title}>
      <Text style={defaultStyles.text}>{prompts[promptIndex]}</Text>
      {promptIndex < prompts.length - 1 ? (
        <TextInput
          style={defaultStyles.input}
          onChangeText={setInput}
          value={input}
          multiline={true}
          placeholder={'Type your answer here'}
          placeholderTextColor={defaultStyles.input.placeholderTextColor}
        />
      ) : null}
      <View style={defaultStyles.buttonContainer}>
        {promptIndex < prompts.length - 1 && onBack && (
          <CustomButton
            onPress={() => onBack(answers)}
            styles={{button: defaultStyles.button}}>
            Back to focus
          </CustomButton>
        )}
        <CustomButton
          onPress={next}
          styles={{
            button: {
              ...defaultStyles.button,
              ...defaultStyles.nextButton,
            },
          }}>
          {buttonText()}
        </CustomButton>
      </View>
    </CustomModal>
  );
}

const useModalStyles = createStyles((theme, disabledButton: boolean) => ({
  text: {
    marginBottom: 16,
    color: theme.muteColor,
    fontSize: theme.fontSizes.sm,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    height: 100,
    padding: 12,
    borderRadius: 10,
    backgroundColor: theme.textColor,
    fontSize: theme.fontSizes.sm,
    textAlignVertical: 'top',
    color: theme.muteColor,
    placeholderTextColor: theme.muteColor,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    rippleColor: theme.primaryColor,
  },
  buttonText: {
    fontSize: theme.fontSizes.sm,
  },
  nextButton: {
    backgroundColor: disabledButton ? theme.muteColor : theme.secondaryColor,
  },
}));
