import moment from "moment";

export const createUser = async (user: RegistrationCredentials) => {
    try {
        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    } catch (error) {
        console.error(error)
    }
};

export const createExam = async ({name, date, questions }: CreateExam) => {
    try {
        fetch("/api/exam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                date: moment(date).toDate(),
                questions,
            }),
        });
    } catch (error) {
        console.error(error)
    }
};