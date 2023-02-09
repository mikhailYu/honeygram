import { Auth, db } from "../firebaseConfig";
import { update, ref, get, remove } from "firebase/database";
import { ref as sRef, deleteObject } from "firebase/storage";

function TogglePostLike(postInfo, postID) {
  let newLikesArr = [];
  const currentUserUid = Auth.currentUser.uid;
  const postRef = ref(db, "posts/" + postID);

  if (!postInfo.likes || postInfo.likes[0] === "") {
    newLikesArr = [currentUserUid];
  } else if (postInfo.likes.includes(currentUserUid)) {
    newLikesArr = postInfo.likes.filter((user) => {
      return user !== currentUserUid;
    });
  } else {
    let arr = postInfo.likes;
    newLikesArr = arr.concat(currentUserUid);
  }

  update(postRef, {
    likes: newLikesArr,
  });
}

export { TogglePostLike };
