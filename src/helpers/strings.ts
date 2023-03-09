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
      fixedQuestions: [['Why do you want to check your phone right now?']],
      randomizedQuestions: [
        ['Which app are you trying to check now?'],
        ['Is checking your phone part of the current task?'],
        ['Is anything distracting you now?'],
        ['Did you encounter any challenges during the focus session?'],
        [`How did you feel during the past ${focusDurationMinutes}?`],
        ['How much time do you plan to spend on checking your phone?'],
        ['What is your plan after checking your phone?'],
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
        ['Which app did you just check?'],
        ['Was checking your phone part of the task that you worked on?'],
        ['Was anything distracting you earlier?'],
        ['Did you encounter any challenges during the focus session?'],
        [`How did you feel during the past ${completedMinutes}?`],
        ['How much time do you plan to spend on your phone?'],
        ['What was your plan after checking your phone?'],
        [
           'What was your original plan for this focus session?',
           'Great Plan! How did it go?',
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: 'Thank you.',
    },
     leaveFocusEarlyDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 3,
      fixedQuestions: [[`You just got started a few minutes, why are you want to leave the session now?`]],
      randomizedQuestions: [
        ['Which app are you trying to check now?'],
        ['Is checking your phone part of the current task?'],
        ['Is anything distracting you now?'],
        ['Did you encounter any challenges during the focus session?'],
        [`How did you feel during the past ${focusDurationMinutes}?`],
        ['How much time do you plan to spend on checking your phone?'],
        ['What is your plan after checking your phone?'],
        [
          'What was your original plan for this focus session?',
          'Great Plan! How did it go?',
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    leaveFocusCloseToGoalDialog: {
      dialogTitle: 'Quick questions before you leave',
      numberOfQuestions: 3,
      fixedQuestions: [['Your are almost there, why do you want to check your phone now?']],
      randomizedQuestions: [
        ['Which app are you trying to check now?'],
        ['Is checking your phone part of the current task?'],
        ['Is anything distracting you now?'],
        ['Did you encounter any challenges during the focus session?'],
        [`How did you feel during the past ${focusDurationMinutes}?`],
        ['How much time do you plan to spend on checking your phone?'],
        ['What is your plan after checking your phone?'],
        [
          'What was your original plan for this focus session?',
          'Great Plan! How did it go?',
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: 'Thank you. Your focus session has ended.',
    },
    completedDialog: {
      dialogTitle: 'Quick questions',
      initialMessage: `Congrats! You have focused for ${completedMinutes}.`,
      numberOfQuestions: 3,
      fixedQuestions: [
        [
          `How did the focus session go?`,
        ],
      ],
      randomizedQuestions: [
        ['Overall, how do you feel during the past ${completedMinutes} minutes?'],
        ['How did you managed to complete the session without being distracted by your phone?'],
        ['What is your next plan?'],
        ['What did you do during the focus session?',
         'Great plan! How did it go?',
        ],
        ['Was it challenging to complete the focusing session?'],
        ['Any thoughts about setting a longer focusing goal next time?'],
      ],
      finalMessage: "Thanks! See you next time.",
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
