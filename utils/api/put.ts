import moment from "moment";

export const updateExam = async ({
  date,
  levels,
  ...examInfo
}: CreateExam & { code: string }) => {
  return fetch("/api/exam", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: moment.utc(date),
      levels: levels.join(","),
      ...examInfo,
    }),
  });
};
