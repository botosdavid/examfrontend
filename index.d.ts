
enum MenuItem {
    Exam,
    Manage,
    Grades,
}

interface UserSession extends Omit<Session, "user"> {
    user: {
        neptun: string;
        role: import('@prisma/client').Role;
    };
    expires: string;
}