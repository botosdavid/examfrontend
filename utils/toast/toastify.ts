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

export const notifyDeletedSuccessfully = () =>
  toast("Exam deleted successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifySelectAnswer = () =>
  toast("You must select an answer!", {
    position: "top-center",
    type: "error",
  });

export const notifyCopiedToClipboard = () =>
  toast("Copied to clipboard!", {
    position: "top-center",
    type: "success",
    hideProgressBar: true,
  });

export const notifyRegistered = () =>
  toast("Registered successfully!", {
    position: "top-center",
    type: "success",
  });

export const notifyNeptunAlreadyExists = () =>
  toast("Neptun already exists!", {
    position: "top-center",
    type: "error",
  });
