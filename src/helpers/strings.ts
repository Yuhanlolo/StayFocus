import {shuffleArray} from './utilities';

function getStrings({
  plan,
  focusDurationMinutes,
  completedMinutes,
}: StringsInput) {
  return {
    leaveFocusDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 4,
      fixedQuestions: [['Why do you want to check your phone right now?']],
      randomizedQuestions: [
        [`How did you feel during the past ${focusDurationMinutes}`],
        ['What are the challenges during the focus session, if any?'],
        ['What is the most important thing you plan to do today?'],
        [
          'What was your original plan for this focus session?',
          'How did the plan go?', // For the chatbot version, don't append the follow-up question "Great Plan ..." because sometimes it creates mixing sentiment with the chatbot's auto-reply
        ],
        ['Hong long are you planning to check your phone this time?'],
        ['Are there any alternative activities you could engage in instead of checking your phone?'],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    focusEndedDialog: {
      dialogTitle: 'Quick reflection questions',
      initialMessage: `Your focus session has ended because you have left the app. You have been focused for ${completedMinutes}.`,
      numberOfQuestions: 4,
      fixedQuestions: [['Why did you just check your phone?']],
      randomizedQuestions: [
        ['What were the challenges during the focus session, if any?'],
        [`How did you feel during the past ${completedMinutes}?`],
        ['What is the most important thing you plan to do today?'],
        [
           'What was your original plan for this focus session?',
           'How did the plan go?',  // For the chatbot version, don't append the follow-up question "Great Plan ..." because sometimes it creates mixing sentiment with the chatbot's auto-reply
        ],
        ['Hong long did you just spend on checking your phone?'],
        ['Were there any alternative activities you could have engaged in instead of checking your phone?'],
      ],
      finalMessage: 'Thank you.',
    },
     leaveFocusEarlyDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 4,
      fixedQuestions: [[`You just got started a few minutes, why are you want to leave the session now?`]],
      randomizedQuestions: [
        ['What are the challenges during the focus session, if any?'],
        [`How did you feel during the past ${focusDurationMinutes} minutes?`],
        ['What is the most important thing you plan to do today?'],
        [
          'What was your original plan for this focus session?',
          'How did the plan go?',  // For the chatbot version, don't append the follow-up question "Great Plan ..." because sometimes it creates mixing sentiment with the chatbot's auto-reply
        ],
        ['Hong long are you planning to check your phone this time?'],
        ['Are there any alternative activities you could engage in instead of checking your phone?'],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    leaveFocusCloseToGoalDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 4,
      fixedQuestions: [['Your are almost there, why do you want to check your phone now?']],
      randomizedQuestions: [
        ['What are the challenges during the focus session, if any?'],
        [`How did you feel during the past ${focusDurationMinutes} minutes?`],
        ['What is the most important thing you plan to do today?'],
        [
          'What was your original plan for this focus session?',
          'How did the plan go?',  // For the chatbot version, don't append the follow-up question "Great Plan ..." because sometimes it creates mixing sentiment with the chatbot's auto-reply
        ],
        ['Hong long are you planning to check your phone this time?'],
        ['Are there any alternative activities you could engage in instead of checking your phone?'],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    completedDialog: {
      dialogTitle: 'Quick questions',
      initialMessage: `Congrats! You have focused for ${completedMinutes} minutes.`,
      numberOfQuestions: 4,
      fixedQuestions: [
        [
          `How did the focus session go?`,
        ],
      ],
      randomizedQuestions: [
        ['Does the complete session bring you closer to your goal today?'],
        ['What is your next plan?'],
        ['How do you feel now?'],
        ['Any other thoughts to share, like challenges or strategies?'],
      ],
      finalMessage: "Thanks! Take some breaks and see you next time.",
    },
  };
}

interface StringsInput {
  plan?: string;
  focusDurationMinutes?: number;
  completedMinutes?: number;
}

type StringsKey = keyof ReturnType<typeof getStrings>;

type StringsDialog<k extends StringsKey> = Omit<
  ReturnType<typeof getStrings>[k],
  'numberOfQuestions' | 'fixedQuestions' | 'randomizedQuestions'
> & {questions: string[]};

export function useStrings<Key extends StringsKey>(
  key: Key,
  params: StringsInput,
): StringsDialog<Key> {
  const obj = getStrings(params)[key];
  const num = obj.numberOfQuestions;
  shuffleArray(obj.randomizedQuestions);
  const q = obj.fixedQuestions.concat(obj.randomizedQuestions);
  const questions = q.slice(0, num).flat();

  return {
    ...obj,
    questions: questions,
  };
}
