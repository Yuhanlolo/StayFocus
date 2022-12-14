import { shuffleArray } from "./utilities";

function getStrings({
  plan,
  focusDurationMinutes,
  completedMinutes,
}: StringsInput) {
  return {
    leaveFocusDialog: {
      dialogTitle: "Quick questions before you leave",
      numberOfQuestions: 2,
      fixedQuestions: [["Why do you want to check your phone now?"]],
      randomizedQuestions: [
        ["How do you feel without smartphone's distraction?"],
        ["Any thoughts about focusing for a longer duration next time?"],
        [
          "Lorem ipsum morbi molestie augue tincidunt purus ultrices",
          "A wealth of information creates a poverty of attention",
        ],
        [`Placeholder for ${focusDurationMinutes}`],
      ],
      finalMessage: "Your session has ended.",
    },
    completedDialog: {
      dialogTitle: "Quick questions",
      initialMessage: `Congrats! You focused on ${plan} for ${completedMinutes}.`,
      numberOfQuestions: 3,
      fixedQuestions: [
        [
          `How is your productivity during the past ${completedMinutes} minutes?`,
        ],
      ],
      randomizedQuestions: [
        ["How do you feel without smartphone's distraction?"],
        ["Any thoughts about focusing for a longer duration next time?"],
        ["A wealth of information creates a poverty of attention"],
        ["If they killed him tonight, at least he would die alive."],
        [
          "Give every man thy ear, but few thy voice;",
          "Take each man's censure, but reserve thy judgment.",
        ],
      ],
      finalMessage: "Great! You've done this focusing session.",
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
  "numberOfQuestions" | "fixedQuestions" | "randomizedQuestions"
> & { questions: string[] };

export function useStrings<Key extends StringsKey>(
  key: Key,
  params: StringsInput
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
