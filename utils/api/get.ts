export const getSubscribedExams = async () => {
  const response = await fetch("/api/user/exam?filter=examsSubscribed");
  return response.json();
};

export const getCreatedExams = async () => {
  const response = await fetch("/api/user/exam?filter=examsCreated");
  return response.json();
};

export const getExam = async (code: string) => {
  const response = await fetch(`/api/exam?code=${code}`);
  return response.json();
};

export const getExamCorrectAnswers = async (code: string, userId: string) => {
  const response = await fetch(`/api/answer?code=${code}&userId=${userId}`);
  return response.json();
};

export const getExamQuestion = async (code: string) => {
  const response = await fetch(`/api/question?code=${code}`);
  return response.json();
};

export const getQuestionHalving = async (id: string) => {
  const response = await fetch(`/api/question/helper?id=${id}&type=halving`);
  return response.json();
};

export const getQuestionStatistics = async (id: string) => {
  const response = await fetch(`/api/question/helper?id=${id}&type=statistics`);
  return response.json();
};

export const getBestAnswer = async (id: string) => {
  const response = await fetch(`/api/question/helper?id=${id}&type=bestanswer`);
  return response.json();
};

export const getExamResults = async (code: string) => {
  const response = await fetch(`/api/exam/results?code=${code}`);
  return response.json();
};

export const getIpAddress = async () => {
  const response = await fetch("https://api.ipify.org/?format=json");
  return response.json();
};
