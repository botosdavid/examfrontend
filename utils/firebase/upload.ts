import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { app } from "@/utils/firebase/config";

const storage = getStorage(app);

export const uploadImage = async (file: File) => {
  const storageRef = ref(storage, `images/${Date.now()}.jpg`);
  const uploadTask = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  console.log("File available at", downloadURL);
  return downloadURL;
};
