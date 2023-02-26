import RetrieveImg from "./retrieveImage";
import { db } from "../firebaseConfig";
import { ref, get } from "firebase/database";

export async function GetProfilePic(userUid) {
  const userRef = ref(db, "users/" + userUid);
  const snapshot = await get(userRef);

  let returnImg;

  if (snapshot.val().defaultPic) {
    returnImg = require("../images/defaultProfileIcons/defaultIcon_0" +
      snapshot.val().defaultPic +
      ".jpg");

    return returnImg;
  } else {
    return await RetrieveImg(
      "profileImages",
      userUid,
      snapshot.val().profilePic
    );
  }
}
