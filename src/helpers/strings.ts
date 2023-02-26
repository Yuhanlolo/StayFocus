import {shuffleArray} from './utilities';

function getStrings({
  plan,
  focusDurationMinutes,
  completedMinutes,
}: StringsInput) {
  return {
    leaveFocusDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 3,
      fixedQuestions: [['Why do you want to check your phone now?']],
      randomizedQuestions: [
        [`You have been focused for ${focusDurationMinutes}, are you sure to leave?`],
        ['Is anything distracting you at this moment?'],
        ['Is anything going on in your mind now?'],
        ['What is your plan after leaving this focus session?'],
        [
          'What was your original plan for this focus session?',
          'Great Plan! How did it go?',
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    focusEndedDialog: {
      dialogTitle: 'Quick reflection questions',
      initialMessage: `Your focus session has ended because you have left the app. You have been focused for ${completedMinutes}.`,
      numberOfQuestions: 3,
      fixedQuestions: [['Why did you just check your phone?']],
      randomizedQuestions: [
        [`You have been focused for ${completedMinutes}, are you sure to leave?`],
        ['Was anything distracting you earlier?'],
        ['Was anything going on in your mind earlier ?'],
        ['What was your plan after leaving this focus session?'],
        [
           'What was your original plan for this focus session?',
           'Great Plan! How did it go?',
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: 'Thank you.',
    },
    completedDialog: {
      dialogTitle: 'Quick questions',
      initialMessage: `Congrats! You focused on ${plan} for ${completedMinutes}.`,
      numberOfQuestions: 3,
      fixedQuestions: [
        [
          `How did the focus session go?`,
        ],
      ],
      randomizedQuestions: [
        ['How do you feel without the distraction from your phone?'],
        ['How did you managed to complete the session without being distracted by your phone?'],
        ['What the next plan?'],
        [`How is your productivity during the past ${completedMinutes} minutes?`],
      ],
      finalMessage: "Great! You've completed this focusing session.",
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
