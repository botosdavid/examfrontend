enum MenuItem {
  Exam,
  Grades,
  Manage,
}

interface UserSession extends Omit<Session, "user"> {
  user: {
    id?: string;
    neptun: string;
    role: import("@prisma/client").Role;
  };
  expires: string;
}

interface AuthSession {
  data: any;
  status: string;
}

interface LoginCredentials {
  neptun: string;
  password: string;
}

interface RegistrationCredentials {
  name: string;
  neptun: string;
  password: string;
  isTeacher: boolean;
}

interface CreateExam {
  name?: string;
  date: Moment;
  questions: CreateQuestion[];
  levels: number[];
  ip: string;
}

interface CreateQuestion {
  text: string;
  correctAnswer: number;
  group?: import("@prisma/client").Group;
  answers: CreateAnswer[];
  image: string;
  imageFile?: File;
}

interface CreateAnswer {
  text: string;
}

interface CreateSelectedAnswer {
  questionId: string;
  selectedAnswer: number;
}

type SelectedAnswer = import("@prisma/client").QuestionsOnUsers & {
  question: import("@prisma/client").Question;
};

type Subscription = {
  user: {
    selectedAnswers: (import("@prisma/client").QuestionsOnUsers & {
      question: import("@prisma/client").Question;
    })[];
    id: string;
  };
};

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

type ExamListItem = import("@prisma/client").Exam & {
  _count: { questions: number };
};

interface QuestionStatistics {
  index: number;
  correctAnswerCount: number;
  skippedAnswerCount: number;
  wrongAnswerCount: number;
  text: string;
  group?: import("@prisma/client").Group;
}
