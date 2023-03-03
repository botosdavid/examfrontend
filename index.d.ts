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
}

interface CreateQuestion {
  text: string;
  correctAnswer: number;
  group?: import("@prisma/client").Group;
  answers: CreateAnswer[];
}

interface CreateAnswer {
  text: string;
}

interface CreateSelectedAnswer {
  questionId: string;
  selectedAnswer: number;
}
