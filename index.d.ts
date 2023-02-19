enum MenuItem {
  Exam,
  Grades,
  Manage,
}

interface UserSession extends Omit<Session, "user"> {
  user: {
    neptun: string;
    role: import("@prisma/client").Role;
  };
  expires: string;
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
  name: string;
  date: Moment | null;
  questions: CreateQuestion[];
}

interface CreateQuestion {
  text: string;
  correctAnswer: number;
  answers: CreateAnswer[];
}

interface CreateAnswer {
  text: string;
}

interface CreateSelectedAnswer {
  questionId: string;
  selectedAnswer: number;
}
