export const getSubscribedExams = async () => {
    const response = await fetch("/api/user/exam?filter=examsSubscribed");
    return response.json();
};

export const getCreatedExams = async () => {
    const response = await fetch("/api/user/exam?filter=examsCreated");
    return response.json();
}

export const getExam = async (code: string) => {
    const response = await fetch(`/api/exam?code=${code}`);
    return response.json();
}