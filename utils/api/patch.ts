export const subscribeToExam = async (code: string) => {
  return fetch("/api/exam", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
};

export const startExam = async (code: string) => {
  return fetch("/api/exam/start", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
};
