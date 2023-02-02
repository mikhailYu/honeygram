import { Storage } from "../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

export default async function RetrieveImg(root, uid, imgID) {
  const pathRef = ref(Storage, root + "/" + uid + "/" + imgID);

  const returnLink = getDownloadURL(pathRef).then((url) => {
    return url.toString();
  });

  return returnLink;
}
