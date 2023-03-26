import moment from "moment";

export const createUser = async (user: RegistrationCredentials) => {
  return await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

export const createExam = async ({
  name,
  date,
  questions,
  levels,
}: CreateExam) => {
  try {
    await fetch("/api/exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        date: moment.utc(date),
        questions,
        levels: levels.join(","),
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

export const createSelectedAnswer = async ({
  questionId,
  selectedAnswer,
}: CreateSelectedAnswer) => {
  try {
    await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId,
        selectedAnswer,
      }),
    });
  } catch (error) {
    console.error(error);
  }
};
