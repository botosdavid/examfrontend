import { toast } from "react-toastify";

export const notifyCreatedSuccessfully = () =>
  toast("Exam created successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifyUpdatedSuccessfully = () =>
  toast("Exam updated successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifyExamFinished = () =>
  toast("Exam finished successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifySubscribedSuccessfully = () =>
  toast("Subscribed successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifyInvalidCredentials = () =>
  toast("Invalid Credentials!", {
    position: "top-center",
    type: "error",
  });

export const notifySelectAnswer = () =>
  toast("You must select an answer!", {
    position: "top-center",
    type: "error",
  });
