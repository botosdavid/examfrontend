export const getRandomWrongAnswerIndex = (answerIndexes: number[]) => {
  let randomIndex = Math.floor(Math.random() * answerIndexes.length);
  return answerIndexes.splice(randomIndex, 1)[0];
};

export const shuffleQuestions = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
