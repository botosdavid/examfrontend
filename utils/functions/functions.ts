export const getRandomWrongAnswerIndex = (answerIndexes: number[]) => {
  let randomIndex = Math.floor(Math.random() * answerIndexes.length);
  return answerIndexes.splice(randomIndex, 1)[0];
};
