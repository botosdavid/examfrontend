import moment from "moment";

export const updateExam = async ({
  name,
  code,
  date,
  questions,
  levels,
}: CreateExam & { code: string }) => {
  return fetch("/api/exam", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      code,
      date: moment.utc(date),
      questions,
      levels: levels.join(","),
    }),
  });
};
