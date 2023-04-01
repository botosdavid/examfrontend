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

export const getPointSum = (selectedAnswers: SelectedAnswer[]) => {
  return selectedAnswers.reduce(
    (acc: number, curr) =>
      Number(curr.selectedAnswer === curr.question.correctAnswer) + acc,
    0
  );
};

export const search = (exams: ExamListItem[], searchQuery: string) => {
  return exams.filter((exam: ExamListItem) =>
    exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
