export const useMutation = () => ({ isLoading: false, data: {} });
export const useQuery = () => ({
  isLoading: false,
  data: { exam },
});

export const exam = {
  id: "1",
  name: "Exam",
  authorId: "authorId",
  date: new Date(),
  code: "123456",
  levels: "0,1",
  ip: "",
  createdAt: new Date(),
  subscribers: [{ group: "A" }],

  questions: [
    {
      id: 1,
      text: "question",
      image: "",
      correctAnswer: 1,
      group: "A",
      answers: [{ text: "answer" }],
      selectedAnswers: [{ selectedAnswer: 1 }],
    },
  ],
};

export class QueryClient {
  constructor() {}
}
