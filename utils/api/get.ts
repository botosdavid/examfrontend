export const getSubscribedExams = async () => {
    const response = await fetch("/api/user/exam");
    return response.json();
};