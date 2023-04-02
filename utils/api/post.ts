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

export const createExam = async ({ date, levels, ...examInfo }: CreateExam) => {
  try {
    await fetch("/api/exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: moment.utc(date),
        levels: levels.join(","),
        ...examInfo,
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
