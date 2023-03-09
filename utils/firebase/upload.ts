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

export const uploadImages = async (questions: CreateQuestion[]) => {
  const imageUrls: string[] = [];

  for (const question of questions) {
    if (question.imageFile?.name) {
      try {
        // TODO: delete image in cloud if overwriting
        const imageUrl = await uploadImage(question.imageFile);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error while uploading image: ", error);
        imageUrls.push("");
      } finally {
        continue;
      }
    }
    imageUrls.push(question.image ?? "");
  }
  return questions
    .map((question, index) => {
      if (!imageUrls[index]) return question;
      return { ...question, image: imageUrls[index] };
    })
    .map(({ imageFile, ...other }) => other);
};
