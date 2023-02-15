import moment from "moment";

export const createExam = async ({name, date, questions }: CreateExam) => {
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
};