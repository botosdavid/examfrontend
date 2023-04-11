export const deleteExam = async (code: string) => {
  return fetch("/api/exam", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
};
