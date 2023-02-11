import { toast } from "react-toastify";

export const notifyCreatedSuccessfully = () =>
  toast("Exam created successfully!", {
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